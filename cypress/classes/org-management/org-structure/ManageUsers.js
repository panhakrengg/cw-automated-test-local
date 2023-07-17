import Field from '../../constants/Field'
import WebNotification from '../../notification/WebNotification'
import EmailOrgManagement from '../../notification/email/EmailOrgManagement'
import EmailHelper from '../../utilities/EmailHelper'
import SignInAs from '../../utilities/SignInAs'
import UserRole from '../../utilities/user-role/UserRole'
import { OrgConst } from '../base-org-management/OrgStub'
import EmailVerification from './EmailVerification'
import OrgUnitInfo from './OrgUnitInfo'

class ManageUsers extends OrgUnitInfo {
  _manageUserMenu = 'Manage Users'
  _premiumBasic = 'Premium Basic'
  _premium = 'Premium'
  _free = 'Free'
  _postFix = '_updated'
  _prefix = 'updated_'
  _dashboardUrl = '/u/home/dashboard'

  constructor() {
    super()
    this._itcGetMembers = this.itc.getMembers
    this._itcResetPassword = this.itc.resetPassword
    this._itcModifyStatus = this.itc.modifyStatus
    this._itcModifyOrgProfile = this.itc.modifyOrgProfile
    this._itcFetchCreateCopTypes = this.itc.fetchCreateCopTypes
    this._itcFetchUserUnderOrg = this.itc.fetchUserUnderOrg
    this._itcRemoveUserOrganization = this.itc.removeUserOrganization
    this._itcInviteUserOrganization = this.itc.inviteUserOrganization
    this._itcModifyPremiumSubscription = this.itc.modifySubscription
  }

