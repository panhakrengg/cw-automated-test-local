import InterceptAction from '../../../base/InterceptAction'
import InterceptReq from '../../../base/InterceptReq'
import Field from '../../../constants/Field'
import BaseCourseActivity from '../../base-manage-course/CourseActivity'

class CourseActivity extends BaseCourseActivity {
  constructor() {
    super()
  }

  _itcSkip = new InterceptAction('/course_activity/skip', 'SkipActivities')

  _itcMarkActivityAsCompleted = new InterceptReq(
    '/course_activity/mark_as_completed',
    'MarkActivityAsCompleted'
  )

  _itcFetchCourseActivities = new InterceptReq(
    '/course_catalog/course/activities',
    'FetchCourseActivities'
  )

  _expectToSeeBadgeUpdateForActivity() {
    const defaultExpectedBadgeNumber = 5
    cy.get('#_courseDetailPortlet_activityAccordion').within(() => {
      cy.get('span.badge.badge-pill').should('have.length', defaultExpectedBadgeNumber)
    })
  }

  expandActivity(activityName) {
    this._initActivityItem(activityName)
    this._clickToExpandActivity(activityName)
  }

  completeLearningGoal(activity) {
    this.expandActivity(activity.title)
    cy.get('@activityBody').then(($body) => {
      cy.wrap($body).get('a.btn-primary:contains("Accept Goal")').click()
      cy.getElementByLabel('Status').select(Field.COMPLETED)
      cy.intercept('**coaching-mentoring%2Fedit-goal**').as('editGoal')
      cy.get('#_coachingMentoringPortlet_save').click()
      cy.wait('@editGoal')
      cy.get('#_coachingMentoringPortlet_TabsBack').click()
    })
  }

  completeFile(activity) {
    this.expandActivity(activity.title)
    cy.get('@activityBody').then(($body) => {
      this._itcMarkActivityAsCompleted.set()
      cy.wrap($body).get('button:contains("View File")').click()
      cy.get('div.preview-popup-wrapper', { timeout: 15000 }).find('span.close-slide-show').click()
      this._itcMarkActivityAsCompleted.wait()
    })
  }

  completeHyperlink(activity) {
    this.expandActivity(activity.title)
    cy.get('@activityBody').within(($body) => {
      cy.wrap($body).get('a.btn-primary:contains("Enter Link")').click()
      cy.wrap($body).swal2().swal2Confirm(Field.CONTINUE).click()
    })
  }

  expectActivityCompleted(activity) {
    cy.get(`div.item-re-order > .border-bottom > .accordion__header:contains("${activity.title}")`)
      .find('span > svg.draggable-icon')
      .should('be.visible')
  }

  expectCompletedActivityIncreasedByOne(oldCompletedCount) {
    this.getCompletedActivityCount().then((newCompletedCount) => {
      expect(newCompletedCount).to.equal(`${Number(oldCompletedCount) + 1}`)
    })
  }

  getCompletedActivityText() {
    return cy.get('div.learning-progress > h5').invoke('text')
  }

  getCompletedActivityCount() {
    this.getCompletedActivityText().then(($text) => {
      cy.wrap($text.match(/\d+/)[0]).as('completedActivityCount')
    })
    return cy.get('@completedActivityCount')
  }

  skipActivity(activity) {
    this.expandActivity(activity.title)
    cy.get('@activityBody').within(() => {
      this._itcSkip.set()
      cy.get('span.slider').click()
      this._itcSkip.wait()
    })
  }

  expectSkipActivityEnable(parent, enabled = true) {
    cy.wrap(parent)
      .get('span.slider')
      .should(enabled ? 'not.contain.class' : 'contain.class', 'disabled')
  }

  expectHyperlinkEnable(activity, enabled = true) {
    this.expandActivity(activity.title)
    cy.get('@activityBody').within(($body) => {
      cy.wrap($body)
        .get('a.btn-primary:contains("Enter Link")')
        .should(enabled ? 'not.contain.class' : 'contain.class', 'disabled')
      if (activity.optional) {
        this.expectSkipActivityEnable($body, enabled)
      }
    })
  }

  expectVirtualClassEnable(activity, enabled = true) {
    this.expandActivity(activity.title)
    cy.get('@activityBody').within(($body) => {
      cy.wrap($body)
        .get('table.course-instance-list')
        .then(($instanceTable) => {
          if ($instanceTable.find('tbody > tr').length) {
            cy.wrap($instanceTable)
              .find('tbody > tr')
              .each(($row) => {
                cy.wrap($row)
                  .find('button:contains("Enter Class")')
                  .should(enabled ? 'be.enabled' : 'be.disabled')
                  .next()
                  .should(enabled ? 'not.contain.class' : 'contain.class', 'disabled')
              })
          }
        })
      if (activity.optional) {
        this.expectSkipActivityEnable($body, enabled)
      }
    })
  }

  expectPhysicalClassEnable(activity, enabled = true) {
    this.expandActivity(activity.title)
    cy.get('@activityBody').within(($body) => {
      if (activity.optional) {
        this.expectSkipActivityEnable($body, enabled)
      }
    })
  }
}
export default CourseActivity
