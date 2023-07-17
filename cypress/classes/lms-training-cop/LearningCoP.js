import Environment from '../base/Environment'
import InterceptReq from '../base/InterceptReq'
import SpyOpenWindowEvent from '../base/SpyOpenWindowEvent'
import Field from '../constants/Field'
import CourseDetail from '../lms/CourseDetail'
import Learning from '../lms/Learning'

class LearningCoP extends Learning {
  _url
  #courseDetail = new CourseDetail()
  courseCard = {
    $listWrapper: '#_myLearningPortlet_courseList',
    $list: `.course-list-wrapper > ul > li`,
    myLearningType: {
      $el: `span.my-learning-type`,
      course: `Course`,
      learningPath: `Learning Path`,
      microLearning: `Micro-Learning`,
    },
  }
  _itchFetchCourseCatalog = new InterceptReq('/course_catalog/search', 'fetchCourseCatalog')

  _itcFetchCourseActivities = new InterceptReq(
    '/course_catalog/book_course/activities',
    'fetchCourseActivities'
  )

  _itcFetchGlobalNavProperties = new InterceptReq(
    '/global_navigation/search/fetch_properties',
    'fetchGlobalNavigationProperties'
  )

  constructor(url) {
    super()
    this._url = url
  }

  setTrainingCopUrl(url) {
    this._url = url
  }
  getTrainingCopUrl() {
    return this._url
  }
  getMyLearningUrl() {
    return '/u/home/learnings'
  }

  _filterByLabelName(labelName) {
    this._itchFetchCourseCatalog.set()
    cy.getElementWithLabel(labelName, 'label')
      .parent()
      .within(($filter) => {
        cy.wrap($filter).getCheckbox().check({ force: true })
      })
    this._itchFetchCourseCatalog.wait()
  }

  expandFilterBy(name) {
    cy.get(`.nav-item:contains("${name}")`).click()
  }

  _expectToSeeCourseBaseOnCategories() {
    cy.waitLoadingOverlayNotExist()
    cy.get(this.courseCard.$list).as('courseList')
    this.checkCourseRenderInFilter('Online Training', 1)
    this.checkCourseRenderInFilter('Tennis By Yourself', 0)
  }

  checkCourseRenderInFilter(courseTitle, courseIndex) {
    cy.get('@courseList')
      .eq(courseIndex)
      .within(($course) => {
        cy.expectElementWithLabelVisible(courseTitle, 'h5 > a')
        cy.wrap($course).expectElementWithLabelVisible(
          this.courseCard.myLearningType.course,
          this.courseCard.myLearningType.$el
        )
        cy.wrap($course).expectElementWithLabelNotExist(
          this.courseCard.myLearningType.learningPath,
          this.courseCard.myLearningType.$el
        )
      })
  }

  _expectToSeeOnlyLearningPath() {
    cy.get(this.courseCard.$list).each(($course) => {
      cy.wrap($course).expectElementWithLabelVisible(
        this.courseCard.myLearningType.learningPath,
        this.courseCard.myLearningType.$el
      )
      cy.wrap($course).expectElementWithLabelNotExist(
        this.courseCard.myLearningType.course,
        this.courseCard.myLearningType.$el
      )
    })
  }

  _expectToSeeOnlyCourse() {
    cy.get(this.courseCard.$list).each(($course) => {
      cy.wrap($course).expectElementWithLabelVisible(
        this.courseCard.myLearningType.course,
        this.courseCard.myLearningType.$el
      )
      cy.wrap($course).expectElementWithLabelNotExist(
        this.courseCard.myLearningType.learningPath,
        this.courseCard.myLearningType.$el
      )
      cy.wrap($course).expectElementWithLabelNotExist(
        this.courseCard.myLearningType.microLearning,
        this.courseCard.myLearningType.$el
      )
    })
  }

  _expectToSeeOnlyMicroLearning() {
    cy.get(this.courseCard.$list).each(($course) => {
      cy.wrap($course).expectElementWithLabelVisible(
        this.courseCard.myLearningType.microLearning,
        this.courseCard.myLearningType.$el
      )
      cy.wrap($course).expectElementWithLabelNotExist(
        this.courseCard.myLearningType.learningPath,
        this.courseCard.myLearningType.$el
      )
      cy.wrap($course).expectElementWithLabelNotExist(
        this.courseCard.myLearningType.course,
        this.courseCard.myLearningType.$el
      )
    })
  }

