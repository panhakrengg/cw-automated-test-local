import Epic from '../../../../classes/Epic'
import SignInAs from '../../../../classes/utilities/SignInAs'
import Story from '../../../../classes/Story'
import { OrgConst } from '../../../../classes/org-management/base-org-management/OrgStub'
import Field from '../../../../classes/constants/Field'

describe(Epic.OrgAdmin, () => {
  beforeEach(() => {
    cy.intercept('GET', '**manage_users%2Fmembers%2Fget').as('getMembers')
    cy.intercept('GET', '**manage_users%2Ffetch_admins').as('getAdmins')
    SignInAs.orgAdmin(OrgConst.TABS.MANAGE_USERS)
  })

  context(Story.manageUsersMemberSecurity, () => {
    it('Click on Edit role and verify popup', () => {
      cy.wait('@getAdmins')
      cy.get('table tr:first-child', { timeout: 10000 })
        .eq(0)
        .within(($firstRow) => {
          const $threeDots = cy.wrap($firstRow).getThreeDots()
          $threeDots.click()
          $threeDots.clickDropdownName('Edit role')
          cy.wrap($firstRow)
            .parents('body')
            .find('.swal2-container')
            .within(($popup) => {
              cy.wrap($popup).should('be.visible')
              cy.wrap($popup)
                .get('.portlet-personnel-management-wrapper > :nth-child(1) > :nth-child(1)')
                .should('be.visible')
              cy.wrap($popup)
                .get(':nth-child(1) > .form-check-label')
                .should('contain.text', 'Organization Admin')
              cy.wrap($popup)
                .get(':nth-child(2) > .form-check-label')
                .should('contain.text', 'Learning Admin')
              cy.wrap($popup).get('.swal2-header > button').click()
            })
        })
    })

    it('Click on Delete and verify popup', () => {
      cy.wait('@getAdmins')
      cy.get('table tr:first-child', { timeout: 10000 })
        .eq(0)
        .within(($firstRow) => {
          const $threeDots = cy.wrap($firstRow).getThreeDots()
          $threeDots.click()
          $threeDots.clickDropdownName(Field.DELETE)
        })
      cy.swal2()
        .should('be.visible')
        .within(($swal2) => {
          cy.getSwal2Header().should(
            'contain.text',
            'Would you like to remove this user as an admin?'
          )
          cy.wrap($swal2).closeSwal2()
        })
    })

    it('Click on Add Admin and verify popup', () => {
      cy.wait('@getAdmins')
      cy.get('button', { timeout: 10000 }).contains('Add Admin').click()
      cy.get('.swal2-popup').within(($popup) => {
        cy.wrap($popup).should('be.visible')
        cy.wrap($popup).get('.multiselect__tags').should('be.visible')
        cy.wrap($popup)
          .get(':nth-child(1) > .form-check-label')
          .should('contain.text', 'Organization Admin')
        cy.wrap($popup)
          .get(':nth-child(2) > .form-check-label')
          .should('contain.text', 'Learning Admin')
        cy.wrap($popup).get('.swal2-header > button').click()
      })
    })
  })
})
