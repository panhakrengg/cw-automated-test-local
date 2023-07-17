import InterceptReq from '../../../base/InterceptReq'
import Field from '../../../constants/Field'
import { CourseActivityTypes } from '../../../lms-admin/base/constant/CourseActivityTypes'
import ManageCourse from '../course/ManageCourse'
import LmsAdminStub from '../setup-data/LmsAdminStub'

class SetUpCourseActivity extends LmsAdminStub {
  activityInfo
  manageCourse = new ManageCourse()

  itcFetchCourseActivities = new InterceptReq(
    '/manage_courses/course_activities/fetch',
    'fetchCourseActivities'
  )
  itcFetchSequential = new InterceptReq('/course_activities/sequential/fetch', 'FetchSequential')
  itcFetchEditorConfig = new InterceptReq(
    '/course/activity/editor_config/fetch',
    'FetchEditorConfig'
  )
  itcSearchActivityLibrary = new InterceptReq('/activity_library/search', 'SearchActivityLibrary')
  itcFetchMoodleActivity = new InterceptReq(
    '/activity_library/moodle_activity_url/fetch',
    'FetchMoodleActivity'
  )
  itcModifyCourseActivity = new InterceptReq(
    '/manage_courses/course_activity/modify',
    'ModifyCourseActivity'
  )
  itcUploadTempFile = new InterceptReq('/manage_courses/temp_file/upload', 'UploadTempFile')

  getCoPCourseAdmin() {
    return `${this.trainingCoPObj.url}/admin/admin#_copMemberManagementPortlet_option=manage-courses`
  }

  clickInstanceByName() {
    this.itcFetchCourseActivities.set()
    cy.getElementWithLabel(this.instanceName, 'span').click()
    this.itcFetchCourseActivities.wait()
    cy.waitLoadingOverlayNotExist()
  }

  clickCourseActivitiesTab() {
    this.itcFetchSequential.set()

    cy.url().then((url) => {
      const courseActivitiesUrl = this.isCoP
        ? `${url}#_copMemberManagementPortlet_tab=activities`
        : `${url}#_learningAdminManageCoursesPortlet_tab=activities`
      cy.visit(courseActivitiesUrl)
    })

    this.itcFetchCourseActivities.wait()
    this.itcFetchSequential.wait()
  }

  clickAddLearningActivitiesButton() {
    cy.wait(2000)
    cy.getElementWithLabel('Add Learning Activities', 'a.btn-primary').first().click()
  }

  visitThenClickInstance() {
    this.manageCourse.visitManageCourse()

    cy.get('.cw-learning-dropdown__wrapper').first().clickCwSplitDropdownToggle(Field.ALL)
    this.manageCourse.waitItcFetchManageCourse()

    cy.inputByPlaceholder('Search courses', `"${this.instanceName}"{enter}`)
    this.manageCourse.waitItcFetchManageCourse()

    this.clickInstanceByName()
    this.clickCourseActivitiesTab()
  }

  selectActivityTypeInPopup(activityType) {
    const type = activityType ? activityType : this.activityInfo.type
    this.itcFetchEditorConfig.set()
    this.itcFetchMoodleActivity.set()

    cy.swal2().within(() => cy.getElementWithLabel(type, 'span').click())
    if (type == 'Assignment' || type == 'Quiz' || type == 'Feedback')
      this.itcFetchMoodleActivity.wait()
    else if (type == CourseActivityTypes.PHYSICAL_CLASS) cy.wait(200)
    else this.itcFetchEditorConfig.wait()
  }

  searchThenSelectActivityFromLibrary() {
    const { from, title } = this.activityInfo

    this.itcSearchActivityLibrary.wait()
    cy.getPopup().within(($popup) => {
      if (from) {
        cy.wrap($popup).clickCwSplitDropdownToggle(`${from} library`)
        this.itcSearchActivityLibrary.wait()
      }

      cy.inputByPlaceholder('Search', `"${title}"`)
      this.itcSearchActivityLibrary.wait()

      cy.clickLinkByName(title)
      cy.clickButtonByName('Add')
    })
    this.itcFetchEditorConfig.wait()
  }
  clickSaveActivity() {
    cy.wait(1000)
    cy.clickButtonByName(Field.SAVE)
    cy.waitLoadingOverlayNotExist(30000)
    if (
      this.activityInfo.type == 'Assignment' ||
      this.activityInfo.type == 'Quiz' ||
      this.activityInfo.type == 'Feedback'
    ) {
      this.itcModifyCourseActivity.wait()
    } else {
      this.itcFetchEditorConfig.wait()
    }
  }

  clickSaveToCreateNewActivity() {
    this.itcModifyCourseActivity.set()
    cy.clickButtonByName(Field.SAVE)
    this.itcModifyCourseActivity.wait()
  }

