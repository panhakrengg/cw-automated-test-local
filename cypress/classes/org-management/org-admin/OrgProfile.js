import Environment from '../../base/Environment'
import InterceptReq from '../../base/InterceptReq'
import SignInAs from '../../utilities/SignInAs'
import UserRole from '../../utilities/user-role/UserRole'

class OrgProfile {
  _profileUpdateMessage = 'Your setting has been updated.'
  _viewUserProfileUrl = '/web/my-profile/profile/-/display/'
  _viewOwnProfileUrl = '/web/my-profile/profile'
  _updated = '_updated'

  _itcFetchOrgProfile = new InterceptReq('/profile/organizations/fetch', 'FetchOrgProfile')
  _itcFetchProfileSetting = new InterceptReq('/profile/setting/fetch', 'FetchProfileSetting')
  _itcModifyProfileSetting = new InterceptReq('/profile/setting/modify', 'ModifyProfileSetting')
  _itcModifyContactInfo = new InterceptReq('/profile/contact_info/modify', 'ModifyContactInfo')

  goToMyProfile(role) {
    this._itcFetchProfileSetting.set()
    cy.visitThenSignIn(this._viewOwnProfileUrl, role)
    this._itcFetchProfileSetting.wait()
  }

  verifyToggleOthersInMyOrganizationCanView(enabled) {
    this.defineAliasProfileCardHeaderFixHeight()
    this.clickProfileCogIcon()
    this.getProfileSettingToggleButton('Others in my organization can view', 'Organization Profile')
    this.verifyCurrentToggleState(enabled)
    this.triggerProfileSettingToggleUpdate()
    cy.expectToastMessage(this._profileUpdateMessage)
  }
  verifyRootOrgMemberCanSeeOtherOrgProfiletab(viewProfile) {
    this.viewOtherProfileByRootOrgMember(viewProfile)
    this.verifyOrgMemberCanSeeOrgProfileTab()
  }
  verifyRootOrgMemberShouldNotSeeOtherOrgProfiletab(viewProfile) {
    this.viewOtherProfileByRootOrgMember(viewProfile)
    this.verifyOrgMemberCannotSeeOrgProfileTab()
  }
  viewOtherProfileByRootOrgMember(viewProfile) {
    this._itcFetchOrgProfile.set()
    SignInAs.rootOrgMember(
      this._viewUserProfileUrl + this.getUserUuidByEnviroment(viewProfile['uuid'])
    )
    this._itcFetchOrgProfile.wait()
  }
  verifyOrgMemberCanSeeOrgProfileTab() {
    this.verifyOrgProfileTab()
  }
  verifyOrgMemberCannotSeeOrgProfileTab() {
    this.verifyOrgProfileTab('not.exist')
  }
  verifyOrgProfileTab(assertion = 'be.visible') {
    this.defineAliasProfileCardHeaderFixHeight()
    cy.get('@cardHeader').within(() => {
      cy.get('div.e-tab-header')
        .find('div.e-toolbar-item')
        .contains('div.e-tab-wrap', 'Organization Profile')
        .should(assertion)
    })
  }
  verifyCurrentToggleState(enabled) {
    cy.get('@button').toggleIsValidState(enabled)
  }

  updateGivenNameAndFamilyName(rollback) {
    this.defineAliasInputGivenAndFamilyName()
    cy.get('@inputGivenName')
      .invoke('val')
      .then((givenName) => cy.wrap(givenName.includes(this._updated)).as('failedPreviously'))
    cy.get('@failedPreviously').then((result) => {
      if (result) {
        cy.get('@inputGivenName').typeBackSpace(8)
        cy.get('@inputFamilyName').typeBackSpace(8)
      } else {
        if (rollback) return
        cy.get('@inputGivenName').type(this._updated)
        cy.get('@inputFamilyName').type(this._updated)
      }
      this.triggerUpdateContactInfo()
    })
  }
  clickProfileCogIcon() {
    cy.get('@cardHeader').within(() => {
      cy.get('a.cog-icon').as('profileCogIcon')
    })
    cy.get('@profileCogIcon').hasSvgIcon()
    cy.get('@profileCogIcon').click()
  }
  clickEditContactInfo() {
    this.defineAliasCardLeftContentBody()
    cy.get('@leftContentBody').then(() => {
      cy.contains('p.font-weight-lighter', 'Contact Info').find('a').click()
    })
    cy.get('div.edit-contact-info').as('editContactInfo')
    cy.get('@editContactInfo').should('be.visible')
  }
  triggerUpdateContactInfo() {
    this._itcModifyContactInfo.set()
    cy.contains('button.text-uppercase', 'Update Contact info').click({
      force: true,
    })
    this._itcModifyContactInfo.wait()
    cy.expectToastMessage('Your profile contact has been updated.')
  }
  triggerProfileSettingToggleUpdate() {
    this._itcModifyProfileSetting.set()
    cy.get('@button').toggleSwitch()
    this._itcModifyProfileSetting.wait()
  }
  defineAliasProfileCardHeaderFixHeight() {
    cy.get('div.view-profile-wrapper').then(() => {
      cy.cecCard().cardRightContent()
      cy.get('@cardRightContent').then(($rightCard) => {
        cy.wrap($rightCard).cecCardHeaderFixHeight().as('cardHeader')
      })
    })
  }
  defineAliasCardLeftContentBody() {
    cy.get('div.view-profile-wrapper').then(() => {
      cy.cecCard().cardLeftContent().as('leftContentBody')
    })
  }
  defineAliasInputGivenAndFamilyName() {
    cy.get('@editContactInfo')
      .find('.profile')
      .within(() => {
        cy.get('.visibility-dropdown-wrapper')
          .contains('label', 'Given Name')
          .parent()
          .find('input[type="text"]')
          .as('inputGivenName')
        cy.get('.visibility-dropdown-wrapper')
          .contains('label', 'Family Name')
          .parent()
          .find('input[type="text"]')
          .as('inputFamilyName')
      })
  }
  getProfileSettingToggleButton(label, section = 'Global Search') {
    cy.get('#default-sidebar')
      .contains('label', section)
      .should('be.visible')
      .parent()
      .within(($section) => {
        cy.wrap($section).cwToggleButton(label, 0)
      })
  }
  getUserUuidByEnviroment(uuid) {
    return uuid[new Environment().getEnvPrefix()]
  }
}

export default OrgProfile
