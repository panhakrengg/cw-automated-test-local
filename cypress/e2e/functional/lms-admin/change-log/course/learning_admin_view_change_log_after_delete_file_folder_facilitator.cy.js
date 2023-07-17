import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import { ChangeLogFacilitatorResourceBase } from '../../../../../classes/lms-admin/settings/change-log/ChangeLogCourseBase'
import LmsUserRole from '../../../../../classes/utilities/user-role/LmsUserRole'

describe(Epic.LmsAdmin, () => {
  const { action, actionResource, assertion, yaml, loginResource } =
    new ChangeLogFacilitatorResourceBase()
  const userRole = LmsUserRole.LMS_USERS.LEARNING_ADMIN.AU_LN_ADMIN_EMERY

  let course, courseId, courseName
  let resources
  let logFacilitator

  context(Story.lmsChangeLogCourse, () => {
    before(() => {
      yaml.getDeleteFileFolder((data) => {
        course = data
        courseId = yaml.getUrlId(course)
        courseName = course.name
        resources = course.facilitatorResources

        cy.getUserInfoByRole(userRole).then((user) => {
          logFacilitator = `${user.fullName} deleted facilitator resource from course ${courseName}`
        })
      })
    })

    it('Learning admin view Change Log after Delete file & folder in facilitator resource', () => {
      Story.ticket('QA-2199')

      cy.logInTestCase('Reset Data: delete all files and folders')
      loginResource.toOrgLmsAsLearningAdmin(courseId)
      actionResource.resetUploadFileAndCreateFolder(resources)

      cy.logInTestCase('Upload new file in root folder')
      actionResource.selectAllFileFolders()
      actionResource.clickDelete()

      cy.logInTestCase('Verify change log in Setting - Course changes')
      action.clickLinkChangeLogInCourse()
      action.clickDropdownFilterByCourseChangesInCourse()
      assertion.verifyFirstCourseChangeLog(logFacilitator, () => {
        assertion.expectToSeeDetailForDeleteResources(resources)
      })
    })
  })
})
