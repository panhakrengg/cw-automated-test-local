import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import Field from '../../../../../classes/constants/Field'
import AdminHelpGuide from '../../../../../classes/help-guides/admin/AdminHelpGuide'
import Navigation from '../../../../../classes/help-guides/admin/Navigation'
import Roles from '../../../../../classes/help-guides/admin/Roles'
import AdminHelpGuideLogin from '../../../../../classes/help-guides/base-help-guides/member-management/AdminHelpGuideLogin'
import Faker from '../../../../../classes/utilities/Faker'

const adminHelpGuide = new AdminHelpGuide()
const adminHelpGuideLogin = new AdminHelpGuideLogin()
const adminNavigation = new Navigation()
const adminRole = new Roles()
const faker = new Faker()

describe(Epic.HelpGuides, { tags: '@skipPrd' }, () => {
  const tableRoleAlias = 'TableRole'

  context(Story.adminTopicsRoles, () => {
    const roleLabel = 'Role'

    beforeEach(() => {
      adminHelpGuideLogin.signInAsAdminToTab()
      adminNavigation.clickRoles()
      adminHelpGuide.initTable(tableRoleAlias)
    })
    it('Help Guide Admin able to see role screen', () => {
      Story.ticket('QA-294')
      adminHelpGuide.initToolbarHeader()
      describe('has toolbar header', () => {
        cy.get('@toolbarHeader').within(() => {
          cy.get('.font-size-22').contains('Roles')
          cy.get('a > span').contains(Field.DELETE)
          cy.get('@btnNew').should('contain.text', 'New Role')
        })
      })
      describe('has table header', () => {
        cy.getTableHeader(Field.NAME).within(() => {
          cy.get('span > input').should('have.attr', 'type').and('equal', 'checkbox')
          cy.get('a > span').contains(Field.NAME)
        })
        cy.getTableHeader('Articles')
      })
      describe('has list of the topics', () => {
        cy.get(`@${tableRoleAlias}`)
          .rowName(faker.getAuTextNotDelete('Learning Admins'))
          .as('learningAdmins')
        cy.get(`@${tableRoleAlias}`).rowName(faker.getAuTextNotDelete('Trainers')).as('trainers')
        cy.get(`@${tableRoleAlias}`).rowName(faker.getAuTextNotDelete('General')).as('general')
        cy.get(`@${tableRoleAlias}`)
          .rowName(faker.getAuTextNotDelete('Community Admins'))
          .as('communityAdmins')

        const roleCheckTotalArticle = (name, total) => {
          cy.get('td').eq(0).contains(name)
          cy.get('td')
            .eq(1)
            .invoke('text')
            .then((totalArticle) => {
              expect(totalArticle).length.at.least(total)
            })
        }

        cy.get('@learningAdmins').within(() => {
          roleCheckTotalArticle(faker.getAuTextNotDelete('Learning Admins'), 1)
        })

        cy.get('@trainers').within(() => {
          roleCheckTotalArticle(faker.getAuTextNotDelete('Trainers'), 1)
        })

        cy.get('@general').within(() => {
          roleCheckTotalArticle(faker.getAuTextNotDelete('General'), 2)
        })

        cy.get('@communityAdmins').within(() => {
          roleCheckTotalArticle(faker.getAuTextNotDelete('Community Admins'), 1)
        })
      })
    })
    it('Help Guide Admin able to see Edit Role popup', () => {
      Story.ticket('QA-599')
      const roleLearningAdmins = faker.getAuTextNotDelete('Learning Admins')
      adminRole.clickRoleName(roleLearningAdmins)
      adminRole.verifyEditPopup(roleLabel, roleLearningAdmins)
    })
    it('Help Guide Admin able to see Create New Role popup', () => {
      Story.ticket('QA-678')
      adminRole.clickNewRole()
      adminRole.verifyCreateNewPopup(roleLabel)
    })
    it('Help Guide Admin able to see Delete roles popup', () => {
      Story.ticket('QA-680')
      const role = roleLabel.toLowerCase()
      let totalSelected

      cy.logInTestCase('Delete one role')
      totalSelected = 1
      adminHelpGuide.selectCheckboxes(totalSelected)
      adminHelpGuide.clickDeleteButton()
      adminHelpGuide.showDialogDelete(role, totalSelected)

      cy.logInTestCase('Delete two or more roles')
      totalSelected = 4
      adminHelpGuide.selectCheckboxes(totalSelected)
      adminHelpGuide.clickDeleteButton()
      adminHelpGuide.showDialogDelete(role, totalSelected)
    })
  })
})
