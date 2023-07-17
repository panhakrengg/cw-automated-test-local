import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import ChangeLogCourseBase from '../../../../../classes/lms-admin/settings/change-log/ChangeLogCourseBase'
import LmsUserRole from '../../../../../classes/utilities/user-role/LmsUserRole'

describe(Epic.LmsAdmin, () => {
  const { action, actionPublish, assertion, login, loginCourseOverview, yaml } =
    new ChangeLogCourseBase()
  const userRole = LmsUserRole.LMS_USERS.COURSE_ADMIN.AU_LN_COU_LEAD_GILES

  let course, courseName, courseId
  let logPublish, logUnpublish

  context(Story.lmsChangeLogCourse, () => {
    before(() => {
      yaml.getCourseForPublishLog((data) => {
        course = data
        courseName = course.name
        courseId = yaml.getUrlId(data)

        cy.getUserInfoByRole(userRole).then((user) => {
          logPublish = `${user.fullName} published course ${courseName}.`
          logUnpublish = `${user.fullName} unpublished course ${courseName}.`
        })
      })
    })

    const verifyChangeLog = () => {
      assertion.verifyFirstCourseChangeLog(logUnpublish)
      assertion.verifyFirstCourseChangeLog(logPublish)
    }

    it('Course admin and Learning admin view Change Log after Publish & Unpublish course', () => {
      Story.ticket('QA-2214')

      cy.logInTestCase('Reset Data: Unpublish course')
      loginCourseOverview.asCourseAdminGiles(courseId)
      actionPublish.unPublish()

      cy.logInTestCase('Publish Course')
      actionPublish.publish()

      cy.logInTestCase('Unpublish Course')
      actionPublish.unPublish()

      cy.logInTestCase('Verify change log in Course')
      action.clickLinkChangeLogInCourse()
      verifyChangeLog()

      cy.logInTestCase('Verify change log in Course - Course changes')
      action.clickDropdownFilterByCourseChangesInCourse()
      verifyChangeLog()

      cy.logInTestCase('Learning admin: verify change log in Setting')
      login.learningAdminEmery()
      action.clickLinkChangeLog()
      verifyChangeLog()
    })
  })
})
