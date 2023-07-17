import Account from '../../../../classes/account/Account'
import AccountUserStub from '../../../../classes/account/stub/AccountUserStub'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import YamlHelper from '../../../../classes/utilities/YamlHelper'
import Environment from '../../../../classes/base/Environment'

describe(Epic.Account, () => {
  const faker = new Faker()
  const account = new Account()
  const env = new Environment()

  let availableDomains

  context(Story.whiteLabelEmailNotifications, () => {
    before(() => {
      new YamlHelper('account')
        .read()
        .its('WhiteLabel.domains')
        .then((domains) => {
          faker.setPathFixture(domains)
          availableDomains = domains[env.getEnvPrefix()]
        })
    })

    it('Org member able to see preferred domain selection when belongs two orgs', () => {
      Story.ticket('QA-1156')
      AccountUserStub.signInAsAuESantos()
      account.visitAccountSettings()
      account.expectedToSeePreferredDomainWith([
        availableDomains.crosswired,
        availableDomains.multiorg,
        availableDomains.firecloud,
      ])
    })
  })
})
