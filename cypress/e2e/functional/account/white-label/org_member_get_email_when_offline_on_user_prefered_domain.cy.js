import AccountUserStub from '../../../../classes/account/stub/AccountUserStub'
import MessageInput from '../../../../classes/chat/MessageInput'
import Messaging from '../../../../classes/chat/Messaging'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import UserRole from '../../../../classes/utilities/user-role/UserRole'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.Account, { retries: 1 }, () => {
  const accountYaml = new YamlHelper('account')
  const faker = new Faker()

  context(Story.whiteLabelEmailNotifications, () => {
    let availableDomains
    let auEOfflineMsgUser

    before(() => {
      accountYaml
        .read()
        .its('WhiteLabel.domains')
        .then((domains) => {
          faker.setPathFixture(domains)
          availableDomains = faker.getEntryFixture()
        })
      cy.stubUser(UserRole.WHITE_LABEL.AUE_OFFLINE_MSG).then((user) => {
        auEOfflineMsgUser = user
      })
    })

    it('Org Member get an email when an offline action email follows based on user preferred domain', () => {
      Story.ticket('QA-1184')
      const messaging = new Messaging(auEOfflineMsgUser.screenName)
      const messageInput = new MessageInput()
      AccountUserStub.signInAsAuESantos()
      messaging.accessToMessage()
      messageInput.typeMessage('Hello world')
      messaging.clickIconSendMessage()
      messaging.verifyEmailNotificationForUnreadMessage(
        'You have an unread message',
        auEOfflineMsgUser,
        'Go to Messaging',
        availableDomains.firecloud
      )
    })
  })
})
