import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourse from '../../../../../classes/lms/admin/setup-data/SetUpCourse'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  let courseObj
  const setup = new SetUpCourse()

  before(() => {
    new YamlHelper('lms-admin/org-course-instance-activities/instance-activities')
      .read()
      .then(({ CourseData }) => {
        courseObj = CourseData.courseFuncActivityFromLibrary
      })
    new SignInLmsAs().lnAdmin_Emery()
  })

  context(Story.organizationCourseInstanceActivities, () => {
    it('Course Func Activity from Library', () => {
      setup.setCourseObject(courseObj)

      setup.manageCourse.visitManageCourse()
      setup.selectAllInstances()
      setup.searchCourse()

      cy.get('#_learningAdminManageCoursesPortlet_manageCourses .position-relative')
        .first()
        .invoke('text')
        .then((text) => {
          if (!text.includes(setup.courseName)) {
            setup.createNewCourseThenPublish()
            setup.addUsers()
            setup.changeFacilitatorRole()
          }
        })
    })
  })
})
