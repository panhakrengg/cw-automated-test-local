import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import Field from '../../../../../classes/constants/Field'
import AdminHelpGuide from '../../../../../classes/help-guides/admin/AdminHelpGuide'
import Navigation from '../../../../../classes/help-guides/admin/Navigation'
import Topics from '../../../../../classes/help-guides/admin/Topics'
import AdminHelpGuideLogin from '../../../../../classes/help-guides/base-help-guides/member-management/AdminHelpGuideLogin'
import Faker from '../../../../../classes/utilities/Faker'

const adminHelpGuide = new AdminHelpGuide()
const adminHelpGuideLogin = new AdminHelpGuideLogin()
const adminNavigation = new Navigation()
const adminTopic = new Topics()
const faker = new Faker()

describe(Epic.HelpGuides, { tags: '@skipPrd' }, () => {
  const tableTopicAlias = 'TableTopic'

  context(Story.adminTopicsRoles, () => {
    const topicLabel = 'Topic'

    beforeEach(() => {
      adminHelpGuideLogin.signInAsAdminToTab()
      adminNavigation.clickTopics()
      adminHelpGuide.initTable(tableTopicAlias)
    })
    it('Help Guide Admin able to see topic screen', () => {
      Story.ticket('QA-2057')
      adminHelpGuide.initToolbarHeader()
      describe('show toolbar header', () => {
        cy.get('@toolbarHeader').within(($header) => {
          cy.wrap($header).get('.font-size-22').contains('Topics')
          cy.get('a > span').contains(Field.DELETE)
          cy.get('@btnNew').should('contain.text', 'New Topic')
        })
      })
      describe('show table header', () => {
        cy.getTableHeader(Field.NAME).within(() => {
          cy.get('span > input').should('have.attr', 'type').and('equal', 'checkbox')
          cy.get('a > span').contains(Field.NAME)
        })
        cy.getTableHeader('Articles')
      })
      describe('show list of topic', () => {
        cy.get(`@${tableTopicAlias}`).rowName(faker.getAuTextNotDelete('Security')).as('security')
        cy.get(`@${tableTopicAlias}`)
          .rowName(faker.getAuTextNotDelete('User Settings'))
          .as('userSettings')
        cy.get(`@${tableTopicAlias}`)
          .rowName(faker.getAuTextNotDelete('Learning Management'))
          .as('learningManagement')
        cy.get(`@${tableTopicAlias}`)
          .rowName(faker.getAuTextNotDelete('Communities of Purpose'))
          .as('communityOfPurpose')
        cy.get(`@${tableTopicAlias}`)
          .rowName(faker.getAuTextNotDelete('Course Settings'))
          .as('courseSettings')
        cy.get(`@${tableTopicAlias}`).rowName(faker.getAuTextNotDelete('Automate')).as('automate')

        const topicCheckTotalArticle = (name) => {
          cy.get('td').eq(0).contains(name)
          cy.get('td')
            .eq(1)
            .invoke('text')
            .then(($text) => {
              expect(parseInt($text)).to.gt(0)
            })
        }
        cy.get('@security').within(() => {
          topicCheckTotalArticle(faker.getAuTextNotDelete('Security'))
        })

        cy.get('@userSettings').within(() => {
          topicCheckTotalArticle(faker.getAuTextNotDelete('User Settings'))
        })

        cy.get('@learningManagement').within(() => {
          topicCheckTotalArticle(faker.getAuTextNotDelete('Learning Management'))
        })

        cy.get('@communityOfPurpose').within(() => {
          topicCheckTotalArticle(faker.getAuTextNotDelete('Communities of Purpose'))
        })

        cy.get('@courseSettings').within(() => {
          topicCheckTotalArticle(faker.getAuTextNotDelete('Course Settings'))
        })

        cy.get('@automate').within(() => {
          topicCheckTotalArticle(faker.getAuTextNotDelete('Automate'))
        })
      })
    })
    it('Help Guide Admin able to see Edit Topic popup', () => {
      Story.ticket('QA-297')
      const topicSecurity = faker.getAuTextNotDelete('Security')
      adminTopic.clickTopicName(topicSecurity)
      adminTopic.verifyEditPopup(topicLabel, topicSecurity)
    })
    it('Help Guide Admin able to see Create New Topic popup', () => {
      Story.ticket('QA-296')
      adminTopic.clickNewTopic()
      adminTopic.verifyCreateNewPopup(topicLabel)
    })
    it('Help Guide Admin able to see Delete topics popup', () => {
      Story.ticket('QA-298')
      const topicText = topicLabel.toLowerCase()
      let totalSelected

      cy.logInTestCase('Delete one topic')
      totalSelected = 1
      adminHelpGuide.selectCheckboxes(totalSelected)
      adminHelpGuide.clickDeleteButton()
      adminHelpGuide.showDialogDelete(topicText, totalSelected)

      cy.logInTestCase('Delete two or more topics')
      totalSelected = 2
      adminHelpGuide.selectCheckboxes(totalSelected)
      adminHelpGuide.clickDeleteButton()
      adminHelpGuide.showDialogDelete(topicText, totalSelected)
    })
  })
})
