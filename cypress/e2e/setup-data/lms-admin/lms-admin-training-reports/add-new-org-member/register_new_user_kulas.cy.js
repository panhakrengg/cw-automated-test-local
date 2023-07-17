import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpProfile from '../../../../../classes/my-profile/setup-data/SetUpProfile'
import SetupNewOrgMember from '../../../../../classes/org-management/setup-data/SetupNewOrgMember'
import UserRole from '../../../../../classes/utilities/user-role/UserRole'

describe(Epic.CoPAdministration, () => {
  const setUpProfile = new SetUpProfile()
  let userObj
  before(() => {
    cy.stubUser(UserRole.LMS_USERS.LEANER.AU_LEARNER_ONLYME_KULAS)
    cy.get('@stubUser').then((user) => {
      userObj = user
    })
  })

  context(Story.lmsAdminTrainingReports, () => {
    it('Create new user "Kulas"', () => {
      context('invite > register', () => {
        new SetupNewOrgMember().fullProcessAddNewOrgMember(userObj)
      })
      context('Upload profile', () => {
        setUpProfile.login.asLearnerKulas()
        setUpProfile.changeProfileImage(userObj.profile)
      })
    })
  })
})
