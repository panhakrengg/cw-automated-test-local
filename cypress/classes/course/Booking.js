import Environment from '../base/Environment'
import InterceptReq from '../base/InterceptReq'
import VisaCard from '../constants/visa-card/VisaCard'

class Booking {
  #environment = new Environment()
  #courseId
  #deliveryMethod
  #date
  #instanceName
  #itcFetchBookCourseUrl = new InterceptReq(
    '/course_catalog/fetch_book_course_url',
    'fetchBookCourseUrl'
  )
  #itcFetchConsentForm = new InterceptReq('/consent_form/fetch', 'FetchConsentForm')
  #itcCourseCatalogFetchCourseInstances = new InterceptReq(
    '/course_catalog/course_instances/fetch',
    'fetchCourseInstancesInCourseCatalog'
  )
  #itcFetchBookCourseActivities = new InterceptReq(
    '/course_catalog/book_course/activities',
    'fetchBookCourseActivities'
  )
  #itcFetchCourseActivities = new InterceptReq(
    '/course_catalog/course/activities',
    'fetchCourseActivities'
  )

  constructor(courseId, deliveryMethod) {
    this.#courseId = courseId
    this.deliveryMethod = deliveryMethod
  }

  setCourseId(courseId) {
    this.#courseId = courseId
  }

  setDeliveryMethod(deliveryMethod) {
    this.#deliveryMethod = deliveryMethod
  }

  setDate(date) {
    this.#date = date
  }

  setInstanceName(name) {
    this.#instanceName = name
  }

  accessToCourseDetail() {
    this.#itcCourseCatalogFetchCourseInstances.set()
    cy.visit(
      `/u/home/course-detail?p_p_id=courseDetailPortlet&p_p_lifecycle=0&_courseDetailPortlet_id=${
        this.#courseId
      }&_courseDetailPortlet_type=2&_courseDetailPortlet_isMyLearning=false&_courseDetailPortlet_mvcRenderCommandName=%2Fcourse%2Fdetail`
    )
    this.#itcCourseCatalogFetchCourseInstances.wait()
  }

  clickDeliveryMethod() {
    cy.cecCard()
      .cardRightContent()
      .get('.cec-card__item-wrapper')
      .contains(this.#deliveryMethod)
      .click({ force: true })
  }

  book() {
    this.clickDeliveryMethod()
    this.bookThisCourse()
  }

  bookShowConsent() {
    this.clickDeliveryMethod()
    this.bookThisCourseThenShowConsent()
  }

  bookThisCourseThenShowConsent() {
    this.#itcFetchConsentForm.set()
    this.clickOnBookThisCourse()
    this.#itcFetchConsentForm.wait()
  }

  bookThisCourseWithoutActivity() {
    this.#itcFetchConsentForm.set()
    this.clickOnBookThisCourse()
    this.#itcFetchConsentForm.wait()
    cy.waitLoadingOverlayNotExist()
  }

  bookThisCourse(shouldSkip = false) {
    this.#itcFetchConsentForm.set()
    this.#itcFetchCourseActivities.set()
    this.clickOnBookThisCourse()
    this.#itcFetchConsentForm.wait()
    cy.waitLoadingOverlayNotExist()
    if (!shouldSkip) this.#itcFetchCourseActivities.wait()
  }

  #getBookButtonElement() {
    return cy.cecCard().cardRightContent().find('button:contains("Book this Course")')
  }

  clickOnBookThisCourse() {
    this.clickBook()
  }

  clickBook() {
    this.#itcFetchBookCourseUrl.set()
    this.#getBookButtonElement().click({ force: true })
    this.#itcFetchBookCourseUrl.wait()
  }

  clickOnBookThisCourseThenDirectToPayment() {
    this.clickBook()
    this.verifySecureCheckoutPage()
  }

  verifySecureCheckoutPage() {
    cy.get('#portlet_paymentPortlet').should('be.visible')
    cy.get('p:contains("Secure Checkout")').should('be.visible')
    cy.get('p:contains("How would you like to pay")').parent().should('be.visible')
    cy.get('#place-order').should('be.visible')
  }

  expectPlaceOrderButtonDisabled() {
    cy.get('button:contains("Place Order")').should('be.disabled')
  }

  expectPlaceOrderButtonEnabled() {
    if (this.#environment.isPrd()) this.expectPlaceOrderButtonDisabled()
    else cy.get('button:contains("Place Order")').should('not.be.disabled')
  }

  clickBackToCourse() {
    this.#itcFetchBookCourseActivities.set()
    cy.get('a:contains("Back to Course")').click()
    this.#itcFetchBookCourseActivities.wait()
  }

  selectCard(card) {
    cy.get(`.card-body:contains("Pay with ${card == 'Visa' ? 'Credit Card' : 'a Coupon Code'}")`)
      .click()
      .next()
      .should('have.class', 'cec-selected-icon')
  }

  expectToSeeInputCouponField() {
    cy.get('input[placeholder="Enter Coupon Code"]').should('be.visible')
  }

  enterPaymentInfo() {
    cy.getElementByLabel('Cardholder’s Name').type(VisaCard.CARD_HOLDER_NAME)
    cy.wait(3000)
    cy.get('iframe')
      .its('0.contentDocument.body')
      .should('not.be.empty')
      .then(cy.wrap)
      .find('input[data-elements-stable-field-name="cardNumber"]')
      .type(VisaCard.CARD_NUMBER)
    cy.get('iframe')
      .its('1.contentDocument.body')
      .should('not.be.empty')
      .then(cy.wrap)
      .find('input[name="exp-date"]')
      .type(VisaCard.EXPIRATION_DATE)
    cy.get('iframe')
      .its('2.contentDocument.body')
      .should('not.be.empty')
      .then(cy.wrap)
      .find('input[data-elements-stable-field-name="cardCvc"]')
      .type(VisaCard.CVC)
  }

  bookByDeliveryMethodAndDate(index = 1) {
    this.getInstanceByDeliveryMethodAndDate(index).click({ force: true })
    this.clickOnBookThisCourse()
  }

  bookByName(name) {
    this.getInstanceByName(name).click()
    this.bookThisCourse()
  }

  bookByNameWithoutCheckNextScreen(name) {
    //not for booking then check learner instance overview. Created because of CW-15897
    this.#itcFetchCourseActivities.set()
    this.getInstanceByName(name).click()
    this.bookThisCourse(true)
    cy.reload()
    this.#itcFetchCourseActivities.wait()
  }

  bookCourseConsentByName() {
    this.getInstanceByName().click()
    this.bookThisCourseThenShowConsent()
  }

  getInstanceByName(name) {
    if (!name) name = this.#instanceName
    return cy
      .cardRightContent()
      .get(`.radio-container:contains("${name}")`)
      .eq(1)
      .find('.radio-checkmark')
  }

  // TODO: should have better way to get a unique instance
  getInstanceByDeliveryMethodAndDate(index = 1) {
    return cy
      .cecCard()
      .cardRightContent()
      .get(`.radio-container:contains("${this.#deliveryMethod}")`)
      .find(`.text-decoration-underline:contains("${this.#date}")`)
      .eq(index)
  }

  start() {
    this.#itcFetchConsentForm.set()
    cy.cecCard()
      .cardRightContent()
      .get(`.cec-card__item-wrapper:contains("${this.#deliveryMethod}")`)
      .find('button')
      .first()
      .click({ force: true })
    this.#itcFetchConsentForm.wait()
  }

  bookCourseInstance() {
    this.accessToCourseDetail()
    this.book()
  }

  bookCourseInstanceWithoutActivity() {
    this.accessToCourseDetail()
    this.clickDeliveryMethod()
    this.bookThisCourseWithoutActivity()
  }

  verifySlotAvailable(slotAvailable) {
    this.getInstanceByDeliveryMethodAndDate()
      .parents('.radio-container')
      .find('.course-schedule-info > span.text-gray')
      .should('contain.text', `(${slotAvailable} slots available)`)
  }
}

export default Booking
