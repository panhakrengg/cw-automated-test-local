import InterceptReq from '../base/InterceptReq'
import CourseTab from '../global-search/CourseTab'
import GlobalSearch from '../global-search/GlobalSearch'
import Booking from './Booking'

class SetUpBooking extends Booking {
  #courseObj
  #instanceObj
  #courseName

  globalSearch = new GlobalSearch()
  courseTab = new CourseTab()

  setCourseObject(obj) {
    this.#courseObj = obj
    this.#courseName = this.#courseObj.name.value
  }

  setInstanceObject(obj) {
    this.#instanceObj = obj
  }

  #clickButtonStart(instanceName) {
    Itc.fetchConsentForm.set()
    cy.cardRightContent()
      .get(`.cec-card__item-wrapper:contains("${instanceName}")`)
      .eq(1)
      .within(() => cy.clickButtonByName('Start'))
    Itc.fetchConsentForm.wait()
  }

  searchCourseThenGoToBookedInstance(courseName, instanceName) {
    this.courseTab.setCourseName(courseName)

    this.globalSearch.search(`"${courseName}"`)
    this.courseTab.clickView()
    this.#clickButtonStart(instanceName)
  }

  bookCourseBySearchFromGlobal() {
    this.courseTab.setCourseName(this.#courseName)
    this.setInstanceName(this.#instanceObj.title.value)

    this.globalSearch.search(`"${this.#courseName}"`)
    this.courseTab.clickView()
    this.bookByName()
  }

  bookCourseBySearchFromGlobalByName(course, instance) {
    this.courseTab.setCourseName(course)
    this.setInstanceName(instance)

    this.globalSearch.search(`"${course}"`)
    this.courseTab.clickView()
    this.bookByName()
  }
}

class Itc {
  static fetchConsentForm = new InterceptReq('/consent_form/fetch', 'FetchConsentForm')
}
export default SetUpBooking
