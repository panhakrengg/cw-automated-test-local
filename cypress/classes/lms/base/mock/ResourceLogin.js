import SignInAs from '../../../utilities/SignInAs'
import ResourceItc from '../intercepts/ResourceItc'
import ResourceQueries from '../queries/ResourceQueries'

export default class ResourceLogin extends ResourceQueries {
  #visitOrgLms(instanceId, callback = () => {}) {
    const itc = instanceId ? ResourceItc.fetchBreadcrumbLearner : ResourceItc.fetchBreadcrumbFaci
    itc.set()
    callback()
    itc.wait()
  }

  toOrgLmsAsLearningAdmin(courseId, instanceId) {
    this.#visitOrgLms(instanceId, () => {
      SignInAs.learningAdminEmery(super.getUrlAdminOrgLms(courseId, instanceId))
    })
  }
}
