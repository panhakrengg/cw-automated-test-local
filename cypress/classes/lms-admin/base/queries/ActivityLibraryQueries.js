import Field from '../../../constants/Field'
import { OrgConst } from '../../../org-management/base-org-management/OrgStub'

class ActivityLibraryQueries {
  getActivityLibraryUrl() {
    return OrgConst.FIRE_CLOUD_FULL_CATALOG_URL + `/activity-library`
  }

  getInputSearchActivity() {
    return cy.get('.cw-top-header__search-input input')
  }

  getActivityCard(title) {
    return cy.getElementWithLabel(title, 'a').parents('.activity-card-wrapper')
  }

  getActivityCardBody(title) {
    return cy.getElementWithLabel(title, 'a').first().parents('div.cec-p-3')
  }

  getActivityWrapper() {
    return cy.get('.activity-body-wrapper')
  }

  getTotalActivitiesByTitle(title) {
    this.getActivityWrapper().within(($body) => {
      cy.wrap($body.find(`a:contains('${title}')`).length).as('totalActivities')
    })
    return cy.get('@totalActivities')
  }

  getActivityLibraryLoadingIcon() {
    return cy.get('.activity-body-wrapper svg.icon-loading-lg')
  }

  getStandardActivityTemplate() {
    return cy.get(`input[name="standard-activity"]`).next('span.radio-checkmark')
  }

  getActivityTemplate() {
    return cy.get(`input[name="activity-template"]`).next('span.radio-checkmark')
  }

  getActivityTypeInCreateActivityPopup(activityType) {
    cy.swal2().within(() => {
      cy.getElementWithLabel(activityType, 'span').parents('.row.mx-0').parent().as('activityType')
    })
    return cy.get('@activityType')
  }

  getButtonSave() {
    return cy.getElementWithLabel(Field.SAVE, 'button')
  }

  getRadioUploadVideo() {
    return cy.getElementWithLabel('Upload a video file', 'span')
  }

  getInputTitle() {
    return cy.getInput('text', 'Enter the title')
  }

  getInputDisplayText() {
    return cy.getInput('text', 'Enter the display text')
  }

  getInputEstimateCompleteTime() {
    return cy.get('#_activityLibraryPortlet_estimatedDuration')
  }

  getInputScoreLimit() {
    return cy.get('#_activityLibraryPortlet_scoreLimit')
  }

  getDropdownLanguageWrapper() {
    return cy.get('label[for="_activityLibraryPortlet_language"]').parent()
  }

  getButtonAddMoodleActivity() {
    return cy.get('.card.text-black').find(`button.btn-outline-primary:contains("${Field.ADD}")`)
  }

  getButtonEditMoodleActivity() {
    return cy.get('.card.text-black').find(`button.btn-outline-primary:contains("${Field.EDIT}")`)
  }

  getFieldSetGeneral() {
    return cy.getElementWithLabel(Field.GENERAL, 'a')
  }

  getFieldSetGrade() {
    return cy.getElementWithLabel(Field.GRADE, 'a')
  }

  getSvgIconStandardActivity() {
    return cy.get('a.activity-title').siblings('svg')
  }

  getLabelUsedByTotalCourse() {
    return cy.get('.text-gray.text-ellipsis')
  }
}

export default ActivityLibraryQueries
