import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import { ChangeLogCourseConsentBase } from '../../../../../classes/lms-admin/settings/change-log/ChangeLogCourseBase'
import SignInAs from '../../../../../classes/utilities/SignInAs'
import UserRole from '../../../../../classes/utilities/user-role/UserRole'

describe(Epic.LmsAdmin, () => {
  const { action, assertion, yaml, actionManageConsent } = new ChangeLogCourseConsentBase()
  const userRole = UserRole.ORG_ADMIN.ORG_ADMIN_AMY

  let courseName, courseId
  let newForm, newFormName, previousForm
  let logEditConsent

  context(Story.lmsChangeLogCourse, () => {
    before(() => {
      yaml.getCourseEditConsentLog((data) => {
        const course = data
        courseName = course.name
        courseId = yaml.getUrlId(course)

        previousForm = course.manageConsent.previous
        newForm = course.manageConsent.new
        newFormName = newForm.formName

        cy.getUserInfoByRole(userRole).then((user) => {
          logEditConsent = `${user.fullName} edited the consent form for course ${courseName}.`
        })
      })
    })

    it('Org admin view Change Log after Edit consent', () => {
      Story.ticket('QA-2213')

      cy.logInTestCase('Reset Data: Make the consent to previous info')
      actionManageConsent.logInThenVisit(() =>
        SignInAs.orgAdmin_Amy(actionManageConsent.getUrlOrgLms(courseId))
      )
      actionManageConsent.resetConsentForm(newFormName, previousForm)

      cy.logInTestCase('Edit consent')
      actionManageConsent.editCustomForm(newForm)

      cy.logInTestCase('Verify change log in Course')
      cy.wait(2000) // wait for change log appear
      action.clickLinkChangeLogInCourse()
      assertion.verifyFirstCourseChangeLog(logEditConsent, () => {
        assertion.expectToSeeDetailForEditConsent(newForm, previousForm)
      })
    })
  })
})
