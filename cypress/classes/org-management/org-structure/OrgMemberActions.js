import Environment from '../../base/Environment'
import Field from '../../constants/Field'

class OrgMemberActions {
  environment = new Environment()
  viewOrganizationProfile(subject, checkActivity = false) {
    if (!subject) return
    cy.wrap(subject).clickDropdownItem('View Organization Profile')
    cy.wrap(subject)
      .swal2()
      .within(() => {
        cy.getSwal2Header().should('contain.text', 'View Organization Profile')
        cy.getSwal2Content().within(($popupContent) => {
          cy.wrap($popupContent)
            .get('#swal2-content')
            .find('> div.popup-consent-form-wrapper > div')
            .as('listOfContents')
          cy.get('@listOfContents')
            .eq(0)
            .contains('Organization Details')
            .parent()
            .find('a[role="button"]')
            .should('be.visible')
            .and('not.be.disabled')
          cy.get('@listOfContents')
            .eq(1)
            .contains(
              'This information is protected with an additional level of encryption. Access is restricted to only administrators and team leaders of your organizations.'
            )

          cy.get('@listOfContents').eq(2).find('div.row').as('orgPersonInfo')
          cy.get('@orgPersonInfo').eq(0).contains('div.col-6', 'First Name')
          cy.get('@orgPersonInfo').eq(1).contains('div.col-6', 'Last Name')
          cy.get('@orgPersonInfo').eq(2).contains('div.col-6', 'Email')

          cy.get('@listOfContents').eq(3).find('> div').as('publicProfile')
          cy.get('@publicProfile')
            .find('div:nth-child(1)')
            .contains('div.text-black', 'Public Profile Details')
            .parent()
            .contains('a.link', 'View public profile')
          cy.get('@publicProfile').eq(1).contains('.col-6', 'Screen Name')
          cy.get('@publicProfile').eq(2).contains('.col-6', 'Account Email')
          if (checkActivity) {
            cy.get('@listOfContents')
              .eq(4)
              .find('> div')
              .within(($checkActivity) => {
                cy.wrap($checkActivity)
                  .eq(0)
                  .contains('div.text-black', 'Activities')
                  .parent()
                  .contains('a.link', 'View activity log')
                cy.wrap($checkActivity).eq(1).contains('.col-6', '2-Step Verification')
                cy.wrap($checkActivity).eq(2).contains('.col-6', 'Member since')
                cy.wrap($checkActivity).eq(3).contains('.col-6', 'Last Login')
              })
          }
        })
      })
    cy.wrap(subject).closeSwal2()
  }

  forcePasswordReset(subject) {
    if (!subject) return
    cy.wrap(subject).clickDropdownItem('Force password reset')
    cy.wrap(subject).verifySwal2Confirmation(
      'Would you like to force this member to reset password?',
      'This user will need to set a new password the next time he/she logs in.',
      Field.YES_FORCE
    )
  }

  manage2StepVerification(subject) {
    if (!subject) return
    cy.wrap(subject).clickDropdownItem('Manage 2-Step Verification')
    cy.wrap(subject)
      .swal2()
      .within(() => {
        cy.getSwal2Header().should('contain.text', 'Manage 2-Step Verification')
        cy.getSwal2Content()
          .get('#swal2-content > div.text-black')
          .within(($manage2FaContent) => {
            cy.contains('> p.font-weight-bold', 'User')
            cy.wrap($manage2FaContent).find('> div.d-flex').as('manage2FaContentEl')
            cy.get('@manage2FaContentEl')
              .eq(0)
              .find('> img.img-circle')
              .should('be.visible')
              .and('not.be.disabled')
              .parent()
              .find('> span')
              .should('be.visible')
            cy.get('@manage2FaContentEl')
              .eq(1)
              .contains('> p.font-weight-bold', '2-Step Verification disabled')
            cy.get('@manage2FaContentEl')
              .eq(2)
              .contains(
                '> span.font-weight-normal',
                'Require this person to setup 2-Step Verification'
              )
              .parent()
              .find('> span.cw-toggle-button > label.switch > span.slider')
              .click()
          })
      })
    cy.wrap(subject).verifySwal2Confirmation(
      'Would you like to require 2-Step Verification on this account?',
      'This user will not be able to disable 2-Step Verification on his or her own.',
      Field.YES_SET
    )
  }

