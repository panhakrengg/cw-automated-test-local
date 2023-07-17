import InterceptReq from '../base/InterceptReq'
import YamlHelper from '../utilities/YamlHelper'
import MyProfile from './MyProfile'

class Setting extends MyProfile {
  globalSearch
  orgProfile
  yamlHelper = new YamlHelper('profile/sample-profile')

  itcModifySetting = new InterceptReq('/profile/setting/modify', 'ModifySetting')

  readSettingVisibilityBodyFromYaml() {
    this.yamlHelper
      .read()
      .its('Settings.body')
      .then((data) => {
        this.globalSearch = data.globalSearch
        this.orgProfile = data.orgProfile
      })
  }

  clickSettingIcon() {
    cy.get('a.cog-icon').last().should('be.visible').click()
  }
  initGlobalSearchElement() {
    cy.get('#default-sidebar').within(($sidebar) => {
      cy.wrap($sidebar)
        .getElementWithLabel(this.globalSearch.label)
        .should('be.visible')
        .parent()
        .as('globalSearch')
    })
    cy.get('@globalSearch')
      .first()
      .within(($body) => {
        cy.wrap($body)
          .getElementWithLabel(this.globalSearch.allUsersCanSee.label)
          .should('be.visible')
          .siblings('.cw-toggle-button')
          .as('allUsersCanSeeToggle')
        cy.wrap($body)
          .getElementWithLabel(this.globalSearch.otherInMyOrgFindMe.label)
          .should('be.visible')
          .siblings('.cw-toggle-button')
          .as('otherInMyOrgCanFindMeToggle')
      })
  }
  initOrgProfileElement() {
    cy.get('#default-sidebar').within(($sidebar) => {
      cy.wrap($sidebar)
        .getElementWithLabel(this.orgProfile.label, 'label')
        .should('be.visible')
        .parent()
        .as('orgProfile')
    })
    cy.get('@orgProfile').within(($orgProfile) => {
      cy.wrap($orgProfile)
        .getElementWithLabel(this.orgProfile.otherInMyOrgCanView.label, 'span')
        .should('be.visible')
        .siblings('.cw-toggle-button')
        .as('otherInMyOrgCanViewToggle')
    })
  }
  expectedToSeeGlobalSearchTitle(title) {
    cy.get('@globalSearch').then(() => {
      cy.getElementWithLabel(title).should('be.visible')
    })
  }
  expectedToSeeAllUsersCanFindMeAndTurnOnToggle(globalSearch) {
    cy.get('@globalSearch').then(($body) => {
      cy.getElementWithLabel(globalSearch.allUsersCanSee.label).should('be.visible')
      cy.get('@allUsersCanSeeToggle').toggleIsEnable()
    })
  }
  expectedNotSeeOrgProfileTitle() {
    cy.get('#default-sidebar > div:nth-child(2) > div:nth-child(2)').within(($sidebar) => {
      cy.wrap($sidebar).getElementWithLabel(this.orgProfile.label).parent().should('not.be.visible')
    })
  }
  turnOffToggleButton(subject) {
    cy.wrap(subject)
      .get('input')
      .invoke('prop', 'checked')
      .then(($state) => {
        if ($state) {
          this.itcModifySetting.set()
          cy.wrap(subject).click()
          this.itcModifySetting.wait()
          cy.wait(1000)
          cy.wrap(subject).toggleIsDisabled()
        }
      })
  }
  turnOnToggleButton(subject) {
    cy.wrap(subject)
      .get('input')
      .invoke('prop', 'checked')
      .then(($state) => {
        if (!$state) {
          this.itcModifySetting.set()
          cy.wrap(subject).click()
          this.itcModifySetting.wait()
          cy.wait(1000)
          cy.wrap(subject).toggleIsEnable()
        }
      })
  }
  turnOffAllUserCanSee() {
    cy.get('@allUsersCanSeeToggle').within(($toggle) => {
      this.turnOffToggleButton($toggle)
    })
  }
  turnOnAllUserCanSee() {
    cy.get('@allUsersCanSeeToggle').within(($toggle) => {
      this.turnOnToggleButton($toggle)
    })
  }
  turnOffOtherInMyOrgCanFindMe() {
    cy.get('@otherInMyOrgCanFindMeToggle').within(($toggle) => {
      this.turnOffToggleButton($toggle)
    })
  }
  turnOnOtherInMyOrgCanFindMe() {
    cy.get('@otherInMyOrgCanFindMeToggle').within(($toggle) => {
      this.turnOnToggleButton($toggle)
    })
  }
  turnOffOtherInMyOrgCanView() {
    cy.get('@otherInMyOrgCanViewToggle').within(($toggle) => {
      this.turnOffToggleButton($toggle)
    })
  }
  turnOnOtherInMyOrgCanView() {
    cy.get('@otherInMyOrgCanViewToggle').within(($toggle) => {
      this.turnOnToggleButton($toggle)
    })
  }
  expectedShowSuccessUpdateSettingToast() {
    cy.expectToastMessage('Your setting has been updated.')
  }
}

export default Setting
