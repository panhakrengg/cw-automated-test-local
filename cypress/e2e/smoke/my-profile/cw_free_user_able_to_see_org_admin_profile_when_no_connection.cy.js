import Epic from '../../../classes/Epic'
import ProfileInfo from '../../../classes/my-profile/ProfileInfo'
import Story from '../../../classes/Story'
import SignInAs from '../../../classes/utilities/SignInAs'

describe(Epic.Profile, () => {
  const profileInfo = new ProfileInfo()
  context(Story.profileVisibility, () => {
    let contactInfo
    let details
    let expertise

    before(() => {
      profileInfo.stub.getProfileStatic((data) => {
        contactInfo = data.users.orgAdmin.contactInfo
        details = data.users.orgAdmin.details
        expertise = data.users.orgAdmin.expertiseQualifications
      })
      SignInAs.freemiumUser()
    })

    it('Cw Free User able to see Org Admin profile when has no connection', () => {
      Story.ticket('QA-796')
      context('verify contact info', () => {
        profileInfo.verifyContactInfo(contactInfo)
      })
      context('Verify details info', () => {
        profileInfo.verifyDetailInfo(details)
        profileInfo.checkUserDetailUrl('Website', details.website[2])
        profileInfo.checkUserDetailUrl('Social Network', details.socialMedia.facebook[0])
      })
      context('Verify expertise and qualifications', () => {
        profileInfo.verifyExpertiseAndQualifications({
          interestsAndHobbies: expertise.interestsAndHobbies.items,
        })
      })
    })
  })
})
