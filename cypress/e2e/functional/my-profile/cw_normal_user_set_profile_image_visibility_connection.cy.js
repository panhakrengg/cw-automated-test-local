import Dashboard from '../../../classes/dashboard/Dashboard'
import Epic from '../../../classes/Epic'
import ProfileInfo from '../../../classes/my-profile/ProfileInfo'
import Story from '../../../classes/Story'
import SignInAs from '../../../classes/utilities/SignInAs'

describe(Epic.Profile, { retries: 1 }, () => {
  const profileInfo = new ProfileInfo()
  const dashboard = new Dashboard()

  context(Story.profileVisibility, () => {
    let normalUserScreenName

    before(() => {
      profileInfo.stub.getProfileStatic((data) => {
        normalUserScreenName = data.users.normal.contactInfo.screenName
      })
    })

    beforeEach(() => {
      profileInfo.login.toProfilePageAsCiMember()
    })

    it('Cw Normal User set profile image visibility as "Connections"', () => {
      Story.ticket('QA-49')
      cy.logInTestCase('Update profile image visibility')
      profileInfo.clickOpenEditProfileImagePopup()
      profileInfo.clickDeleteProfileImage()
      profileInfo.selectFileUpload(profileInfo._myProfileImagePath)
      profileInfo.selectProfileImageVisibility('Connections')
      profileInfo.clickSaveProfileImage()

      profileInfo.getProfileImageTokenId().then(($imageId) => {
        cy.logInTestCase('Preview As Someone in any logged in user')
        profileInfo.previewProfileAsAnyLoggedInUser()
        profileInfo.checkDefaultProfileImageVisible()

        cy.logInTestCase('Preview As Someone in connections')
        profileInfo.visitMyProfile()
        profileInfo.previewProfileAsConnections()
        profileInfo.checkProfileImageTokenId($imageId)

        cy.logInTestCase('Preview As Someone in organization')
        profileInfo.visitMyProfile()
        profileInfo.previewProfileAsOrganization()
        profileInfo.checkDefaultProfileImageVisible()

        cy.logInTestCase('Verify view image profile with org admin')
        dashboard.interceptGettingStart()
        SignInAs.orgAdmin()
        dashboard.waitGettingStart()
        profileInfo.verifyMyProfileWithDefaultImage(normalUserScreenName)

        cy.logInTestCase('Verify view image profile with org member')
        dashboard.interceptGettingStart()
        SignInAs.orgMember()
        dashboard.waitGettingStart()
        profileInfo.verifyMyProfileImage(normalUserScreenName, $imageId, 'Message')
      })
    })
  })
})
