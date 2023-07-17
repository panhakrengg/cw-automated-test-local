import InterceptReq from '../base/InterceptReq'
import Field from '../constants/Field'
import Dashboard from '../dashboard/Dashboard'
import GlobalMenu from '../global-menu/GlobalMenu'

class ManageCommunity {
  _itcCreateCop = new InterceptReq('/create/community', 'CreateCop')
  _itcFetchPosts = new InterceptReq('/post_activity/fetch_posts', 'fetchPosts')
  _itcFetchCopInfo = new InterceptReq('/admin/fetch_cop_info', 'fetchCopInfo')
  _itcAdminFetchManageMember = new InterceptReq(
    '/admin/fetch_manage_members',
    'AdminFetchManageMember'
  )

  _itcAdminFetchManageMember = new InterceptReq(
    '/admin/fetch_manage_members',
    'AdminFetchManageMember'
  )

  constructor(name) {
    this.name = name
  }

  #settingFriendlyUrl = '/admin/admin#_copMemberManagementPortlet_option=settings'
  #itcFetchMembers = new InterceptReq('/admin/fetch_manage_members', 'fetchMembers')

  #itcDeleteCop = new InterceptReq('/admin/delete_cop', 'deleteCop')

  setCommunityName(name) {
    this.name = name
  }

  create(type) {
    cy.visit(
      '/create-cop?p_p_id=setupCommunityPortlet&p_p_lifecycle=0&_setupCommunityPortlet_communityUrl=%2Fu%2Fhome%2Fcommunities&_setupCommunityPortlet_mvcRenderCommandName=%2Fcreate_community%2Fview'
    )
    this.createByType(type)
  }

  createFromGlobalMenu(type) {
    const globalMenu = new GlobalMenu()
    globalMenu.getHeaderTitle().click()
    cy.get('.cw-navigation__list--container > ul > li').contains('My Communities').click()
    cy.intercept('GET', '**communities%2Fget').as('getCommunities')
    cy.wait('@getCommunities')
    cy.get('#_myCommunitiesPortlet_myCommunities').within(($myCommunitiesPortlet) => {
      cy.wrap($myCommunitiesPortlet).get('a').contains('Create new community').click()
    })
    this.createByType(type)
  }

  createByType(type) {
    cy.get('.header-group', { timeout: 30000 }).contains(type).click()
    Cypress.on('uncaught:exception', () => false)
    cy.get('button').contains('Create your Community of Purpose Site').click()
    cy.get('input[placeholder="Enter your Community of Purpose name"]').clear().type(this.name)
    if (type == 'Organization') {
      cy.get('button').contains('Next, Set Banner Image').click()
    }
    const itcCreateCoP = new InterceptReq('/create/community', 'createCoP')
    itcCreateCoP.set()
    cy.get('button').contains('Create Community of Purpose').click()
    itcCreateCoP.wait()
  }

  formatNameToValidUrl() {
    return this.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
  }

  //apply to org and training cop
  adminNavigationUrl() {
    return `web/${this.formatNameToValidUrl()}/admin/admin`
  }

  //apply to mission worker and topical cop
  adminNavigationUrlNonOrgCop() {
    return `web/${this.formatNameToValidUrl()}/admin`
  }

  delete() {
    this.goToAdminSettings()
    this.deleteThisCommunityOfPurPose()
  }

  deleteByUrl(url) {
    this.visitSettings(url)
    this.deleteThisCommunityOfPurPose()
  }

