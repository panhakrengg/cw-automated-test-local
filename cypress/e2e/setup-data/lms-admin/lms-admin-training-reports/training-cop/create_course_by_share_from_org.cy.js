import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetupCopCourse from '../../../../../classes/cop/setup-data/SetupCopCourse'

describe(Epic.LmsAdmin, () => {
  let copObj, courseName
  const setupCopCourse = new SetupCopCourse()

  before(() => {
    cy.stubCommunity('lms-admin/lms-admin-training-reports/training-reports', 'tCopTrainingReport')
    cy.get('@stubCommunity').then((stubCommunity) => {
      copObj = stubCommunity
      courseName = copObj.sharedCourses.courseSharedForCheckingTrainingReport.name
    })
  })

  context(Story.lmsAdminTrainingReports, () => {
    it('Add existing course from org to "TCoP Training Reports"', () => {
      setupCopCourse.login.asOrgAdminAmy(copObj.url)
      setupCopCourse.addExistingCourse(courseName)
    })
  })
})
