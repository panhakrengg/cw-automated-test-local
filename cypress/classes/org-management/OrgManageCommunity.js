import InterceptAction from '../base/InterceptAction'
import InterceptReq from '../base/InterceptReq'
import Field from '../constants/Field'
import ManageCommunity from '../cop/ManageCommunity'
import SignInAs from '../utilities/SignInAs'
import { OrgConst } from './base-org-management/OrgStub'
import { SubOrgConst } from './base-org-management/SubOrgStub'

const ASSIGN_YOUR_SELF_AS_ADMIN = 'Assign yourself as admin'
const UNASSIGN_YOUR_SELF_AS_ADMIN = 'Unassign yourself as admin'

class OrgManageCommunity {
  _itcCommunities = new InterceptReq('/manage_communities/search', 'CopFetch')

  #itcFetchPromotion = new InterceptReq('/post-activity/fetch_promotion', 'FetchPromotion')

  #itcAssignRole = new InterceptAction('/manage_communities/cop/assign_role', 'assignRole')

  #itcFetchCommunities = new InterceptReq('/manage_communities/cop/fetch', 'fetchCommunities')

  singInByOrgAdmin() {
    this.setItcCommunities()
    SignInAs.orgAdmin(OrgConst.TABS.MANAGE_COMMUNITIES)
    this.waitCommunityTableRender()
  }

  setItcPromotion() {
    this.#itcFetchPromotion.set()
  }

  setItcCommunities() {
    this._itcCommunities.set()
  }

  waitPromotion() {
    this.#itcFetchPromotion.wait()
  }

  waitCommunityTableRender() {
    this._itcCommunities.wait()
    cy.cwTable('tableCommunity', 'headerCommunity')
  }