  _expectToSeeOnlyMyLearningByLanguages(filterLanguages) {
    cy.get(this.courseCard.$listWrapper).within(() => {
      filterLanguages.resultShow.forEach((filterLanguage) => {
        cy.expectElementWithLabelVisible(filterLanguage, 'h5 > a')
      })
    })
    cy.get(this.courseCard.$list).then(($items) => {
      expect($items.length).to.be.equal(filterLanguages.totalResult)
    })
  }

  visitLearning() {
    this._itchFetchCourseCatalog.set()
    cy.visit(this._url + '/learning')
    cy.selectItemPerPage(75)
    this._itchFetchCourseCatalog.wait()
  }

  sortCourseBy(orderMethod) {
    this._itchFetchCourseCatalog.set()
    cy.get('.learning-wrapper .cw-dropdown')
      .first()
      .within(($cwDropdown) => {
        cy.get('#_copLearningPortlet_cw-dropdown_').click()
        cy.wrap($cwDropdown).clickDropdownName(orderMethod)
        cy.waitLoadingOverlayNotExist()
      })
    this._itchFetchCourseCatalog.wait()
  }
  clickOnCourseBy(title) {
    this._itcFetchCourseActivities.set()
    cy.getElementWithLabel(title, '.learning-path-course-overview a').click()
    this._itcFetchCourseActivities.wait()
  }

  expectToSeeCourse(courseName) {
    this._itchFetchCourseCatalog.set()
    cy.selectItemPerPage(75)
    this._itchFetchCourseCatalog.wait()
    cy.get(`#_copLearningPortlet_courseList > ul > li:contains("${courseName}")`).should(
      'be.visible'
    )
  }

  expectNotSeeCourse(courseName) {
    cy.get(`#_copLearningPortlet_courseList > ul > li:contains("${courseName}")`).should(
      'not.exist'
    )
  }

  visitCourseDetail(courseId) {
    this._itcFetchCourseActivities.set()
    cy.visit(
      `${this._url}/learning?p_p_id=copLearningPortlet&p_p_lifecycle=0&_copLearningPortlet_id=${courseId}&_copLearningPortlet_type=2&_copLearningPortlet_isMyLearning=false&_copLearningPortlet_mvcRenderCommandName=%2Fcourse%2Fdetail`
    )
    cy.get('body').then(($body) => {
      if ($body.find('#_copLearningPortlet_copCourseDetail').length) {
        this._itcFetchCourseActivities.wait()
      }
    })
  }

  expectToSeeCourseDetailPage() {
    cy.get('#_copLearningPortlet_copCourseDetail').should('be.visible')
  }

  expectHeaderElementsAreVisible(menuData) {
    cy.get('div#_copLearningPortlet_copLearning > .rounded-top').within(() => {
      super.assertHeadingWithTotal('Learning')
      super.assertDropDownMenuItems(menuData)
    })
  }
  expectLearningBannerIsVisible() {
    cy.get('div.my-learning-banner-wrapper').within(() => {
      cy.get('img').should('have.attr', 'src').should('include', 'my-learning-catalog.png')

      cy.get('p.title').should('contain.text', 'Manage all of your learning in one place')
      cy.get('p.description').should(
        'contain.text',
        'Whether it is a self-study course, a virtual meeting or a physical classroom you can track'
      )
      cy.get('a.btn-learning').should('contain.text', 'Go to My Learning')
    })
  }
  expectCoursesAttributesAreListed() {
    cy.get('div#_copLearningPortlet_courseList').within(() => {
      cy.get('li.list-group-item')
        .should('have.length.gt', 0)
        .then(($item) => {
          cy.wrap($item).find('img').should('have.attr', 'data-url')
          cy.wrap($item)
            .find('a.multi-line-text-ellipsis-two')
            .then(($anchor) => {
              expect($anchor).to.have.attr('href').include('2Fcourse%2Fdetail')
              expect($anchor.text()).to.have.length.gt(0)
            })
          cy.wrap($item)
            .find('span.my-learning-type')
            .then(($type) => {
              expect($type.text()).to.have.length.gt(0)
            })
          cy.wrap($item)
            .find('p.multi-line-text-ellipsis-two')
            .then(($desc) => {
              expect($desc.text()).to.have.length.gt(0)
            })
          cy.wrap($item)
            .find('a.btn-outline-primary')
            .then(($btn) => {
              expect($btn).to.have.attr('href').include('2Fcourse%2Fdetail')
              expect($btn.text()).to.have.length.gt(0)
            })
        })
    })
  }
  expectCourseFiltersAreListed() {
    cy.get('.col-md-3.d-md-flex').within(() => {
      cy.get('strong').should('contain.text', 'Filters')
      cy.get('a').should('contain.text', 'Reset')
    })

    cy.get('ul.management-bar-nav').within(() => {
      this.getFilterOption('Course Types').should('have.length.gt', 0)
      this.getFilterOption('Languages').should('have.length.gt', 0)
      this.getFilterOption('Delivery Methods').should('have.length.gt', 0)
      this.getFilterOption('Categories').should('have.length.gt', 0)
      this.getFilterOption(Field.START_DATE)
        .should('have.length.gt', 0)
        .then(($startDateSection) => {
          cy.wrap($startDateSection).parent().find('input#datepicker-trigger').should('be.disabled')
        })
    })
  }
  getFilterOption(name) {
    return cy.get('span').contains(name).parentsUntil('.nav-item').find('.checkbox-wrapper')
  }

