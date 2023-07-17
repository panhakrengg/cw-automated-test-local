import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetupCoP from '../../../../../classes/cop/setup-data/SetupCoP'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.LmsAdmin, () => {
  let copObj
  const setupCoP = new SetupCoP()

  before(() => {
    cy.stubCommunity('lms-admin/lms-admin-training-reports/training-reports', 'tCopTrainingReport')
    cy.get('@stubCommunity').then((stubCommunity) => {
      copObj = stubCommunity
    })
  })

  context(Story.lmsAdminTrainingReports, () => {
    it('Setup Training CoP "TCoP Training Reports"', () => {
      setupCoP.setCoPBaseYaml(copObj)

      SignInAs.orgAdmin_Amy()
      setupCoP.createTrainingCoP()
      setupCoP.createConsentBySelectFromOrg()
      setupCoP.inviteMembersThenAccept()
    })
  })
})