  lockAccount(subject) {
    if (!subject) return
    cy.wrap(subject).clickDropdownItem('Lock account')
    cy.wrap(subject).verifySwal2Confirmation(
      'Would you like to lock this account?',
      'Note: You can unlock this user at any time',
      Field.YES_LOCK
    )
  }

  verifyRemoveTeamLeader(subject) {
    if (!subject) return
    cy.wrap(subject).clickDropdownItem('Remove team leader')
    cy.wrap(subject).verifySwal2Confirmation(
      'Would you like to remove this user as a team leader?',
      '',
      Field.YES_REMOVE
    )
  }

  makeTeamLeader(subject) {
    if (!subject) return
    cy.wrap(subject).getThreeDots().getDropdownName('Make team leader')
  }

  verifyRemove(subject) {
    if (!subject) return
    //TODO: need to refactor to get the exact dropdown item that has duplcated ex: Remove team leader and Remove
    cy.wrap(subject)
      .get('.dropdown-three-dots')
      .within(($threeDots) => {
        cy.wrap($threeDots).click()
        cy.wrap($threeDots).find('ul.dropdown-menu > li:last').click()
      })
    cy.wrap(subject).verifySwal2Confirmation(
      'Would you like to remove this user from this organization unit?',
      '',
      Field.YES_REMOVE
    )
  }

  verifyPopupAddMember(subject, isEdit = false) {
    const addUser = this.environment.isPrd() ? 'au_ac_funcmember' : 'au_categoryorgadmin'

    if (!subject) return
    cy.wrap(subject)
      .swal2()
      .within(($editPopup) => {
        cy.getSwal2Header().should('contain.text', isEdit ? Field.EDIT : 'Add Member')
        cy.getSwal2Content()
          .get('#swal2-content > div')
          .within(($editContent) => {
            cy.get('> .search-user-wrapper').contains('label', 'User')
            if (isEdit) {
              cy.get('> .search-user-wrapper')
                .find('div.disabled > img.img-circle')
                .should('be.visible')
                .parent()
                .find('span.font-weight-bold')
                .should('be.visible')
            } else {
              cy.get('> .search-user-wrapper .multiselect').within(($searchUser) => {
                cy.wrap($searchUser).find('.multiselect__input').type(`${addUser} {enter}`)
                cy.wrap($searchUser)
                  .find(
                    '.multiselect__content-wrapper > ul.multiselect__content > li.multiselect__element'
                  )
                  .should('have.length.at.least', 1)
                  .first()
                  .click()
              })
            }
            cy.get('> .position-wrapper')
              .contains('label', 'Position')
              .parent()
              .find('.multiselect')
              .within(($position) => {
                cy.wrap($position).click()
                cy.wrap($position)
                  .find('input.multiselect__input')
                  .and(
                    'have.attr',
                    'placeholder',
                    'Enter a new position or select the existing ones'
                  )
                  .type('Cop Owner {enter}')
              })
            cy.wrap($editContent)
              .find('> div:nth-child(3)')
              .contains('label', 'Working hours')
              .parent()
              .find('div > input[type="number"]')
              .should('be.visible')
              .and('not.be.disabled')
              .type('40')
            cy.wrap($editContent)
              .find('.cec-popup__footer > div > button')
              .contains(isEdit ? Field.SAVE : Field.ADD)
              .should('be.visible')
              .and('not.be.disabled')
          })
        cy.wrap($editPopup).closeSwal2()
      })
  }

  verifyEdit(subject) {
    if (!subject) return
    cy.wrap(subject).clickDropdownItem(Field.EDIT)
    this.verifyPopupAddMember(subject, true)
  }

  verifyOrgMemberThreeDots(subject, isTeamLeader = false) {
    if (!subject) return
    this.verifyEdit(subject)
    this.viewOrganizationProfile(subject)
    if (isTeamLeader) {
      this.verifyRemoveTeamLeader(subject)
    } else {
      this.makeTeamLeader(subject)
    }
    this.forcePasswordReset(subject)
    this.manage2StepVerification(subject)
    this.lockAccount(subject)
    this.verifyRemove(subject)
  }
}

export default OrgMemberActions
