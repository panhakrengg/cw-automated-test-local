import Epic from '../../../classes/Epic'
import Story from '../../../classes/Story'
import ProfileInfo from '../../../classes/my-profile/ProfileInfo'
import SignInAs from '../../../classes/utilities/SignInAs'

describe(Epic.Profile, { retries: 1 }, () => {
  const profileInfo = new ProfileInfo()

  context(Story.profileVisibility, () => {
    let teamLeader
    let areaOfFocus
    let skillsAndExpertise
    let languages
    let interestsAndHobbies
    let contactInfo

    before(() => {

      profileInfo.stub.getProfileStatic((data) => {
        teamLeader = data.users.teamLeader
        contactInfo = teamLeader.contactInfo
        areaOfFocus = teamLeader.expertiseQualifications.areaOfFocus
        skillsAndExpertise = teamLeader.expertiseQualifications.skillsAndExpertise
        languages = teamLeader.expertiseQualifications.languages
        interestsAndHobbies = teamLeader.expertiseQualifications.interestsAndHobbies
      })
    })

    beforeEach(() => {
      profileInfo.login.toProfilePageAsTeamLeader()
    })

    it('Team Leader update My focus add fields with visibility only me', () => {
      Story.ticket('QA-802')
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
      context('Preview As Someone in any logged in user', () => {
        profileInfo.previewProfileAsAnyLoggedInUser()
        profileInfo.expectedExpertiseTabShowEmptyState(contactInfo)
      })
      context('Preview As Someone in connections', () => {
        profileInfo.visitMyProfile()
        profileInfo.previewProfileAsConnections()
        profileInfo.expectedExpertiseTabShowEmptyState(contactInfo)
      })
      context('Preview As Someone in organization', () => {
        profileInfo.visitMyProfile()
        profileInfo.previewProfileAsOrganization()
        profileInfo.expectedExpertiseTabShowEmptyState(contactInfo)
      })
      context('Verify view image profile with cw normal member', () => {
        SignInAs.ciMember()
        profileInfo.viewOtherUserProfileFromSearch(contactInfo)
        profileInfo.expectedExpertiseTabShowEmptyState(contactInfo)
      })
      context('Verify view image profile with org member', () => {
        SignInAs.orgMember()
        profileInfo.viewOtherUserProfileFromSearch(contactInfo)
        profileInfo.expectedExpertiseTabShowEmptyState(contactInfo)
      })
      context('Verify view image profile with org admin', () => {
        SignInAs.orgAdmin()
        profileInfo.viewOtherUserProfileFromSearch(contactInfo)
        profileInfo.expectedExpertiseTabShowEmptyState(contactInfo)
      })
      context('Reset Data', () => {
        profileInfo.login.toProfilePageAsTeamLeader()
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
