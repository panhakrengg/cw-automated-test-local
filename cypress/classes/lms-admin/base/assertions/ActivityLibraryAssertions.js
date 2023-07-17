import Converter from '../../../utilities/Converter'
import UserAccountUtil from '../../../utilities/UserAccountUtil'
import { CourseActivityTypes } from '../constant/CourseActivityTypes'
import ActivityLibraryItc from '../intercepts/ActivityLibraryItc'
import ActivityLibraryQueries from '../queries/ActivityLibraryQueries'

class ActivityLibraryAssertions extends ActivityLibraryQueries {
  expectToSeeSaveActivitySuccessfullyToast() {
    cy.expectToastMessage('Your changes have been saved.')
  }

  expectToSeeActivityTitle(title) {
    super.getActivityCardBody(title).within(() => {
      cy.expectElementWithLabelVisible(title, '.activity-title')
    })
  }

  #expectToSeeActivityCardCoverImage(subject, coverImage) {
    if (coverImage) {
      const imageName = coverImage.name ? coverImage.name : coverImage.value
      if (subject.find('.activity-thumbnail svg').length) {
        cy.get('.activity-thumbnail svg').should('be.visible')
      } else {
        cy.get('.activity-thumbnail img')
          .invoke('attr', 'src')
          .then(($src) => {
            let string = $src.includes(imageName) ? imageName : 'CoverImage'
            expect($src).to.contain(string)
          })
      }
    }
  }

  #expectToSeeActivityCardBody(title, type, isStandardTemplate) {
    if (isStandardTemplate) {
      super.getSvgIconStandardActivity().should('be.visible')
    } else {
      super.getSvgIconStandardActivity().should('not.exist')
    }
    cy.expectElementWithLabelVisible(title, '.activity-title')
    cy.expectElementWithLabelVisible(type, 'small')
    super
      .getLabelUsedByTotalCourse()
      .invoke('text')
      .then(($text) => {
        const totalUsed = Converter.getNumberFromString($text)
        cy.expectElementWithLabelVisible(
          `Used by ${totalUsed ? totalUsed : 0} course ${totalUsed > 1 ? 'instances' : 'instance'}`,
          'div.text-gray'
        )
      })
  }

  #expectToSeeNewActivityInLibrary(activity, type, isStandardTemplate = true) {
    const { title, coverImage } = activity
    const cardTitle = title.new ? title.new : title.value ? title.value : title
    super.getActivityCard(cardTitle).within(($card) => {
      this.#expectToSeeActivityCardBody(cardTitle, type, isStandardTemplate)
      this.#expectToSeeActivityCardCoverImage($card, coverImage)
    })
  }

  expectToSeeNewELearningActivityInLibrary(activity) {
    this.#expectToSeeNewActivityInLibrary(
      activity,
      CourseActivityTypes.INTERACTIVE_ELEARNING.toUpperCase()
    )
  }

  expectToSeeNewVideoActivityInLibrary(activity, isStandardTemplate = true) {
    this.#expectToSeeNewActivityInLibrary(
      activity,
      CourseActivityTypes.VIDEO.toUpperCase(),
      isStandardTemplate
    )
  }

  expectToSeeNewRichTextActivityInLibrary(activity) {
    this.#expectToSeeNewActivityInLibrary(activity, CourseActivityTypes.RICH_TEXT.toUpperCase())
  }

  expectToSeeNewLearningGoalActivityInLibrary(activity) {
    this.#expectToSeeNewActivityInLibrary(activity, CourseActivityTypes.LEARNING_GOAL.toUpperCase())
  }

  expectToSeeNewHyperlinkActivityInLibrary(activity, isStandardTemplate) {
    activity.title = activity.displayText
    this.#expectToSeeNewActivityInLibrary(
      activity,
      CourseActivityTypes.HYPERLINK.toUpperCase(),
      isStandardTemplate
    )
  }

  expectToSeeNewQuizActivityInLibrary(activity) {
    this.#expectToSeeNewActivityInLibrary(activity, CourseActivityTypes.QUIZ.toUpperCase(), false)
  }

  expectToSeeNewFeedbackActivityInLibrary(activity) {
    this.#expectToSeeNewActivityInLibrary(
      activity,
      CourseActivityTypes.FEEDBACK.toUpperCase(),
      false
    )
  }

  expectToSeeNewAssignmentActivityInLibrary(activity) {
    this.#expectToSeeNewActivityInLibrary(
      activity,
      CourseActivityTypes.ASSIGNMENT.toUpperCase(),
      false
    )
  }

  expectToSeeFileActivityInLibrary(activity) {
    this.#expectToSeeNewActivityInLibrary(activity, CourseActivityTypes.FILE.toUpperCase())
  }

  expectToSeeNoResultFound() {
    super.getActivityWrapper().within(() => {
      cy.expectElementWithLabelVisible('No results found.', 'p')
    })
  }

  expectToSeeSaveButtonDisabled() {
    super.getButtonSave().isDisabled()
  }

  expectToSeeModifiedDateAndCreatedUser() {
    const currentDate = new UserAccountUtil().getDateByDefaultTimeZoneAndFormat()
    cy.get('@stubUser').then((user) => {
      const fullName = user.fullName
      cy.get('div.cec-px-6')
        .should('be.visible')
        .invoke('text')
        .then(($text) => {
          expect($text).to.eql(`Last modified on  ${currentDate}  by  ${fullName}`) //note: don't replace space for normal space
        })
    })
  }

  expectToSeeStandardTemplateDisabled() {
    super.getStandardActivityTemplate().parent().isDisabled()
  }

  expectToSeeActivityTemplateDisabled() {
    super.getActivityTemplate().parent().isDisabled()
  }

  expectToSeeFileUploadedSuccessfully(fileNames = []) {
    fileNames.forEach((fileName) => {
      cy.expectElementWithLabelVisible(fileName, 'div')
    })
  }

  expectToSeeImageUploadedSuccessfully(activity) {
    const { coverImage } = activity
    if (coverImage) {
      cy.wait(2000)
      cy.get('.cw-form-image-wrapper img')
        .invoke('attr', 'src')
        .then(($src) => {
          let string = $src.includes(coverImage.name) ? coverImage.name : 'CoverImage'
          expect($src).to.contain(string)
        })
    }
  }

  #expectInputContainTitle(activity) {
    if (activity.title) {
      super.getInputTitle().should('have.value', activity.title)
    } else {
      super.getInputDisplayText().should('have.value', activity.displayText)
    }
  }

  #expectDropdownSelectedLanguage(activity) {
    if (activity.language)
      super.getDropdownLanguageWrapper().expectElementWithLabelVisible(activity.language, 'span')
  }

  #expectInputScoreLimitContainValue(activity) {
    if (activity.scoreLimit) super.getInputScoreLimit().should('have.value', activity.scoreLimit)
  }

  #expectInputEstimateCompleteTimeContainValue(activity) {
    if (activity.estimateComplete)
      super.getInputEstimateCompleteTime().should('have.value', activity.estimateComplete)
  }

  expectToSeeYoutubeThumbnail(thumbnailUrl) {
    cy.get('.card-inner').within(() => {
      cy.get('iframe')
        .getIframeBody()
        .within(() => {
          cy.wait(3000)
          cy.get('#player')
            .should('be.visible')
            .within(() => {
              cy.get('.ytp-cued-thumbnail-overlay-image')
                .should('be.visible')
                .invoke('css', 'background-image')
                .then(($style) => {
                  expect($style).to.contain(thumbnailUrl)
                })
            })
        })
    })
  }

  #expectToSeeContentInCkEditor(activity) {
    const { description, descriptionImage } = activity
    cy.wait(3000)
    cy.get('div[class*="cw-editor"]').within(() => {
      cy.get(
        'div[id*="cke__activityLibraryPortlet_"], div[id*="_copMemberManagementPortlet_"]'
      ).within(($editor) => {
        cy.wrap($editor).ckEditorHasContent(
          description,
          descriptionImage ? descriptionImage.name : ''
        )
      })
    })
  }

  #verifyActivityModificationInfo(activity) {
    this.expectToSeeSaveActivitySuccessfullyToast()
    this.#expectInputContainTitle(activity)
    this.#expectToSeeContentInCkEditor(activity)
    this.expectToSeeImageUploadedSuccessfully(activity)
    this.#expectDropdownSelectedLanguage(activity)
    this.#expectInputScoreLimitContainValue(activity)
    this.#expectInputEstimateCompleteTimeContainValue(activity)
    this.expectToSeeSaveButtonDisabled()
    this.expectToSeeModifiedDateAndCreatedUser()
  }

  verifyActivityInfoWithStandardTemplateInEditMode(activity) {
    this.#verifyActivityModificationInfo(activity)
    this.expectToSeeStandardTemplateDisabled()
  }

  verifyActivityInfoWithActivityTemplateInEditMode(activity) {
    this.#verifyActivityModificationInfo(activity)
    this.expectToSeeActivityTemplateDisabled()
  }

  verifyMoodleActivityWithActivityTemplate(activity) {
    const { title, description, gradeToPass } = activity
    cy.expectElementWithLabelVisible(title.new ? title.new : title, 'p')
    cy.expectElementWithLabelVisible(description, 'span')
    if (gradeToPass) cy.expectElementWithLabelVisible(gradeToPass, 'span')
    ActivityLibraryItc.itcFetchMoodleActivityUrl.set()
    cy.reload()
    ActivityLibraryItc.itcFetchMoodleActivityUrl.wait()
    cy.wait(3000)
    this.expectToSeeImageUploadedSuccessfully(activity)
    this.expectToSeeActivityTemplateDisabled()
  }
}

export default ActivityLibraryAssertions