  expectGotoMyLearningButtonIsActive() {
    cy.get('div.my-learning-banner-wrapper').within(() => {
      cy.get('a.btn-learning')
        .should('contain.text', 'Go to My Learning')
        .invoke('removeAttr', 'target')
        .click()
    })
  }
  expectLearnerGoesToMyLearningPage() {
    cy.url().should('include', '/u/home/learnings')
    cy.get('div.navigation-org-branding .nav-link').should('contain.text', 'Learning')
    cy.get('div.learning-dropdown').should('contain.text', 'My Learning')
    cy.get('div#_myLearningPortlet_learning .rounded-top').within(() => {
      cy.contains(/My Learning.*\(\d+\)/).should('have.length.gt', 0)
    })
  }
  visitMyLearning() {
    this._itchFetchCourseCatalog.set()
    cy.visit(this.getMyLearningUrl())
    this._itchFetchCourseCatalog.wait()
  }

  expectNotAbleToFindUnpublishedCourse(courseName) {
    cy.get('div#_myLearningPortlet_learning .search-wrapper').within(() => {
      this._itchFetchCourseCatalog.set()
      cy.get('input[name="keywords"]').type(`"${courseName}"`)
      cy.get(`button:contains("Search")`).click()
      this._itchFetchCourseCatalog.wait()
    })
    cy.get('div.learning-wrapper-description .empty-result.d-sm-flex .empty-result-message').within(
      ($result) => {
        cy.wrap($result)
          .invoke('text')
          .then(($text) => {
            expect($text).to.match(
              new RegExp(`We’re sorry\. No results were found for \“"${courseName}"\”`)
            )
          })
      }
    )
  }

  expectedAccessDeniedFromCopLearning(courseId) {
    cy.visit(this.getLearningCourseDetailUrl(courseId))
    cy.url().should('contain', '/access-denied')
  }

  expectedPageNotFoundOfCopLearning(courseId) {
    cy.visit(this.getLearningCourseDetailUrl(courseId), {
      failOnStatusCode: false,
    })
    cy.pageNotFound()
  }

  expectNoResultFoundForSearch(courseName) {
    this._itcFetchGlobalNavProperties.set()
    cy.searchGlobal(`"${courseName}"`)
    this._itcFetchGlobalNavProperties.wait()
    cy.showEmptySearchResult(`"${courseName}"`)
  }

  getLearningCourseDetailUrl(courseId) {
    return (
      this.getTrainingCopUrl() +
      `/learning?p_p_id=copLearningPortlet&p_p_lifecycle=0&_copLearningPortlet_id=${courseId}&_copLearningPortlet_type=2&_copLearningPortlet_isMyLearning=false&_copLearningPortlet_mvcRenderCommandName=%2Fcourse%2Fdetail`
    )
  }

  verifyDownloadCourseAttachment(attachmentName) {
    const spyOpenWindowEvent = new SpyOpenWindowEvent()
    spyOpenWindowEvent.setSpy()
    cy.getElementWithLabel(attachmentName, 'a').click()
    spyOpenWindowEvent.getUrl().then(($url) => {
      cy.downloadFile($url, 'cypress/downloads', attachmentName)
      cy.verifyDownload(attachmentName)
    })
  }

