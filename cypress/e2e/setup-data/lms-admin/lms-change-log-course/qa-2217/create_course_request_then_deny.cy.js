import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourse from '../../../../../classes/lms/admin/setup-data/SetUpCourse'
import SignInAs from '../../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'

describe(Epic.LmsAdmin, () => {
  let courseObj
  const setupCourse = new SetUpCourse()

  before(() => {
    new YamlHelper('lms-admin/lms-change-log/log-course').read().then(({ ShareCourses }) => {
      const community = ShareCourses.tCopFuncRequestToUseSharedCourse
      courseObj = community.sharedCourses.requestThenDeny
    })
  })

  context(Story.lmsChangeLogCourse, () => {
    it('Create new course "Share course request then deny - check log"', () => {
      setupCourse.setCourseObject(courseObj)

      SignInAs.orgAdmin_Amy()
      setupCourse.createNewCourseThenPublishAndShare(courseObj.communitySharing)
    })
  })
})
