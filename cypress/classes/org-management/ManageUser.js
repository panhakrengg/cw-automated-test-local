import InterceptReq from '../base/InterceptReq'
import UserRole from '../utilities/user-role/UserRole'
import { OrgConst } from './base-org-management/OrgStub'
import ManageMemberProfile from './ManageMemberProfile'

class ManageUser {
  manageMemberProfile = new ManageMemberProfile()
  itcAdmins = new InterceptReq('/manage_users/fetch_admins', 'Admins')
  itcMembers = new InterceptReq('/manage_users/members/get', 'Members')

  setItc() {
    this.itcAdmins.set()
    this.itcMembers.set()
  }
  waitItc() {
    this.itcAdmins.wait()
    this.itcMembers.wait()
  }
  waitItcMember() {
    this.itcMembers.wait()
  }

  pageUrl() {
    return OrgConst.TABS.MANAGE_USERS
  }

  tableMember() {
    cy.cwTable('tableMember', 'tableMemberHeader', 1)
  }

  memberFirstRowOnAction(name) {
    cy.get('@tableMember')
      .find('tr:first-child')
      .within(($firstRow) => {
        cy.wrap($firstRow).clickDropdownItem(name)
      })
  }

  showMemberTableFirstRowOnAction(name) {
    this.waitItcMember()
    this.tableMember()
    this.memberFirstRowOnAction(name)
  }

  signInAsOrgAdmin() {
    cy.visitThenSignIn(this.pageUrl(), UserRole.ORG_ADMIN.ORGANIZATION)
  }

  getRowData(rowName, alias = 'rowData', index = 0) {
    cy.get('.member-wrapper').within(() => {
      cy.cwTable()
        .rowName(rowName)
        .eq(index)
        .within(($tr) => {
          cy.wrap($tr).as(alias)
        })
    })
  }

  searchMemberByName($name) {
    this.itcMembers.set()
    cy.get('.manage-member-wrapper')
      .find('.search-box-wrapper')
      .within((searchboxWrapper) => {
        cy.wrap(searchboxWrapper).find('input[placeholder="Search"]').type(`${$name} {enter}`)
      })
    this.itcMembers.wait()
  }
  clearMemberSearchBox() {
    cy.get('.manage-member-wrapper')
      .find('.search-box-wrapper')
      .within(($searchboxWrapper) => {
        cy.wrap($searchboxWrapper).find('input[placeholder="Search"]').clear()
      })
  }
  expectedInviteButtonIsVisible() {
    cy.getCwSplitDropdown().contains('button', 'Invite People').should('be.visible')
  }
  expectedThreeDotOptionIsVisible(menuName) {
    cy.get('@rowData').within(($rowData) => {
      cy.wrap($rowData).getThreeDots().getDropdownName(menuName).should('be.visible')
    })
  }
  expectedMemberThreeDotsOptionIsVisibled(userName, threeDotOption) {
    this.searchMemberByName(userName)
    this.getRowData(userName)
    this.expectedThreeDotOptionIsVisible(threeDotOption)
  }
  checkGivenNameByUsername(username, callback = () => {}) {
    this.searchMemberByName(username)
    this.getRowData(username)
    cy.get('.member-wrapper').within(() => {
      cy.wrap('@rowData')
        .getTableDataByIndex(2)
        .within(($td) => {
          callback($td)
        })
    })
  }
  expectedUserDisplayGivenName(screenName, givenName) {
    this.checkGivenNameByUsername(screenName, ($td) => {
      cy.wrap($td).contains('span', `${screenName} (${givenName})`).should('be.visible')
    })
  }
  expectedUserNotDisplayGivenName(screenName) {
    this.checkGivenNameByUsername(screenName, ($td) => {
      cy.wrap($td)
        .contains(new RegExp(`^${screenName}$`, 'g'))
        .should('be.visible')
    })
  }
  expectedThreeDotContainSevenOptions() {
    cy.get('@rowData').within(($tr) => {
      cy.wrap($tr).getThreeDots().get('ul.dropdown-menu').find('li').should('have.length', 7)
    })
  }
  expectedInvitePopupContainSubscriptionBlock() {
    this.manageMemberProfile.inviteViaEmail()
    cy.contains('label', 'Select Member Subscription')
    cy.get('.row.cec-mb-1').within(($subscription) => {
      this.getSubscriptionBy($subscription, 'Basic', 1).should('be.visible')
      this.getSubscriptionBy($subscription, 'Premium', 2).should('be.visible')
    })
  }
  getSubscriptionBy(subject, type, position) {
    return cy.wrap(subject).get(`div.col-md-4:nth-child(${position})`).contains('div', type)
  }
  expectedTotalMemberDisplay() {
    cy.get('div.manage-member-wrapper h1 div')
      .first()
      .within(($member) => {
        this.checkTotalMemberDisplayBy($member, 'Basic Member')
        this.checkTotalMemberDisplayBy($member, 'Premium Members')
      })
  }
  checkTotalMemberDisplayBy(subject, type) {
    cy.wrap(subject)
      .get('div:nth-child(1) > span')
      .invoke('text')
      .then(($basicMember) => {
        return $basicMember.replace(` ${type}`, '')
      })
      .then(parseInt)
      .should('be.a', 'number')
  }
}

export default ManageUser
