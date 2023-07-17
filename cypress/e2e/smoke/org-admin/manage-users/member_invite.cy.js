import Epic from '../../../../classes/Epic'
import ManageUser from '../../../../classes/org-management/ManageUser'
import Story from '../../../../classes/Story'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.OrgAdmin, () => {
  const manageUser = new ManageUser()

  beforeEach(() => {
    manageUser.setItc()
    cy.visitThenSignIn(manageUser.pageUrl(), UserRole.ORG_ADMIN.ORGANIZATION)
  })

  context(Story.manageUsersMemberSecurity, () => {
    it('Able to Invite via Email or Bulk Invite', () => {
      manageUser.waitItc()
      cy.get('button').contains('Invite People').click()
      cy.get('.cw-split-dropdown > .dropdown-menu > :nth-child(1) > .dropdown-item').should(
        'contain.text',
        'Invite via Email'
      )
      cy.get('.cw-split-dropdown > .dropdown-menu > :nth-child(2) > .dropdown-item').should(
        'contain.text',
        'Bulk Invite'
      )
    })

    it('Click on Invite via Email and verify popup', () => {
      manageUser.waitItc()
      cy.get('button').contains('Invite People').click()
      cy.get('.cw-split-dropdown > .dropdown-menu > :nth-child(1) > .dropdown-item')
        .as('Invite via Email')
        .click()
      cy.get('.swal2-popup').within(($popupWrapper) => {
        cy.wrap($popupWrapper)
          .parents('body')
          .find('.swal2-container')
          .within(($popup) => {
            cy.wrap($popup).should('be.visible')
            cy.wrap($popup).get('.popup-consent-form-wrapper > .cec-p-4').should('be.visible')
            cy.wrap($popup)
              .get(':nth-child(1) > .form-group > .control-label')
              .should('contain.text', 'Email')
            cy.wrap($popup)
              .get(':nth-child(2) > .form-group > .control-label')
              .should('contain.text', 'First Name')
            cy.wrap($popup)
              .get(':nth-child(3) > .form-group > .control-label')
              .should('contain.text', 'Last Name')
            cy.wrap($popup).get('a').should('contain.text', 'Add another person')
            cy.wrap($popup).get('.swal2-header > button').click()
          })
      })
    })

    it('Click on Bulk Invite and verify popup', () => {
      manageUser.waitItc()
      cy.get('button').contains('Invite People').click()
      cy.get('.cw-split-dropdown > .dropdown-menu > :nth-child(2) > .dropdown-item').click()
      cy.get('.swal2-container').within(($popup) => {
        cy.wrap($popup).should('be.visible')
        cy.wrap($popup).get('.cw-dropzone-drop-area').should('be.visible')
        cy.wrap($popup).get('.align-items-start').should('contain.text', 'Download Excel Template')
        cy.wrap($popup)
          .get('.cec-button-holder > .d-flex > div')
          .should('contain.text', 'Duplicate emails will be ignored')
        cy.wrap($popup).get('.swal2-header > button').click()
      })
    })
  })
})
