import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import ChangeLogActivityLibraryBase from '../../../../../classes/lms-admin/settings/change-log/ChangeLogActivityLibraryBase'
import LmsUserRole from '../../../../../classes/utilities/user-role/LmsUserRole'

describe(Epic.LmsAdmin, { tags: ['@skipPrd'] }, () => {
  const changeLogActivityLibraryBase = new ChangeLogActivityLibraryBase()
  let editCertificateChangeLog

  context(Story.lmsChangeLogCertificate, () => {
    before(() => {
      const userRole = LmsUserRole.LMS_USERS.LEARNING_ADMIN.AU_LN_ADMIN_EMERY
      cy.getUserInfoByRole(userRole).then((user) => {
        editCertificateChangeLog = `${user.fullName} edited certificate template for FireCloud Zone.`
      })
    })

    it('Learning admin not able to see Edit certificate Change Log on other categories beside Certificate Changes', () => {
      Story.ticket('QA-2260')
      changeLogActivityLibraryBase.login.learningAdminEmery()
      changeLogActivityLibraryBase.action.clickLinkChangeLog()
      changeLogActivityLibraryBase.assertion.expectToSeeChangeLogList()

      cy.logInTestCase('Category: Course changes')
      changeLogActivityLibraryBase.action.clickDropdownFilterByCourseChanges()
      changeLogActivityLibraryBase.assertion.expectTheFirstRowNotContainText(
        editCertificateChangeLog
      )

      cy.logInTestCase('Category: Course instance changes')
      changeLogActivityLibraryBase.action.clickDropdownFilterByCourseInstanceChanges()
      changeLogActivityLibraryBase.assertion.expectTheFirstRowNotContainText(
        editCertificateChangeLog
      )

      cy.logInTestCase('Category: Learning path changes')
      changeLogActivityLibraryBase.action.clickDropdownFilterByLearningPathChanges()
      changeLogActivityLibraryBase.assertion.expectTheFirstRowNotContainText(
        editCertificateChangeLog
      )

      cy.logInTestCase('Category: User group changes')
      changeLogActivityLibraryBase.action.clickDropdownFilterByUserGroupChanges()
      changeLogActivityLibraryBase.assertion.expectTheFirstRowNotContainText(
        editCertificateChangeLog
      )

      cy.logInTestCase('Category: Activity library changes')
      changeLogActivityLibraryBase.action.clickDropdownFilterByActivityLibraryChanges()
      changeLogActivityLibraryBase.assertion.expectTheFirstRowNotContainText(
        editCertificateChangeLog
      )
    })
  })
})
