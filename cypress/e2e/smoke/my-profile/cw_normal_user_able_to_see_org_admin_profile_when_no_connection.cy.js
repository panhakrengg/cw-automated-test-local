import Epic from '../../../classes/Epic'
import GlobalSearch from '../../../classes/global-search/GlobalSearch'
import ProfileInfo from '../../../classes/my-profile/ProfileInfo'
import Story from '../../../classes/Story'
import SignInAs from '../../../classes/utilities/SignInAs'

describe(Epic.Profile, () => {
  const profileInfo = new ProfileInfo()
  const globalSearch = new GlobalSearch()
  context(Story.profileVisibility, () => {
    let contactInfo
    let details
    let expertise
    let orgAdmin

    before(() => {
      profileInfo.stub.getProfileStatic((profileStatic) => {
        orgAdmin = profileStatic.users.orgAdmin
        contactInfo = profileStatic.users.orgAdmin.contactInfo
        details = profileStatic.users.orgAdmin.details
        expertise = profileStatic.users.orgAdmin.expertiseQualifications
      })
    })

    it('Cw Normal User able to see Org Admin profile when has no connection', () => {
      SignInAs.instanceMember()
      context('Verify org admin profile in global search', () => {
        globalSearch.search(orgAdmin.contactInfo.screenName)
        profileInfo.checkProfileInGlobalSearch(
          orgAdmin.contactInfo.fullName.globalSearch,
          '',
          'Add Connection',
          true
        )
        profileInfo.checkProfileHeadline(orgAdmin.contactInfo.headline)
        profileInfo.clickProfileUserCard()
      })

      context('Verify org admin profile in my profile', () => {
        profileInfo.checkProfileInMyProfile(
          orgAdmin.contactInfo.fullName.myProfile,
          '',
          'Connect'
        )
        profileInfo.checkAboutMeNotExist()
        profileInfo.verifyExpertiseAndQualifications({
          interestsAndHobbies: expertise.interestsAndHobbies.items,
        })
      })
    })
  })
})
