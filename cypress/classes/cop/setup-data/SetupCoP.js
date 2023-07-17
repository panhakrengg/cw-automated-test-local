import Environment from '../../base/Environment'
import InterceptReq from '../../base/InterceptReq'
import Field from '../../constants/Field'
import WebNotification from '../../notification/WebNotification'
import OrgManageCommunity from '../../org-management/OrgManageCommunity'
import EnvLogin from '../../utilities/EnvLogin'

class SetupCoP {
  itcAssignRoleAdmin = new InterceptReq('/admin/assign_role', 'AssignRoleAdmin')
  itcChangeCopOwner = new InterceptReq('/admin/change_cop_owner', 'ChangeCopOwner')
  itcFetchCopInfo = new InterceptReq('/admin/fetch_cop_info', 'FetchCopInfo')
  itcFetchDynamicMember = new InterceptReq('/dynamic_member/member/fetch', 'FetchDynamicMember')
  itcFetchManageMembers = new InterceptReq('/admin/fetch_manage_members', 'FetchManageMembers')
  itcFetchMemberRoles = new InterceptReq('/admin/fetch_member_roles', 'FetchMemberRoles')
  itcFetchOwnerSetting = new InterceptReq('/admin/fetch_ownership_setting', 'FetchOwnerSetting')
  itcGetCoPAdmins = new InterceptReq('/admin/cop_admins/get', 'GetCoPAdmins')
  itcInviteMembers = new InterceptReq('/admin/invite_members', 'InviteMembers')
  itcSearchOrgUsers = new InterceptReq('/admin/search_org_users', 'SearchOrgUsers')
  itcFetchFeaturesSettings = new InterceptReq(
    '/admin/fetch_features_settings',
    'FetchFeaturesSettings'
  )
  itcSearchCommunities = new InterceptReq('/manage_communities/search', 'SearchCommunities')
  itcFetchOwnershipSetting = new InterceptReq(
    '/admin/fetch_ownership_setting',
    'FetchOwnershipSetting'
  )
  #itcGetConsentInstance = new InterceptReq('/setting/consent/instance/get', 'GetConsentInstance')
  #itcFetchPredefinedForms = new InterceptReq(
    '/setting/consent/fetch_predefined_forms',
    'FetchPredefinedForms'
  )
  #itcSaveConsentForm = new InterceptReq('/setting/consent/save_consent_form', 'SaveConsentForm')
  #itcFetchConsentForm = new InterceptReq('/consent_form/fetch', 'FetchConsentForm')
  #itcGetCommentProfile = new InterceptReq('/post/get_comment_profiles', 'GetCommentProfile')
  env = new Environment()
  webNotification = new WebNotification()
  orgManageCommunity = new OrgManageCommunity()

  setCoPBaseYaml(baseYaml) {
    this.copBaseYaml = baseYaml
  }

  changeProfile(filePath) {
    cy.getButtonByName('Set your profile photo').click()
    cy.wait(500)
    cy.getButtonByName('Change image').chooseFile(filePath)
    cy.wait(1000)
    cy.clickPrimaryButton(Field.SAVE)
  }

  createByType(type) {
    const { organization, name, profile } = this.copBaseYaml

    cy.get('.header-group', { timeout: 30000 }).contains(type).click()
    Cypress.on('uncaught:exception', () => false)
    cy.get('button').contains('Create your Community of Purpose Site').click()
    cy.wait(2000)
    if (organization) cy.get('select').select(organization)
    if (profile) this.changeProfile(profile.path)
    cy.get('input[placeholder="Enter your Community of Purpose name"]').clear().type(name)
    if (type != 'Training') {
      cy.get('button').contains('Next, Set Banner Image').click()
    }
    const itcCreateCoP = new InterceptReq('/create/community', 'createCoP')
    itcCreateCoP.set()
    cy.get('button').contains('Create Community of Purpose').click()
    itcCreateCoP.wait()
  }

  createTrainingCoP() {
    cy.visit(
      '/create-cop?p_p_id=setupCommunityPortlet&p_p_lifecycle=0&_setupCommunityPortlet_communityUrl=%2Fu%2Fhome%2Fcommunities&_setupCommunityPortlet_mvcRenderCommandName=%2Fcreate_community%2Fview'
    )
    this.createByType('Training')
  }

  #visitManageConsent() {
    this.#itcGetConsentInstance.set()
    cy.visit(
      `${this.copBaseYaml.url}/admin/admin#_copMemberManagementPortlet_option=manage-consent`
    )
    this.#itcGetConsentInstance.wait()
  }

  #enableConsentToggle() {
    this.#itcFetchPredefinedForms.set()
    cy.get('.consent-card').within(($card) => {
      cy.wrap($card).toggleSwitch()
    })
    this.#itcFetchPredefinedForms.wait()
  }

  #clickUseThisFormButton() {
    this.#itcSaveConsentForm.set()
    cy.clickPrimaryButton('Use this form')
    this.#itcSaveConsentForm.wait()
  }

  #clickYesIAgree() {
    this.#itcGetCommentProfile.set()
    cy.clickPrimaryButton(Field.YES_I_AGREE)
    this.#itcFetchConsentForm.wait()
    cy.waitLoadingOverlayNotExist()
  }

  #acceptAllConsentForm() {
    const { manageConsent } = this.copBaseYaml
    this.#itcFetchConsentForm.wait()
    cy.getPopup().within(($popup) => {
      for (const [key, value] of Object.entries(manageConsent.consentItems)) {
        cy.wrap($popup).checkboxByLabel(value, 'p').check()
      }
    })
  }

  #acceptConsentExpectSeeFullName() {
    const { manageConsent } = this.copBaseYaml
    this.#itcFetchConsentForm.wait()
    cy.getPopup().within(($popup) => {
      for (const [key, value] of Object.entries(manageConsent.consentItems)) {
        if (!value.includes('see my full name')) cy.wrap($popup).checkboxByLabel(value, 'p').check()
      }
    })
  }

  createConsentBySelectFromOrg() {
    const { manageConsent } = this.copBaseYaml
    this.#itcFetchConsentForm.set()

    this.#visitManageConsent()
    this.#enableConsentToggle()
    cy.swal2().within(() => {
      cy.getElementWithLabel(manageConsent.formName, '.text-black').click()
      cy.clickPrimaryButton(Field.NEXT)
      this.#clickUseThisFormButton()
    })
    this.#acceptAllConsentForm()
    this.#clickYesIAgree()
  }

  #getCopUrl() {
    return this.copBaseYaml.url
  }

  copMembersAcceptConsent() {
    const { acceptSeeFullName } = this.copBaseYaml
    this.#itcFetchConsentForm.set()

    for (const [key, value] of Object.entries(acceptSeeFullName[this.env.getEnvYaml()])) {
      cy.logInTestCase(`Member accepts consent ${value.email}`)
      cy.signInViaEmail(value.email)
      cy.visit(this.#getCopUrl())
      value.acceptSeeFullName
        ? this.#acceptAllConsentForm()
        : this.#acceptConsentExpectSeeFullName()
      this.#clickYesIAgree()
      cy.reload()
      cy.waitLoadingOverlayNotExist()
      cy.signOut()
    }
  }

  createCommunity() {
    cy.visit(
      '/create-cop?p_p_id=setupCommunityPortlet&p_p_lifecycle=0&_setupCommunityPortlet_communityUrl=%2Fu%2Fhome%2Fcommunities&_setupCommunityPortlet_mvcRenderCommandName=%2Fcreate_community%2Fview'
    )
    this.createByType(this.copBaseYaml.type)
  }

  visitCoPAdmin() {
    this.itcFetchDynamicMember.set()
    this.itcFetchCopInfo.set()
    if (this.copBaseYaml.admin) cy.visit(this.copBaseYaml.admin.url, { failOnStatusCode: false })
    else cy.visit(`${this.copBaseYaml.url}/admin/admin`, { failOnStatusCode: false })
    this.itcFetchCopInfo.wait()
    this.itcFetchDynamicMember.wait()
  }
  visitOwnership() {
    cy.url().then((url) => {
      cy.visit(
        `${url}#_copMemberManagementPortlet_option=settings;_copMemberManagementPortlet_settingOption=cp-ownership-setting`
      )
    })
  }
  visitFeature() {
    this.visitCoPAdmin()
    this.itcFetchFeaturesSettings.set()
    cy.url().then((url) => {
      cy.visit(
        `${url}#_copMemberManagementPortlet_option=settings;_copMemberManagementPortlet_settingOption=features`
      )
    })
    this.itcFetchFeaturesSettings.wait()
    cy.wait(1000)
  }
  visitDefaultPostAuthor() {
    this.visitCoPAdmin()
    this.itcFetchOwnershipSetting.set()
    cy.url().then((url) => {
      cy.visit(
        `${url}#_copMemberManagementPortlet_option=settings;_copMemberManagementPortlet_settingOption=default-post-author`
      )
    })
    this.itcFetchOwnershipSetting.wait()
    cy.wait(1000)
  }

  visitManageCommunityOrgAdmin() {
    this.itcSearchCommunities.set()
    cy.visit('/web/firecloud-zone/manage-communities')
    this.itcSearchCommunities.wait()
  }

  inviteMembersByName() {
    const screenNames = this.copBaseYaml.members[this.env.getEnvYaml()].screenNames
    this.itcSearchOrgUsers.set()
    this.itcFetchManageMembers.set()

    cy.clickButtonByName(Field.INVITE)
    this.itcSearchOrgUsers.wait()
    cy.swal2().within(() => {
      screenNames.forEach((member) => {
        cy.inputByPlaceholder('Search your connections', `${member}{enter}`)
        this.itcSearchOrgUsers.wait()
        cy.getCheckbox().first().check()
      })
      cy.clickButtonByName(Field.NEXT)
      this.clickSendInvite()
    })
    this.itcFetchManageMembers.wait()
  }

  clickSendInvite() {
    this.itcInviteMembers.set()
    cy.clickButtonByName('Send invite')
    this.itcInviteMembers.wait()
  }

  inviteMembersByEmail() {
    const emails = this.copBaseYaml.copUsers[this.env.getEnvYaml()].inviteViaEmails
    this.itcSearchOrgUsers.set()
    this.itcFetchManageMembers.set()

    let inviteEmail = ''
    emails.forEach((email) => {
      inviteEmail += `${email},`
    })

    cy.clickButtonByName(Field.INVITE)
    this.itcSearchOrgUsers.wait()
    cy.swal2().within(() => {
      cy.clickLinkByName('invite via email')
      cy.inputByPlaceholder('Enter e-mail address', inviteEmail)
      this.clickSendInvite()
    })
    this.itcFetchManageMembers.wait()
  }

  acceptInvitation() {
    const emails = this.copBaseYaml.copUsers[this.env.getEnvYaml()].members
    const notification = `invited you to join ${this.copBaseYaml.name}.`

    emails.forEach((email) => {
      cy.signInViaEmail(email)
      this.webNotification.acceptRequest(notification)
      cy.signOut()
    })
  }

  inviteMembers() {
    this.visitCoPAdmin()
    this.inviteMembersByEmail()
  }

  inviteMembersThenAccept() {
    this.inviteMembers()
    this.acceptInvitation()
  }

  clickUpdate() {
    cy.clickButtonByName(Field.UPDATE)
    this.itcAssignRoleAdmin.wait()
  }

  changeRole(emails, role) {
    this.itcFetchMemberRoles.set()
    this.itcAssignRoleAdmin.set()

    this.visitCoPAdmin()
    emails.forEach((email) => {
      cy.rowName(email).within((userRow) => {
        cy.wrap(userRow).clickDropdownItem('Change Role')
        this.itcFetchMemberRoles.wait()
      })
      cy.swal2().within(() => {
        cy.clickDropdownSelect(role)
        this.clickUpdate()
      })
    })
  }

  changeToAdminRole() {
    const adminEmails = this.copBaseYaml.copUsers[this.env.getEnvYaml()].admins
    this.changeRole(adminEmails, 'Administrator')
  }

  changeToContactManagerRole() {
    const emails = this.copBaseYaml.copUsers[this.env.getEnvYaml()].contactManagers
    this.changeRole(emails, 'Contact Manager')
  }

  clickChangeOwner() {
    cy.clickLinkByName('Change Owner')
  }

  confirmPwd() {
    this.itcGetCoPAdmins.set()
    cy.inputFormGroup('Confirm your password before continuing', EnvLogin.envPass())
    cy.clickButtonByName(Field.CONFIRM)
    this.itcGetCoPAdmins.wait()
  }

  selectAdminThenChangeOwnership() {
    const ownerEmail = this.copBaseYaml.copUsers[this.env.getEnvYaml()].owner

    this.itcChangeCopOwner.set()
    this.itcFetchOwnerSetting.set()

    cy.swal2().within(() => {
      cy.getElementWithLabel(ownerEmail, 'p').click()
      cy.checkboxByLabel('I agree that').check()
      cy.clickButtonByName(Field.CHANGE)

      this.itcChangeCopOwner.wait()
      this.itcFetchOwnerSetting.wait()
      cy.clickButtonByName(Field.CLOSE)
    })
  }

  changeOwnership() {
    this.changeToAdminRole()
    this.visitOwnership()

    this.clickChangeOwner()
    this.confirmPwd()
    this.selectAdminThenChangeOwnership()
  }

  changeOwnerFromOrgAdmin() {
    this.visitManageCommunityOrgAdmin()
    this.orgManageCommunity.changeOwner(
      this.copBaseYaml.name,
      this.copBaseYaml.copUsers[this.env.getEnvYaml()].owner,
      true
    )
  }

  changeOwnerFromOrgAdminKeepPreviousOwner() {
    this.visitManageCommunityOrgAdmin()
    this.orgManageCommunity.changeOwner(
      this.copBaseYaml.name,
      this.copBaseYaml.copUsers[this.env.getEnvYaml()].owner,
      false
    )
  }

  enableContactManagementFeature(feature) {
    cy.getElementWithLabel(feature, 'label')
      .find('input')
      .invoke('is', ':checked')
      .then((checked) => {
        if (!checked) {
          cy.checkboxByLabel(feature).check()
          cy.expectToastMessage('Settings have been saved.')
        }
      })
  }
  visitThenEnableContactManagementFeature() {
    this.visitFeature()
    this.enableContactManagementFeature('Contact Management')
  }
  visitThenSetDefaultPostAuthorMyCommunity() {
    this.visitDefaultPostAuthor()
    cy.getElementWithLabel('My Community of Purpose', 'label').click()
    cy.wait(5000)
  }
}
export default SetupCoP
