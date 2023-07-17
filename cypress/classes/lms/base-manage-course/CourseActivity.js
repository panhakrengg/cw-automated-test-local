import InterceptReq from '../../base/InterceptReq'

class CourseActivity {
  #itcReorderCourseActivity = new InterceptReq(
    '/manage_courses/course_activity/order',
    'ReorderCourseActivity'
  )

  constructor(courseInstance) {
    this.courseInstance = courseInstance
  }

  #getCourseActivityNumber() {
    return this.courseInstance.activities.total
  }

  _clickViewFileDropdown() {
    cy.get(`button:contains('View File')`).parent('.btn-group').getDropdownToggle().click()
  }

  _expectToSeeCourseActivitySection() {
    this.#expectToSeeCourseActivityLabel()
    this.#expectToSeeCorrectNumberOfTotalCourseActivity()
  }

  #expectToSeeCourseActivityLabel() {
    cy.expectElementWithLabelVisible('Course Activities', '.cec-pb-4')
  }

  #expectToSeeCorrectNumberOfTotalCourseActivity() {
    cy.get('div#_courseDetailPortlet_activityAccordion').within(() => {
      cy.get('div.item-re-order').should('have.length.gte', this.#getCourseActivityNumber())
    })
  }

  _initActivityItem(title) {
    cy.cardMainContent()
      .get(`.item-re-order .accordion__header:contains(${title})`)
      .parent('div')
      .as('activityItem')
  }

  _clickToExpandActivity() {
    cy.get('@activityItem').within(() => {
      cy.get('a[data-toggle="collapse"]')
        .invoke('attr', 'aria-expanded')
        .then(($expanded) => {
          if ($expanded != 'true') {
            cy.clickCollapseIcon()
          }
        })
      cy.get('.accordion__body').as('activityBody')
    })
  }

  _setActivities(activities) {
    this.activities = activities
  }

  _getActivities() {
    return this.activities
  }

  _revertReorderCourseActivity() {
    cy.get('.course-activities-holder').within(() => {
      this.#dragAndDropActivity(50, 300, 1)
      this.#dragAndDropActivity(50, 450, 3)
    })
  }

  _reorderCourseActivity() {
    cy.get('#_copMemberManagementPortlet_activityAccordion').within(() => {
      this.#storeTempActivityTitle(0)
      this.#dragAndDropActivity(50, 450, 0)
      this.#storeTempActivityTitle(2)
      this.#dragAndDropActivity(50, 620, 2)
    })
  }

  _expectToSeeCourseActivityChangeOrder(portletId) {
    const firstOrderedActivityIndex = 1
    const secondOrderedActivityIndex = 3
    cy.get(portletId).within(() => {
      this.#getCourseActivityTitleByIndex(firstOrderedActivityIndex).then(($title) => {
        expect($title.trim()).to.be.equal(this.activities[0].title)
      })
      this.#getCourseActivityTitleByIndex(secondOrderedActivityIndex).then(($title) => {
        expect($title.trim()).to.be.equal(this.activities[1].title)
      })
    })
  }

  #getCourseActivityTitleByIndex(index) {
    return cy.get('span.flex-nowrap').eq(index).invoke('text')
  }

  #dragAndDropActivity(clientX, clientY, index) {
    this.#itcReorderCourseActivity.set()
    cy.dragdrop(clientX, clientY, index)
    this.#itcReorderCourseActivity.wait()
  }

  #storeTempActivityTitle(index) {
    this.activities = []
    cy.get('span.flex-nowrap')
      .eq(index)
      .within(($element) => {
        cy.wrap($element)
          .invoke('text')
          .then(($text) => {
            this.activities.push({ index: index, title: $text.trim() })
          })
      })
  }
}

export default CourseActivity
