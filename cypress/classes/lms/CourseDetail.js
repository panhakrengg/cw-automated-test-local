import InterceptReq from '../base/InterceptReq'
import Field from '../constants/Field'
import Learning from './Learning'

class CourseDetail extends Learning {
  #courseLinksLabel = [Field.OVERVIEW, 'Discussion', 'Resources', 'Notes', 'Connect']

  #fetchCourseInstance = new InterceptReq(
    '/course_catalog/course_instances/fetch',
    'FetchCourseInstance'
  )
  itcBookCourseActivities = new InterceptReq(
    '/course_catalog/book_course/activities',
    'BookCourseActivities'
  )
  itcFetchCourseCatalogActivities = new InterceptReq(
    '/course_catalog/course/activities',
    'fetchCourseCatalogActivities'
  )
  itcFetchNotes = new InterceptReq('/course_instance_note/get', 'fetchNotes')
  itcDownloadCertificate = new InterceptReq('/certificate/download', 'DownloadCertificate')
  itcTermAndCondition = new InterceptReq(
    '/course_catalog/course_schedule/term_and_condition',
    'TermAndCondition'
  )
  itcFetchRecentThread = new InterceptReq('/forum/thread/fetch_recent_threads', 'fetchRecentThread')
  _itchFetchCourseDetail = new InterceptReq('/course_catalog/course/detail', 'fetchCourseDetail')
  setItcTermAndCondition() {
    this.itcTermAndCondition.set()
  }
  waitItcTermAndCondition() {
    this.itcTermAndCondition.wait()
  }
  setItcFetchCourseDetail() {
    this._itchFetchCourseDetail.set()
  }
  waitItcFetchCourseDetail() {
    this._itchFetchCourseDetail.wait()
  }
  waitItcFetchNotes() {
    this.itcFetchNotes.wait()
  }
  expectToSeeCourseDetailPage() {
    cy.get('div#_courseDetailPortlet_courseDetail').should('be.visible')
  }
  clickButtonStartCourse(index = 1) {
    cy.clickButtonByName(Field.START, index)
  }
  clickOnCourseActivity(title) {
    cy.get('#_courseDetailPortlet_activityAccordion').within(() => {
      cy.getElementWithLabel(title, 'span').parents('a[data-toggle="collapse"]').click()
    })
  }
  hoverOnTableBody(title) {
    cy.wait(2000) // wait for element is ready
    cy.getElementWithLabel(title)
      .parents('.item-re-order, div.w-90')
      .within(($courseActivity) => {
        cy.wrap($courseActivity).as('courseActivity')
        cy.get('.date-tooltip-wrapper').realHover({ force: true })
      })
  }
  verifyDisplayInYourTimezoneTooltip(timezone) {
    cy.get('@courseActivity').within(() => {
      cy.expectElementWithLabelVisible(
        `Times are displayed in your time zone (UTC  ${timezone}).`,
        '.tooltip-body'
      )
    })
  }
  verifyDisplayConvertTimezoneTooltipIn(currentTimezone, activityTimezone) {
    cy.get('@courseActivity').within(() => {
      cy.expectElementWithLabelVisible(
        `Times are displayed in your time zone (UTC  ${currentTimezone}). They were converted from UTC  ${activityTimezone}.`,
        '.tooltip-body'
      )
    })
  }
  verifyDisplayTimezoneTooltipIn(timezone) {
    cy.get('@courseActivity').within(() => {
      cy.expectElementWithLabelVisible(`Times are displayed in UTC  ${timezone}.`, '.tooltip-body')
    })
  }
  verifyDisplayConvertFromUTCTimezoneTooltipTo(activityTimezone) {
    cy.get('@courseActivity').within(() => {
      cy.expectElementWithLabelVisible(
        `Times are displayed in your time zone (UTC ). They were converted from UTC  ${activityTimezone}.`,
        '.tooltip-body'
      )
    })
  }
  hoverOnBookingOptions(activityType) {
    cy.getElementWithLabel(activityType, 'span')
      .last()
      .siblings('.date-tooltip-wrapper')
      .as('courseActivity')
    cy.get('@courseActivity').realHover()
  }
  clickScheduleDetailsBy(activityType) {
    this.itcBookCourseActivities.set()
    cy.getElementWithLabel(activityType, 'span')
      .last()
      .siblings('.course-schedule-info')
      .within(() => {
        cy.getElementWithLabel('Schedule Details', 'a').click()
      })
    this.itcBookCourseActivities.wait()
  }
  getInstanceByTitle(instanceTitle) {
    cy.getElementWithLabel(instanceTitle, 'span')
      .parents('.radio-container ')
      .first()
      .within(($instance) => {
        cy.wrap($instance).as('instance')
      })
    return cy.get('@instance')
  }

  clickScheduleDetailsByInstanceTitle(instanceTitle) {
    this.itcBookCourseActivities.set()
    this.getInstanceByTitle(instanceTitle).within(() => {
      cy.get('.course-schedule-info').within(() => {
        cy.getElementWithLabel('Schedule Details', 'a').click()
      })
    })
    this.itcBookCourseActivities.wait()
  }
  verifyScheduleDetailPopup(instanceObj) {
    cy.swal2().within(($swal2) => {
      cy.expectElementWithLabelVisible(instanceObj.additionalBookingNote, 'p')
      cy.expectElementWithLabelVisible(instanceObj.courseContactEmail, 'div')
      cy.wrap($swal2).closeSwal2()
    })
  }
  verifyUnBookInstanceInfo(instanceObj) {
    this.getInstanceByTitle(instanceObj.title.value).within(() => {
      if (instanceObj.title) cy.expectElementWithLabelVisible(instanceObj.title.value, 'span')
      cy.expectElementWithLabelVisible(instanceObj.deliveryMethod, 'span')
      cy.expectElementWithLabelVisible(instanceObj.language[0], 'span')
      cy.expectElementWithLabelVisible(
        instanceObj.courseFee.currency + ' ' + instanceObj.courseFee.value,
        'span'
      )
      cy.expectElementWithLabelVisible('Schedule Details', 'a')
    })
  }
  verifyTooltipForVirtualClassActivityInScheduleDetails(
    title,
    currentTimeOffset,
    activityTimeOffset
  ) {
    cy.swal2().within(() => {
      this.hoverOnTableBody(title)
      this.verifyDisplayConvertTimezoneTooltipIn(currentTimeOffset, activityTimeOffset)
    })
  }
  verifyTooltipForPhysicalClassActivityInScheduleDetails(title, activityTimeOffset) {
    cy.swal2().within(() => {
      this.hoverOnTableBody(title)
      this.verifyDisplayTimezoneTooltipIn(activityTimeOffset)
    })
  }
  urlCourseInstanceById(id) {
    return `/web/ci${id}/course-detail`
  }
  visitCourseInstanceDetail(id) {
    this.itcFetchCourseCatalogActivities.set()
    cy.visit(this.urlCourseInstanceById(id))
    this.itcFetchCourseCatalogActivities.wait()
  }
  getBookedCourseInstance(courseInstanceId, sidebar) {
    cy.visit(`/web/ci${courseInstanceId}/course-detail#_courseDetailPortlet_tab=${sidebar}`)
  }
  visitNotesPage(courseInstanceId) {
    this.itcFetchNotes.set()
    this.getBookedCourseInstance(courseInstanceId, 'notes')
    this.itcFetchNotes.wait()
  }
  visitCourseDetail(courseId) {
    this.setItcTermAndCondition()
    cy.visit(this.getCatalogCourseDetailUrl(courseId))
    this.waitItcTermAndCondition()
  }
  clickOnNotesTab() {
    this.itcFetchNotes.set()
    this.clickOnTab('Notes')
    this.itcFetchNotes.wait()
  }
  clickOnOverviewTab() {
    this.itcFetchRecentThread.set()
    this.clickOnTab(Field.OVERVIEW)
    this.itcFetchRecentThread.wait()
  }
  clickOnTab(tab) {
    cy.cecCard().cardRightContent().find(`nav > a:contains("${tab}")`).click()
  }
  clickViewCertificate() {
    this.itcDownloadCertificate.set()
    cy.getElementWithLabel('View Certificate', 'button').first().click()
    this.itcDownloadCertificate.wait()
  }
  expectedCourseLinks() {
    cy.cecCard()
      .cecCardTitle()
      .should('contain.text', 'Course Links')
      .cardRightContent()
      .within(() => {
        cy.get('nav > a').should('have.length', this.#courseLinksLabel.length)
        this.#courseLinksLabel.forEach((label) => {
          cy.get('nav > a').should('contain.text', label)
        })
      })
  }
  assertCourseDetailContent(courseInfo, activityPhysicalClass, rootElement) {
    cy.get(rootElement).within(() => {
      cy.get('div.cec-card__right-content').within(() => {
        this.#clickInstanceByTitle(courseInfo.courseInstances.publishedNotBook.title)

        this.getInstanceByTitle(courseInfo.courseInstances.publishedNotBook.title).then(($item) => {
          expect($item.find('div.date-tooltip-wrapper > span').text()).to.match(
            /(\d+\s+\w+,\s+\d+\s+\-)/
          )
          expect($item.find('span.course-schedule-info span.text-gray').text()).to.match(
            /\(\d+\s+slots available\)/
          )
          expect($item.find('span.course-schedule-info span:nth-child(3)')).to.contain.text(
            activityPhysicalClass.address
          )
          expect($item.find('span.course-schedule-info span:nth-child(4)')).to.contain.text(
            'English'
          )
          expect($item.find('span.course-schedule-info span:nth-child(5)')).to.contain.text('Free')
        })
      })

      cy.get('div.cec-card__main-content').within(() => {
        cy.get('.cec-card__title').should('contain.text', courseInfo.name)
        cy.get('h1 + div.text-dark').should('contain.text', courseInfo.courseOverview)
        cy.contains(/Course Fee.*?Free/).should('have.length.gt', 0)
        cy.contains(
          new RegExp(
            `Total activities:.*?${courseInfo.courseInstances.publishedNotBook.activities.total}`
          )
        ).should('have.length.gt', 0)
        const duration = courseInfo.courseInstances.publishedNotBook.expectedDuration / 60
        if (!this.environment.isPrd())
          cy.contains(new RegExp(`Duration:.*?${duration}\\s+Hours`)).should('have.length.gt', 0)
        cy.getElementWithLabel(Field.ATTACHMENT, 'h2')
          .parent()
          .within(() => {
            cy.get('a').should('contain.text', courseInfo.attachment[0])
          })
        cy.get('div.cec-card__header svg > g').should('not.exist')
      })
    })
  }

  #clickInstanceByTitle(instanceTitle) {
    this.itcBookCourseActivities.set()
    cy.getElementWithLabel(instanceTitle, 'label').find('input').first().click({ force: true })
    this.itcBookCourseActivities.wait()
    cy.waitLoadingOverlayNotExist()
  }

  assertCourseActivities(courseInfo, rootElement) {
    const instance = courseInfo.courseInstances.publishedNotBook
    this.#clickInstanceByTitle(instance.title)
    cy.get(rootElement).within(() => {
      cy.get('div.item-re-order').should(
        'contain.text',
        instance.activities.physicalClassChildren.title
      )
      cy.get('div.item-re-order').should('contain.text', instance.activities.virtualTalking.title)
      cy.get('div.accordion__header .collapse-icon-closed').should('not.exist')
      cy.get('div.item-re-order .collapse').should('not.be.visible')
    })
  }

  assertScheduleDetailPopupContent(courseInfo, activityPhysicalClass, activityVirtualClass) {
    this.clickScheduleDetailsByInstanceTitle(courseInfo.courseInstances.publishedNotBook.title)
    cy.waitUntilIconLoadingLgNotExist()
    cy.swal2()
      .within(() => {
        cy.getSwal2Header().should('contain.text', 'Schedule Details')
        cy.getSwal2Content().within(($swal2Content) => {
          cy.wrap($swal2Content).then(($content) => {
            expect($content.find('div.card-list:nth-child(1) p')).to.contain.text(
              activityPhysicalClass.title
            )
            expect($content.find('div.card-list:nth-child(1) span')).to.contain.text(
              'Physical Class'
            )
            expect($content.find('div.card-list:nth-child(1) span')).to.contain.text(Field.LOCATION)
            expect($content.find('div.card-list:nth-child(1) p')).to.contain.text(
              activityPhysicalClass.address
            )
            expect($content.find('div.card-list:nth-child(1) p').text()).to.match(
              /Children's Program:.*?\s+.*?Available/
            )
            expect($content.find('div.card-list:nth-child(1) table.course-instance-list')).to.be
              .visible
            expect(
              $content.find('div.card-list:nth-child(1) table.course-instance-list tbody tr').length
            ).to.be.gt(0)

            expect($content.find('div.card-list:nth-child(1) p')).to.contain.text(
              activityVirtualClass.title
            )
            expect($content.find('div.card-list:nth-child(1) span')).to.contain.text(
              'Virtual Class'
            )
            expect($content.find('div.card-list:nth-child(1) p').text()).to.match(
              /Program:.*?\s+.*?Zoom/
            )
            expect($content.find('div.card-list:nth-child(1) table.course-instance-list')).to.be
              .visible
            expect(
              $content.find('div.card-list:nth-child(1) table.course-instance-list tbody tr').length
            ).to.be.gt(0)

            expect($content.find('div.card-list:nth-child(2) h3')).to.contain.text(
              'Additional Booking Notes'
            )
            expect($content.find('div.card-list:nth-child(2) p')).to.contain.text(
              courseInfo.courseInstances.publishedNotBook.additionalBookingNote
            )

            expect($content.find('div.card-list:nth-child(3) h3')).to.contain.text('General')
            expect($content.find('div.card-list:nth-child(3) .row').text()).to.match(
              /Children's Program:.*?\s+.*?Available/
            )

            expect($content.find('div.card-list:nth-child(4) h3')).to.contain.text('Facilitators')

            cy.shouldExist(cy.get('div.card-list:nth-child(4) .cec-user-profile'))

            expect(
              $content.find('div.card-list:nth-child(4) .member-info-wrapper > a').attr('href')
            ).to.include('/my-profile/profile/')

            expect($content.find('div.card-list:nth-child(4) span > a').text()).to.match(/\w+/)
          })
        })
      })
      .closeSwal2()
  }

  assertBookCourseChildrenInfoPopupIsValid() {
    cy.get('div.cec-card__right-content').within(() => {
      cy.get('button.btn-primary')
        .should('contain.text', 'Book this Course')
        .should('not.have.class', 'disabled')
        .click()
    })
    cy.swal2()
      .within(() => {
        cy.getSwal2Header().should('contain.text', 'Any children attending with you?')
        cy.getSwal2Content().within(($swal2Content) => {
          cy.wrap($swal2Content).then(($content) => {
            expect($content.find('div.children-info-content > div')).to.contain.text(
              'If so, please enter their names below'
            )
            expect($content.find('input[placeholder="Your child’s full name"]')).to.be.visible
            expect($content.find('select > option').length).to.be.eq(16)
            expect($content.find('a.text-dark > svg > g')).to.be.visible
            expect($content.find('div.add-more-name-holder > a > span')).to.contain.text(
              'Add another child'
            )
            expect($content.find('button.btn-primary')).to.contain.text('Book this Course').to.be
              .visible
          })
        })
      })
      .closeSwal2()
  }

  assertViewBookingTermsAndConditions(rootElement, title) {
    cy.get('div.cec-card__right-content').within(() => {
      cy.get('a.text-gray').should('contain.text', 'View booking terms & conditions').click()
    })

    cy.get(rootElement).within(() => {
      cy.get('div.cec-card__header span.cec-card__title').should('contain.text', title)
      cy.get('div.cec-card__right-content > div.cec-card__header').should(
        'contain.text',
        'Recommendations'
      )
      cy.get('div.cec-card__item-wrapper').should('not.exist')
    })
  }
  getCatalogCourseDetailUrl(courseId) {
    return `/u/home/course-detail?p_p_id=courseDetailPortlet&p_p_lifecycle=0&_courseDetailPortlet_id=${courseId}&_courseDetailPortlet_type=2&_courseDetailPortlet_isMyLearning=false&_courseDetailPortlet_mvcRenderCommandName=%2Fcourse%2Fdetail`
  }
  expectedAccessDeniedFromCourseCatalog(courseId) {
    cy.url().should('contain', '/access-denied')
  }
  expectCourseDetailInCourseCatalog(
    courseId,
    courseInfo,
    activityPhysicalClass,
    activityVirtualClass
  ) {
    this.visitCourseDetail(courseId)
    this.assertCourseDetailContent(
      courseInfo,
      activityPhysicalClass,
      'div#_courseDetailPortlet_courseDetail'
    )
    this.assertCourseActivities(courseInfo, 'div#_courseDetailPortlet_activityAccordion')
    this.assertScheduleDetailPopupContent(courseInfo, activityPhysicalClass, activityVirtualClass)
    this.assertBookCourseChildrenInfoPopupIsValid()
    if (!this.environment.isPrd()) {
      this.assertViewBookingTermsAndConditions(
        'div#_courseDetailPortlet_courseDetail',
        'Booking Terms and Condition'
      )
    }
  }

  initInstanceCardByDate(date) {
    cy.cardRightContent()
      .dateToolTipWrapper(date)
      .parents('.cec-card__item-wrapper')
      .eq(0)
      .as('instanceCard')
  }

  clickInstance() {
    cy.get('@instanceCard').click()
  }

  expectBookButtonIsDisabled() {
    this.clickInstance()
    cy.cardRightContent().expectButtonWithLabelAndDisabled('Book this Course')
  }

  expectBookButtonIsEnabled() {
    this.clickInstance()
    cy.cardRightContent().expectButtonWithLabelAndEnabled('Book this Course')
  }

  clickStart() {
    this.setItcFetchCourseDetail()
    cy.get('@instanceCard').within(() => cy.clickButtonByName(Field.START))
    this.waitItcFetchCourseDetail()
  }

  expectCourseDetailSectionIsValid() {
    cy.get('div.cec-card__main-content').within(() => {
      cy.contains(/Course Fee\s+:.*?USD\s+\d+/).should('have.length.gt', 0)
      cy.contains(/Total activities:.*?\d+/).should('have.length.gt', 0)
      cy.get('div.cec-card__header svg > g').should('not.exist')
      cy.get('h1 + div.text-dark')
        .invoke('text')
        .then(($description) => {
          expect($description.length).to.be.gt(0)
        })
      cy.get('h2 + div')
        .invoke('text')
        .then(($attachment) => {
          expect($attachment.length).to.be.gt(0)
        })
      cy.get('div#_courseDetailPortlet_activityAccordion div.item-re-order').should(
        'have.length.gt',
        0
      )
    })
  }

  clickBackIcon() {
    cy.get('.cec-card__main-content > .cec-card__header > a').click()
    cy.waitLoadingOverlayNotExist()
  }

  assertContainHaveQuestionButton() {
    cy.expectElementWithLabelVisible('Have questions? Email us', 'span')
  }

  _verifyMainHeaderIsVisible(title) {
    cy.get('.cec-card__main-content .cec-card__header')
      .should('be.visible')
      .within(() => {
        cy.expectElementWithLabelVisible(title, '.cec-card__title')
      })
  }
}

export default CourseDetail
