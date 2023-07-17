import Field from '../../../../constants/Field'
import CourseActivitiesQueries from '../queries/CourseActivitiesQueries'

class CourseActivitiesAssertions extends CourseActivitiesQueries {
  #expectToSeeAccordionTitle(activityTitle) {
    cy.get('.accordion__header').within(() => {
      cy.expectElementWithLabelVisible(activityTitle, 'span.text-black')
    })
  }

  expectAddedNewActivityToInstanceSuccessfully(activityTitle, activityDesc) {
    super.getAccordionActivityItem(activityTitle).within(() => {
      if (activityTitle) {
        this.#expectToSeeAccordionTitle(activityTitle)
      }
      if (activityDesc) {
        cy.get('.accordion-body').within(() => {
          cy.expectElementWithLabelVisible(activityDesc, 'div.cec-mb-1')
        })
      }
    })
  }

  expectAddedExistingActivityFromLibrarySuccessfully(activityObj, isEditable = false) {
    super
      .getTheLastCourseActivity()
      .find('.accordion-body .card')
      .within(() => {
        cy.expectElementWithLabelVisible(activityObj.title, 'p')
        cy.get('p.multi-line-text-ellipsis-two')
          .should('contain.text', activityObj.description)
          .and('be.visible')
        cy.expectElementWithLabelVisible(Field.REMOVE, 'a')
        isEditable
          ? cy.expectElementWithLabelVisible(Field.EDIT_DETAILS, 'a')
          : cy.expectElementWithLabelNotExist(Field.EDIT_DETAILS, 'a')
      })
  }

  expectToSeeCannotModifiableMessage() {
    cy.getElementWithLabel(
      "This template can't be modified. Learners will complete this activity only once in multiple course instances.",
      'p'
    )
      .should('be.visible')
      .find('svg')
      .should('be.visible')
  }

  expectToSeeLinkForChooseActivityTemplateInEditActivity(title) {
    super
      .getActivityByTitle(title)
      .parents('div.border-bottom')
      .within(() => {
        super.getChooseFromActivityLibraryLink().should('be.visible')
      })
  }

  #expectToSeeImageCoverOfActivityTemplate(activity) {
    const { coverImage } = activity
    cy.get(`.image__wrapper > img`)
      .invoke('attr', 'src')
      .then(($src) => {
        let string = $src.includes(coverImage.name) ? coverImage.name : 'CoverImage'
        expect($src).to.contain(string)
      })
  }

  #expectToSeeActivityTemplate(activity) {
    cy.get('.card').within(() => {
      this.#expectToSeeImageCoverOfActivityTemplate(activity)
      cy.expectElementWithLabelVisible(activity.title, 'p.font-size-16')
      cy.expectElementWithLabelVisible(activity.description, '.multi-line-text-ellipsis-two')
    })
  }

  verifyActivityInfoUsingActivityTemplate(activity) {
    super.getAccordionActivityItem(activity.title).within(() => {
      this.#expectToSeeAccordionTitle(activity.title)
      this.#expectToSeeActivityTemplate(activity)
    })
  }
}

export default CourseActivitiesAssertions
