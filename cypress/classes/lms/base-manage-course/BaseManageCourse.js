import Environment from '../../base/Environment'
import LmsManagementHelper from '../../lms-training-cop/base-manage-course/LmsManagementHelper'
import Properties from '../../utilities/Properties'
import AdditionalInformation from './AdditionalInformation'
import CourseActivity from './CourseActivity'

class BaseManageCourse {
  #env = new Environment()

  constructor(course, courseInstance) {
    this.course = course
    this.courseInstance = courseInstance
    this.additionInfo = new AdditionalInformation(courseInstance)
    this.courseActivity = new CourseActivity(courseInstance)
  }

  _defineAliasMainContent() {
    cy.get('div.course-detail-wrapper').within(() => {
      cy.cecCard().cardMainContent()
    })
  }

  _setCourse(course) {
    this.course = course
  }

  #getCourseTitle() {
    return this.course.name
  }

  _getCourseFee(edit) {
    if (edit) return this.course['courseFee']['value']
    const courseFee = this.course['courseFee']['value']
    return courseFee > 0 ? 'USD ' + courseFee : 'Free'
  }

  #getTotalActivities() {
    return this.courseInstance.activities.total
  }

  #getDuration() {
    return this.courseInstance.duration
  }

  #getCourseDate() {
    return this.courseInstance.date
  }

  #getDeliveryMethod() {
    return this.courseInstance.deliveryMethod
  }

  #getLocation() {
    return this.courseInstance.location
  }

  #getLanguage() {
    return this.courseInstance.language
  }

  _verifyCourseAttachment() {
    const { attachment } = this.course
    if (Array.isArray(attachment)) {
      attachment.forEach((element) => {
        cy.contains(element).parent().hasSvgIcon()
      })
    } else {
      cy.contains(attachment).parent().hasSvgIcon()
    }
  }

  _verifyTagAndSkill(label, isOverview) {
    cy.contains(label).as('tagSkill')
    cy.get('@tagSkill').should('have.class', 'border')
    if (!isOverview) {
      cy.get('@tagSkill').should('have.css', 'background-color', Properties.toggleActiveColor)
    }
  }

  _verifyCourseTagsAndSkills(isOverview, isReadOnly) {
    const { tagSkill } = this.course
    cy.contains(
      isOverview ? 'span' : 'label',
      isOverview ? 'Tags & Skills covered in this course:' : 'Tags and Skills'
    )
      .should('be.visible')
      .parent()
      .within(() => {
        if (Array.isArray(tagSkill)) {
          tagSkill.forEach((element) => this._verifyTagAndSkill(element, isOverview || isReadOnly))
        } else {
          this._verifyTagAndSkill(tagSkill, isOverview || isReadOnly)
        }
      })
  }

  _expectToSeeAdditionInfo() {
    this.additionInfo._expectToSeeAdditionInfo()
  }

  _expectToSeeCourseActivitySection() {
    this.courseActivity._expectToSeeCourseActivitySection()
  }

  _expectToCourseDetailInformation() {
    this._expectToSeeCourseTitle()
    this._expectToSeeTotalCourseActivities()
    this._expectToSeeTotalCourseDuration()
    this._expectToSeeCourseFee()
    this._expectToSeeCourseDate()
    this._expectToSeeDeliveryMethod()
    this._expectToSeeLocation()
    this._expectToSeeLanguage()
    LmsManagementHelper.expectToSeeCourseLabel()
    this._expectToSeeCourseOverview()
  }

  _expectToSeeCourseTitle() {
    cy.expectElementWithLabelVisible(`${this.#getCourseTitle()}`, '.cec-card__title')
  }

  _expectToSeeCourseFee() {
    cy.contains(`Course Fee : ${this._getCourseFee()}`).should('be.visible')
  }

  _expectToSeeTotalCourseDuration() {
    cy.contains(`Duration: ${this.#getDuration()}`).should('be.visible')
  }

  _expectToSeeTotalCourseActivities() {
    cy.contains(`Total activities: ${this.#getTotalActivities()}`).should('be.visible')
  }

  _expectToSeeCourseDate() {
    cy.contains(`Course date: ${this.#getCourseDate()}`).should('be.visible')
  }

  _expectToSeeDeliveryMethod() {
    cy.contains(`Delivery Methods: ${this.#getDeliveryMethod()}`).should('be.visible')
  }

  _expectToSeeLocation() {
    cy.contains(`Location: ${this.#getLocation()}`).should('be.visible')
  }

  _expectToSeeLanguage() {
    cy.contains(`Language: ${this.#getLanguage()}`).should('be.visible')
  }

  _expectToSeeCourseBanner() {
    if (!this.#env.isLocal()) {
      // in local course image clone from UAT doesn't show. Even we update, it's still not visible
      cy.get('figure.image__wrapper')
        .should('have.class', 'loaded')
        .find('> img.course-image-cover')
        .should('be.visible')
        .and('have.attr', 'src')
        .as('courseBannerUrl')
      cy.get('@courseBannerUrl').should(
        !this.course['bannerImage'] ? 'include' : 'not.contain',
        '/images/course-default-image.png'
      )
    }
  }

  _expectToSeeCourseOverview() {
    cy.contains(this.course['courseOverview']).should('be.visible')
  }

  _expectToSeeCourseAttachment() {
    if (this.course['attachment']) {
      this._verifyCourseAttachment()
    }
  }

  _expectToSeeCourseTagSkill() {
    if (this.course['tagSkill']) {
      this._verifyCourseTagsAndSkills(true)
    }
  }
}
export default BaseManageCourse
