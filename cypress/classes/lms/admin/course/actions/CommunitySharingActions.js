import Field from '../../../../constants/Field'
import { ComSharingConstant } from '../constant/CommunitySharingConstant'
import CommunitySharingItc from '../intercepts/CommunitySharingItc'
import CommunitySharingQueries from '../queries/CommunitySharingQueries'

export default class CommunitySharingActions extends CommunitySharingQueries {
  enableCommunitySharing() {
    super
      .getToggleCommunitySharing()
      .isToggleChecked()
      .then(($isToggleChecked) => {
        if (!$isToggleChecked) {
          super.getToggleCommunitySharing().toggleSwitch()
          cy.waitToastAppearThenDisappear(ComSharingConstant.SHARED_COURSE_ENABLED)
        }
      })
  }

  disableCommunitySharing() {
    super
      .getToggleCommunitySharing()
      .isToggleChecked()
      .then(($isToggleChecked) => {
        if ($isToggleChecked) {
          super.getToggleCommunitySharing().click()
          cy.clickButtonByName(Field.YES_DISABLE)
          cy.waitToastAppearThenDisappear(ComSharingConstant.SHARED_COURSE_DISABLED)
        }
      })
  }
  enableAllowDuplicate() {
    super
      .getToggleAllowDuplicate()
      .isToggleChecked()
      .then(($isToggleChecked) => {
        if (!$isToggleChecked) {
          super.getToggleAllowDuplicate().toggleSwitch()
          cy.waitToastAppearThenDisappear(ComSharingConstant.ALLOW_DUPLICATE_ENABLED)
        }
      })
  }

  disableAllowDuplicate() {
    super
      .getToggleAllowDuplicate()
      .isToggleChecked()
      .then(($isToggleChecked) => {
        if ($isToggleChecked) {
          super.getToggleAllowDuplicate().click()
          cy.waitToastAppearThenDisappear(ComSharingConstant.ALLOW_DUPLICATE_DISABLED)
        }
      })
  }
  enableRequirePermission() {
    super
      .getToggleRequirePermission()
      .isToggleChecked()
      .then(($isToggleChecked) => {
        if (!$isToggleChecked) {
          super.getToggleRequirePermission().toggleSwitch()
          cy.waitToastAppearThenDisappear(ComSharingConstant.REQUIRE_PERMISSION_ENABLED)
        }
      })
  }

  disableRequirePermission() {
    super
      .getToggleRequirePermission()
      .isToggleChecked()
      .then(($isToggleChecked) => {
        if ($isToggleChecked) {
          super.getToggleRequirePermission().click()
          cy.waitToastAppearThenDisappear(ComSharingConstant.REQUIRE_PERMISSION_DISABLED)
        }
      })
  }

  removeCommunity(name) {
    CommunitySharingItc.fetchExistingCommunities.set()
    super.getCommunityByName(name).within(($community) => {
      cy.wrap($community).clickDropdownItem(Field.REMOVE)
    })
    cy.clickButtonByName(Field.YES_REMOVE)
    CommunitySharingItc.fetchExistingCommunities.wait()
  }

