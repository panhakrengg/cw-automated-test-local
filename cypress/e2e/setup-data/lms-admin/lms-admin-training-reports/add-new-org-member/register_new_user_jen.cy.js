import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpProfile from '../../../../../classes/my-profile/setup-data/SetUpProfile'
import SetupNewOrgMember from '../../../../../classes/org-management/setup-data/SetupNewOrgMember'
import UserRole from '../../../../../classes/utilities/user-role/UserRole'

describe(Epic.CoPAdministration, () => {
  const setUpProfile = new SetUpProfile()
  let userObj
  before(() => {
    cy.stubUser(UserRole.LMS_USERS.LEANER.AU_LEARNER_Change_Email_JEN)
    cy.get('@stubUser').then((user) => {
      userObj = user
    })
  })

  context(Story.lmsAdminTrainingReports, () => {
    it('Create new user "Jen"', () => {
      context('invite > register', () => {
        new SetupNewOrgMember().fullProcessAddNewOrgMember(userObj)
      })
      context('Upload profile', () => {
        setUpProfile.login.asLearnerChangeEmailJen()
        setUpProfile.changeProfileImage(userObj.profile)
      })
    })
  })
})
