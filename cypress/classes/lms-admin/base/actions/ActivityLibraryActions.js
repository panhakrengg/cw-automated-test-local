import Field from '../../../constants/Field'
import { Lms } from '../../../constants/Lms'
import ActivityLibraryAssertions from '../assertions/ActivityLibraryAssertions'
import { CourseActivityTypes } from '../constant/CourseActivityTypes'
import ActivityLibraryItc from '../intercepts/ActivityLibraryItc'
import ActivityLibraryQueries from '../queries/ActivityLibraryQueries'

class ActivityLibraryActions extends ActivityLibraryQueries {
  visitActivityLibrary() {
    ActivityLibraryItc.itcSearchActivityLibrary.set()
    cy.visit(super.getActivityLibraryUrl())
    ActivityLibraryItc.itcSearchActivityLibrary.wait()
    cy.waitLoadingOverlayNotExist()
  }

  clickButtonCreateActivity() {
    cy.clickPrimaryButton('Create Activity')
  }

  selectNormalActivityTypeToCreate(activityType) {
    ActivityLibraryItc.itcCreateTempFolder.set()
    ActivityLibraryItc.itcFetchEditorConfig.set()
    super.getActivityTypeInCreateActivityPopup(activityType).click()
    ActivityLibraryItc.itcCreateTempFolder.wait()
    ActivityLibraryItc.itcFetchEditorConfig.wait()
  }

  selectMoodleActivityTypeToCreate(activityType) {
    ActivityLibraryItc.itcFetchMoodleActivityUrl.set()
    super.getActivityTypeInCreateActivityPopup(activityType).click()
    ActivityLibraryItc.itcFetchMoodleActivityUrl.wait()
  }

