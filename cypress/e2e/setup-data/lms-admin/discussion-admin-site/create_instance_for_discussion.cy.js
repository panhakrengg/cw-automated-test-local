import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import SetUpCourseInstance from '../../../../classes/lms/admin/setup-data/SetUpCourseInstance'
import YamlHelper from '../../../../classes/utilities/YamlHelper'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  let course, instance, learners
  const setupInstance = new SetUpCourseInstance()

  before(() => {
    new YamlHelper('lms-admin/discussion-admin-site/course-discussion-info')
      .read()
      .then(({ CourseData }) => {
        course = CourseData.courseFuncDiscussion
        instance = course.funcInstanceDiscussion
        learners = instance.managePeople.learners
      })
  })

  context(Story.discussionAdminSite, () => {
    it('Setup instance "Func Instance Discussion"', () => {
      new SignInLmsAs().lnAdmin_Emery()
      setupInstance.createNewInstanceThenPublishFromManageCourse(course, instance)
      setupInstance.setupInstancePeople.addUsers(learners)
    })
  })
})
