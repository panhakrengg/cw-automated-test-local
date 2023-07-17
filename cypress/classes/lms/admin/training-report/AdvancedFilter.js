import InterceptReq from '../../../base/InterceptReq'
import TrainingReport from './TrainingReport'

class AdvancedFilter extends TrainingReport {
  #itcGetTrainingReport = new InterceptReq('/training-report/get', 'GetTrainingReport')

  constructor() {
    super()
    this.inputWrapperElements = [
      { labelName: 'Learner name', placeholder: 'Enter learner name' },
      { labelName: 'Course Start Date', placeholder: 'mm-dd-yyyy' },
      { labelName: 'Course End Date', placeholder: 'mm-dd-yyyy' },
      { labelName: 'Course Location', placeholder: 'Enter course location' },
    ]
    this.selectWrapperElements = [
      { labelName: 'Courses', placeholder: 'Select Course' },
      { labelName: 'Delivery Methods', placeholder: 'Select delivery method' },
      { labelName: 'Course completion status', placeholder: 'Select completion status' },
    ]
  }

  checkLearnerNotBookCourse() {
    super.getBaseContainerHeader(($header) => {
      cy.wrap($header)
        .find('label.font-weigh-normal')
        .contains('Show learners who have not booked the selected course')
        .within(($element) => {
          cy.wrap($element).find('input[type="checkbox"]').check()
        })
    })
  }

  clickOnAdvanceFilter() {
    super.getBaseContainerHeader(($header) => {
      super.getAdvancedFilter($header).click()
    })
  }

  clickButtonApply() {
    cy.clickPrimaryButton('Apply')
  }

  clickOnButtonApplyFilter() {
    this.#getAdvanceFilterButton(() => {
      this.#itcGetTrainingReport.set()
      this.clickButtonApply()
      this.#itcGetTrainingReport.wait()
      cy.waitLoadingOverlayNotExist()
    })
  }

  clickOnSelectedElement(labelName, placeholder) {
    this.#getBaseSelectedElement(labelName).getElementWithLabel(placeholder, 'i').click()
  }

  openCourseFilter() {
    this.clickOnSelectedElement(
      this.selectWrapperElements[0].labelName,
      this.selectWrapperElements[0].placeholder
    )
  }

  filterCourseByName(courseName) {
    this.selectItem(courseName)
  }

  selectItem(itemName) {
    cy.checkboxByLabel(itemName).check()
  }

  expectToSeeAdvanceFilterActionButton() {
    this.#getAdvanceFilterButton(() => {
      cy.expectButtonWithLabelAndDisabled('Clear Filter')
      cy.expectButtonWithLabelAndEnabled('Apply')
    })
  }

  expectToSeeRequiredFieldOnSelectElement(labelName) {
    super.getBaseContainerHeader(($header) => {
      cy.wrap($header).within(($content) => {
        this.#getBaseAdvancedFilterElement($content, labelName)
          .and('have.class', 'has-error')
          .find('div.text-danger:contains("Please select at least one course")')
          .should('be.visible')
      })
    })
  }

  expectToSeeInputWrapperElements() {
    this.inputWrapperElements.forEach((element) => {
      this.#expectToSeeInputWrapperElement(element.labelName, element.placeholder)
    })
  }

  expectNotToSeeAdvanceFilter() {
    super.getBaseTableHeader(($header) => {
      cy.wrap($header).get('.tabulator-header-filter').should('not.be.visible')
    })
  }

  expectToSeeSelectWrapperElements() {
    this.selectWrapperElements.forEach((element) => {
      this.#expectToSeeSelectWrapperElement(element.labelName, element.placeholder)
    })
  }

  #expectToSeeInputWrapperElement(labelName, placeholder) {
    super.getBaseContainerHeader(($header) => {
      cy.wrap($header).within(($content) => {
        this.#getBaseAdvancedFilterElement($content, labelName)
          .inputSearch(placeholder)
          .should('be.visible')
      })
    })
  }

  #expectToSeeSelectWrapperElement(labelName, placeholder) {
    this.#getBaseSelectedElement(labelName).expectElementWithLabelVisible(placeholder, 'i')
  }

  #getBaseSelectedElement(labelName) {
    cy.wrap(null).as('baseSelectedElement')
    super.getBaseContainerHeader(($header) => {
      cy.wrap($header).within(($content) => {
        this.#getBaseAdvancedFilterElement($content, labelName).as('baseSelectedElement')
      })
    })
    return cy.get('@baseSelectedElement')
  }

  #getAdvanceFilterButton(callback = () => {}) {
    super.getBaseContainerHeader(($header) => {
      cy.wrap($header)
        .get('.advance-filter-button')
        .within(() => {
          callback()
        })
    })
  }

  #getBaseAdvancedFilterElement($content, labelName) {
    return cy.wrap($content).expectElementWithLabelVisible(labelName, 'label').parent()
  }
}

export default AdvancedFilter
