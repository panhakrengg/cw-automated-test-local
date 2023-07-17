import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SignInAsCoP from '../../../../../classes/cop/cop-administration/base-administration/SignInAsCoP'
import SetupCoP from '../../../../../classes/cop/setup-data/SetupCoP'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  let copObj
  const setupCoP = new SetupCoP()
  const signInCopAs = new SignInAsCoP()

  before(() => {
    cy.stubCommunity(
      'lms-training-cop/tcop-activity-library/tcop-activity-library',
      'tCopForActivityLibrary'
    )
    cy.get('@stubCommunity').then((stubCommunity) => {
      copObj = stubCommunity
    })
  })

  context(Story.tCopActivityLibrary, () => {
    it('Create "TCoP Func For Activity Library"', () => {
      describe('Create cop, change owner from org admin & invite member', () => {
        setupCoP.setCoPBaseYaml(copObj)

        SignInAs.orgAdmin_Amy()
        setupCoP.createCommunity()
        setupCoP.changeOwnerFromOrgAdmin()
        setupCoP.inviteMembersThenAccept()
      })
      describe('Change admin role', () => {
        signInCopAs.owner_Kristy()
        setupCoP.changeToAdminRole()
      })
    })
  })
})
