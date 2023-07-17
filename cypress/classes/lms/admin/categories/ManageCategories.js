import Environment from '../../../base/Environment'
import InterceptReq from '../../../base/InterceptReq'
import { OrgConst } from '../../../org-management/base-org-management/OrgStub'

class ManageCategories {
  environment = new Environment()

  fireCloudFullCatalogUrl = OrgConst.FIRE_CLOUD_FULL_CATALOG_URL

  #itcFetchCategories = new InterceptReq('/manage_categories/fetch_categories', 'FetchCategories')
  #itcFetchCategoriesMembers = new InterceptReq(
    '/manage_categories/members/fetch',
    'FetchCategoriesMembers'
  )
  #itcSearchUsers = new InterceptReq('/manage_categories/search_users', 'SearchUsers')
  #itcAddUsers = new InterceptReq('/category/users/add', 'AddUsers')

  setItcFetchCategories() {
    this.#itcFetchCategories.set()
  }
  waitItcFetchCategories() {
    this.#itcFetchCategories.wait()
  }

  setItcFetchCategoriesMembers() {
    this.#itcFetchCategoriesMembers.set()
  }
  waitItcFetchCategoriesMembers() {
    this.#itcFetchCategoriesMembers.wait()
  }

  setItcSearchUsers() {
    this.#itcSearchUsers.set()
  }
  waitItcSearchUsers() {
    this.#itcSearchUsers.wait()
  }

  setItcAddUsers() {
    this.#itcAddUsers.set()
  }
  waitItcAddUsers() {
    this.#itcAddUsers.wait()
  }

  getCreateCategoryUrl() {
    return `${this.fireCloudFullCatalogUrl}/manage-categories?p_p_id=manageCategoriesPortlet&p_p_lifecycle=0&_manageCategoriesPortlet_mvcRenderCommandName=%2Fcategory%2Fedit&_manageCategoriesPortlet_id=0`
  }

  getManageCategoriesUrl() {
    return `${this.fireCloudFullCatalogUrl}/manage-categories`
  }

  visitManageCategories() {
    this.setItcFetchCategories()
    cy.visit(this.getManageCategoriesUrl())
    this.waitItcFetchCategories()
  }

  visitCreateCategory() {
    cy.visit(this.getCreateCategoryUrl())
  }
}
export default ManageCategories
