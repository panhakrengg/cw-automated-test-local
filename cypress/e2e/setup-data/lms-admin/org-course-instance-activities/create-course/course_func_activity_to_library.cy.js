import Epic from '../../../../../classes/Epic'
import SetUpCourse from '../../../../../classes/lms/admin/setup-data/SetUpCourse'
import Story from '../../../../../classes/Story'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'

describe(Epic.LmsAdmin, () => {
  let courseObj
  const setup = new SetUpCourse()

  before(() => {
    new YamlHelper('lms-admin/org-course-instance-activities/instance-activities')
      .read()
      .then(({ CourseData }) => {
        courseObj = CourseData.courseFuncActivityToLibrary
      })
    new SignInLmsAs().lnAdmin_Emery()
    setup.setOrgInstanceActivityYaml()
  })

  beforeEach(() => {
    setup.setCourseBaseYaml('courseFuncActivityToLibrary')
  })

  context(Story.organizationCourseInstanceActivities, () => {
    it('Course Func Add Activity to Library', () => {
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
            setup.changeAdminRole()
          }
        })
    })
  })
})
