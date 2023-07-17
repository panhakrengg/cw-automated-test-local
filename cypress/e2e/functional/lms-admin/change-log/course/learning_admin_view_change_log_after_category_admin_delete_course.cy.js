import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import ChangeLogCourseBase from '../../../../../classes/lms-admin/settings/change-log/ChangeLogCourseBase'
import LmsUserRole from '../../../../../classes/utilities/user-role/LmsUserRole'

describe(Epic.LmsAdmin, () => {
  const { action, assertion, yaml, loginCourseList, actionCourseList, login } =
    new ChangeLogCourseBase()
  const userRole = LmsUserRole.LMS_USERS.CATEGORY_ADMIN.AU_LN_CTG_AD_KENTON

  let course, courseName
  let logCourse

  context(Story.lmsChangeLogCourse, () => {
    before(() => {
      yaml.getAuCourseDeleteLog((data) => {
        course = data
        courseName = course.name

        cy.getUserInfoByRole(userRole).then((user) => {
          logCourse = `${user.fullName} deleted course ${courseName}.`
        })
      })
    })

    it('Learning admin view Change Log after category admin Delete course', () => {
      Story.ticket('QA-2194')

      cy.logInTestCase('Category admin - reset Data: create course if not exist')
      loginCourseList.asCategoryAdminKenton()
      actionCourseList.searchCourseInAll(courseName)
      actionCourseList.createCourseIfNotExist(course)

      cy.logInTestCase('Delete Course')
      actionCourseList.deleteCourse(courseName)

      cy.logInTestCase('Learning admin: verify change log in Setting')
      login.learningAdminEmery()
      action.clickLinkChangeLog()
      assertion.verifyFirstCourseChangeLog(logCourse, () => {
        assertion.expectToSeeDetailForDeletedCourse(course)
      })

      cy.logInTestCase('Verify change log in Setting - Course changes')
      action.clickDropdownFilterByCourseChanges()
      assertion.verifyFirstCourseChangeLog(logCourse)
    })
  })
})
