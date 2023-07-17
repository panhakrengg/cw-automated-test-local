import YamlHelper from '../../utilities/YamlHelper'
import CourseActivity from './CourseActivity'
import Field from '../../constants/Field'

class ActivityUI extends CourseActivity {
  #activityOptional = false
  constructor(courseInstance) {
    super()
    this.courseInstance = courseInstance
    this.#getActivitySample()
  }
  #getCourseActivity() {
    return this.courseInstance.activities
  }

  #getActivitySample() {
    const data = new YamlHelper('/lms/course-activities/sample-activities')
    data.read().then(({ SampleActivities }) => {
      this._activities = SampleActivities
    })
  }
  _expectNoSkipToggle() {
    cy.get('@activityItem').within(() => cy.get('.cw-toggle-button').should('not.be.exist'))
  }
  _expectHasSkipToggle() {
    cy.get('@activityItem').within(() => cy.cwToggleButton('Skip'))
  }
  #getChildrenProgram(available) {
    if (available) return 'Available'
    else return 'Unavailable'
  }
  #expectDueDate(dueDate) {
    cy.expectElementWithLabelVisible('Due Date', '.font-weight-bold')
    cy.expectElementWithLabelVisible(
      `${dueDate.dateFormat} @ ${dueDate.displayTime}`,
      '.text-decoration-underline'
    )
  }
  #expectScheduleTable(scheduledDate, includeButton = false) {
    const firstSchedule = scheduledDate.firstDay
    const secondSchedule = scheduledDate.secondDay
    cy.get('@activityBody').within(($body) => {
      cy.wrap($body).getTableHeader('Date').should('be.exist')
      cy.wrap($body).getTableHeader('Start Time').should('be.exist')
      cy.wrap($body).getTableHeader('End Time').should('be.exist')
      cy.expectValueByRowColumnIndex('0', '0', firstSchedule.dateFormat)
      cy.expectValueByRowColumnIndex('0', '1', firstSchedule.startTime)
      cy.expectValueByRowColumnIndex('0', '2', firstSchedule.endTime)
      cy.expectValueByRowColumnIndex('1', '0', secondSchedule.dateFormat)
      cy.expectValueByRowColumnIndex('1', '1', secondSchedule.startTime)
      cy.expectValueByRowColumnIndex('1', '2', secondSchedule.endTime)
      if (includeButton) {
        cy.getCellByRowColumnIndex('0', '3').within(() => {
          cy.expectButtonWithLabelAndEnabled('Enter Class')
          cy.hasLinkNoHref('View Recording')
        })
        cy.getCellByRowColumnIndex('1', '3').within(() => {
          cy.expectButtonWithLabelAndEnabled('Enter Class')
          cy.hasLinkNoHref('View Recording')
        })
      }
    })
  }
  #expectOptionalActivity(optional = this.#activityOptional) {
    optional ? this._expectHasSkipToggle() : this._expectNoSkipToggle()
  }
  #mainUI(activityKey, optional = this.#activityOptional) {
    // check description, due date, button
    const activity = this._activities[`${activityKey}`]
    const title = activity.title

    this._initActivityItem(title)
    this._clickToExpandActivity()

    cy.get('@activityBody').within(() => {
      this.#expectOptionalActivity(optional)
      cy.expectElementWithLabelVisible(activity.description)
      this.#expectDueDate(activity)
      activity.buttonLinkText
        ? cy.hasLink(activity.buttonLinkText, '')
        : cy.expectButtonWithLabelAndEnabled(activity.buttonText)
    })
  }
  #physicalClassUI(activityKey, optional = this.#activityOptional) {
    const physical = this._activities[`${activityKey}`]

    this._initActivityItem(physical.title)
    this._clickToExpandActivity()

    cy.get('@activityItem').within(() => {
      this.#expectOptionalActivity(optional)

      cy.get('@activityBody').within(() => {
        cy.expectElementWithLabelVisible(physical.description, 'p.cec-mb-4')
        cy.expectElementWithLabelVisible(Field.LOCATION, 'span')
        cy.expectElementWithLabelVisible(
          `${physical.address}, ${physical.city}, ${physical.country}`,
          'p'
        )
        cy.expectElementWithLabelVisible(`Children's Program`, 'span')
        cy.expectElementWithLabelVisible(
          this.#getChildrenProgram(physical.childrenProgramAvailable),
          'p'
        )
      })
      this.#expectScheduleTable(physical.scheduledDate)
      this._clickToExpandActivity()
    })
  }
  #virtualClassUI(activityKey, userName, optional = this.#activityOptional) {
    const virtual = this._activities[`${activityKey}`]

    this._initActivityItem(virtual.title)
    this._clickToExpandActivity()

    cy.get('@activityBody').within(() => {
      this.#expectOptionalActivity(optional)
      cy.expectElementWithLabelVisible(virtual.description, 'div.cec-mb-1')
      cy.expectElementWithLabelVisible('Facilitators', 'label')

      cy.get('.cec-user-profile')
        .should('have.attr', 'data-url')
        .should('include', '/image/user_portrait')
      cy.expectElementWithLabelVisible(userName, '.font-weight-bold')
      cy.expectElementWithLabelVisible('Program:', 'p')
      cy.expectElementWithLabelVisible('Zoom', 'p')
    })
    this.#expectScheduleTable(virtual.scheduledDate, true)

    this._clickToExpandActivity()
  }
  #fileImageUI(activityKey, optional = this.#activityOptional) {
    const file = this._activities[`${activityKey}`]

    this.#mainUI(activityKey, optional)

    cy.get('@activityBody').within(() => {
      this._clickViewFileDropdown()
      cy.getDropdownList()
        .should('have.length', 2)
        .should('contains.text', `Download (${file.size})`)
        .should('contains.text', 'View File')
    })
    this._clickToExpandActivity()
  }
  #fileDocUI(activityKey, optional = this.#activityOptional) {
    const file = this._activities[`${activityKey}`]

    this._initActivityItem(file.title)
    this._clickToExpandActivity()

    cy.get('@activityBody').within(() => {
      this.#expectOptionalActivity(optional)
      cy.expectElementWithLabelVisible(file.description, 'div.cec-mb-1')
      this.#expectDueDate(file)
      cy.hasLink(`Download (${file.size})`, `${file.fileAsLink}`)
      cy.expectButtonWithLabelAndNotExist('View File')
    })

    this._clickToExpandActivity()
  }
  #videoUI(activityKey, optional = this.#activityOptional) {
    this.#mainUI(activityKey, optional)
    this._clickToExpandActivity()
  }
  #hyperlinkUI(activityKey, optional = this.#activityOptional) {
    const hyperlink = this._activities[`${activityKey}`]

    this._initActivityItem(hyperlink.title)
    this._clickToExpandActivity()

    cy.get('@activityBody').within(() => {
      this.#expectOptionalActivity(optional)
      cy.expectElementWithLabelVisible(hyperlink.description, 'div.cec-mb-1')
      cy.hasLink('Enter Link')
    })

    this._clickToExpandActivity()
  }
  #seeMoreLess() {
    cy.noLink('See less')
    cy.clickLinkByName('See more')
    cy.noLink('See more')
    cy.clickLinkByName('See less')
    cy.hasLink('See more')
    cy.noLink('See less')
  }
  #learningGoalUI(activityKey, optional = this.#activityOptional) {
    const learningGoal = this._activities[`${activityKey}`]

    this._initActivityItem(learningGoal.title)
    this._clickToExpandActivity()

    cy.get('@activityBody').within(() => {
      this.#expectOptionalActivity(optional)
      cy.expectElementWithLabelVisible(learningGoal.description, 'div.cec-mb-1')
      cy.get('.cec-mb-1 img')
        .should('have.attr', 'src')
        .should('include', 'Against')
      this.#seeMoreLess()
      cy.hasLink(learningGoal.attachment)
      cy.hasLink(learningGoal.buttonLinkText, 'learning_goal%2Faccept_or_open')
    })

    this._clickToExpandActivity()
  }
  #interactiveLearningUI(activityKey, optional = this.#activityOptional) {
    this.#mainUI(activityKey, optional)
    this._clickToExpandActivity()
  }
  #richTextUI(activityKey, optional = this.#activityOptional) {
    const richText = this._activities[`${activityKey}`]

    this._initActivityItem(richText.title)
    this._clickToExpandActivity()

    cy.get('@activityBody').within(() => {
      this.#expectOptionalActivity(optional)
      cy.get('div p').should('not.exist')
      this.#expectDueDate(richText)
      cy.expectButtonWithLabelAndEnabled('Read Text')
    })

    this._clickToExpandActivity()
  }
  #quizUI(activityKey, optional = this.#activityOptional) {
    const quiz = this._activities[`${activityKey}`]

    this.#mainUI(activityKey, optional)

    cy.get('@activityBody').within(() => {
      cy.expectElementWithLabelVisible('To Pass', 'b')
      cy.expectElementWithLabelVisible(`${quiz.gradeToPass}.00  or higher`, 'span')
    })

    this._clickToExpandActivity()
  }
  #assignmentUI(activityKey, optional = this.#activityOptional) {
    this.#mainUI(activityKey, optional)
    this._clickToExpandActivity()
  }
  #feedbackUI(activityKey, optional = this.#activityOptional) {
    this.#mainUI(activityKey, optional)
    this._clickToExpandActivity()
  }
  _expectActivitiesTitle() {
    const activities = this.#getCourseActivity()
    cy.cardMainContent()
      .get('div#_courseDetailPortlet_activityAccordion')
      .within(() => {
        for (const [key] of Object.entries(activities)) {
          if (key == 'total') continue
          cy.get('div.item-re-order').should('contain.text', activities[`${key}`].title)
        }
      })
  }
  #expectAllActivities(facilitatorUser) {
    this.#physicalClassUI('physicalTrainAtSchool')
    this.#fileImageUI('fileImage')
    this.#videoUI('videoYouTube')
    this.#hyperlinkUI('hyperlink')
    this.#learningGoalUI('learningGoal')
    this.#videoUI('videoVimeo')
    this.#interactiveLearningUI('eLearningCommunity')
    this.#fileDocUI('fileDoc')
    this.#videoUI('videoFile')
    this.#richTextUI('richText')
    this.#virtualClassUI('virtualTalking', facilitatorUser)
    this.#quizUI('quizDailyClass')
    this.#assignmentUI('assignmentMidterm')
    this.#feedbackUI('feedbackClassmate')
  }
  _expectAllNotOptionalActivitiesUI(facilitatorUser) {
    this.#activityOptional = false
    this.#expectAllActivities(facilitatorUser)
  }
  _expectAllOptionalActivitiesUI(facilitatorUser) {
    this.#activityOptional = true
    this.#expectAllActivities(facilitatorUser)
  }
}

export default ActivityUI