  interceptGetUsers() {
    this._itcGetMembers.set()
  }
  waitGetUsers() {
    this._itcGetMembers.wait()
  }
  interceptResetPassword() {
    this._itcResetPassword.set()
  }
  waitResetPassword() {
    this._itcResetPassword.wait()
  }
  interceptModifyStatus() {
    this._itcModifyStatus.set()
  }
  waitModifyStatus() {
    this._itcModifyStatus.wait()
  }
  accessManageUsersTabByAdmin() {
    this.interceptGetUsers()
    SignInAs.orgAdmin(OrgConst.TABS.MANAGE_USERS)
    this.waitGetUsers()
  }
  changeMemberFilterToExit() {
    cy.get('#_orgManageUsersPortlet_cw-dropdown_').clickCwDropdownItem('Exited')
  }
  findUserRow(text, isNotFullMatch) {
    this.searchUser(text, isNotFullMatch)
    cy.get('@manageMemberWrapper').within(() => cy.cwTable().rowName(text).as('member'))
  }
  searchUser(text, isNotFullMatch = false) {
    this.defineAliasForManageMemberWrapper()
    cy.get('@manageMemberWrapper').find('.search-box-wrapper').as('searchBoxWrapper')
    this.interceptGetUsers()
    const textToSearch = isNotFullMatch ? `${text}` : `"${text}"`
    cy.get('@searchBoxWrapper').typeInput(`${textToSearch} {enter}`)
    cy.wait(1000)
    this.waitGetUsers()
  }
  findUserRowByAdmin(text, isNotFullMatch = false) {
    this.accessManageUsersTabByAdmin()
    this.findUserRow(text, isNotFullMatch)
  }
  defineAliasForManageMemberWrapper() {
    cy.get('.manage-member-wrapper').as('manageMemberWrapper')
  }
  checkUrlAfterSignIn(role, url) {
    cy.visitThenSignIn('/', role)
    cy.url().should('include', url)
  }
  checkLockOrUnlockAccount(email, name) {
    this.unlockIfMemberAlreadyLocked()
    cy.get('@member').within(($member) => {
      cy.wrap($member).clickDropdownItem('Lock account')
    })
    this.interceptModifyStatus()
    cy.get('@member').swal2().swal2Confirm(Field.YES_LOCK).click()
    this.waitModifyStatus()
    cy.get('@member').within(($member) => {
      cy.wrap($member).get('td:first').hasSvgIcon()
    })
    cy.signInViaEmail(email)
    cy.get('#kc-content-wrapper').contains(
      'span.kc-feedback-text',
      'Account is disabled, contact admin.'
    )
    EmailVerification.verifyDisabledEmail(email, name)
    this.findUserRowByAdmin(email)
    this.unlockMember()
    cy.get('@member').within(($member) => {
      cy.wrap($member).hidedSvgIcon()
    })
    this.checkUrlAfterSignIn(UserRole.ORG_MEMBER.LOCK_USER, this._dashboardUrl)
  }
  unlockIfMemberAlreadyLocked() {
    let isLocked = false
    cy.get('@member')
      .getThreeDots()
      .find('ul.dropdown-menu li')
      .each((li) => {
        if (li.text().includes('Unlock account')) isLocked = true
      })
      .then(() => {
        if (isLocked) this.unlockMember()
      })
  }
  unlockMember() {
    this.interceptModifyStatus()
    cy.get('@member').within(($member) => {
      cy.wrap($member).clickDropdownItem('Unlock account')
      cy.wrap($member).swal2().swal2Confirm('Yes, Unlock').click()
    })
    this.waitModifyStatus()
  }
  openViewOrgProfilePopup() {
    cy.get('@member').within(($member) => {
      cy.wrap($member).clickDropdownItem('View Organization Profile')
      cy.wrap($member)
        .swal2()
        .getSwal2Content()
        .find('.popup-consent-form-wrapper')
        .as('viewOrgProfilePopup')
    })
    cy.get('@viewOrgProfilePopup').contains('Organization Details').parent().as('orgDetailParent')
  }
  defineAliasesForOrgProfile() {
    cy.get('@orgDetailParent').find('a[role="button"]').as('btnEditProfile')
    cy.get('@btnEditProfile').click()
    this.defineAliasOrgProfileInfoPopup()
    this.defineAliasesForPersonalInfo()
    cy.get('@formUpdate').contains('Job Title').parent().as('jobTitle')
    cy.get('@formUpdate').contains('button', Field.CANCEL).as('btnCancel')
    cy.get('@formUpdate').contains('button', Field.SAVE).as('btnSave')
    cy.get('@firstName')
      .find('input.form-control')
      .then(($firstName) => {
        cy.wrap($firstName.val().includes(this._postFix)).as('isFailedPreviously')
      })
  }
  defineAliasOrgProfileInfoPopup(index = 3, alias = 'formUpdate') {
    cy.get('@viewOrgProfilePopup').find(`div:nth-child(${index})`).as(alias)
  }
  defineAliasesForPersonalInfo() {
    cy.get('@formUpdate').contains('First Name').parent().as('firstName')
    cy.get('@formUpdate').contains('Last Name').parent().as('lastName')
    cy.get('@formUpdate').contains('Email').parent().as('email')
  }
  verifyPublicProfileDetails(screenName, email) {
    cy.get('@publicProfileDetails').then(() => {
      cy.contains('div', 'Screen Name').parent().contains('span', screenName).should('be.visible')
      cy.contains('div', 'Account Email').parent().contains('div', email).should('be.visible')
    })
  }
  verifyPopupViewOrgProfileActivities() {
    cy.get('@viewOrgProfilePopup').then(() => {
      cy.get('div:nth-child(5)').as('activitiesSection')
    })
    cy.get('@activitiesSection').then(() => {
      cy.contains('div', 'Activities')
        .should('be.visible')
        .parent()
        .contains('a.link', 'View activity log')
        .should('be.visible')
        .and('have.attr', 'href')
      cy.contains('div', '2-Step Verification').should('be.visible')
      cy.contains('div', 'Date joined').should('be.visible')
      cy.contains('div', 'Last Login').should('be.visible')
    })
  }
  clickOnSaveButton(isOrgProfile) {
    isOrgProfile ? this._itcModifyOrgProfile.set() : this._itcModifyPremiumSubscription.set()
    cy.get('@btnSave').click()
    isOrgProfile ? this._itcModifyOrgProfile.wait() : this._itcModifyPremiumSubscription.wait()
    this.waitGetUsers()
  }
  validateProfileInfo(profileInfo) {
    if (profileInfo['firstName'])
      cy.get('@firstName').should('contain.text', profileInfo['firstName'])
    if (profileInfo['lastName']) cy.get('@lastName').should('contain.text', profileInfo['lastName'])
    if (profileInfo['email']) cy.get('@email').should('contain.text', profileInfo['email'])
    if (profileInfo['jobTitle']) cy.get('@jobTitle').should('contain.text', profileInfo['jobTitle'])
  }
  inputProfileInfo(profileInfo) {
    cy.get('@firstName').typeInput(profileInfo['firstName'])
    cy.get('@lastName').typeInput(profileInfo['lastName'])
    cy.get('@email').typeInput(profileInfo['email'])
    profileInfo['jobTitle']
      ? cy.get('@jobTitle').typeInput(profileInfo['jobTitle'])
      : cy.get('@jobTitle').find('input.form-control').clear()
  }
  validateUserProfileInfo(profileInfo) {
    cy.visitThenSignIn('/web/my-profile/profile', UserRole.ORG_MEMBER.VIEW_ORG_PROFILE)
    cy.get('.profile-summary-wrapper').as('profileWrapper')
    cy.get('@profileWrapper').contains(
      'p',
      `( ${profileInfo['firstName']} ${profileInfo['lastName']} )`
    )
    cy.get('@profileWrapper').contains('p', profileInfo['email'])
    cy.get('.profile-detail-wrapper').contains('span', 'Technical Support')
  }
  revertOrgProfileData(profileInfo) {
    this.findUserRowByAdmin(profileInfo['email'])
    this.openViewOrgProfilePopup()
    this.defineAliasesForOrgProfile()
    this.inputProfileInfo(profileInfo)
    this.clickOnSaveButton(true)
  }
  openChangeSubscriptionPopup() {
    cy.get('@member').within(($member) => {
      cy.wrap($member).clickDropdownItem('Change Member Subscription')
      cy.wrap($member).getPopup().as('changeSubPopup')
      cy.get('@changeSubPopup').getPopupBody().as('changeSubPopupBody')
      cy.get('@changeSubPopup').getPopupFooter().as('changeSubPopupFooter')
    })
  }
  defineAliasesForChangeSubscription() {
    cy.get('@changeSubPopupBody').within(() => {
      cy.get('.text-noselect').as('subscriptionPlan')
      cy.get('@subscriptionPlan').first().as('basic')
      cy.get('@subscriptionPlan').last().as('premium')
    })
    cy.get('@changeSubPopupFooter').within(() => {
      cy.contains('button', Field.SAVE).as('btnSave')
      cy.get('@btnSave').should('be.visible').and('be.disabled')
    })
  }
  validateChangeSubscription(email) {
    cy.get('@basicSelected').then((basicSelected) => {
      this.changeSubscription(basicSelected)
      this.validateSubscriptionColumn(basicSelected)
      if (!basicSelected) {
        this.validateAssignAsOrgAdmin(email)
      }
    })
    this.validateUserSubscription()
    this.revertSubscriptionToBasic(email)
  }
  changeSubscription(basicSelected) {
    cy.get(this.getSubscriptionTypeBy(basicSelected)).click()
    this.clickOnSaveButton()
  }
  getSubscriptionTypeBy(basicSelected) {
    return basicSelected ? '@premium' : '@basic'
  }
  validateSubscriptionColumn(basicSelected) {
    cy.get('@member').within(($member) => {
      cy.wrap($member).find('td:nth-child(4)').as('subscriptionColumn')
    })
    cy.get('@subscriptionColumn').should('contain.text', basicSelected ? 'Premium' : 'Basic')
  }
  validateAssignAsOrgAdmin(email) {
    cy.contains('button.add-admin-button', 'Add Admin').as('addAdminButton')
    cy.get('@addAdminButton').click()
    cy.get('@addAdminButton').swal2().getSwal2Content().as('addAdminPopup')
    cy.get('@addAdminPopup').within(($addAdminPopup) => {
      this._itcFetchUserUnderOrg.set()
      cy.wrap($addAdminPopup).multiSelectType(email)
      this._itcFetchUserUnderOrg.wait()
      cy.wrap($addAdminPopup).multiSelectNotFound('No users found.')
    })
  }
  validateUserSubscription() {
    this._itcFetchCreateCopTypes.set()
    cy.visitThenSignIn(
      '/create-cop?p_p_id=setupCommunityPortlet&p_p_lifecycle=0&_setupCommunityPortlet_communityUrl=%2Fmy-communities&_setupCommunityPortlet_mvcRenderCommandName=%2Fcreate_community%2Fview',
      UserRole.ORG_MEMBER.VIEW_ORG_PROFILE
    )
    this._itcFetchCreateCopTypes.wait()
    this.validateSubscriptionLabel()
    this.validateMissionWorkerCopCreation()
  }
  validateSubscriptionLabel() {
    cy.get('@basicSelected').then((basicSelected) => {
      this.validateSubscriptionLabelAtAvatarDropdown(
        basicSelected ? this._premium : this._premiumBasic
      )
    })
  }
  validateMissionWorkerCopCreation() {
    cy.cecCard().eq(2).contains('div.header-group > h1 > span', 'Mission Worker')
  }
  validateSubscriptionLabelAtAvatarDropdown(label) {
    cy.get('#avatar-dropdown').within(($avatarDropdown) => {
      cy.wrap($avatarDropdown).click()
      cy.contains('ul.cw-user-dropdown > li', label)
    })
  }
  revertSubscriptionToBasic(email) {
    cy.get('@basicSelected').then((basicSelected) => {
      if (basicSelected) return
      this.findUserRowByAdmin(email)
      this.openChangeSubscriptionPopup()
      this.defineAliasesForChangeSubscription()
      cy.get('@premium').click()
      this.clickOnSaveButton()
    })
  }
  inviteFreemiumUserToBePremiumOfOrg(user, orgAdmin) {
    this.searchUser(user['email'])
    cy.get('@itcGetMembers').then((res) => {
      const body = res.response['body']
      if (!body['success']) return
      cy.wrap(
        JSON.parse(body['result'])['data'].some(
          (member) =>
            user['email'] == member.publicProfileEmail && !member.exitedMember && member.member
        )
      ).as('isNotExitedMember')
    })
    cy.get('@isNotExitedMember').then((isNotExitedMember) => {
      if (!isNotExitedMember) {
        this.inviteUserToJoinOrganization(user)
        this.freemiumUserAcceptOrgInvitation(orgAdmin)
        this.validateChatLockIcon()
        this.validateSubscriptionLabelAtAvatarDropdown(this._premium)
      }
    })
  }
  inviteUserIfAlreadyRemoved(user) {
    this.searchUser(user.email)
    cy.get('@itcGetMembers').then((res) => {
      const body = res.response['body']
      if (!body['success']) return
      cy.wrap(
        JSON.parse(body['result'])['data'].some(
          (member) =>
            user.email == member.publicProfileEmail && !member.exitedMember && member.member
        )
      ).as('isNotExitedMember')
    })
    cy.get('@isNotExitedMember').then((isNotExitedMember) => {
      if (isNotExitedMember) {
        cy.get('@manageMemberWrapper').cwTable().rowName(user.email).as('member')
      } else {
        this.inviteUserToJoinOrganization(user)
        this.acceptInvitaionViaEmail(user.email)
        this.findUserRowByAdmin(user.email)
      }
    })
  }
  validateChatLockIcon(hasLock) {
    cy.get('div.cw-private-messaging > a > span.sticker').as('lockIcon')
    hasLock
      ? cy.get('@lockIcon').hasSvgIcon()
      : cy.get('@lockIcon').should('have.class', 'panel-notifications-count')
  }
  inviteUserToJoinOrganization(user) {
    const { email, givenName, familyName } = user

    cy.get('@manageMemberWrapper').within(($member) => {
      cy.wrap($member).getCwSplitDropdown().click()
      cy.get(`@cwSplitDropdown`).clickDropdownName('Invite via Email')
    })
    cy.get('@manageMemberWrapper').swal2().getSwal2Content().as('invitePeoplePopup')
    cy.get('@invitePeoplePopup').find('.consent-scroll-content').as('formUpdate')
    this.defineAliasesForPersonalInfo()
    cy.get('@email').typeInput(email)
    if (givenName) cy.get('@firstName').typeInput(givenName)
    if (familyName) cy.get('@lastName').typeInput(familyName)
    cy.get('@invitePeoplePopup').contains('button', Field.NEXT).click()
    this._itcInviteUserOrganization.set()
    cy.get('@invitePeoplePopup').contains('button', 'Send invite').click()
    this._itcInviteUserOrganization.wait()
    this.waitGetUsers()
  }
  acceptInvitaionViaEmail(email) {
    new EmailHelper()
      .getReceivedEmail(EmailOrgManagement.INVITE_EMAIL_SUBJECT, email, true)
      .getEmailElementHref('Accept Invitation')
    cy.get('@elementHref').then((url) => {
      cy.signOut()
      cy.visitThenSignIn(url, UserRole.ORG_MEMBER.REMOVE_USER)
    })
  }
  validateEmailShouldBeNull(email) {
    new EmailHelper()
      .getReceivedEmailBySubjectCount(EmailOrgManagement.INVITE_EMAIL_SUBJECT, email, true)
      .should('be.null')
  }
  freemiumUserAcceptOrgInvitation(orgAdmin) {
    cy.visitThenSignIn(this._dashboardUrl, UserRole.ORG_MEMBER.REMOVE_FREE_USER)
    this.validateChatLockIcon(true)
    this.validateSubscriptionLabelAtAvatarDropdown(this._free)
    new WebNotification().acceptOrgInvitation(
      `${orgAdmin.givenName} ${orgAdmin.familyName}`,
      EmailOrgManagement.ORGANIZATION_NAME
    )
  }
  removeUserFromOrganization(dropdownItem = 'Remove from organization') {
    cy.get('@member').within(($member) => {
      cy.wrap($member).clickDropdownItem(dropdownItem)
      this._itcRemoveUserOrganization.set()
      cy.wrap($member).swal2().swal2Confirm(Field.YES_REMOVE).click()
      this._itcRemoveUserOrganization.wait()
      this.waitGetUsers()
    })
  }
  validateUserAfterRemoved(email, isRemoveFreeUser) {
    cy.get('@manageMemberWrapper').contains('div.taglib-empty-result-message', 'No data')
    this.changeMemberFilterToExit()
    cy.get('@member').contains('span', email)
    //this.validateAssignAsOrgAdmin(email) TODO: Uncomment this back after this ticket fixes https://khalibre.atlassian.net/browse/CW-14616
    cy.visitThenSignIn(
      '/',
      isRemoveFreeUser ? UserRole.ORG_MEMBER.REMOVE_FREE_USER : UserRole.ORG_MEMBER.REMOVE_USER
    )
    this.validateSubscriptionLabelAtAvatarDropdown(this._free)
  }
  clickThreeDots() {
    cy.get('@member').within(() => {
      cy.getThreeDots()
    })
    cy.get('@cwThreeDots').click()
  }
  verifyPendingInviteMemberThreeDotsItems() {
    cy.get('@cwThreeDots')
      .getDropdownList()
      .should('contain.text', 'Resend invitation')
      .and('contain.text', Field.REMOVE)
  }
  verifyTableColumnHeaders() {
    cy.cwTable()
    cy.get('@cwTableTh')
      .should('contain.text', Field.NAME)
      .and('contain.text', 'Name (Public Profile)')
    cy.get('@cwTableTh').contains('Subscription').parent().hasSvgIcon()
    cy.get('@cwTableTh').contains('2SV').parent().hasSvgIcon()
  }
  verifyTableColumnHeaderSortIcon() {
    cy.get('@manageMemberWrapper').within(() => cy.cwTable())
    cy.get('@cwTableTh').then(($tableTh) => {
      cy.wrap($tableTh).eq(0).noSvgIcon()
      cy.wrap($tableTh).eq(1).noSvgIcon()
      cy.wrap($tableTh).eq(2).hasSvgIcon()
      cy.wrap($tableTh).eq(3).hasSvgIcon()
    })
  }
  verifyTableSorting() {
    cy.get('@manageMemberWrapper').selectItemPerPage(75)
    this.waitGetUsers()
    this.verifyTableSortByDefault()
    this.verifyTableSortBySubscription()
    this.verifyTableSortBy2Sv()
  }
  verifyTableSortByDefault() {
    cy.getCellData('screenName', 'GetMembers', true)
  }
  verifyTableSortBySubscription() {
    cy.get('@cwTable').clickTableHeader('Subscription')
    this.waitGetUsers()
    cy.getCellData('premiumUserLabel', 'GetMembers', true).expectSortDescending()
  }
  verifyTableSortBy2Sv() {
    cy.get('@cwTable').clickTableHeader('2SV')
    this.waitGetUsers()
    cy.getCellData('twoStepVerification', 'GetMembers', true).expectSortAscending()
  }
  verifyTableRowData(uatUser) {
    this.findUserRow(uatUser['premiumBasicUser']['email'])
    this.verifyOrgNameColumn(uatUser['premiumBasicUser'])
    this.verifyPublicNameColumn(uatUser['premiumBasicUser'])
    this.verifySubscriptionColumn(true)
    this.verify2svColumn()
    this.findUserRow(uatUser['enabledTwoFa']['email'])
    this.verifySubscriptionColumn()
    this.verify2svColumn(true)
  }
  verifyOrgNameColumn(user) {
    cy.get('@member').find('td:first').as('orgNameColumn')
    cy.get('@orgNameColumn')
      .contains('span.font-weight-bold', `${user['givenName']} ${user['familyName']}`)
      .should('be.visible')
    cy.get('@orgNameColumn').contains('span', user['email']).should('be.visible')
  }
  verifyPublicNameColumn(user) {
    cy.get('@member').find('td:nth-child(2)').as('publicNameColumn')
    cy.get('@publicNameColumn')
      .contains('span.font-weight-bold', user['screenName'])
      .should('be.visible')
    cy.get('@publicNameColumn').contains('span', user['email']).should('be.visible')
  }
  verifySubscriptionColumn(isBasic) {
    cy.get('@member').find('td:nth-child(4)').as('subscriptionColumn')
    cy.get('@subscriptionColumn')
      .contains('span', isBasic ? 'Basic' : 'Premium')
      .should('be.visible')
  }
  verify2svColumn(enabled) {
    cy.get('@member').find('td:nth-child(5)').as('2svColumn')
    cy.get('@2svColumn').contains('span', enabled ? Field.YES : Field.NO)
  }
  verifyViewOrgProfileEditIcon() {
    this.openViewOrgProfilePopup()
    cy.get('@orgDetailParent').find('a[role="button"]').hasSvgIcon()
  }
  verifyFirstLoadBasicAndPremiumMemberCount() {
    this.defineAliasForManageMemberWrapper()
    this.verifyBasicAndPremiumMemberCount()
  }
  verifySearchUserAndResultCount(text, isNotFullMatch = false) {
    this.findUserRow(text, isNotFullMatch)
    this.verifyBasicAndPremiumMemberCount()
  }
  verifyBasicAndPremiumMemberCount() {
    cy.get('@itcGetMembers').its('state').should('eq', 'Complete')
    cy.get('@itcGetMembers').then((res) => {
      const { body } = res.response
      if (!body['success']) return
      cy.wrap(JSON.parse(body['result'])).as('memberResult')
    })

    cy.get('@memberResult').then((res) => {
      cy.get('@manageMemberWrapper').within(() => {
        cy.contains('h1', `Members (${res.total})`).as('countMemberLabel')
      })
      cy.get('@countMemberLabel').within(() => {
        this.verifyBasicMemberCountLabel(res.basicUser)
        this.verifyPremiumMemberCountLabel(res.premiumUser)
      })
    })
  }
  verifyBasicMemberCountLabel(number) {
    cy.contains('span', `${number} Basic Member${number > 1 ? 's' : ''}`)
  }
  verifyPremiumMemberCountLabel(number) {
    cy.contains('span', `${number} Premium Member${number > 1 ? 's' : ''}`)
  }
  verifyClearSearchBoxLinkLabel() {
    cy.get('@searchBoxWrapper')
      .contains('a[href="javascript:;"]', 'Clear')
      .as('clearSearchBoxLabel')
  }
  verifyTriggerClearSearchBoxLinkLabel() {
    cy.get('@clearSearchBoxLabel').click()
    cy.get('@clearSearchBoxLabel').should('not.be.visible')
    cy.get('@searchBoxWrapper').inputSearch('Search').should('not.have.value')
    this.waitGetUsers()
    this.verifyBasicAndPremiumMemberCount()
  }
}

export default ManageUsers