  addActivityToInstance() {
    this.itcFetchEditorConfig.set()
    this.itcSearchActivityLibrary.set()
    this.itcFetchMoodleActivity.set()
    this.itcModifyCourseActivity.set()

    cy.cardMainContent()
      .invoke('text')
      .then((text) => {
        if (!text.includes(this.activityInfo.title)) {
          this.clickAddLearningActivitiesButton()
          this.selectActivityTypeInPopup()
          cy.clickLinkByName('choose from the activity library.')
          this.searchThenSelectActivityFromLibrary()
          this.clickSaveActivity()
        }
      })
  }

  searchInstanceThenGoToCourseActivities(instanceName) {
    this.instanceName = instanceName ? instanceName : this.instanceName
    cy.get('.cw-learning-dropdown__wrapper').first().clickCwSplitDropdownToggle(Field.ALL)
    this.manageCourse.waitItcFetchManageCourse()

    cy.inputByPlaceholder('Search courses', `"${this.instanceName}"{enter}`)
    this.manageCourse.waitItcFetchManageCourse()

    this.clickInstanceByName()
    this.clickCourseActivitiesTab()
  }

  fillElearning() {
    cy.inputByPlaceholder('Enter the title', this.activityInfo.title)
    cy.typeInEditor(this.activityInfo.description)
    cy.uploadFile(this.activityInfo.uploadLessonPackage, this.itcUploadTempFile)
    cy.inputFormGroup('Score Limit', this.activityInfo.scoreLimit)
  }

  addActivityFromInstanceToLibrary() {
    this.itcFetchEditorConfig.set()
    this.itcSearchActivityLibrary.set()
    this.itcFetchMoodleActivity.set()
    this.itcModifyCourseActivity.set()

    cy.cardMainContent()
      .invoke('text')
      .then((text) => {
        if (!text.includes(this.activityInfo.title)) {
          this.clickAddLearningActivitiesButton()
          this.selectActivityTypeInPopup()
          this.fillElearning()
          this.clickSaveToCreateNewActivity()
        }
      })
  }
  addActivityFromLibrary(activityYaml, instanceObj) {
    this.activityInfo = instanceObj
      ? instanceObj.activities[activityYaml]
      : this.instanceObj.activities[activityYaml]
    instanceObj = instanceObj ? instanceObj : this.instanceObj

    this.searchInstanceThenGoToCourseActivities(instanceObj.title)
    this.addActivityToInstance()
  }

  addActivityFromLibraryByStandingOnInstance(activity) {
    this.activityInfo = activity

    this.itcFetchSequential.set()
    this.itcFetchCourseActivities.set()
    cy.clickLinkByName('Course Activities')
    this.itcFetchCourseActivities.wait()
    this.itcFetchSequential.wait()

    this.addActivityToInstance()
  }

  addActivityToLibrary(activityYaml) {
    this.activityInfo = this.instanceObj.activities[activityYaml]

    this.searchInstanceThenGoToCourseActivities()
    this.addActivityFromInstanceToLibrary()
  }

