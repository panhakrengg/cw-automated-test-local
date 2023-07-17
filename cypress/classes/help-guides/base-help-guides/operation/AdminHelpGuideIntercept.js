import InterceptReq from '../../../base/InterceptReq'
import Field from '../../../constants/Field'

class AdminHelpGuideIntercept {
  itcAdmin = new InterceptReq('/web/help-guide/admin', 'interceptAdmin')
  itcFetchCategories = new InterceptReq('/help-guide/fetch/categories', 'FetchCategories')
  itcListArticle = new InterceptReq('/help-guide/fetch-post-list', 'ListArticle')
  itcPostDelete = new InterceptReq('*delete*category', Field.DELETE)
  itcSidebar = new InterceptReq('/help-guide/sidebar_items/fetch', 'SidebarItems')

  interceptAdmin() {
    this.itcAdmin.set()
  }
  waitInterceptAdmin() {
    this.itcAdmin.wait()
  }

  itcSidebarSet() {
    this.itcSidebar.set()
  }

  itcSidebarWait() {
    this.itcSidebar.wait()
  }

  itcPostDeleteSet() {
    this.itcPostDelete.set()
  }
  itcPostDeleteWait() {
    this.itcPostDelete.wait()
  }

  interceptFetchCategories() {
    this.itcFetchCategories.set()
  }

  waitFetchCategories() {
    this.itcFetchCategories.wait()
  }

  interceptList() {
    this.itcListArticle.set()
  }

  waitList() {
    this.itcListArticle.wait()
  }

  waitIntercept(urlName) {
    if (urlName == 'articles') {
      this.waitList()
      Cypress.on('uncaught:exception', () => false)
    } else if (urlName == 'topics' || urlName == 'roles') {
      this.waitFetchCategories()
    }
  }
}

export default AdminHelpGuideIntercept
