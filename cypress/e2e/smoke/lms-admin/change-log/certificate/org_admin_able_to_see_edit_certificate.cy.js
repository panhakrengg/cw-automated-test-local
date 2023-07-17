import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import ChangeLogActivityLibraryBase from '../../../../../classes/lms-admin/settings/change-log/ChangeLogActivityLibraryBase'
import LmsUserRole from '../../../../../classes/utilities/user-role/LmsUserRole'

describe(Epic.LmsAdmin, { tags: ['@skipPrd'] }, () => {
  const changeLogActivityLibraryBase = new ChangeLogActivityLibraryBase()
  let changeLog

  context(Story.lmsChangeLogCertificate, () => {
    before(() => {
      const userRole = LmsUserRole.LMS_USERS.LEARNING_ADMIN.AU_LN_ADMIN_EMERY
      cy.getUserInfoByRole(userRole).then((user) => {
        changeLog = `${user.fullName} edited certificate template for FireCloud Zone.`
      })
    })

    it('Org Admin able to see Edit certificate Change Log', () => {
      Story.ticket('QA-2259')
      changeLogActivityLibraryBase.login.orgAdminAmy()
      changeLogActivityLibraryBase.action.clickLinkChangeLog()
      changeLogActivityLibraryBase.assertion.expectToSeeChangeLogList()
      changeLogActivityLibraryBase.action.clickDropdownFilterByCertificateChanges()
      changeLogActivityLibraryBase.assertion.expectTheFirstRowContainText(changeLog)
    })
  })
})
