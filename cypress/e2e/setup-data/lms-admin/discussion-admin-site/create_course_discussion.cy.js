import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import SetUpCourse from '../../../../classes/lms/admin/setup-data/SetUpCourse'
import YamlHelper from '../../../../classes/utilities/YamlHelper'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  let courseObj
  const setup = new SetUpCourse()

  before(() => {
    new YamlHelper('lms-admin/discussion-admin-site/course-discussion-info')
      .read()
      .then(({ CourseData }) => {
        courseObj = CourseData.courseFuncDiscussion
      })
    new SignInLmsAs().lnAdmin_Emery()
  })

  context(Story.discussionAdminSite, () => {
    it('Setup course "Course Func for Discussion"', () => {
      setup.setCourseObject(courseObj)

      setup.createNewCourseThenPublish()
      setup.addFacilitators()
      setup.addAdmins()
    })
  })
})
