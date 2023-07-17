import Environment from '../base/Environment'
import InterceptReq from '../base/InterceptReq'
import Pagination from '../components/Pagination'
import Field from '../constants/Field'
import { Lms } from '../constants/Lms'
import LmsManagementHelper from '../lms-training-cop/base-manage-course/LmsManagementHelper'

class Learning {
  environment = new Environment()

  #fetchCourseInstance = new InterceptReq(
    '/course_catalog/course_instances/fetch',
    'FetchCourseInstance'
  )
  #fetchCourseCatalog = new InterceptReq('/course_catalog/search', 'fetchCourseCatalog')
  #fetchBookedCourseInfo = new InterceptReq(
    '/booked_course/course_info/fetch',
    'fetchBookedCourseInfo'
  )
  #itcWithdrawCourse = new InterceptReq('/booked_course/course_instance/withdraw', 'withdrawCourse')
  #itcSearchCourseCatalog = new InterceptReq('/course_catalog/search', 'SearchCourseCatalog')
  setItcFetchCI() {
    this.#fetchCourseInstance.set()
  }
  waitItcFetchCI() {
    this.#fetchCourseInstance.wait()
  }
  loginAsCourseLearnerInJapan(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, 'Course.instance.learner.auTimeJp')
  }
  loginAsCourseLearnerInPhnomPenh(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, 'Course.instance.learner.auTimeKh')
  }
  visitLearningPage() {
    this.#fetchCourseCatalog.set()
    cy.visit('/u/home/learnings')
    this.#fetchCourseCatalog.wait()
    cy.waitLoadingOverlayNotExist()
    Cypress.on('uncaught:exception', () => false)
  }
  searchCourse(courseTitle) {
    this.#fetchCourseCatalog.set()
    cy.get('.search-wrapper').within(() => {
      cy.typeInput(`${courseTitle}{enter}`)
    })
    this.#fetchCourseCatalog.wait()
    cy.waitLoadingOverlayNotExist()
  }
  switchToCourseCatalog() {
    cy.getCwDropdown().within(($cwDropdown) => {
      this.#fetchCourseCatalog.set()
      cy.wrap($cwDropdown).click()
      cy.wrap($cwDropdown).clickDropdownName(Lms.courseCatalog)
      this.#fetchCourseCatalog.wait()
      cy.waitLoadingOverlayNotExist()
    })
  }
  clickButtonSearch() {
    cy.clickButtonByName('Search')
  }
  filterByLabelName(labelName) {
    cy.getElementWithLabel(labelName, 'label')
      .parent()
      .within(() => {
        cy.getCheckbox().check()
        cy.wait(1000)
        cy.waitLoadingOverlayNotExist()
      })
  }
  unCheckFilterByLabelName(labelName) {
    cy.getElementWithLabel(labelName, 'label')
      .parent()
      .within(($filter) => {
        cy.wrap($filter).getCheckbox().uncheck()
        cy.wait(1000)
        cy.waitLoadingOverlayNotExist()
      })
  }

  clickCourseTitle(title) {
    cy.getElementWithLabel(title, 'a').first().click()
  }
  expectToSeeBookingOption() {
    this.expectChooseBookingOptionSection()
    cy.cardMainContent()
      .getElementWithLabel('First Class in City Club', '.learning-path-and-course-title > a')
      .first()
      .as('courseTitle')
  }

  expectChooseBookingOptionSection() {
    cy.cardRightContent().expectButtonWithLabelAndEnabled('Book this Course')
    cy.cardRightContent().getElementWithLabel('Choose Booking option', 'span')
    cy.cardRightContent().getElementWithLabel('Physical Classroom', 'span')
    if (!this.environment.isPrd()) {
      cy.cardRightContent().getElementWithLabel('View booking terms & conditions', 'a')
    }
    LmsManagementHelper.expectToSeeCourseLabel()
  }

  openViewMyCourseBy(courseTitle) {
    cy.getElementWithLabel(courseTitle, 'a')
      .parents('.col-lg-11')
      .siblings('.col-lg-1')
      .within(() => {
        cy.getThreeDots().click()
        cy.get('@cwThreeDots').clickDropdownName('View my courses')
      })
  }
  clickInstanceInMyCoursePopup(scheduleDate) {
    cy.swal2().within(() => {
      cy.getElementWithLabel(scheduleDate, 'li').find('a').first().click()
    })
  }
  withDrawCourseInstanceBy(scheduleDate, type) {
    cy.swal2().within(() => {
      cy.getElementWithLabel(scheduleDate, '.date-tooltip-wrapper > span')
        .should('be.visible')
        .parent()
        .siblings('h5')
        .should('have.text', type)
        .parent()
        .siblings('.w-45')
        .within(() => {
          cy.getElementWithLabel('Withdraw', 'a').click()
        })
    })
  }
  confirmWithDrawCourseInstance() {
    cy.swal2().within(($swal2) => {
      cy.wrap($swal2).swal2Confirm('Yes, Withdraw').click()
    })
  }

  assertCourseContent($content, courseName, courseOverview) {
    expect($content).to.contain.text(courseName)
    expect($content).to.contain.text(courseOverview)
    expect($content.find('span')).contain.text('Course')
    expect($content.find('img')).to.have.attr('alt').include('CourseImage')
    expect($content.find('img')).to.have.attr('data-url')
    cy.request($content.find('img').attr('data-url')).then(($result) => {
      expect($result.status).to.be.eq(200)
    })
  }
  expectToSeeCourseAfterSearchInMyLearning(
    courseInfo,
    btnTitle = Field.START,
    assertDuration = true,
    assertIcon = true
  ) {
    this.searchCourse(`"${courseInfo.name}"`)

    cy.get('div.learning-wrapper-title').within(() => {
      cy.contains(`"${courseInfo.name}"`).should('have.length.gt', 0)
    })
    cy.get('div#_myLearningPortlet_courseList').within(($item) => {
      this.assertCourseContent($item, courseInfo.name, courseInfo.courseOverview)
      cy.wrap($item).find('a.btn-outline-primary').contains(btnTitle)
      if (assertIcon) {
        cy.wrap($item).find('.lexicon-icon > g').should('be.visible')
      }
      if (assertDuration) {
        cy.wrap($item).find('span.badge > span').should('contain.text', 'Duration')
        cy.wrap($item)
          .find('span.badge > span')
          .should('match', /\d+\-\d+\s+Minutes/)
      }
    })
  }
  showItemPerPage(items) {
    this.#fetchCourseCatalog.set()
    cy.selectItemPerPage(items)
    this.#fetchCourseCatalog.wait()
  }
  viewMyCoursesByCourseName(courseName) {
    this.getCourses().then(($courses) => {
      if ($courses.find(`h5 > a:contains("${courseName}")`).length) {
        this.getCourseByName(courseName).within(() => {
          cy.getThreeDots().eq(1).click()
          this.#fetchBookedCourseInfo.set()
          cy.get('ul.dropdown-menu > li').eq(1).contains('View my courses').click()
          this.#fetchBookedCourseInfo.wait()
        })
      }
    })
  }
  expectCourseHasButton(courseName, buttonName) {
    this.getCourseByName(courseName).find('a.btn').should('contain.text', buttonName)
  }
  getLearningPathByName(learningPathName) {
    return this.#getEntryByName(learningPathName, '.course-list-wrapper')
  }
  getCourseByName(courseName) {
    return this.getCourses()
      .find('h5 > a.text-decoration-none')
      .contains(courseName)
      .parents('li.list-group-item')
  }
  getCourses() {
    return cy.get('#_myLearningPortlet_courseList').find('ul > li.list-group-item')
  }
  expectToSeeBookedCourseHasButton(instanceDate, buttonName) {
    this.getBookedInstanceByDate(instanceDate)
      .find('a.btn-default')
      .should('contain.text', buttonName)
  }
  getBookedInstanceByDate(instanceDate) {
    return cy
      .swal2()
      .get('span.text-decoration-underline')
      .contains(instanceDate)
      .parents('li')
      .should('be.visible')
  }
  expectBookedInstanceNoWithdraw(instanceDate) {
    this.getBookedInstanceByDate(instanceDate).within(() => {
      cy.get('a:contains("Withdraw")').should('not.exist')
    })
  }
  withdrawByDate(instanceDate) {
    cy.wait(300) // TODO: Add intercept instance list in popup
    cy.get('body').then(($body) => {
      if ($body.find('.swal2-popup').length) {
        cy.get('ul.instance-list').then(($instances) => {
          cy.wrap($instances)
            .invoke('text')
            .then(($text) => {
              if ($text.includes(instanceDate)) {
                this.getBookedInstanceByDate(instanceDate).within(($aCourse) => {
                  cy.wrap($aCourse).clickLinkByName('Withdraw')
                })
                this.#itcWithdrawCourse.set()
                cy.swal2Confirm('Yes, Withdraw').click()
                this.#itcWithdrawCourse.wait()
              } else {
                cy.log(`No ${instanceDate} to withdraw`)
              }
            })
        })
      }
    })
  }
  withdrawByName(instanceName) {
    cy.swal2()
      .invoke('text')
      .then((text) => {
        if (text.includes(instanceName)) {
          cy.getElementWithLabel(instanceName, 'li').within(() => {
            cy.clickLinkByName('Withdraw')
          })
        }
      })
    this.confirmWithDrawCourseInstance()
  }
  #getEntryByName(entryName, clazzWrapper) {
    return cy.get(clazzWrapper).find(`ul > li.list-group-item:contains("${entryName}")`)
  }
  clickCourseBy(courseTitle) {
    this.getCourseByName(courseTitle).within(() => {
      cy.getElementWithLabel(courseTitle, 'a').click()
    })
  }
  visitCourseInstanceByClickingThreeDots(courseName, courseInstanceId, instanceDate) {
    cy.get('div#_myLearningPortlet_courseList').within(() => {
      cy.get('li.list-group-item')
        .contains(courseName)
        .parentsUntil('.list-group-item')
        .as('courseListItem')
    })
    cy.get('@courseListItem').within(() => {
      cy.get('.col-lg-1 > .dropdown-three-dots')
        .click()
        .then(($threeDots) => {
          cy.wrap($threeDots).find('.dropdown-item').click().wait(500)
        })
    })
    cy.swal2().within(() => {
      cy.getSwal2Header().should('contain.text', 'My Courses')
      cy.getSwal2Content().within(($content) => {
        cy.wrap($content)
          .contains(instanceDate)
          .parentsUntil('li.border-bottom-style-dash-list')
          .then(($item) => {
            cy.wrap($item).next().find('a.btn-default').should('contain.text', Field.START).click()
            cy.url().should('include', courseInstanceId)
          })
      })
    })
  }
  visitCourseInstanceResourcesTab() {
    cy.get('div.cec-card__right-content div.d-md-block').within(() => {
      cy.clickLinkByName('Resources')
    })
  }
  visitCourseInstanceByClickingThreeDots(courseName, courseInstanceId, instanceDate) {
    cy.get('div#_myLearningPortlet_courseList').within(() => {
      cy.get('li.list-group-item')
        .contains(courseName)
        .parentsUntil('.list-group-item')
        .last()
        .as('courseListItem')
    })
    cy.get('@courseListItem').within(() => {
      cy.get('.col-lg-1.d-lg-block > .dropdown-three-dots')
        .click()
        .then(($threeDots) => {
          cy.wrap($threeDots).find('.dropdown-item').click().wait(500)
        })
    })
    cy.swal2().within(() => {
      cy.getSwal2Header().should('contain.text', 'My Courses')
      cy.getSwal2Content().within(($content) => {
        cy.wrap($content)
          .contains(instanceDate)
          .parentsUntil('li.border-bottom-style-dash-list')
          .then(($item) => {
            cy.wrap($item).next().find('a.btn-default').should('contain.text', Field.START).click()
            cy.url().should('include', courseInstanceId)
          })
      })
    })
  }
  visitCourseInstanceResourcesTab() {
    cy.get('div.cec-card__right-content nav').within(() => {
      cy.clickLinkByName('Resources')
    })
  }
  expectEmptyResultWhenSearchCourse(courseName) {
    this.searchCourse(`"${courseName}"`)
    cy.showEmptySearchResult(`"${courseName}"`)
  }

  expectOrganizationButNoCategoryInFilerCourse(orgFullCatalogId, categoryName) {
    cy.get('div.nav-nested-container').within(() => {
      cy.getElementWithLabel('Categories/Communities', 'span').click()
      cy.get(`input[value="${orgFullCatalogId}"]`)
        .should('be.visible')
        .parentsUntil('li.checkbox-wrapper')
        .within(() => {
          cy.get('label.input-checkbox-label').click()
          cy.get('div.dropdown-toggle').click()
          cy.get('ul.dropdown-menu').should('not.contain.text', categoryName)
          cy.get('ul.dropdown-menu').should('contain.text', 'You are not a part of any categories.')
        })
    })
  }

  expectOnlyCrosswiredEntryInCategoryCommunityFilterSection() {
    cy.getElementWithLabel('Categories/Communities', 'span').click()
    cy.getElementWithLabel('Categories/Communities', 'span')
      .parent('a')
      .next()
      .within(() => {
        cy.get('ul.collapse-element').then(($item) => {
          expect($item.find('li.checkbox-wrapper').length).to.be.eq(1)
          expect($item.find('label.input-checkbox-label')).to.contain.text('Crosswired')
        })
      })
  }
  expectToSeePopularCourses() {
    cy.get('div#_myLearningPortlet_courseList').within(() => {
      cy.get('span.header-top-title').should('contain.text', 'Popular Courses')
      cy.get('ul.list-group > li.list-group-item').should('have.length.gte', 5)
    })
  }
  expectToNotSeePopularCourses() {
    cy.get('div#_myLearningPortlet_courseList').within(() => {
      cy.get('span.header-top-title').should('not.exist')
    })
  }
  assertDropDownMenuItems(menuData) {
    const $menuItems = cy.get('.cw-dropdown').cwDropdownMenuItems()
    Cypress._.each(Cypress._.keys(menuData), (key) => {
      $menuItems.should('contain.text', menuData[key])
    })
  }
  assertHeadingWithTotal(title) {
    cy.contains(new RegExp(`${title}.*\(\\d+\)`)).should('have.length.gt', 0)
  }

  expectHeaderElementsAreVisible() {
    cy.get('div#_myLearningPortlet_learning  .nav-search').within(() => {
      const $menuItems = cy.get('.cw-dropdown').cwDropdownMenuItems()
      $menuItems.should('contain.text', 'Course Catalog')
      cy.get(`input[name='keywords']`).should('be.visible')
      cy.get(`button:contains('Search')`).should('be.visible')
    })
  }
  expectSortByDropdownIsVisibleWithItems(menuData) {
    cy.get('div#_myLearningPortlet_learning .rounded-top').within(() => {
      this.assertHeadingWithTotal('Course Catalog')
      this.assertDropDownMenuItems(menuData)
    })
  }
  expectCourseFiltersAreListed(filters) {
    cy.get('.col-md-3.d-md-flex').within(() => {
      cy.get('strong').should('contain.text', 'Filters')
      cy.get('a').should('contain.text', 'Reset')
    })

    cy.get('ul.management-bar-nav').within(() => {
      Object.keys(filters).forEach((key) => {
        cy.getElementWithLabel(filters[key].title, 'span').should('be.visible')
      })
    })
  }
  expectOnlyCourseTypeFilterIsExpended(filters) {
    cy.get('.col-md-3.d-md-flex').within(() => {
      cy.get('strong').should('contain.text', 'Filters')
      cy.get('a').should('contain.text', 'Reset')
    })

    cy.get('ul.management-bar-nav').within(() => {
      Object.keys(filters).forEach((key) => {
        if (filters[key].title === 'Course Types') {
          cy.getElementWithLabel(filters[key].title, 'span')
            .parent('a')
            .should('not.have.class', 'collapsed')
        } else {
          cy.getElementWithLabel(filters[key].title, 'span')
            .parent('a')
            .should('have.class', 'collapsed')
        }
      })
    })
  }

  expectCourseFiltersAreListed(filters) {
    cy.get('ul.management-bar-nav').within(() => {
      Object.keys(filters).forEach((key) => {
        const optionsElement = this.getFilterItems(filters[key].title)
        filters[key].items.forEach((item) => {
          optionsElement.should('contain.text', item)
          if (filters[key].title === 'Categories/Communities') {
            filters[key].exclude.forEach((excludeItem) => {
              optionsElement.should('not.contain.text', excludeItem)
            })
          }
          if (filters[key].title === Field.START_DATE && item === 'Custom') {
            optionsElement.within(() => {
              cy.getElementWithLabel('Custom', 'label')
                .click()
                .parent()
                .next()
                .find('input#datepicker-trigger')
                .should('be.visible')
                .as('datePickerTrigger')
            })
          }
        })
      })
    })
  }
  getFilterItems(name) {
    cy.getElementWithLabel(name, 'span')
      .parent('a')
      .invoke('attr', 'class')
      .then((classList) => {
        if (classList.split(' ').includes('collapsed')) {
          return cy
            .getElementWithLabel(name, 'span')
            .click()
            .then(($element) => {
              cy.wrap($element).parent('a').next()
            })
        }
      })

    return cy.getElementWithLabel(name, 'span').then(($element) => {
      cy.wrap($element).parent('a').next()
    })
  }
  expectDatePickerIsVisible(months) {
    const d = new Date()
    const currentYear = d.getFullYear()
    const currentMonth = d.getMonth()

    cy.get('@datePickerTrigger').click()
    cy.get('div.asd__wrapper').within(() => {
      cy.get('.asd__change-month-button--previous').should('be.visible')
      cy.get('.asd__change-month-button--next').should('be.visible')
      cy.get('.asd__action-buttons').should('contain.text', Field.CANCEL)
      cy.get('.asd__action-buttons').should('contain.text', Field.APPLY)
      cy.get('.asd__month-name').should('contain.text', months[d.getMonth()])
      cy.get('.asd__month-name').should('contain.text', d.getFullYear())
      cy.get('.asd__month-name').should('contain.text', months[d.getMonth() + 1])
      if (currentMonth === 11) {
        d.setFullYear(d.getFullYear() + 1)
        cy.get('.asd__month-name').should('contain.text', d.getFullYear())
      } else {
        cy.get('.asd__month-name').should('contain.text', currentYear)
      }
    })
  }
  clickFilterItem(filterSection, filterItem) {
    this.#fetchCourseCatalog.set()
    cy.get('ul.management-bar-nav').within(() => {
      this.getFilterItems(filterSection).within(() => {
        cy.getElementWithLabel(filterItem, 'label').click({ force: true })
      })
    })
    this.#fetchCourseCatalog.wait()
    cy.waitLoadingOverlayNotExist()
  }
  assertCourseContentAfterFilter($item, courseInfo) {
    courseInfo.resultShow.forEach((course) => {
      this.assertCourseContent($item, course.name, course.courseOverview)
    })
    if (courseInfo.resultNotShow) {
      courseInfo.resultNotShow.forEach((course) => {
        expect($item).not.to.contain.text(course.name)
      })
    }
  }
  expectOnlyVirtualClassesByApplyVirtualFilter(courseInfo) {
    this.clickFilterItem('Delivery Methods', 'Virtual Classroom')
    cy.get('div#_myLearningPortlet_courseList').within(($item) => {
      this.assertCourseContentAfterFilter($item, courseInfo)
    })
    cy.getElementWithLabel('Delivery Methods', 'span').click().wait(200)
  }

  expectOnlyPhysicalClassesByApplyPhysicalFilter(courseInfo) {
    this.clickFilterItem('Delivery Methods', 'Physical Classroom')
    cy.get('div#_myLearningPortlet_courseList').within(($item) => {
      this.assertCourseContentAfterFilter($item, courseInfo)
    })
    cy.getElementWithLabel('Delivery Methods', 'span').click().wait(200)
  }
  expectOnlySelfStudyBlendedClassesByApplySelfStudyBlendedFilter(courseInfo) {
    this.clickFilterItem('Delivery Methods', 'Self-study')
    cy.getElementWithLabel('Delivery Methods', 'span').click().wait(200)
    this.clickFilterItem('Delivery Methods', 'Blended Learning')
    cy.get('div#_myLearningPortlet_courseList').within(($item) => {
      this.assertCourseContentAfterFilter($item, courseInfo)
    })
  }
  expectToSeeEmptyProgressSectionBy(title, total) {
    cy.getElementWithLabel(title, 'a')
      .parents('.list-group-item')
      .within(() => {
        const completeLabel = `Completed: 0/${total}`
        LmsManagementHelper._expectToSeeProgressBaseSection({
          complete: { label: completeLabel, cssClazz: '.my-learning h5' },
          progressBarPercentage: '0',
        })
      })
  }
  clickTheLastPagination() {
    const pagination = new Pagination()
    cy.waitLoadingOverlayNotExist()
    pagination.clickTheLastPagination()
    cy.wait(1000)
    cy.waitLoadingOverlayNotExist()
  }
  expectOnlyProviderCoursesByApplyProviderFilter(providerName) {
    this.clickFilterItem('Providers', providerName)
    this.assertProviderCoursesList(providerName)
    this.clickTheLastPagination()
  }
  expectOnlyProviderCoursesInTheLastPaginationPage(providerName) {
    this.assertProviderCoursesList(providerName)
  }
  assertProviderCoursesList(providerName) {
    let totalItems = 0
    cy.get('div#_myLearningPortlet_courseList .list-group-item').each(($item) => {
      this.assertProvider($item, providerName)
      totalItems += 1
    })
    cy.get('div#_myLearningPortlet_courseList .list-group-item').then(($items) => {
      expect($items.length).to.be.eq(totalItems)
    })
  }
  assertProvider($item, providerName) {
    cy.wrap($item).within(() => {
      cy.contains(new RegExp(`Provider:.*?\\s+?${providerName}`)).should('have.length.gt', 0)
    })
  }
  clickOnCourseInPosition(position) {
    cy.get(`div#_myLearningPortlet_courseList .list-group-item:${position}`).within(() => {
      cy.get('h5 > a').click()
    })
  }
  expectTagsAndSkillsInCoursePosition(position, baseManageCourse) {
    cy.get(`div#_myLearningPortlet_courseList .list-group-item:${position}`).within(() => {
      cy.get('h5 > a').click()
    })
    baseManageCourse._verifyCourseTagsAndSkills(true, true)

    cy.go('back')
    cy.waitLoadingOverlayNotExist()
  }
  expectToShowOnlyFilteredCourses(courseInfo) {
    cy.get('div#_myLearningPortlet_courseList .list-group-item').then(($items) => {
      this.assertCourseContentAfterFilter($items, courseInfo)
      expect($items.length).to.be.gte(courseInfo.resultShow.length)
    })
  }
  #getCourseCatalogItem(callback = () => {}) {
    cy.get('div#_myLearningPortlet_learning .rounded-top').within(($content) => {
      cy.contains(/Course Catalog.*\(\d+\)/).then(($item) => {
        callback($item)
      })
    })
  }
  resetFilters() {
    this.#fetchCourseCatalog.set()
    cy.get('div#_myLearningPortlet_learning .rounded-top').within(($content) => {
      cy.contains('Reset').should('have.length.gt', 0).click()
    })
    this.#fetchCourseCatalog.wait()
  }
  getTotalCoursesInCatalog() {
    this.#getCourseCatalogItem(($item) => {
      cy.wrap($item).invoke('text').as('strTotalCourses')
    })
  }
  expectTotalCoursesAreSameAfterRemovingFilters() {
    this.#getCourseCatalogItem(($item) => {
      cy.wrap($item)
        .invoke('text')
        .then((text) => {
          cy.get('@strTotalCourses').should('be.eq', text)
        })
    })
  }
  clickDropdownFilterItem($elem, filterItem) {
    $elem.next().within(() => {
      cy.getElementWithLabel(filterItem, 'span').click({ force: true })
    })
  }
  assertCoursesAfterFilter(courseData) {
    cy.get('div#_myLearningPortlet_courseList').within(($item) => {
      Object.keys(courseData).forEach((key) => {
        this.assertCourseContent($item, courseData[key].name, courseData[key].courseOverview)
      })
    })
  }
  expectToSeeCoursesOfFilteredCommunity(filterItemName, communityCourseData) {
    this.#fetchCourseCatalog.set()
    cy.get('ul.management-bar-nav').within(() => {
      this.getFilterItems('Categories/Communities')
        .within(() => {
          cy.getElementWithLabel(Lms.community, 'label').as('communityFilter')
          cy.get('@communityFilter').click()
          cy.waitLoadingOverlayNotExist()
          this.clickDropdownFilterItem(cy.get('@communityFilter'), filterItemName)
        })
        .as('categoriesCommunitiesSection')
    })
    this.#fetchCourseCatalog.wait()
    this.assertCoursesAfterFilter(communityCourseData)
  }
  expectToSeeCoursesOfFilteredCommunityAndOrgLmsCategory(filterItemName, courseData) {
    this.#fetchCourseCatalog.set()
    cy.get('@categoriesCommunitiesSection').within(() => {
      cy.getElementWithLabel(Lms.fireCloudZone, 'label').as('fireCloudZone')
      cy.get('@fireCloudZone').click()
      cy.waitLoadingOverlayNotExist()
      this.clickDropdownFilterItem(cy.get('@fireCloudZone'), filterItemName)
    })
    this.#fetchCourseCatalog.wait()
    this.assertCoursesAfterFilter(courseData)
  }
  expectToSeeCoursesOfFilteredOrgLmsCategory(courseData) {
    this.#itcSearchCourseCatalog.set()
    cy.get('@communityFilter').click()
    this.#itcSearchCourseCatalog.wait()
    this.assertCoursesAfterFilter(courseData)
  }
  sortCourseBy(orderMethod) {
    this.#fetchCourseCatalog.set()
    cy.get('div#_myLearningPortlet_learning .rounded-top').within(() => {
      cy.clickCwDropdownItem(orderMethod)
      cy.waitLoadingOverlayNotExist()
    })
    this.#fetchCourseCatalog.wait()
  }
  _verifyBannerIsVisible() {
    cy.get('.learning-banner')
      .should('be.visible')
      .within(() => {
        cy.expectElementWithLabelVisible(
          'Expand your understanding of missions by choosing from a wide range of online courses.',
          'p'
        )
      })
  }
  _verifyNavSearch() {
    const options = ['My Learning', 'Course Catalog']
    cy.get('.nav-search').within(($nav) => {
      cy.wrap($nav).hasSvgIcon()
      options.forEach((option) => {
        cy.wrap($nav).getDropdownName(option).should('be.visible')
      })
      cy.get('.search-wrapper')
        .should('be.visible')
        .within(() => {
          cy.get('.icon-search').should('be.visible')
          cy.get('.search-input').should('be.visible')
          cy.expectElementWithLabelVisible('Search', 'button')
        })
    })
  }
  viewMyCourseThenWithdraw(courseName, instanceName) {
    this.getCourses().then(($courses) => {
      if ($courses.find(`h5 > a:contains("${courseName}")`).length) {
        this.viewMyCoursesByCourseName(courseName)
        this.withdrawByName(instanceName)
      }
    })
  }
  visitThenWithdrawByInstanceName(courseName, instanceName) {
    this.visitLearningPage()
    this.showItemPerPage(75)
    this.viewMyCourseThenWithdraw(courseName, instanceName)
  }
}
export default Learning
