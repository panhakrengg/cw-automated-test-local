import InterceptReq from '../../../base/InterceptReq'
import Field from '../../../constants/Field'
import LmsManagementHelper from '../../../lms-training-cop/base-manage-course/LmsManagementHelper'
import { CoPConst } from '../../../lms-training-cop/base/CoPStub'
import CourseDetail from '../../CourseDetail'

class LearningPathDetail {
  saveLearningPathButtonLabel = 'Save this to my learning'
  leaveLearningPathButtonLabel = 'Leave Learning Path'

  constructor(learningPath) {
    this.learningPath = learningPath
  }

  setLearningPath(learningPath) {
    this.learningPath = learningPath
  }

  #itcSaveLearningPath = new InterceptReq('/course_catalog/learning_path/join', 'SaveLearningPath')

  #itcLeaveLearningPath = new InterceptReq(
    '/course_catalog/learning_path/leave',
    'LeaveLearningPath'
  )

  #itcBookCourseActivities = new InterceptReq(
    '/course_catalog/book_course/activities',
    'bookCourseActivities'
  )

  #itcFetchLearningPathDetail = new InterceptReq(
    '/course_catalog/learning_path/detail',
    'FetchLearningPathDetail'
  )

  #itcFetchCourseActivities = new InterceptReq(
    '/course_catalog/course/activities',
    'fetchCourseActivities'
  )

  visitLearningPathDetail(lPId) {
    this.#itcFetchLearningPathDetail.set()
    cy.visit(this.#getCopLearningPathLearnerUrl(lPId))
    this.#itcFetchLearningPathDetail.wait()
  }

  _expectToSeeLearningPathOverview() {
    cy.cecCard()
      .cardMainContent()
      .within(() => {
        this.#expectToSeeLearningPathProgressSection()
        this.#expectToSeeCompletedCourses()
      })
  }

  _expectToSeeLearningPathBaseProgressSection() {
    this.#expectToSeeLearningPathBaseProgressSection()
    cy.expectElementWithLabelVisible(Field.CONTINUE, 'a')
  }

  _getLeaveLearningPathButtonLabel() {
    return this.#getButton().invoke('text')
  }

  _saveLearningPath() {
    this.#expectSaveLearningPathAction(this.saveLearningPathButtonLabel)
  }

  _leaveLearningPath() {
    this.#expectLeaveLearningPathAction(this.leaveLearningPathButtonLabel)
  }

  _expectToSeeLearningPathActionLabel(label) {
    this._getLeaveLearningPathButtonLabel().then(($text) => {
      expect($text.trim()).to.be.equal(label)
    })
  }

  _clickLearningPathByTitle(title) {
    this.#itcFetchLearningPathDetail.set()
    cy.getElementWithLabel(title, 'a').parent('h5').click()
    this.#itcFetchLearningPathDetail.wait()
  }

  _expectBackToLearningPath(title) {
    LmsManagementHelper.expectToSeeLearningPathLabel()
    LmsManagementHelper.expectToSeeCoursesForThisLearningPathLabel()
    cy.getElementWithLabel(title, 'span').should('be.visible')
    this._expectToSeeLearningPathActionLabel(this.leaveLearningPathButtonLabel)
  }

  _clickOnLpNameBreadcrumb() {
    this.#itcFetchLearningPathDetail.set()
    cy.cecCard().cardMainContent().find('.learning-path-and-course-title > a').click()
    this.#itcFetchLearningPathDetail.wait()
  }

  _verifyBookedCourse(courseName) {
    this.#getCourse(courseName).then(($course) => {
      expect($course.find('a.btn-outline-primary')).to.contain.text(Field.START)
    })
  }

  _startCourse(courseName) {
    this.#getCourse(courseName).then(($course) => {
      this.#itcFetchCourseActivities.set()
      const startButtonElement = `a.btn-outline-primary:contains("${Field.START}")`
      if ($course.find(startButtonElement).length) {
        cy.wrap($course).find(startButtonElement).click()
      } else {
        cy.wrap($course).find(`a.btn-success:contains("${Field.COMPLETED}")`).click()
      }
      this.#itcFetchCourseActivities.wait()
    })
  }

  clickOnCourseName(courseName) {
    this.#itcBookCourseActivities.set()
    this.#getCourse(courseName).find('h5 > a').click()
    this.#itcBookCourseActivities.wait()
  }

  _verifyBookedCourseOverview(lpName, courseName, instance) {
    new CourseDetail().expectedCourseLinks()
    this.#verifyCourseDate(instance.date)
    this.#verifyCourseActivities(instance.activities)
    this.#verifyDeliveryMethod(instance.deliveryMethod)
    this.#verifyBreadcrumb(lpName, courseName)
  }

  verifyCourseLink() {
    cy.cecCard()
      .cardRightContent()
      .get('nav > a')
      .within(($nav) => {
        cy.wrap($nav).should('have.length', 5)
        cy.wrap($nav).eq(0).should('contain.text', Field.OVERVIEW)
        cy.wrap($nav).eq(1).should('contain.text', 'Discussions')
        cy.wrap($nav).eq(2).should('contain.text', 'Resources')
        cy.wrap($nav).eq(3).should('contain.text', 'Notes')
        cy.wrap($nav).eq(4).should('contain.text', 'Connect')
      })
  }

  #getCourse(courseName) {
    return cy.get(`.overall-wrapper > ul li:contains("${courseName}")`)
  }

  #verifyBreadcrumb(lpName, courseName) {
    cy.get('div.learning-path-and-course-title')
      .eq(1)
      .should('contain.text', `${lpName} / ${courseName}`)
  }

  #verifyCourseDate(courseDate) {
    cy.getElementWithLabel('Course date:', 'span').next().should('contain.text', courseDate)
  }

  #verifyDeliveryMethod(deliveryMethod) {
    cy.getElementWithLabel('Delivery Methods:', 'span')
      .find('span.text-black-darker')
      .should('contain.text', deliveryMethod)
  }

  #verifyCourseActivities(courseActivities) {
    cy.getElementWithLabel('Course Activities', 'h1')
      .parent()
      .then(($activities) => {
        Object.entries(courseActivities)[1].forEach((activity) => {
          switch (activity) {
            case 'fileImage':
              cy.wrap($activities).should('contain.text', courseActivities[activity].Title)
              break
            default:
              break
          }
        })
      })
  }

  #getButton() {
    return cy.cecCard().cardRightContent().find(`a`)
  }

  #expectToSeeLearningPathBaseProgressSection() {
    this.completLabel = `Completed: 1/${this.learningPath.courses.total}`
    LmsManagementHelper._expectToSeeProgressBaseSection({
      complete: { label: this.completLabel, cssClazz: 'h5' },
      progressBarPercentage: '50',
    })
  }

  #expectToSeeCompletedCourses() {
    cy.get('.courses-list li')
      .find('.btn-success')
      .within(($content) => {
        cy.wrap($content).should('contain.text', Field.COMPLETED).and('be.visible')
      })
  }

  #expectSaveLearningPathAction(label) {
    this.#itcSaveLearningPath.set()
    this.#itcFetchLearningPathDetail.set()
    this.#getLearningPathActionButton(label)
    cy.get('@btnLearningPathAction').click()
    this.#itcSaveLearningPath.wait()
    this.#itcFetchLearningPathDetail.wait()
  }

  #expectLeaveLearningPathAction(label) {
    this.#itcLeaveLearningPath.set()
    this.#itcFetchLearningPathDetail.set()
    this.#getLearningPathActionButton(label)
    cy.get('@btnLearningPathAction').click()
    this.#itcLeaveLearningPath.wait()
    this.#itcFetchLearningPathDetail.wait()
  }

  #getLearningPathActionButton(label) {
    cy.cecCard()
      .cardRightContent()
      .find('a.btn')
      .as('btnLearningPathAction')
      .should('contain.text', label)
      .and('be.visible')
  }

  #expectToSeeLearningPathProgressSection() {
    this.completLabel = `Completed: 1/${this.learningPath.courses.total}`
    LmsManagementHelper._expectToSeeProgressMainSection({
      complete: { label: this.completLabel },
      progressLabel: 'Overall progress',
      progressBarPercentage: '50',
    })
  }

  #getCopLearningPathLearnerUrl(lPId) {
    return (
      `${CoPConst.URL}/learning?p_p_id=copLearningPortlet&p_p_lifecycle=0&_copLearningPortlet_id=` +
      `${lPId}` +
      '&_copLearningPortlet_type=1&_copLearningPortlet_isMyLearning=false&' +
      '_copLearningPortlet_mvcRenderCommandName=/course/detail'
    )
  }

  visitLearningPathCourse(learningPathName, courseName) {
    cy.getElementWithLabel(learningPathName, 'a.multi-line-text-ellipsis-two').click()
    cy.getElementWithLabel(courseName, 'a.multi-line-text-ellipsis-two').click()
  }

  expectNoBreadcrumbExists() {
    cy.get('div.cec-card__title > div.learning-path-and-course-title').should('not.exist')
  }

  clickLearningPathBy(title) {
    this.#itcFetchLearningPathDetail.set()
    cy.get('#_myLearningPortlet_courseList').within(() => {
      cy.getElementWithLabel(title, 'a').first().click()
    })
    this.#itcFetchLearningPathDetail.wait()
  }

  clickButtonSaveThisToMyLearningPath() {
    cy.get('.cec-card__right-content').within(($rightContent) => {
      if ($rightContent.find(`a:contains(${this.saveLearningPathButtonLabel})`).length) {
        this.#itcSaveLearningPath.set()
        cy.getElementWithLabel(this.saveLearningPathButtonLabel, 'a').click()
        this.#itcSaveLearningPath.wait()
      }
    })
  }

  clickButtonLeaveLearningPath() {
    cy.get('.cec-card__right-content').within(($rightContent) => {
      if ($rightContent.find(`a:contains(${this.leaveLearningPathButtonLabel})`).length) {
        this.#itcLeaveLearningPath.set()
        cy.getElementWithLabel(this.leaveLearningPathButtonLabel, 'a').click()
        this.#itcLeaveLearningPath.wait()
      }
    })
  }

  expectToSeeLearningPathEmptyProgressSection() {
    const completeLabel = `Completed: 0/${this.learningPath.courses.total}`
    cy.get('.cec-card__main-content').within(() => {
      LmsManagementHelper._expectToSeeProgressMainSection({
        complete: { label: completeLabel },
        progressLabel: 'Overall progress',
        progressBarPercentage: '0',
      })
    })
  }

  expectTotalUnBookCourse(total) {
    cy.get('#reorderCourse').within(($courseList) => {
      cy.wrap($courseList)
        .getLinksWithLabel(Field.VIEW)
        .then(($links) => {
          expect($links.length).to.equal(total)
        })
    })
  }
}
export default LearningPathDetail
