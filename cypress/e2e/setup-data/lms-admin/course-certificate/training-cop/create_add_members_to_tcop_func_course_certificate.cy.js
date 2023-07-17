import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetupCoP from '../../../../../classes/cop/setup-data/SetupCoP'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.LmsAdmin, () => {
  let copObj
  const setupCoP = new SetupCoP()

  before(() => {
    cy.stubCommunity('lms-admin/course-certificate/course-certificate', 'tCoPFuncCourseCertificate')
    cy.get('@stubCommunity').then((stubCommunity) => {
      copObj = stubCommunity
    })
    SignInAs.orgAdmin_Amy()
  })

  context(Story.courseCertificate, () => {
    it('Setup Training CoP "TCoP Func FireCloud Course Certificate"', () => {
      setupCoP.setCoPBaseYaml(copObj)

      setupCoP.createTrainingCoP()
      setupCoP.inviteMembersThenAccept()
    })
  })
})