  #inputActivityTitle(title) {
    cy.inputByPlaceholder('Enter the title', title)
  }

  #inputDisplayText(title) {
    cy.inputByPlaceholder('Enter the display text', title)
  }

  #inputDescription(description) {
    cy.clearTextEditor()
    cy.typeInEditor(description)
  }

  #inputScoreLimit(score) {
    cy.inputByLabel('Score Limit', score)
  }

  #inputURL(url) {
    cy.inputByPlaceholder('Enter your own url', url)
  }

  #selectTemplateOption(templateOption) {
    if (templateOption === Lms.standardActivity) {
      super.getStandardActivityTemplate().click()
    } else {
      super.getActivityTemplate().click()
    }
  }

  #uploadVideo(fileVideo) {
    super.getRadioUploadVideo().siblings('.radio-checkmark').click()
    cy.uploadFile(fileVideo, ActivityLibraryItc.itcUploadTempFile)
  }

  #uploadCoverImage(coverImage, isUpdate) {
    cy.intercept('**%2Factivity_library%2Fedit**').as('itcEditActivityLibrary')
    cy.get('.text-noselect .switch > input')
      .invoke('prop', 'checked')
      .then(($check) => {
        if (!$check) cy.get('.text-noselect').toggleSwitch()
      })
    isUpdate ? cy.clickButtonByName('Change Photo') : cy.clickButtonByName('Add an Image')
    cy.changeImage(coverImage)
    cy.wait(1000)
    cy.swal2().within(($swal2) => {
      cy.clickButtonByName(Field.SAVE)
      cy.wrap($swal2).should('not.exist')
      cy.wait('@itcEditActivityLibrary')
    })
  }

  #uploadFiles(files = []) {
    files.forEach((file) => {
      cy.uploadFile(file, ActivityLibraryItc.itcUploadTempFile)
    })
  }

  #addLanguage(language) {
    cy.get('label[for="_activityLibraryPortlet_language"]')
      .parent()
      .within(($language) => {
        cy.wrap($language).getCwDropdown().click()
        cy.getElementWithLabel(language, '.language-dropdown-item-wrapper span').click()
      })
  }

  #inputEstimateCompleteTime(time) {
    super.getInputEstimateCompleteTime().clear().type(time)
  }

  removeAllUploadedFile() {
    cy.get('.cw-dropzone')
      .next()
      .within(() => {
        cy.get('a.text-black').click()
      })
  }

  #inputYoutubeURL(activity) {
    const activityLibraryAssertions = new ActivityLibraryAssertions()
    const { youtubeUrl, youtubeThumbnail } = activity
    ActivityLibraryItc.itcYoutubeApi.set()
    cy.inputByPlaceholder('Please enter your url here', youtubeUrl)
    ActivityLibraryItc.itcYoutubeApi.wait()
    activityLibraryAssertions.expectToSeeYoutubeThumbnail(youtubeThumbnail)
  }

  fillInActivityInfo(activity) {
    const {
      displayText,
      title,
      content,
      contentImage,
      description,
      descriptionImage,
      scoreLimit,
      url,
      coverImage,
      uploadVideoFile,
      uploadFiles,
      templateOption,
      youtubeUrl,
    } = activity

    if (title) this.#inputActivityTitle(title)
    if (displayText) this.#inputDisplayText(displayText)
    if (content) this.#inputDescription(content)
    if (contentImage) cy.uploadImageToRTE(contentImage.path, true)
    if (description) this.#inputDescription(description)
    if (descriptionImage) cy.uploadImageToRTE(descriptionImage.path, true)
    if (scoreLimit) this.#inputScoreLimit(scoreLimit)
    if (url) this.#inputURL(url)
    if (coverImage) this.#uploadCoverImage(coverImage.path)
    if (uploadVideoFile) this.#uploadVideo(uploadVideoFile.path[0])
    if (uploadFiles) this.#uploadFiles(uploadFiles.path)
    if (templateOption) this.#selectTemplateOption(templateOption)
    if (youtubeUrl) this.#inputYoutubeURL(activity)
  }

  #fillInUpdateActivityInfo(activity) {
    const {
      title,
      description,
      descriptionImage,
      coverImage,
      uploadFiles,
      uploadLessonPackage,
      language,
      scoreLimit,
      estimateComplete,
    } = activity
    if (title) this.#inputActivityTitle(title)
    if (description) this.#inputDescription(description)
    if (descriptionImage) cy.clickImageInImageSelector(descriptionImage.name)
    if (coverImage) this.#uploadCoverImage(coverImage.path, true)
    if (uploadFiles) {
      this.removeAllUploadedFile()
      this.#uploadFiles(uploadFiles.path)
    }
    if (uploadLessonPackage) {
      this.removeAllUploadedFile()
      cy.uploadFile(uploadLessonPackage.path[0], ActivityLibraryItc.itcUploadTempFile)
    }
    if (scoreLimit) this.#inputScoreLimit(scoreLimit)
    if (language) this.#addLanguage(language)
    if (estimateComplete) this.#inputEstimateCompleteTime(estimateComplete)
  }

  editActivity(activity, oldActivityTitle) {
    this.searchActivity(oldActivityTitle)
    this.clickThreeDotEditActivity(oldActivityTitle)
    this.#fillInUpdateActivityInfo(activity)
    this.#clickButtonSaveNormalActivity(activity)
  }

  editActivityIfExist(oldTitle, updateActivity) {
    this.searchActivity(oldTitle)
    super.getTotalActivitiesByTitle(oldTitle).then(($total) => {
      if ($total) {
        this.editActivity(updateActivity, oldTitle)
        this.clickBackLinkIcon()
      }
    })
  }

  #createNewNormalActivityByType(activity, activityType) {
    this.clickButtonCreateActivity()
    this.selectNormalActivityTypeToCreate(activityType)
    cy.wait(3000)
    this.fillInActivityInfo(activity)
    this.#clickButtonSaveNormalActivity(activity)
  }

  #clickButtonAddMoodle(activity) {
    if (activity.name) {
      activity.name.includes('Feedback')
        ? cy.intercept('**info=media_videojs_get_language').as('coreFetchNotifications')
        : cy.intercept('**info=core_coursdeformat_get_state').as('coreFetchNotifications')
      super.getButtonAddMoodleActivity().click()
      cy.wait('@coreFetchNotifications')
    } else {
      cy.intercept('**/repository/draftfiles_ajax.php?action=list').as('moodle')
      super.getButtonAddMoodleActivity().click()
      cy.wait('@moodle')
    }
  }

  #clickButtonEditMoodle(activity) {
    if (activity.name) {
      cy.intercept('**info=core_courseformat_get_state').as('coreFetchNotifications')
      super.getButtonEditMoodleActivity().click()
      cy.wait('@coreFetchNotifications')
    } else {
      cy.intercept('**/repository/draftfiles_ajax.php?action=list').as('moodle')
      super.getButtonEditMoodleActivity().click()
      cy.wait('@moodle')
    }
  }

  #addNewMoodleActivity(activity) {
    const { title, description, additionalFiles, gradeToPass } = activity
    cy.intercept('**info=core_courseformat_get_state').as('coreFetchNotifications')
    cy.get('.slide-show-modal')
      .should('be.visible')
      .within(() => {
        cy.get('#activity')
          .getIframeBody()
          .within(() => {
            cy.get('#id_name')
              .clear()
              .type(title.new ? title.new : title)
            cy.get('#id_introeditor_ifr')
              .getIframeBody()
              .within(($body) => {
                cy.wrap($body).clear().type(description)
              })
            if (additionalFiles) {
              cy.get('.fm-content-wrapper').then(($fmContainer) => {
                if (!$fmContainer.find(`.fp-file`).length) {
                  cy.get('.dndupload-message > .dndupload-arrow').click()
                  cy.get('.moodle-dialogue-lightbox')
                    .siblings('.filepicker')
                    .within(() => {
                      cy.get('input[name="repo_upload_file"]').selectFile(
                        `cypress/fixtures/${additionalFiles.path}`,
                        { force: true }
                      )
                      cy.get('.fp-upload-btn').click()
                    })
                }
              })
            }

            if (gradeToPass) {
              cy.get('a[aria-controls="id_modstandardgradecontainer"]').click()
              cy.get('#id_gradepass').clear().type(gradeToPass)
            }
            cy.get('#id_submitbutton').click()
            cy.wait('@coreFetchNotifications')
          })
        cy.wait(5000)
        cy.get('#activity')
          .getIframeBody()
          .within(() => {
            cy.get('#page-wrapper')
              .should('be.visible')
              .within(() => {
                cy.get('.singlebutton, #intro, .nav-tabs').should('be.visible')
              })
          })
      })
      .then(() => {
        cy.get('.close-slide-show.cursor-pointer').click()
      })
  }

  #createNewMoodleActivityByType(activity, activityType) {
    this.clickButtonCreateActivity()
    this.selectMoodleActivityTypeToCreate(activityType)
    this.#clickButtonAddMoodle(activity)
    this.#addNewMoodleActivity(activity)
    if (activity.coverImage) this.#uploadCoverImage(activity.coverImage.path)
    this.#clickButtonSaveMoodleActivity()
  }

  createNewFileActivity(activity) {
    this.#createNewNormalActivityByType(activity, CourseActivityTypes.FILE)
  }

  createNewHyperLinkActivity(activity) {
    this.#createNewNormalActivityByType(activity, CourseActivityTypes.HYPERLINK)
  }

  createNewELearningActivity(activity) {
    this.#createNewNormalActivityByType(activity, CourseActivityTypes.INTERACTIVE_ELEARNING)
  }

  createNewVideoActivity(activity) {
    this.#createNewNormalActivityByType(activity, CourseActivityTypes.VIDEO)
  }

  createNewRichTextActivity(activity) {
    this.#createNewNormalActivityByType(activity, CourseActivityTypes.RICH_TEXT)
  }

  createNewLearningGoalActivity(activity) {
    this.#createNewNormalActivityByType(activity, CourseActivityTypes.LEARNING_GOAL)
  }

  createNewQuizActivity(activity) {
    this.#createNewMoodleActivityByType(activity, CourseActivityTypes.QUIZ)
  }

  createNewAssignmentActivity(activity) {
    this.#createNewMoodleActivityByType(activity, CourseActivityTypes.ASSIGNMENT)
  }

  createNewFeedbackActivity(activity) {
    this.#createNewMoodleActivityByType(activity, CourseActivityTypes.FEEDBACK)
  }

  createNewActivityIfNotExist(title, callbackCreateFunction = () => {}) {
    this.searchActivity(title)
    super.getTotalActivitiesByTitle(title).then(($total) => {
      if (!$total) {
        callbackCreateFunction()
      }
    })
  }

  modifyCourseActivityInActivityLibrary(activity) {
    this.fillInActivityInfo(activity)
    this.#clickButtonSaveNormalActivity(activity)
  }

  searchActivity(title) {
    cy.wait(3000)
    ActivityLibraryItc.itcSearchActivityLibrary.set()
    super.getInputSearchActivity().clear().type(`"${title}" {enter}`)
    ActivityLibraryItc.itcSearchActivityLibrary.wait()
    cy.wait(1000)
  }

  deleteActivityFromLibraryIfFound(title) {
    this.searchActivity(title)
    cy.get('.activity-library-wrapper').then(($activityWrapper) => {
      const totalActivities = $activityWrapper.find(`a:contains(${title})`).length
      if (totalActivities) {
        this.clickThreeDotDeleteActivity(title)
      }
    })
  }

  #clickButtonSaveNormalActivity(activity) {
    if (activity.youtubeUrl) ActivityLibraryItc.itcYoutubeApi.set()
    ActivityLibraryItc.itcModifyActivityLibrary.set()
    ActivityLibraryItc.itcFetchEditorConfig.set()
    cy.clickPrimaryButton(Field.SAVE)
    cy.expectOverlayIsVisible()
    ActivityLibraryItc.itcModifyActivityLibrary.wait()
    ActivityLibraryItc.itcFetchEditorConfig.wait()
    cy.waitLoadingOverlayNotExist()
    if (activity.youtubeUrl) ActivityLibraryItc.itcYoutubeApi.wait()
  }

  #clickButtonSaveMoodleActivity() {
    ActivityLibraryItc.itcModifyActivityLibrary.set()
    cy.clickPrimaryButton(Field.SAVE)
    cy.expectOverlayIsVisible()
    ActivityLibraryItc.itcModifyActivityLibrary.wait()
    cy.waitLoadingOverlayNotExist()
  }

  clickBackLinkIcon() {
    ActivityLibraryItc.itcCheckCatalogMoodle.set()
    cy.clickBackLink()
    ActivityLibraryItc.itcCheckCatalogMoodle.wait()
    super.getActivityWrapper().should('be.visible')
  }

  #clickDropdownFilterActivity(option) {
    ActivityLibraryItc.itcSearchActivityLibrary.set()
    cy.get('.btn-group-filter-course').within(($filter) => {
      cy.wrap($filter).get('.dropdown-button').click()
      cy.wrap($filter).clickDropdownName(option)
    })
    ActivityLibraryItc.itcSearchActivityLibrary.wait()
  }

  clickDropdownFilterCommunityLibraryAndSearchActivity(title) {
    this.#clickDropdownFilterActivity(Field.COMMUNITY_LIBRARY)
    this.searchActivity(title)
  }

  clickDropdownFilterArchivedAndSearchActivity(title) {
    this.#clickDropdownFilterActivity(Field.ARCHIVED)
    this.searchActivity(title)
  }

  clickDropdownFilterActivityLibraryAndSearchActivity(title) {
    this.#clickDropdownFilterActivity(Lms.activityLibrary)
    this.searchActivity(title)
  }

  #clickThreeDotActivityByItemName(title, threeDotItem) {
    super
      .getActivityCard(title)
      .first()
      .within(($activity) => {
        cy.wrap($activity).clickDropdownItem(threeDotItem)
      })
  }

  clickThreeDotDeleteActivity(title) {
    super.getActivityCard(title).each(() => {
      this.#clickThreeDotActivityByItemName(title, Field.DELETE)
      ActivityLibraryItc.itcDeleteActivityLibrary.set()
      cy.clickConfirmPopUp(Field.YES_DELETE)
      ActivityLibraryItc.itcDeleteActivityLibrary.wait()
    })
  }

  clickThreeDotArchiveActivity(title) {
    ActivityLibraryItc.itcArchiveActivity.set()
    this.#clickThreeDotActivityByItemName(title, Field.ARCHIVE)
    cy.clickConfirmPopUp(Field.YES_ARCHIVE)
    ActivityLibraryItc.itcArchiveActivity.wait()
  }

  clickThreeDotUnArchiveActivity(title) {
    ActivityLibraryItc.itcArchiveActivity.set()
    this.#clickThreeDotActivityByItemName(title, Field.UN_ARCHIVE)
    ActivityLibraryItc.itcArchiveActivity.wait()
  }

  clickThreeDotUnArchiveActivityIfExist(title) {
    super.getTotalActivitiesByTitle(title).then(($total) => {
      if ($total) {
        this.clickThreeDotUnArchiveActivity(title)
      }
    })
  }

  clickThreeDotArchiveActivityIfExist(title) {
    super.getTotalActivitiesByTitle(title).then(($total) => {
      if ($total) {
        this.clickThreeDotArchiveActivity(title)
      }
    })
  }

  clickThreeDotEditActivity(title) {
    ActivityLibraryItc.itcFetchActivityLibraryDetails.set()
    this.#clickThreeDotActivityByItemName(title, Field.EDIT)
    ActivityLibraryItc.itcFetchActivityLibraryDetails.wait()
  }

  editMoodleActivity(oldTitle, updateActivity) {
    this.searchActivity(oldTitle)
    this.clickThreeDotEditActivity(oldTitle)
    this.#clickButtonEditMoodle(updateActivity)
    this.#addNewMoodleActivity(updateActivity)
    if (updateActivity.coverImage) this.#uploadCoverImage(updateActivity.coverImage.path, true)
    this.#clickButtonSaveMoodleActivity()
  }

  editMoodleActivityIfExist(oldTitle, updateActivity) {
    this.searchActivity(oldTitle)
    super.getTotalActivitiesByTitle(oldTitle).then(($total) => {
      if ($total) {
        this.editMoodleActivity(oldTitle, updateActivity)
        this.clickBackLinkIcon()
      }
    })
  }
}

export default ActivityLibraryActions
