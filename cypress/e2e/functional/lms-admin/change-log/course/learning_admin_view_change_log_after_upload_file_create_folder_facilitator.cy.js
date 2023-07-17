import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import { ChangeLogFacilitatorResourceBase } from '../../../../../classes/lms-admin/settings/change-log/ChangeLogCourseBase'
import ReportDefect from '../../../../../classes/utilities/ReportDefect'
import LmsUserRole from '../../../../../classes/utilities/user-role/LmsUserRole'

describe(Epic.LmsAdmin, () => {
  const { action, actionResource, assertion, yaml, loginResource } =
    new ChangeLogFacilitatorResourceBase()
  const userRole = LmsUserRole.LMS_USERS.LEARNING_ADMIN.AU_LN_ADMIN_EMERY

  let course, courseId, courseName
  let fileRoot, fileUnderFolder, auFolderName
  let logFacilitator

  context(Story.lmsChangeLogCourse, () => {
    before(() => {
      yaml.getCourseConsentNewResourceLog((data) => {
        course = data
        courseId = yaml.getUrlId(course)
        courseName = course.name

        const resources = course.facilitatorResources
        fileRoot = resources.files
        auFolderName = resources.folders.auFolder.name
        fileUnderFolder = resources.folders.auFolder.files

        cy.getUserInfoByRole(userRole).then((user) => {
          logFacilitator = `${user.fullName} added facilitator resource to course ${courseName}.`
        })
      })
    })

    after(() => {
      ReportDefect.markCwDefect('CW-18433: Some courses cannot Upload file and Create folder')
    })

    it('Learning admin view Change Log after Upload file & Create folder in facilitator resource', () => {
      Story.ticket('QA-2197', ['CW-18433'])

      cy.logInTestCase('Reset Data: delete all files and folders')
      loginResource.toOrgLmsAsLearningAdmin(courseId)
      actionResource.deleteAllFilesAndFoldersIfExist()

      cy.logInTestCase('Upload new file in root folder')
      actionResource.uploadFiles(fileRoot.path)

      cy.logInTestCase('Create new folder')
      actionResource.createNewFolder(auFolderName)

      cy.logInTestCase('Upload another file under folder')
      actionResource.clickFolder(auFolderName)
      actionResource.uploadFiles(fileUnderFolder.path)

      cy.logInTestCase('Verify change log in Setting - Course changes')
      action.clickLinkChangeLogInCourse()
      action.clickDropdownFilterByCourseChangesInCourse()
      assertion.verifyFirstCourseChangeLog(logFacilitator, () => {
        assertion.expectToSeeDetailForResourcesAsFile(fileUnderFolder.name[0])
      })
      assertion.verifySecondCourseChangeLog(logFacilitator, () => {
        assertion.expectToSeeDetailForResourcesAsFolder(auFolderName)
      })
      assertion.verifyThirdCourseChangeLog(logFacilitator, () => {
        assertion.expectToSeeDetailForResourcesAsFile(fileRoot.name[0])
      })
    })
  })
})
