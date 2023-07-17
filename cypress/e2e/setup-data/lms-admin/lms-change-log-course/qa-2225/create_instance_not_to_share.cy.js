import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourseInstance from '../../../../../classes/lms/admin/setup-data/SetUpCourseInstance'
import SignInAs from '../../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'

describe(Epic.LmsAdmin, () => {
  let courseObj, instanceObj

  before(() => {
    new YamlHelper('lms-admin/lms-change-log/log-course').read().then(({ ShareCourses }) => {
      const community = ShareCourses.tCopFuncRequestToUseSharedCourse
      courseObj = community.sharedCourses.requestThenApproveSpecificInstances
      instanceObj = courseObj.instanceNotToShare
    })
  })

  context(Story.lmsChangeLogCourse, () => {
    it('Setup instance "Instance not to share" in requestThenApproveSpecificInstances', () => {
      SignInAs.orgAdmin_Amy()
      new SetUpCourseInstance().createNewInstanceFromManageCourse(courseObj, instanceObj)
    })
  })
})
