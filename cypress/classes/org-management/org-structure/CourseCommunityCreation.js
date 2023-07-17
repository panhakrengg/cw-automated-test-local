import Field from '../../constants/Field'

class CourseCommunityCreation {
  enableCourseCreation() {
    cy.cwTable()
      .first()
      .within(($subOrganization) => {
        cy.wrap($subOrganization).getTableHeader('Course Creation').should('be.visible')
        cy.wrap($subOrganization)
          .get('tr')
          .eq(1)
          .within(($firstRow) => {
            cy.wrap($firstRow).getThreeDots().click()
            cy.wrap($firstRow).clickDropdownName('Enable Course Creation')
          })
      })
  }
  expectEnableCourseCreationPopup() {
    cy.swal2().within(($swal2) => {
      cy.getSwal2Header().should(
        'have.text',
        'Would you like to enable course creation to this Organization unit?'
      )
      cy.wrap($swal2)
        .getSwal2Content()
        .within(($swal2Content) => {
          cy.wrap($swal2Content)
            .find('div')
            .should(
              'contain.text',
              'All communities in this Organization unit will have the option to create their own courses.'
            )
        })
    })
  }
  expectAddExistingCourseButton() {
    cy.get('.border > .row')
      .contains('Add Existing Course')
      .as('addExistingCourse')
      .should('be.visible')
    cy.get('@addExistingCourse').click()
    cy.get('.swal2-popup').should('be.visible').closeSwal2()
  }
  createSubOrganization(name) {
    cy.get('button').contains('Create sub organization').click()
    cy.get(':nth-child(1) > .form-group input').type(name)
    cy.get('.multiselect__single').type('Organization {enter}')
    cy.intercept('**org_unit_info%2Fmodify').as('createOrgUnit')
    cy.get('button').contains(Field.SAVE).click()
    cy.wait('@createOrgUnit')
  }
  accessToRootOrganization() {
    cy.get('a > .text-primary').contains('WebLearn International').click()
  }
  expectCourseCreateShouldDisableByDefault(orgUnitName) {
    cy.cwTable()
      .rowName(orgUnitName)
      .first()
      .within(($subOrganization) => {
        cy.wrap($subOrganization).within(($newOrgUnit) => {
          cy.wrap($newOrgUnit).should('be.visible')
          cy.wrap($newOrgUnit).get('td').eq(2).should('contain.text', 'Disabled')
        })
      })
  }
  deleteOrgUnit(name) {
    cy.cwTable()
      .rowName(name)
      .first()
      .within(($subOrganization) => {
        cy.wrap($subOrganization).getThreeDots().click()
        cy.intercept('**org_management%2Fdelete_org').as('deleteOrg')
        cy.wrap($subOrganization).clickDropdownName(Field.DELETE)
      })
    cy.get('button:contains("Yes, Delete")').click()
    cy.wait('@deleteOrg')
  }
  expectNotToSeeEnableCourseCreationOption() {
    cy.get('.cw-table')
      .first()
      .within(($subOrganization) => {
        cy.wrap($subOrganization).getTableHeader('Course Creation').should('be.visible')
        cy.wrap($subOrganization)
          .get('tr')
          .eq(1)
          .within(($firstRow) => {
            cy.wrap($firstRow).getThreeDots().click()
          })
        cy.wrap($subOrganization)
          .get('.dropdown-three-dots > .dropdown-menu', { timeout: 20000 })
          .should('not.contain.text', 'Enable Course Creation')
      })
  }

  createNewCommunity() {
    cy.get('button').contains('Create new community').click()
  }

  accessToSubOrg(name) {
    cy.get('#_orgManagementPortlet_cw-dropdown_subOrg_0').click()
    cy.get('.dropdown-item').contains(name).click()
  }
}

export default CourseCommunityCreation
