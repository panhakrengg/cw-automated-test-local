import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import { ChangeLogCourseConsentBase } from '../../../../../classes/lms-admin/settings/change-log/ChangeLogCourseBase'
import LmsUserRole from '../../../../../classes/utilities/user-role/LmsUserRole'

describe(Epic.LmsAdmin, () => {
  const {
    action,
    assertion,
    yaml,
    loginCourseList,
    actionCourseList,
    actionModifyCourse,
    actionManageConsent,
  } = new ChangeLogCourseConsentBase()
  const userRole = LmsUserRole.LMS_USERS.CATEGORY_ADMIN.AU_LN_CTG_AD_KENTON

  let course, courseName, form
  let logEditConsent, logEnableConsent

  context(Story.lmsChangeLogCourse, () => {
    before(() => {
      yaml.getAuCourseNewCustomConsentLog((data) => {
        course = data
        courseName = course.name
        form = course.manageConsent.customCourseConsent

        cy.getUserInfoByRole(userRole).then((user) => {
          logEditConsent = `${user.fullName} edited the consent form for course ${courseName}.`
          logEnableConsent = `${user.fullName} enabled the consent form for course ${courseName}.`
        })
      })
    })

    it('Category admin view Change Log after Create new custom consent', () => {
      Story.ticket('QA-2212')

      cy.logInTestCase('Reset Data: Remove Existing Course')
      loginCourseList.asCategoryAdminKenton()
      actionCourseList.deleteCourseIfExist(courseName)

      cy.logInTestCase('Precondition: need new course')
      actionModifyCourse.visitCreateCourseOrgLms()
      actionModifyCourse.createNewCourse(course)

      cy.logInTestCase('Create new consent')
      actionManageConsent.createCustomForm(form)

      cy.logInTestCase('Verify change log in Course')
      action.clickLinkChangeLogInCourse()
      assertion.verifyFirstCourseChangeLog(logEditConsent, () => {
        assertion.expectToSeeDetailForCreateConsent(form)
      })
      assertion.verifyFirstCourseChangeLog(logEnableConsent)
    })
  })
})