  #clickAddMoodle() {
    cy.intercept('**info=core_fetch_notifications').as('coreFetchNotifications')
    cy.clickButtonByName(Field.ADD)
    cy.wait('@coreFetchNotifications')
  }

  #fillMoodleInfo(activity) {
    const { title, description, additionalFiles, gradeToPass } = activity
    cy.intercept('**info=core_fetch_notifications').as('coreFetchNotifications')
    cy.get('.slide-show-modal')
      .should('be.visible')
      .within(() => {
        cy.get('#activity')
          .getIframeBody()
          .within(() => {
            cy.get('#id_name').clear().type(title)
            if (description) {
              cy.get('#id_introeditor_ifr')
                .getIframeBody()
                .within(($body) => {
                  cy.wrap($body).clear().type(description)
                })
            }
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
              cy.get('a[aria-controls="id_modstandardgrade"]').click()
              cy.get('#id_gradepass').clear().type(gradeToPass)
            }
            cy.get('#id_submitbutton').click()
            cy.wait('@coreFetchNotifications')
          })
        cy.wait(5000)
        cy.get('#activity')
          .getIframeBody()
          .within(() => {
            cy.get('#page')
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

  #fillScheduledDate(scheduledDate) {
    for (const [key, value] of Object.entries(scheduledDate)) {
      cy.inputByPlaceholder('Set schedule date', value.date)
      cy.getElementWithLabel('From', '.col-sm-4').find('input').type(value.from)
      cy.getElementWithLabel('To', '.col-sm-4').find('input').type(value.to, { force: true })
    }
  }

  #fillPhysicalClass(physical) {
    const {
      title,
      description,
      address,
      city,
      country,
      scheduledDate,
      childrenProgramAvailable,
      optionalActivity,
    } = physical

    cy.getElementWithLabel(CourseActivityTypes.PHYSICAL_CLASS, '.item-re-order').within(() => {
      cy.inputFormGroup('Title', title)
      if (description) cy.inputTextAreaFormGroup('Description', description)
      cy.inputFormGroup('Address', address)
      cy.inputFormGroup('City', city)
      cy.inputFormGroup('Country', country)
      if (childrenProgramAvailable)
        cy.getElementWithLabel('Children Program Available', 'label').within(() =>
          cy.getCheckbox().check()
        )
      if (optionalActivity)
        cy.getElementWithLabel('Optional activity', 'label')
          .parent()
          .within(() => cy.getCheckbox().check())
      this.#fillScheduledDate(scheduledDate)
    })
  }

  #addFacilitatorsToVirtualClass(facilitators) {
    Itc.fetchUsersCourseInstance.set()
    cy.clickLinkByName('Add Facilitator')
    Itc.fetchUsersCourseInstance.wait()
    cy.getPopup().within(() => {
      facilitators.forEach((faci) => {
        cy.inputByPlaceholder('Search', faci)
        Itc.fetchUsersCourseInstance.wait()
        cy.waitIconLoadingNotExist()

        cy.getCheckbox().check()
      })
      cy.clickButtonByName(Field.ADD)
      cy.wait(100)
    })
  }

  #addZoomToVirtualClass(zoomName) {
    Itc.zoomAccountCourseActivities.set()
    cy.clickLinkByName('Add Zoom Integration')
    Itc.zoomAccountCourseActivities.wait()
    cy.swal2().within(() => {
      cy.getElementWithLabel(zoomName, '.card').click()
    })
    cy.clickButtonByName('use')
    cy.wait(100)
  }

  #fillVirtualClass(virtual) {
    const { title, description, facilitators, zoomName, scheduledDate, optionalActivity } = virtual

    this.#addZoomToVirtualClass(zoomName)
    cy.getElementWithLabel(CourseActivityTypes.VIRTUAL_CLASS, '.item-re-order').within(() => {
      cy.inputFormGroup('Title', title)
      this.#addFacilitatorsToVirtualClass(facilitators)
      this.#fillScheduledDate(scheduledDate)
      if (description) cy.typeInEditor(description)
      if (optionalActivity)
        cy.getElementWithLabel('Optional activity', 'label')
          .parent()
          .within(() => cy.getCheckbox().check())
    })
  }

  createPhysicalActivity(physical) {
    cy.cardMainContent()
      .invoke('text')
      .then((text) => {
        if (!text.includes(physical.title)) {
          this.clickAddLearningActivitiesButton()
          this.selectActivityTypeInPopup(CourseActivityTypes.PHYSICAL_CLASS)
          this.#fillPhysicalClass(physical)
          this.clickSaveToCreateNewActivity()
        }
      })
  }

  createVirtualActivity(virtual) {
    this.#foundActivity().then((activityCreated) => {
      if (!activityCreated) {
        this.clickAddLearningActivitiesButton()
        this.selectActivityTypeInPopup(CourseActivityTypes.VIRTUAL_CLASS)
        this.#fillVirtualClass(virtual)
        this.clickSaveToCreateNewActivity()
      }
    })
  }

  #foundActivity(title) {
    cy.cardMainContent()
      .invoke('text')
      .then((text) => {
        cy.wrap(text.includes(title)).as('found')
      })
    return cy.get('@found')
  }

  #createMoodleActivity(moodle, type) {
    cy.cardMainContent()
      .invoke('text')
      .then((text) => {
        if (!text.includes(moodle.title)) {
          this.clickAddLearningActivitiesButton()
          this.selectActivityTypeInPopup(type)
          this.#clickAddMoodle()
          this.#fillMoodleInfo(moodle)
          this.clickSaveToCreateNewActivity()
        }
      })
  }

  createFeedbackActivity(feedback) {
    this.#createMoodleActivity(feedback, CourseActivityTypes.FEEDBACK)
  }

  createQuizActivity(quiz) {
    this.#createMoodleActivity(quiz, CourseActivityTypes.QUIZ)
  }
}

class Itc {
  static fetchUsersCourseInstance = new InterceptReq(
    '/course_instance/fetch_users',
    'FetchUsersCourseInstance'
  )
  static zoomAccountCourseActivities = new InterceptReq(
    '/manage_courses/course_activities/zoom_accounts',
    'ZoomAccountCourseActivities'
  )
}
export default SetUpCourseActivity
