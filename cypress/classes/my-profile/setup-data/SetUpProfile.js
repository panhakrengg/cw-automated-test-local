import InterceptReq from '../../base/InterceptReq'
import Field from '../../constants/Field'
import SignInAs from '../../utilities/SignInAs'
import ContactInfo from '../ContactInfo'

class SetUpProfile {
  #contactInfo = new ContactInfo()

  constructor() {
    this.login = new LoginToProfile()
  }

  changeProfileImage(image) {
    Intercepts.changeProfilePicture.set()
    cy.get('.img-circle').realHover()
    cy.clickLinkByName('Change Photo')
    cy.swal2().within(($swal2) => {
      cy.clickButtonByName('Change image')
      cy.changeImage(image)
      cy.wait(1000)
      cy.clickCwDropdownItem('Platform')
      cy.clickButtonByName(Field.SAVE)
      cy.wrap($swal2).should('not.exist')
    })
    Intercepts.changeProfilePicture.wait()
  }

  changeFamilyNameVisibility(visibility) {
    cy.get(':nth-child(2) > :nth-child(1) > :nth-child(1) > .visibility-dropdown-wrapper').within(
      ($dropdown) => {
        cy.wrap($dropdown).clickCwSplitDropdownToggle(visibility)
      }
    )
  }

  changeGivenNameVisibility(visibility) {
    cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .visibility-dropdown-wrapper').within(
      ($dropdown) => {
        cy.wrap($dropdown).clickCwSplitDropdownToggle(visibility)
      }
    )
  }

  clickEditThenChangeNameVisibility(givenNameVisibility, familyNameVisibility) {
    this.#contactInfo.clickEditContactInfo()
    this.changeGivenNameVisibility(givenNameVisibility)
    this.changeFamilyNameVisibility(familyNameVisibility)
    this.#contactInfo.clickUpdateContactInfo()
  }
}

class LoginToProfile {
  #getProfileUrl() {
    return '/web/my-profile/profile'
  }

  #visitProfile(signIn = () => {}) {
    signIn()
  }

  asLearnerKulas() {
    this.#visitProfile(SignInAs.learnerKulas(this.#getProfileUrl()))
  }
  asLearnerChangeEmailJen() {
    this.#visitProfile(SignInAs.learnerChangeEmailJen(this.#getProfileUrl()))
  }
  asExitedSimo() {
    this.#visitProfile(SignInAs.exitedOrgMemberSimo(this.#getProfileUrl()))
  }
  asLearningPathF() {
    this.#visitProfile(SignInAs.learningPathF(this.#getProfileUrl()))
  }
}

class Intercepts {
  static changeProfilePicture = new InterceptReq(
    '/my-profile/change-profile-picture',
    'ChangeProfilePicture'
  )
  static optionsGetProfile = new InterceptReq('/my_profile/get/options', 'OptionsGetProfile')
}

export default SetUpProfile
