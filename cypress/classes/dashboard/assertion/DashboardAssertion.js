import InterceptReq from '../../base/InterceptReq'

class DashboardAssertion {
  promotion = new InterceptReq('/post-activity/fetch_promotion', 'Promotion')
  #itcFetchGlobalNavProperties = new InterceptReq(
    '/global_navigation/search/fetch_properties',
    'fetchGlobalNavigationProperties'
  )
  url = '/u/home/dashboard'

  verifyLoginByRoleSuccess(role) {
    this.#itcFetchGlobalNavProperties.set()
    this.promotion.set()
    cy.visitThenSignIn(this.url, role)
    this.#itcFetchGlobalNavProperties.wait()
    this.promotion.wait()
    cy.url().should('include', this.url)
  }
}

export default DashboardAssertion
