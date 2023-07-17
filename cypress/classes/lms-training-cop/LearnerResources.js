import Resources from './Resources'
import { CoPConst } from './base/CoPStub'

class LearnerResources extends Resources {
  fetchResourceCommand() {
    return '/learner_resource/fetch'
  }
  createFolderCommand() {
    return '/learner_resource/create_folder'
  }
  uploadFileCommand() {
    return '/learner_resource/upload_file'
  }
  visitLeanerResourceBy(courseId, courseInstanceId) {
    this._itcFetchResource.set()
    cy.visit(
      `${CoPConst.URL}/admin/admin?p_p_id=copMemberManagementPortlet&p_p_lifecycle=0&_copMemberManagementPortlet_mvcRenderCommandName=%2Fcourse_instance%2Fedit&_copMemberManagementPortlet_id=${courseInstanceId}&_copMemberManagementPortlet_tab=resources&_copMemberManagementPortlet_courseId=${courseId}`
    )
    this._itcFetchResource.wait()
  }
  pageTitle() {
    return 'Learner Resources'
  }
}

export default LearnerResources