  deleteThisCommunityOfPurPose() {
    const dashboard = new Dashboard()
    dashboard.interceptGettingStart()
    cy.url().then((url) => {
      if (url.includes(this.#settingFriendlyUrl)) {
        this.#itcDeleteCop.set()
        cy.get('.scroll-content > :nth-child(7) > .d-flex').click()
        cy.get('#btn-delete').click()
        cy.get('#_copMemberManagementPortlet_0').click()
        cy.get('#_copMemberManagementPortlet_1').click()
        cy.get('#btn-confirm').click()
        this.#itcDeleteCop.wait()
        dashboard.waitGettingStart()
        cy.wait(60000) // Wait 60s after deleting the cop. !IMPORTANCE: There's some backgound tasks and Indexer need to be wait or else the data will not refresh.
      }
    })
  }

  goToAdminSettings() {
    cy.visit(this.adminNavigationUrl() + '#_copMemberManagementPortlet_option=settings')
  }

  goToAdminTabWith(option, intercept) {
    intercept.set()
    cy.visit(this.adminNavigationUrl() + `#_copMemberManagementPortlet_option=${option}`)
    intercept.wait()
  }

  goToAdminTabOfNonOrgCopWith(option, intercept) {
    intercept.set()
    cy.visit(this.adminNavigationUrlNonOrgCop() + `#_copMemberManagementPortlet_option=${option}`)
    intercept.wait()
  }

  goToAdminManageCourse() {
    const itcFetchManageCourses = new InterceptReq('/manage_courses/fetch', 'fetchManageCourses')
    itcFetchManageCourses.set()
    cy.visit(this.adminNavigationUrl() + '#_copMemberManagementPortlet_option=manage-courses')
    itcFetchManageCourses.wait()
  }

  goToAdmin(dropdownItem) {
    cy.get('#_copMemberManagementPortlet_cw-dropdown_', {
      timeout: 50000,
    }).click()
    cy.get(`.dropdown-menu > li > a[title = "${dropdownItem}"]`).click()
  }

  goToAdminTab() {
    cy.get('#_webPresenceNavigationPortlet_navTag', { timeout: 20000 }).contains('Admin').click()
  }
  clickCreateYourCommunitySite() {
    cy.get('span:contains("Create your Community of Purpose Site")').parent().click()
  }
  clickNextBannerImage() {
    cy.get('span:contains("Next, Set Banner Image")').parent().click()
  }
  clickCreateCommunityFinalStep() {
    this._itcCreateCop.set()
    cy.get('span:contains("Create Community of Purpose")').parent().click()
    this._itcCreateCop.wait()
  }
  clickGoBackManageCommunities() {
    cy.get('b:contains("Go back to manage communities")').parent().click()
  }

  expectOwner(ownerEmail) {
    cy.cwTable()
      .rowName(ownerEmail)
      .should('be.visible')
      .within(($ownerRow) => {
        cy.wrap($ownerRow).get('td').eq(3).should('contain.text', Field.OWNER)
      })
  }

  visitManageMember(copUrl) {
    this.#itcFetchMembers.set()
    cy.visit(copUrl + '/admin/admin')
    this.#itcFetchMembers.wait()
  }

  visitSettings(copUrl) {
    cy.request({
      url: `${copUrl}/admin/admin?p_p_id=copMemberManagementPortlet&p_p_lifecycle=2&p_p_cacheability=cacheLevelPage&_copMemberManagementPortlet_currentURL=${copUrl}/admin/admin&p_p_resource_id=/admin/fetch_cop_info`,
      failOnStatusCode: false,
    }).then(($response) => {
      if ($response.status == 200 && $response.headers['content-length'] != 0) {
        cy.visit(copUrl + this.#settingFriendlyUrl)
      }
    })
  }

  visitHome(copUrl) {
    this._itcFetchPosts.set()
    cy.visit(copUrl)
    this._itcFetchPosts.wait()
    Cypress.on('uncaught:exception', () => false)
  }
  visitHomeForJoinToRequest(copUrl) {
    this._itcFetchCopInfo.set()
    cy.visit(copUrl)
    this._itcFetchCopInfo.wait()
  }
  clickButtonRequestToJoinCommunity() {
    cy.get('#_copSubscriptionRequestPortlet_subscriptionRequest').within(() => {
      cy.getElementWithLabel('Request to Join', 'span').parent('a.request').click()
    })
  }
  submitRequestToJoinCommunity() {
    cy.swal2().within(() => {
      cy.getElementWithLabel('Submit', 'button').click()
    })
  }
}
export default ManageCommunity
