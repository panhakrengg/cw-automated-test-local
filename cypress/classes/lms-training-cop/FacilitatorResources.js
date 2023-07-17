import Resources from './Resources'
import { CoPConst } from './base/CoPStub'

class FacilitatorResources extends Resources {
  fetchResourceCommand() {
    return '/facilitator_resource/fetch'
  }
  createFolderCommand() {
    return '/facilitator_resource/create_folder'
  }
  uploadFileCommand() {
    return '/facilitator_resource/upload_file'
  }
  visitFacilitatorResourceBy(courseId) {
    this._itcFetchResource.set()
    this._itcFetchBreadcrumbs.set()
    cy.visit(
      `${CoPConst.URL}/admin/admin?p_p_id=copMemberManagementPortlet&p_p_lifecycle=0&_copMemberManagementPortlet_mvcRenderCommandName=%2Fcourse%2Fedit&_copMemberManagementPortlet_id=${courseId}&_copMemberManagementPortlet_tab=admin-resources`
    )
    cy.waitUntilIconLoadingLgIsVisible()
    this._itcFetchResource.wait()
    this._itcFetchBreadcrumbs.wait()
    cy.waitUntilIconLoadingLgNotExist()
    Cypress.on('uncaught:exception', () => false)
  }
  pageTitle() {
    return 'Facilitator Resources'
  }
}

export default FacilitatorResources
