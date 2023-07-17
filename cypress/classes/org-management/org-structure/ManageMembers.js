import SpyOpenWindowEvent from '../../base/SpyOpenWindowEvent'
import Field from '../../constants/Field'
import DashboardAssertion from '../../dashboard/assertion/DashboardAssertion'
import SetupAuthentication from '../../register/SetupAuthentication'
import EmailHelper from '../../utilities/EmailHelper'
import { OrgConst } from '../base-org-management/OrgStub'
import EmailVerification from './EmailVerification'
import OrgMemberActions from './OrgMemberActions'
import OrgUnitInfo from './OrgUnitInfo'

class ManageMembers extends OrgUnitInfo {
  static storyAddRemoveMemberAndTeamLeader = 'Add/Remove Members and Team Leaders'
  static storyManage2StepVerification = 'Manage Members - Manage 2-Step Verification'
  orgMemberActions = new OrgMemberActions()
  dashboardAssertion = new DashboardAssertion()

  interceptFetchMember() {
    this.fetchOrgMembers.set()
  }
  waitFetchMember() {
    this.fetchOrgMembers.wait()
  }
  interceptFetchTeamLeader() {
    this.fetchOrgTeamLeaders.set()
  }
  waitFetchTeamLeader() {
    this.fetchOrgTeamLeaders.wait()
  }
  accessOrgUnitInfoTab() {
    cy.get(
      '#_orgManagementPortlet_tabListDesktop > .e-tab-header > .e-toolbar-items > .e-toolbar-item'
    )
      .eq(0)
      .click()
  }
  accessManageMembersTab() {
    this.interceptFetchTeamLeader()
    this.interceptFetchMember()
    cy.get(
      '#_orgManagementPortlet_tabListDesktop > .e-tab-header > .e-toolbar-items > .e-toolbar-item'
    )
      .eq(1)
      .click()
    this.waitFetchTeamLeader()
    this.waitFetchMember()
    cy.wait(1000)
  }
  initAliasMembersSection() {
    this.getContent(3).as('members')
  }
  initARowMemberByEmail(email) {
    cy.get('@members').cwTable().rowName(email).as('member')
  }
  #clickButtonAddMember() {
    cy.get('@members').contains('button', 'Add Member').click()
    cy.wait(500) // wait input in popup render
  }
  addNewMemberByScreenName(screenName) {
    this.#clickButtonAddMember()
    cy.get('@members').within(($members) => {
      this.popupModifyMember($members, screenName)
    })
    this.accessOrgUnitInfoTab()
    this.accessManageMembersTab()
  }
  editMember() {
    cy.get('@member').within(($tr) => {
      cy.wrap($tr).clickDropdownItem(Field.EDIT)
      cy.wait(500) // wait input in popup render
      this.popupModifyMember($tr, '', 'Drawing Featured Plan', 16)
    })
  }
  verifyMemberColumn(user, isEdit = false, isRoot = false) {
    cy.get('@member').within(($tr) => {
      cy.wrap($tr).children().as('th')
      cy.get('@th').eq(0).contains(user.fullName)
      cy.get('@th').eq(0).contains(user.email)
      cy.get('@th').eq(1).contains(user.screenName)
      cy.get('@th').eq(1).contains(user.email)
      cy.get('@th')
        .eq(2)
        .contains(isEdit ? (isRoot ? '16 (40%)' : '16 (66%)') : '0 (0%)')
      cy.get('@th')
        .eq(3)
        .contains(isEdit ? 'Drawing Featured Plan' : '--')
      cy.get('@th').eq(4).contains(Field.NO)
    })
  }
  verifyMakeTeamLeaderEmailNotification(user, orgName) {
    const emailHelper = new EmailHelper()
    const orgUrl = Cypress.config('baseUrl') + OrgConst.TABS.ORGANIZATION_STRUCTURE
    emailHelper
      .getReceivedEmail('You have a new role in your organization.', user.email, true)
      .then(($body) => {
        if (!$body) return
        expect($body).to.includes(`<div>Dear ${user.givenName},</div>`)
        expect($body).to.includes(
          `<div>You are added as a team leader in <b class="text-capitalize">${orgName}</b> sub-organization.</div>`
        )
        expect($body).to.includes(`<a href="${orgUrl}`)
      })
  }
  makeMemberAsTeamLeader() {
    this.interceptFetchMember()
    cy.get('@member').within(($tr) => cy.wrap($tr).clickDropdownItem('Make team leader'))
    this.waitFetchMember()
  }
  popupModifyMember(subject, name, position = '', workingHour = 0) {
    if (!subject) return
    cy.wrap(subject)
      .swal2()
      .within(() => {
        cy.getSwal2Content().get('#swal2-content > div').as('content')
      })
    if (name) {
      cy.get('@content')
        .find('.search-user-wrapper')
        .within(($search) => {
          this.itc.searchUserUnderOrg.set()
          cy.wrap($search).multiSelectType(name)
          this.itc.searchUserUnderOrg.wait()
          cy.wrap($search).multiSelectByName(name)
        })
    }
    if (position) {
      cy.get('@content')
        .find('.position-wrapper')
        .within(($position) => {
          cy.wrap($position).getMultiSelectInput().as('inputPosition')
          cy.get('@inputPosition')
            .clear()
            .type(position.toString())
            .then(() => {
              cy.wait(500)
              cy.wrap($position).multiSelectByName(position)
            })
        })
    }
    if (workingHour) {
      cy.get('@content').find('> div:nth-child(3)').typeInput(workingHour, 'number')
    }
    cy.intercept(
      '*orgManagementPortlet_javax.portlet.action=%2Fmanage_member%2Forg_member%2Fmodify'
    ).as('modifyMember')
    this.interceptFetchMember()
    cy.get('@content').within(() => {
      cy.clickPrimaryButton(name ? Field.ADD : Field.SAVE)
    })
    cy.wait('@modifyMember')
    this.waitFetchMember()
    cy.wait(1000)
  }
  removeTeamLeader(fullName) {
    this.waitFetchTeamLeader()
    this.getContent().within(() => {
      cy.cwTable().rowName(fullName).as('teamLeader')
    })
    cy.get('@teamLeader').within(($tr) => {
      cy.wrap($tr).clickDropdownItem('Remove team leader')
      this.interceptFetchMember()
      cy.intercept(
        '*orgManagementPortlet_javax.portlet.action=%2Fmanage_member%2Forg_member%2Fmodify'
      ).as('modifyMember')
      cy.wrap($tr)
        .swal2()
        .within(($popup) => cy.wrap($popup).swal2Confirm(Field.YES_REMOVE).click())
      cy.wait('@modifyMember')
      cy.wrap($tr).toast().contains('Team leader removed').parent().closeToast()
    })
  }
  removeMember() {
    this.waitFetchMember()
    cy.get('@member').within(($tr) => {
      this.removeMemberByRow($tr)
    })
  }
  removeMemberByRow(row) {
    cy.wrap(row)
      .getThreeDots()
      .within(($threeDots) => {
        cy.wrap($threeDots).click()
        cy.wrap($threeDots).find('ul.dropdown-menu > li:last').click()
      })
    cy.intercept('*x.portlet.action=%2Fmanage_member%2Forg_member%2Fremove').as('removeMember')
    this.interceptFetchMember()
    cy.wrap(row)
      .swal2()
      .within(($popup) => cy.wrap($popup).swal2Confirm(Field.YES_REMOVE).click())
    cy.wait('@removeMember')
    this.waitFetchMember()
    cy.wrap(row).toast().contains('Member removed').parent().closeToast()
  }
  cleanUpExistingUser(email) {
    cy.get('@members').within(() => {
      cy.get('@itcFetchOrgMembers').then((res) => {
        const { success, result } = res.response.body
        if (!success) return
        const members = JSON.parse(result)
        const existsMembers = members.data.filter((member) => email == member.publicProfileEmail)
        if (existsMembers.length) {
          cy.get('@members')
            .cwTable()
            .rowName(email)
            .within(($tr) => {
              this.removeMemberByRow($tr)
            })
        }
      })
    })
  }
  checkForcePasswordReset(email, hasMember) {
    if (!hasMember) {
      this.getContent(3).cwTable().rowName(email).first().as('member')
    }
    cy.get('@member').within(($tr) => {
      cy.wrap($tr).clickDropdownItem('Force password reset')
    })
    this.itc.forceResetPassword.set()
    cy.get('@member').swal2().swal2Confirm(Field.YES_FORCE).click()
    this.itc.forceResetPassword.wait()
  }
  verifyResetPasswordSuccessWhenLogin(email) {
    const setupAuthentication = new SetupAuthentication()
    cy.signInViaEmail(email)
    setupAuthentication.resetPassword()
  }
  lockAccount(email) {
    this.getContent(3).cwTable().rowName(email).as('member')
    cy.get('@member').within(($tr) => {
      this.unlockIfMemberAlreadyLocked($tr)
      cy.wrap($tr).clickDropdownItem('Lock account')
    })
    this.itc.modifyAccountStatus.set()
    cy.get('@member').swal2().swal2Confirm(Field.YES_LOCK).click()
    this.itc.modifyAccountStatus.wait()
  }
  verifyLockAccountSuccess(user) {
    const { email, givenName } = user
    cy.signInViaEmail(email)
    cy.get('#kc-content-wrapper').contains(
      'span.kc-feedback-text',
      'Account is disabled, contact admin.'
    )
    EmailVerification.verifyDisabledEmail(email, givenName)
  }
  verifyUnlockAccountSuccess(role) {
    this.dashboardAssertion.verifyLoginByRoleSuccess(role)
  }
  unlockAccount(email) {
    this.getContent(3).cwTable().rowName(email).as('member')
    cy.get('@member').within(($tr) => {
      cy.wrap($tr).get('td:first').find('.lexicon-icon').hasSvgIcon()
      this.unlockMember($tr)
    })
  }
  unlockIfMemberAlreadyLocked(subject) {
    if (!subject) return
    let isLocked = false
    cy.wrap(subject)
      .getThreeDots()
      .find('ul.dropdown-menu li')
      .each((li) => {
        if (li.text().includes('Unlock account')) isLocked = true
      })
      .then(() => {
        if (isLocked) this.unlockMember(subject)
      })
  }
  unlockMember(subject) {
    if (!subject) return
    this.itc.modifyAccountStatus.set()
    cy.wrap(subject).clickDropdownItem('Unlock account')
    this.itc.modifyAccountStatus.wait()
  }
  verifyTeamLeader(rowName = 'AULead LeaderRootOrg') {
    this.getContent().within(($content) => {
      cy.wrap($content).contains('h1', 'Team leaders (')
      cy.cwTable().get('thead th').contains(Field.NAME)
      cy.cwTable()
        .rowName(rowName)
        .within(($tr) => {
          this.orgMemberActions.verifyRemoveTeamLeader($tr)
        })
    })
  }
  verifyMembers(isRootOrg = true) {
    const copOwnerFrontedUser = this.environment.isPrd()
      ? 'copownerfrontend@mail.com'
      : 'copownerfrontend@yopmail.com'
    const copOwnerRootUser = this.environment.isPrd()
      ? 'copowner@mail.com'
      : 'copownerroot@yopmail.com'

    this.getContent(3).within(($content) => {
      cy.wrap($content).contains('> div.member-wrapper > div > h1', 'Members (')
      cy.cwTable().within(($tableMembers) => {
        this.verifyMembersTableheader()
        cy.wrap($tableMembers).row().should('have.length.at.least', 3)
        cy.wrap($tableMembers)
          .rowName(isRootOrg ? copOwnerRootUser : copOwnerFrontedUser)
          .within(($tr) => {
            this.orgMemberActions.verifyOrgMemberThreeDots($tr)
          })
      })
      this.interceptFetchMember()
      cy.wrap($content)
        .get('.search-box-wrapper > div.has-search > input.form-control')
        .should('have.attr', 'placeholder', 'Search members')
        .type(isRootOrg ? 'memberrootorg@yopmail.com {enter}' : `${copOwnerFrontedUser} {enter}`)
      this.waitFetchMember()
      cy.get('@itcFetchOrgMembers').then(() => {
        cy.cwTable().row().should('have.length.at.least', 1)
      })
      cy.wrap($content).contains('button', 'Add Member').click()
      this.orgMemberActions.verifyPopupAddMember($content)
    })
  }
  verifyMembersTableheader() {
    cy.get('thead th').contains(Field.NAME)
    cy.get('thead th').contains('Name (Public Profile)')
    cy.get('thead th').contains('Working hours (%)')
    cy.get('thead th').contains('Position')
    cy.get('thead th').contains('2SV')
  }
  getContent(index = 2) {
    return cy.cecCard().cardMainContent().find(`.border-bottom:nth-child(${index})`)
  }

  getRowData(rowName, alias = 'rowData') {
    new ManageMembers().getContent(3).within(() => {
      cy.cwTable().within(($tableMembers) => {
        cy.wrap($tableMembers)
          .rowName(rowName)
          .within(($tr) => {
            cy.wrap($tr).as(alias)
          })
      })
    })
  }

  redirectToPublicProfile() {
    new SpyOpenWindowEvent().getUrl().then(($url) => {
      this.itc.pendingSpouse.set()
      cy.visit($url)
      this.itc.pendingSpouse.wait()
    })
  }

  viewPopupOrgProfile() {
    cy.get('@rowData').within((rowData) => {
      this.openPopupViewOrgProfile(rowData)
      cy.wrap(rowData).swal2().getSwal2Content().as('popupContent')
      cy.get('@popupContent').within(() => {
        cy.get('#swal2-content')
          .find('> div.popup-consent-form-wrapper > div')
          .eq(3)
          .find('> div')
          .as('publicProfile')
      })
    })
  }

  expectedUserInRootOrg() {
    cy.contains('p', 'Org Units')
      .parent()
      .within(() => {
        cy.cwTable().find('tr').first().as('getFirstRow')
      })

    cy.get('@getFirstRow').within((firstRow) => {
      cy.wrap(firstRow).find('td:first-child').contains(OrgConst.ROOT_ORG_NAME).should('be.visible')
      cy.wrap(firstRow).find('td:last-child').contains('AULead LeaderRootOrg').should('be.visible')
    })
  }

  openPopupViewOrgProfile($subject) {
    cy.wrap($subject).clickDropdownItem('View Organization Profile')
  }

  clickLinkViewPublicProfile() {
    cy.get('@publicProfile').then((publicProfile) => {
      cy.wrap(publicProfile)
        .find('div')
        .contains('div.text-black', 'Public Profile Details')
        .parent()
        .find('a.link', 'View public profile')
        .within(($link) => {
          cy.wrap($link).click()
        })
    })
  }

  clickUserName($username) {
    cy.get('@rowData').within((rowData) => {
      cy.wrap(rowData).contains('.cursor-pointer', $username).click()
    })
  }
}

export default ManageMembers
