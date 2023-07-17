import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpProfile from '../../../../../classes/my-profile/setup-data/SetUpProfile'
import SetupNewOrgMember from '../../../../../classes/org-management/setup-data/SetupNewOrgMember'
import UserRole from '../../../../../classes/utilities/user-role/UserRole'

describe(Epic.CoPAdministration, () => {
  const setUpProfile = new SetUpProfile()
  let userObj
  before(() => {
    cy.stubUser(UserRole.LMS_USERS.LEARNING_PATH_ADMIN.AU_LEARNING_PATH_F)
    cy.get('@stubUser').then((user) => {
      userObj = user
    })
  })

  context(Story.lmsChangeLogLearningPath, () => {
    it('Create new user "Learning Path F"', () => {
      context('invite > register', () => {
        new SetupNewOrgMember().fullProcessAddNewOrgMember(userObj)
      })
      context('Upload profile', () => {
        setUpProfile.login.asLearningPathF()
        setUpProfile.changeProfileImage(userObj.profile)
      })
    })
  })
})
