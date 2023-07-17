import Epic from '../../../classes/Epic'
import ProfileInfo from '../../../classes/my-profile/ProfileInfo'
import Story from '../../../classes/Story'
import SignInAs from '../../../classes/utilities/SignInAs'

describe(Epic.Profile, { retries: 2 }, () => {
  const profileInfo = new ProfileInfo()
  context(Story.profileVisibility, () => {
    let orgAdmin
    let areaOfFocus
    let skillsAndExpertise
    let languages
    let interestsAndHobbies

    before(() => {
      profileInfo.stub.getProfileStatic((data) => {
        orgAdmin = data.users.orgAdmin
        areaOfFocus = orgAdmin.expertiseQualifications.areaOfFocus
        skillsAndExpertise = orgAdmin.expertiseQualifications.skillsAndExpertise
        languages = orgAdmin.expertiseQualifications.languages
        interestsAndHobbies = orgAdmin.expertiseQualifications.interestsAndHobbies
      })
    })

    beforeEach(() => {
      profileInfo.login.toProfilePageAsOrgAdmin()
    })

    it('Org Admin update My focus add fields and others view see fields', () => {
      profileInfo.clickExpertiseAndQualificationTab(false)
      profileInfo.updateRemoveMyFocusItems({
        areaOfFocus: areaOfFocus,
        skillsAndExpertise: skillsAndExpertise,
        languages: languages,
        interestsAndHobbies: interestsAndHobbies,
      })
      profileInfo.updateMyFocus({
        areaOfFocus: areaOfFocus,
        skillsAndExpertise: skillsAndExpertise,
        languages: languages,
        interestsAndHobbies: interestsAndHobbies,
      })

      context('Preview As Someone in connections', () => {
        profileInfo.visitMyProfile()
        profileInfo.previewProfileAsConnections()
        profileInfo.verifyExpertiseAndQualifications({
          areaOfFocus: areaOfFocus.newItems,
          languages: languages.newItems,
          interestsAndHobbies: interestsAndHobbies.newItems,
        })
      })
      context('Preview As Someone in organization', () => {
        profileInfo.visitMyProfile()
        profileInfo.previewProfileAsOrganization()
        profileInfo.verifyExpertiseAndQualifications({
          skillsAndExpertise: skillsAndExpertise.newItems,
          languages: languages.newItems,
          interestsAndHobbies: interestsAndHobbies.newItems,
        })
      })
      context('Preview As Someone in any logged in user', () => {
        profileInfo.visitMyProfile()
        profileInfo.previewProfileAsAnyLoggedInUser()
        profileInfo.verifyExpertiseAndQualifications({
          interestsAndHobbies: interestsAndHobbies.newItems,
        })
      })
      context('Verify view image profile with cw normal member', () => {
        SignInAs.ciMember()
        profileInfo.viewOtherUserProfileFromSearch(orgAdmin.contactInfo)
        profileInfo.verifyExpertiseAndQualifications({
          interestsAndHobbies: interestsAndHobbies.newItems,
        })
      })
      context('Verify view image profile with org member', () => {
        SignInAs.orgMember()
        profileInfo.viewOtherUserProfileFromSearch(orgAdmin.contactInfo)
        profileInfo.verifyExpertiseAndQualifications({
          skillsAndExpertise: skillsAndExpertise.newItems,
          languages: languages.newItems,
          interestsAndHobbies: interestsAndHobbies.newItems,
        })
      })
      context('Verify view image profile with team leader', () => {
        SignInAs.teamLeaderRootOrgUnit()
        profileInfo.viewOtherUserProfileFromSearch(orgAdmin.contactInfo)
        profileInfo.verifyExpertiseAndQualifications({
          areaOfFocus: areaOfFocus.newItems,
          skillsAndExpertise: skillsAndExpertise.newItems,
          languages: languages.newItems,
          interestsAndHobbies: interestsAndHobbies.newItems,
        })
      })
      context('Reset Data', () => {
        profileInfo.login.toProfilePageAsOrgAdmin()
        profileInfo.clickExpertiseAndQualificationTab()
        profileInfo.updateRemoveMyFocusItems({
          areaOfFocus: areaOfFocus,
          skillsAndExpertise: skillsAndExpertise,
          languages: languages,
          interestsAndHobbies: interestsAndHobbies,
        })
      })
    })
  })
})