  #searchCommunity(copName) {
    this.#itcFetchCommunities.set()
    cy.getInputFeedback().clear().type(`"${copName}"`)
    this.#itcFetchCommunities.wait()
    cy.waitIconLoadingNotExist()
  }

  addCommunity(copName) {
    this.clickAddCommunity()

    cy.getPopup().within(($popup) => {
      this.#searchCommunity(copName)

      //add this condition because sometimes, it takes time for new community appearing
      if (!$popup.find(`label:contains("${copName}")`).length > 0) {
        cy.wait(5000)
        this.#searchCommunity(copName)
      }

      cy.getCheckbox().first().check()
      cy.clickButtonByName(Field.ADD)
    })
  }

  clickAddCommunity() {
    this.#itcFetchCommunities.set()
    cy.get('.cec-card button:contains("Add community")').click()
    this.#itcFetchCommunities.wait()
  }

  createNewCommunity(type, copName) {
    this.clickCreateNewCommunity()
    new ManageCommunity(copName).createByType(type)
  }

  expectNewCommunityWithNoOrgUnit(copName) {
    cy.cwTable()
      .rowName(copName)
      .first()
      .within(($row) => {
        cy.wrap($row).get('td').eq(1).should('contain.text', '-')
      })
  }

  goBackToManageCommunities() {
    this.setItcCommunities()
    cy.get('a:contains("Go back to manage communities")').click()
    this.waitCommunityTableRender()
  }

  clickCreateNewCommunity() {
    cy.get('.cec-card button:contains("Create new community")').scrollIntoView().click()
    cy.waitPortletReady()
  }

  expectCommunityCard(type, index) {
    cy.get(`:nth-child(${index}) > .cec-card > .header-group`).should('contain.text', type)
  }

  searchCommunity(keywords) {
    this.setItcCommunities()
    cy.get('input[placeholder = "Search communities"]')
      .click()
      .focus()
      .clear()
      .type(`"${keywords}"`)
    cy.wait(3000)
    this.waitCommunityTableRender()
    cy.cwTable().rowName(keywords).first().should('be.visible')
  }

  clearSearchBox() {
    cy.get('input[placeholder="Search communities"]').clear()
  }

  changeOwnerAndVerify(copName, newOwner, removePreviousOwner = false, expectedEmail) {
    this.changeOwner(copName, newOwner, removePreviousOwner)
    const manageCommunity = new ManageCommunity(copName)
    cy.visit(manageCommunity.adminNavigationUrl(), { failOnStatusCode: false })
    if (!removePreviousOwner) {
      cy.get(`table tr:contains(${expectedEmail})`, { timeout: 50000 }).as('row')
      cy.get('@row').within(($row) => {
        cy.wrap($row).get(':nth-child(4)').should('contain.text', Field.OWNER)
      })
    }
  }

  clickDropdownChangeOwnerBy(copName) {
    cy.get(`table tr:contains(${copName})`).within(($row) => {
      const $threeDot = cy.wrap($row).getThreeDots()
      $threeDot.click()
      $threeDot.clickDropdownName('Change owner')
    })
  }

  changeOwnerSearchUserAndSave(newOwnerGivenName, removePreviousOwner) {
    cy.get('input[placeholder = "Search users"]').as('searchField')
    cy.intercept('**manage_users%2Ffetch_users_under_org').as('searchUser')
    cy.get('@searchField').type(newOwnerGivenName)
    cy.wait(3000)
    cy.wait('@searchUser')
    cy.get('@searchField').type('{enter}')
    if (removePreviousOwner) {
      cy.get('.cec-mt-4 > input').click()
    }
    cy.intercept('**change_cop_owner').as('changeOwner')
    cy.get(`button:contains("${Field.SAVE}")`).click()
    cy.wait('@changeOwner')
  }

  changeOwner(copName, newOwnerGivenName, removePreviousOwner) {
    this.searchCommunity(copName)
    this.clickDropdownChangeOwnerBy(copName)
    this.changeOwnerSearchUserAndSave(newOwnerGivenName, removePreviousOwner)
  }

  confirmAssign() {
    this.#itcAssignRole.set()
    cy.get('@cwThreeDots').swal2Confirm('Yes, Assign').click()
    this.#itcAssignRole.wait()
    cy.waitLoadingOverlayNotExist()
  }

  confirmUnAssign() {
    this.#itcAssignRole.set()
    cy.get('@cwThreeDots').swal2Confirm('Yes, Unassign').click()
    this.#itcAssignRole.wait()
    cy.waitLoadingOverlayNotExist()
  }

  accessAdminTab(copName) {
    cy.visit(new ManageCommunity(copName).adminNavigationUrl(), {
      failOnStatusCode: false,
    })
  }

  expectAdminRoleInTableBy(email) {
    cy.get(`table tr:contains(${email})`, { timeout: 20000 }).as('row')
    cy.get('@row').within(($row) => {
      cy.wrap($row).get(':nth-child(4)').should('contain.text', 'Administrator')
    })
  }

  expectPageNotFound() {
    Cypress.on('uncaught:exception', () => false)
    cy.pageNotFound()
  }

  assignYourselfAsAdmin(copName) {
    this.searchCommunity(copName)
    cy.cwTable()
      .rowName(copName)
      .first()
      .within(($row) => {
        cy.wrap($row).getThreeDots().click()
        cy.wrap($row)
          .get('ul.dropdown-menu')
          .invoke('text')
          .then((text) => {
            if (text.includes(ASSIGN_YOUR_SELF_AS_ADMIN)) {
              cy.wrap($row).clickDropdownName(ASSIGN_YOUR_SELF_AS_ADMIN)
              this.confirmAssign()
            }
          })
      })
  }

  unassignYourselfAsAdmin(copName) {
    this.searchCommunity(copName)
    cy.cwTable()
      .rowName(copName)
      .first()
      .within(($row) => {
        cy.wrap($row).getThreeDots().click()
        cy.wrap($row)
          .get('ul.dropdown-menu')
          .invoke('text')
          .then((text) => {
            if (text.includes(UNASSIGN_YOUR_SELF_AS_ADMIN)) {
              cy.wrap($row).clickDropdownName(UNASSIGN_YOUR_SELF_AS_ADMIN)
              this.confirmUnAssign()
            }
          })
      })
  }

  increaseShowCommunity() {
    cy.get('#_orgManageCommunitiesPortlet_entry-count').click()
    cy.get('.dropdown-item:contains("75")').click()
    cy.wait('@getCommunities')
  }

  clickThreeDotEditOrgUnit() {
    cy.getThreeDots().click()
    cy.clickDropdownName('Edit organization unit')
    cy.get('@getOrgUnits')
  }

  editOrganizationUnit(copName) {
    this.increaseShowCommunity()
    cy.get(`table tr:contains(${copName})`).within(($row) => {
      this.clickThreeDotEditOrgUnit()
    })
    cy.wait('@getOrgUnits')
  }

  checkOrgUnitForCoP(copName, orgUnitName = 'None') {
    cy.get(`table tr:contains(${copName})`).within(($row) => {
      cy.wrap($row)
        .get(':nth-child(2)')
        .should('contain.text', orgUnitName == 'None' ? '-' : orgUnitName)
    })
  }

  saveOrgUnitBy(name = 'None') {
    cy.get(`.multiselect__option:contains(${name})`).click()
    cy.get('button:contains("Save")').click()
  }

  searchOrgUnitBy(name = 'None') {
    cy.getPopup().within(() => {
      cy.get('input[placeholder = "Search an organization unit"]').type(name, {
        force: true,
      })
    })
  }

  revertPreviousOwner(copName, admin) {
    this.accessToManageCommunity()
    this.changeOwner(copName, admin, true)
  }

  resetUserOwner(copName, firstAdmin, secondAdmin) {
    this.searchCommunity(copName)
    this.clickDropdownChangeOwnerBy(copName)
    cy.swal2().within(() => {
      cy.get('.popup-change-owner-wrapper').then(($popup) => {
        if ($popup.find(`strong:contains('${secondAdmin}')`).length) {
          this.changeOwnerSearchUserAndSave(firstAdmin, true)
        } else {
          cy.wrap($popup).closeSwal2()
        }
      })
    })
  }

  verifyCopRemovedFromOrgUnit(copName, oldOrgUnitName) {
    if (oldOrgUnitName != '-') {
      cy.intercept('**org_management%2Ffetch_org_detail').as('getOrgDetail')
      SignInAs.orgAdmin(OrgConst.TABS.ORGANIZATION_STRUCTURE)
      cy.get('#_orgManagementPortlet_cw-dropdown_subOrg_0').click()
      cy.get(`.cw-dropdown > .dropdown-menu li:contains(${oldOrgUnitName})`).click()
      cy.wait('@getOrgDetail')
      cy.get('.cec-card__main-content > .border-bottom-0').within(($communities) => {
        cy.wrap($communities).get(`table tr:contains(${copName})`).should('not.be.exist')
      })
    }
  }

  verifyCopListedUnderNewOrgUnit(copName, newOrgUnitName) {
    if (newOrgUnitName != 'None') {
      SignInAs.orgAdmin(OrgConst.TABS.ORGANIZATION_STRUCTURE)
      cy.get('#_orgManagementPortlet_cw-dropdown_subOrg_0').click()
      cy.get(`.cw-dropdown > .dropdown-menu li:contains(${newOrgUnitName})`).click()
      cy.get('.cec-card__main-content > .border-bottom-0').within(($communities) => {
        cy.wrap($communities).get(`table tr:contains(${copName})`).should('be.visible')
      })
    }
  }

  accessToManageCommunity() {
    this.setItcCommunities()
    SignInAs.orgAdmin(OrgConst.TABS.MANAGE_COMMUNITIES)
    this.waitCommunityTableRender()
  }

  clickThreeDotsEditOrgUnit(subject) {
    cy.wrap(subject).clickDropdownItem('Edit organization unit')
  }

  clickThreeDotsUnassignAsAdmin(subject) {
    cy.wrap(subject).clickDropdownItem('Unassign yourself as admin')
  }

  clickThreeDotsAssignAsAdmin(subject) {
    cy.wrap(subject).clickDropdownItem('Assign yourself as admin')
  }

  clickThreeDotsChangeOwner(subject) {
    cy.wrap(subject).clickDropdownItem('Change owner')
  }

  clickMultiSelect() {
    cy.getMultiSelect().click()
  }

  expectEditOrgUnitTitle(subject) {
    cy.wrap(subject)
      .getPopupHeader()
      .contains('span', 'Edit organization unit')
      .should('be.visible')
  }

  expectOrgUnitLabelPopup(subject) {
    cy.wrap(subject).first().should('contain.text', 'Organization Unit')
  }

  expectMultiSelectTagPopup(subject) {
    cy.wrap(subject)
      .last()
      .within(() => {
        cy.getMultiSelect().should('be.visible')
        cy.get('.multiselect__tags').should('be.visible')
      })
  }

  expectPopupButtons(subject) {
    cy.wrap(subject)
      .getPopupFooter()
      .within(() => {
        cy.contains('Button', Field.CANCEL).should('be.visible')
        cy.contains('Button', Field.SAVE).should('be.disabled')
      })
  }

  expectOrgUnitDropDownItems(subject, number) {
    cy.get(subject).getMultiSelectItems().should('have.length.greaterThan', number)
  }

  expectDrawFeaturePlan(subject) {
    cy.get(subject).getMultiSelectItems().should('contain.text', SubOrgConst.DRAWING_FEATURE_PLAN)
  }

  expectAddCommunityPopup() {
    cy.getPopup().should('be.visible').closePopup()
  }

  expectSwap2(subject) {
    cy.wrap(subject).swal2().should('be.visible').closeSwal2()
  }

  getPopupBy(subject, callback = (popupBody) => {}) {
    cy.wrap(subject)
      .getPopup()
      .getPopupBody()
      .within(($popupBody) => callback($popupBody))
  }
  getRowDataByCopName($rowName) {
    cy.cwTable().within(($table) => {
      cy.wrap($table)
        .rowName($rowName)
        .first()
        .then(($tr) => {
          cy.wrap($tr).as('tableRow')
        })
    })
  }
  expectedCopNotContainEditOrgUnitInThreeDot(copName) {
    this.searchCommunity(copName)
    this.getRowDataByCopName(copName)
    this.expectedThreeDotOptionIsNotExist('Edit organization unit')
  }
  expectedThreeDotOptionIsNotExist(menuName) {
    cy.get('@tableRow').within(($tableRow) => {
      cy.wrap($tableRow).getThreeDots().click()
    })
    cy.get('@cwThreeDots').within(($cwThreeDot) => {
      cy.wrap($cwThreeDot)
        .find(`ul.dropdown-menu li > a:contains('${menuName}')`)
        .should('not.exist')
    })
  }
  clickOrgCopCard() {
    cy.get('.cec-card__body div.cursor-pointer:nth-child(2)').click()
  }
  expectedOrgCommunityIsSearchable(orgCommunityTitle) {
    cy.contains('div.community-search-tile h4', orgCommunityTitle).should('be.visible')
  }
  expectNavigationTabOfOrgCopAdmin() {
    cy.get('#_webPresenceNavigationPortlet_navTag').within(($nav) => {
      cy.wrap($nav).get('li').as('navItem')
      cy.get('@navItem').should('have.length', '7')
      this.expectTabNameByIndex('navItem', 0, 'Home')
      this.expectTabNameByIndex('navItem', 1, 'About Us')
      this.expectTabNameByIndex('navItem', 2, 'Members')
      this.expectTabNameByIndex('navItem', 3, 'Key Contacts')
      this.expectTabNameByIndex('navItem', 4, 'Collaboration')
      this.expectTabNameByIndex('navItem', 5, 'Manage Posts')
      this.expectTabNameByIndex('navItem', 6, 'Admin')
    })
  }
  expectNavigationTabOfOrgCopMember() {
    cy.get('#_webPresenceNavigationPortlet_navTag').within(($nav) => {
      cy.wrap($nav).get('li').as('navItem')
      cy.get('@navItem').should('have.length', '5')
      this.expectTabNameByIndex('navItem', 0, 'Home')
      this.expectTabNameByIndex('navItem', 1, 'About Us')
      this.expectTabNameByIndex('navItem', 2, 'Members')
      this.expectTabNameByIndex('navItem', 3, 'Key Contacts')
      this.expectTabNameByIndex('navItem', 4, 'Collaboration')
    })
  }
  expectNavigationTabOfTrainingCopAdmin() {
    cy.get('#_webPresenceNavigationPortlet_navTag').within(($nav) => {
      cy.wrap($nav).get('li').as('navItem')
      cy.get('@navItem').should('have.length', '8')
      this.expectTabNameByIndex('navItem', 0, 'Home')
      this.expectTabNameByIndex('navItem', 1, 'About Us')
      this.expectTabNameByIndex('navItem', 2, 'Members')
      this.expectTabNameByIndex('navItem', 3, 'Key Contacts')
      this.expectTabNameByIndex('navItem', 4, 'Learning')
      this.expectTabNameByIndex('navItem', 5, 'Collaboration')
      this.expectTabNameByIndex('navItem', 6, 'Manage Posts')
      this.expectTabNameByIndex('navItem', 7, 'Admin')
    })
  }
  expectNavigationTabOfTrainingCopMember() {
    cy.get('#_webPresenceNavigationPortlet_navTag').within(($nav) => {
      cy.wrap($nav).get('li').as('navItem')
      cy.get('@navItem').should('have.length', '6')
      this.expectTabNameByIndex('navItem', 0, 'Home')
      this.expectTabNameByIndex('navItem', 1, 'About Us')
      this.expectTabNameByIndex('navItem', 2, 'Members')
      this.expectTabNameByIndex('navItem', 3, 'Key Contacts')
      this.expectTabNameByIndex('navItem', 4, 'Learning')
      this.expectTabNameByIndex('navItem', 5, 'Collaboration')
    })
  }
  expectTabNameByIndex(subject, index, name) {
    cy.get(`@${subject}`).eq(index).should('contain.text', name)
  }
}

export default OrgManageCommunity