  #removeIfExist(name) {
    super
      .getSharedCommunitiesList()
      .invoke('text')
      .then((text) => {
        if (text.includes(name)) {
          this.removeCommunity(name)
        }
      })
  }

  #clickTabMenu(tab) {
    CommunitySharingItc.fetchSharingItemsCourse.set()
    super.getTabMenu(tab).click()
    CommunitySharingItc.fetchSharingItemsCourse.wait()
  }

  clickTabMenuApproved() {
    this.#clickTabMenu(ComSharingConstant.APPROVED)
  }

  clickTabMenuPending() {
    this.#clickTabMenu(ComSharingConstant.PENDING)
  }

  clickTabMenuSuggested() {
    this.#clickTabMenu(ComSharingConstant.SUGGESTED)
  }

  resetToRemoveCommunity(name) {
    this.#removeIfExist(name)
    this.clickTabMenuSuggested()
    this.#removeIfExist(name)
    this.clickTabMenuPending()
    this.#denyPendingCommunityIfExist(name)
  }

  #clickButtonSuggestToCommunity() {
    CommunitySharingItc.fetchAssociatedTrainingCops.set()
    super.getButtonSuggestToCommunities().click()
    CommunitySharingItc.fetchAssociatedTrainingCops.wait()
  }

  #searchThenSelectCommunity(name) {
    CommunitySharingItc.fetchAssociatedTrainingCops.set()
    cy.inputSearch().type(`"${name}"`)
    CommunitySharingItc.fetchAssociatedTrainingCops.wait()
    cy.waitUntilIconLoadingLgNotExist()

    cy.getCheckbox().first().check()
    cy.clickButtonByName(Field.NEXT)
  }

  #selectInstancesToShared(instancesToShared) {
    CommunitySharingItc.fetchSharingItemsCourse.set()
    if (instancesToShared) this.#selectSpecificInstances(instancesToShared)
    cy.clickButtonByName(ComSharingConstant.SUGGEST)
    CommunitySharingItc.fetchSharingItemsCourse.wait()
  }

  suggestCommunity(community) {
    const { name, instancesToShared } = community
    this.#clickButtonSuggestToCommunity()
    cy.getPopup().within(() => {
      this.#searchThenSelectCommunity(name)
      this.#selectInstancesToShared(instancesToShared)
    })
  }

  #clickButtonReview(copName, userName = '') {
    const request = `${userName} would like to add this course to ${copName}.`
    cy.getElementWithLabel(request, '.d-flex')
      .first()
      .within(() => {
        cy.clickButtonByName(Field.REVIEW)
      })
  }

  #clickButtonDeny() {
    CommunitySharingItc.submitReviewRequest.set()
    CommunitySharingItc.fetchExistingCommunities.set()
    cy.getPopup().within(() => {
      cy.clickButtonByName(Field.DENY)
    })
    CommunitySharingItc.submitReviewRequest.wait()
    CommunitySharingItc.fetchExistingCommunities.wait()
  }

  denyPendingCommunity(copName, userName) {
    this.#clickButtonReview(copName, userName)
    this.#clickButtonDeny()
  }

  #denyPendingCommunityIfExist(copName) {
    super
      .getSharedCommunitiesList()
      .invoke('text')
      .then((text) => {
        if (text.includes(copName)) {
          this.denyPendingCommunity(copName)
        }
      })
  }

  #clickButtonApprove() {
    CommunitySharingItc.submitReviewRequest.set()
    CommunitySharingItc.fetchExistingCommunities.set()
    cy.clickButtonByName(Field.APPROVE)
    CommunitySharingItc.submitReviewRequest.wait()
    CommunitySharingItc.fetchExistingCommunities.wait()
  }

  approveCommunityWithAllInstances(copName, userName) {
    this.#clickButtonReview(copName, userName)
    cy.getPopup().within(() => {
      cy.clickRadioButton(ComSharingConstant.ALL_COURSE_INSTANCES)
      this.#clickButtonApprove()
    })
  }

  #selectSpecificInstances(instances = []) {
    const { share, notShare } = instances

    cy.clickRadioButton(ComSharingConstant.SPECIFIC_COURSE_INSTANCES)

    if (notShare) {
      Object.entries(notShare).forEach(([, value]) => {
        cy.rowCheckbox(value.title).uncheck()
      })
    }

    if (share) {
      Object.entries(share).forEach(([, value]) => {
        cy.rowCheckbox(value.title).check()
      })
    } else {
      cy.get('thead').getCheckbox().check()
    }
  }

  approveCommunityWithSpecificInstances(copName, userName, instances) {
    this.#clickButtonReview(copName, userName)
    cy.getPopup().within(() => {
      this.#selectSpecificInstances(instances)
      this.#clickButtonApprove()
    })
  }

  #clickButtonUpdate() {
    cy.clickButtonByName(Field.UPDATE)
    cy.waitToastAppearThenDisappear(ComSharingConstant.COMMUNITY_SHARING_UPDATED)
  }

  setDefaultInstancesAsAllCourseInstances() {
    super.getRadioAllCourseInstances().click()
    this.#clickButtonUpdate()
  }

  setDefaultInstancesAsSpecificInstances(instances) {
    this.#selectSpecificInstances(instances)
    this.#clickButtonUpdate()
  }

  resetToSelectAllCourseInstances() {
    super
      .getRadioAllCourseInstances()
      .isRadioChecked()
      .then(($isChecked) => {
        if (!$isChecked) {
          this.setDefaultInstancesAsAllCourseInstances()
        }
      })
  }

  resetToSelectSpecificCourseInstances(instances) {
    super
      .getRadioSpecificCourseInstances()
      .isRadioChecked()
      .then(($isChecked) => {
        if (!$isChecked) {
          this.setDefaultInstancesAsSpecificInstances(instances)
        }
      })
  }
}