  getSearchCourseCatalogResult() {
    return new Cypress.Promise((resolve) => {
      this._itchFetchCourseCatalog
        .getResponse()
        .its('response.body.result.courses')
        .then((result) => {
          resolve(result)
        })
    })
  }
  verifySortCourseByAscending() {
    this.getSearchCourseCatalogResult().then((result) => {
      cy.wrap(
        result.map((c) => {
          return Cypress._.deburr(c['title'])
        })
      ).expectLocaleCompareSortAscending()
    })
  }
  verifySortCourseByDescending() {
    this.getSearchCourseCatalogResult().then((result) => {
      cy.wrap(
        result.map((c) => {
          return Cypress._.deburr(c['title'])
        })
      ).expectLocaleCompareSortDescending()
    })
  }
  expectCourseNotFoundCopLearning(courseName) {
    this.expectNotSeeCourse(courseName)
  }

  expectCourseFoundInMyLearning(courseName, courseOverview) {
    cy.get('div#_myLearningPortlet_courseList').within(() => {
      cy.get('li.list-group-item')
        .contains(courseName)
        .parentsUntil('.list-group-item')
        .last()
        .as('courseListItem')
    })
    cy.get('@courseListItem').then(($item) => {
      this.assertCourseContent($item, courseName, courseOverview)
      expect($item.find('.lexicon-icon > g')).to.be.visible
      expect($item.find('a.btn-outline-primary')).to.contain.text(Field.START)
      expect($item.find('a.btn-outline-primary')).to.have.attr('href').include('2Fcourse%2Fdetail')
      expect($item.find('.col-lg-1 > .dropdown-three-dots')).to.be.visible
    })
  }

  expectViewCourseInMyCoursesPopup(courseName, courseOverview) {
    cy.get('@courseListItem').within(($item) => {
      cy.get('.col-lg-1 > .dropdown-three-dots')
        .click()
        .then(($threeDots) => {
          cy.wrap($threeDots).find('.dropdown-item').click().wait(500)
        })
    })
    cy.swal2()
      .within(() => {
        cy.getSwal2Header().should('contain.text', 'My Courses')
        cy.getSwal2Content().within(($content) => {
          this.assertCourseContent($content, courseName, courseOverview)
          expect($content.find('div.booked-courses label')).to.contain.text('Booked courses')
          expect($content.find('a.btn-default')).contain.text(Field.START)
          expect($content.find('a.btn-default + a')).contain.text('Withdraw')
          expect($content.find('ul.instance-list h5').text()).to.match(/\w+?/)
          expect($content.find('div.date-tooltip-wrapper > span').text()).to.match(
            /(\d+\s+\w+,\s+\d+\s+-)/
          )
        })
      })
      .closeSwal2()
  }

  expectToSeePublishedCourseAttributes(courseInfo) {
    cy.get('div#_copLearningPortlet_courseList .list-group-item').then(($content) => {
      this.assertCourseContent($content, courseInfo.name, courseInfo.courseOverview)
    })
  }
  visitCourseDetailInCopLearning(courseId) {
    this.#courseDetail.setItcTermAndCondition()
    cy.visit(this.getLearningCourseDetailUrl(courseId), {
      failOnStatusCode: false,
    })
    this.#courseDetail.waitItcTermAndCondition()
  }
  expectCourseDetailInCopLearning(
    courseId,
    courseInfo,
    activityPhysicalClass,
    activityVirtualClass
  ) {
    this.visitCourseDetailInCopLearning(courseId)
    this.#courseDetail.assertCourseDetailContent(
      courseInfo,
      activityPhysicalClass,
      'div#_copLearningPortlet_copCourseDetail'
    )
    this.#courseDetail.assertCourseActivities(
      courseInfo,
      'div#_copLearningPortlet_activityAccordion'
    )
    this.#courseDetail.assertScheduleDetailPopupContent(
      courseInfo,
      activityPhysicalClass,
      activityVirtualClass
    )
    this.#courseDetail.assertBookCourseChildrenInfoPopupIsValid()
    if (!new Environment().isPrd()) {
      this.#courseDetail.assertViewBookingTermsAndConditions(
        'div#_copLearningPortlet_copCourseDetail',
        'learning.booking-term-and-condition'
      )
    }
  }
}

export default LearningCoP
