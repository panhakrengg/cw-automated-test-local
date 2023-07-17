import Epic from '../../../classes/Epic'
import GlobalSearch from '../../../classes/global-search/GlobalSearch'
import ProfileInfo from '../../../classes/my-profile/ProfileInfo'
import Story from '../../../classes/Story'
import SignInAs from '../../../classes/utilities/SignInAs'

describe(Epic.Profile, () => {
  const profileInfo = new ProfileInfo()
  const globalSearch = new GlobalSearch()
  context(Story.profileVisibility, () => {
    let freeUserScreenName

    before(() => {
      profileInfo.stub.getProfileStatic((data) => {
        freeUserScreenName = data.users.freemium.contactInfo.screenName
      })
    })

    it('Cw Free User only able to set profile image as "Network"', () => {
      Story.ticket('QA-736')
      context('Cw free user', () => {
        profileInfo.login.toProfilePageAsFreeUser()
        profileInfo.clickOpenEditProfileImagePopup()
        profileInfo.selectProfileImageVisibility()
        profileInfo.checkDropdownItemsEnabled(['Network'])
        profileInfo.checkDropdownItemsDisabled(['Only Me', 'Connections', 'Platform'])
        profileInfo.clickSaveProfileImage()
        profileInfo.previewProfileAsAnyLoggedInUser()
        profileInfo.checkDefaultProfileInMyProfile(freeUserScreenName)
      })
      context('Verify with normal member', () => {
        SignInAs.orgMember()
        globalSearch.search(freeUserScreenName)
        profileInfo.checkDefaultProfileInGlobalSearch(freeUserScreenName)
      })
    })
  })
})
