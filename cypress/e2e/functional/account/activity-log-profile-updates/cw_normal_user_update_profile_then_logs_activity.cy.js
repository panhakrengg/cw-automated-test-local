import ActivityLogs from '../../../../classes/account/ActivityLogs'
import AccountUserStub from '../../../../classes/account/stub/AccountUserStub'
import ActivityCategories from '../../../../classes/constants/ActivityCategories'
import Epic from '../../../../classes/Epic'
import ProfileInfo from '../../../../classes/my-profile/ProfileInfo'
import Setting from '../../../../classes/my-profile/Setting'
import Story from '../../../../classes/Story'
import UserRole from '../../../../classes/utilities/user-role/UserRole'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

const PROFILE_UPDATES = ActivityCategories.PROFILE_UPDATES

describe(Epic.Account, () => {
  const profileInfo = new ProfileInfo()
  const activityLogs = new ActivityLogs()
  const setting = new Setting()
  const sampleProfileYamlHelper = new YamlHelper('/profile/sample-profile')
  const accountYamlHelper = new YamlHelper('account')

  let auAcFuncMemberName
  let aboutMe = 'CC Function Tracking Activity Log'
  let areaOfFocus
  let skillsAndExpertise
  let languages
  let interestsAndHobbies
  let ccMcopFunctionCop
  let ccFunctionCop

  before(() => {
    cy.stubUser(UserRole.ACTIVITY_LOG.AU_AC_FUNC_MEMBER)
    cy.get('@stubUser').then((user) => {
      auAcFuncMemberName = user.familyName + ' ' + user.givenName
    })
    sampleProfileYamlHelper
      .read()
      .its('ProfileStatic.users.auAcFuncMember.expertiseQualifications')
      .then((data) => {
        areaOfFocus = data.areaOfFocus
        skillsAndExpertise = data.skillsAndExpertise
        languages = data.languages
        interestsAndHobbies = data.interestsAndHobbies
      })
    accountYamlHelper
      .read()
      .its('Organizations.webLearn.communities')
      .then((communities) => {
        ccFunctionCop = communities.ccFunction.name
        ccMcopFunctionCop = communities.ccMcopFunctions.name
      })
    setting.readSettingVisibilityBodyFromYaml()
  })

  beforeEach(() => {
    AccountUserStub.signInAsAuAcFuncMember()
    profileInfo.visitMyProfile()
  })
  context(Story.activityLog, () => {
    it('Cw Normal User update profile about me then logs activity - Profile Updates', () => {
      Story.ticket('QA-1374')
      context('Clear about me', () => {
        profileInfo.clickCommunityTab()
        profileInfo.clickEditAboutMe()
        profileInfo.updateAboutMe()
      })
      context('Update about me', () => {
        profileInfo.clickEditAboutMe()
        profileInfo.updateAboutMe(aboutMe)
        profileInfo.expectedShowAboutMe(aboutMe)
      })
      context('Log activity for profile updates', () => {
        profileInfo.getProfileImageTokenId().then(($imageTokenId) => {
          activityLogs.accessActivityLog()
          activityLogs.clickFilterActivityBy(PROFILE_UPDATES)
          activityLogs.containLogUpdateProfileAboutMe(auAcFuncMemberName, $imageTokenId, aboutMe)
        })
      })
    })

    it('Cw Normal User update profile expertise about my focus then logs activity - Profile Updates', () => {
      Story.ticket('QA-1376')
      context('Reset and remove expertise my focus', () => {
        profileInfo.clickExpertiseAndQualificationTab(false)
        profileInfo.removeAllMyFocusItemsByInAllField([
          areaOfFocus.label,
          skillsAndExpertise.label,
          languages.label,
          interestsAndHobbies.label,
        ])
      })

      context('Update expertise my focus', () => {
        profileInfo.updateMyFocus({
          areaOfFocus: areaOfFocus,
          skillsAndExpertise: skillsAndExpertise,
          languages: languages,
          interestsAndHobbies: interestsAndHobbies,
        })
      })

      context('Log activity for update expertise my focus', () => {
        cy.logInTestCase('Log activity for update expertise my focus')
        profileInfo.getProfileImageTokenId().then(($imageTokenId) => {
          activityLogs.accessActivityLog()
          activityLogs.clickFilterActivityBy(PROFILE_UPDATES)
          activityLogs.containLogUpdateProfileExpertiseMyFocus(auAcFuncMemberName, $imageTokenId, [
            areaOfFocus.newItems[0],
            skillsAndExpertise.newItems[0],
            languages.newItems[0],
            interestsAndHobbies.newItems[0],
          ])
        })
      })
    })

    it('Cw Normal User update profile image then logs activity - Profile Updates', () => {
      Story.ticket('QA-1373')
      context('Reset data', () => {
        profileInfo.clickOpenEditProfileImagePopup()
        profileInfo.selectProfileImageVisibility('Only Me')
        profileInfo.clickSaveProfileImage()
      })
      context('Upload profile image and visibility', () => {
        profileInfo.itcGetProfileImage.set()
        profileInfo.clickOpenEditProfileImagePopup()
        profileInfo.selectFileUpload(profileInfo._myProfileImage2Path)
        profileInfo.selectProfileImageVisibility('Platform')
        profileInfo.clickSaveProfileImage()
        profileInfo.itcGetProfileImage.wait()
        cy.get('.img-circle').should('be.visible')
      })
      context('Log activity for profile updates', () => {
        profileInfo.getProfileImageTokenId().then(($imageTokenId) => {
          activityLogs.accessActivityLog()
          activityLogs.clickFilterActivityBy(PROFILE_UPDATES)
          activityLogs.containLogUpdateProfileImage(auAcFuncMemberName, $imageTokenId)
        })
      })
    })

    it('Cw Normal User update profile set primary CoP then logs activity - Profile Updates', () => {
      Story.ticket('QA-1375')
      context('Reset data', () => {
        profileInfo.clickCommunityTab()
        profileInfo.clickEditMyCommunity()
        if (Cypress.currentRetry == 1) {
          profileInfo.selectPrimaryCop(ccFunctionCop)
        } else {
          profileInfo.selectPrimaryCop(ccMcopFunctionCop)
        }
        profileInfo.clickButtonSaveEditCopPopup()
      })

      context('Switch primary cop', () => {
        const oldPrimaryCopName = profileInfo.getPrimaryCopName()
        profileInfo.clickEditMyCommunity()
        profileInfo.selectPrimaryCop(ccFunctionCop)
        profileInfo.clickButtonSaveEditCopPopup()
        const newPrimaryCopName = profileInfo.getPrimaryCopName()

        context('Expected org member himself see updated primary', () => {
          if (oldPrimaryCopName && newPrimaryCopName) {
            profileInfo.expectedPrimaryCopUpdate(oldPrimaryCopName, newPrimaryCopName)
          }
        })
      })

      context('Log activity for set primary cop', () => {
        profileInfo.getProfileImageTokenId().then(($imageTokenId) => {
          activityLogs.accessActivityLog()
          cy.wait(1000)
          activityLogs.containLogUpdateProfileSetPrimaryCop(
            auAcFuncMemberName,
            $imageTokenId,
            ccMcopFunctionCop,
            ccFunctionCop
          )
        })
      })
    })

    it('Org Member update org profile settings then logs activity - Profile Updates', () => {
      Story.ticket('QA-1378')
      context('Reset "Others in my organization can view" to enable', () => {
        setting.clickSettingIcon()
        setting.initGlobalSearchElement()
        setting.initOrgProfileElement()
        setting.turnOnOtherInMyOrgCanView()
      })

      context('Update "Others in my organization can view" to disable', () => {
        setting.turnOffOtherInMyOrgCanView()
      })

      context('Log activity for set primary cop', () => {
        profileInfo.getProfileImageTokenId().then(($imageTokenId) => {
          activityLogs.accessActivityLog()
          activityLogs.clickFilterActivityBy(PROFILE_UPDATES)
          activityLogs.containLogUpdateProfileGlobalSearchSettings(
            auAcFuncMemberName,
            $imageTokenId
          )
        })
      })
    })
  })
})
