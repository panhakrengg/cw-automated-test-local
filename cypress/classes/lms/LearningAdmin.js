import InterceptReq from '../base/InterceptReq'
import Field from '../constants/Field'
import { OrgConst } from '../org-management/base-org-management/OrgStub'
import CourseDetail from './CourseDetail'
import Learning from './Learning'

class LearningAdmin extends CourseDetail {
  learning = new Learning()

  itcFetchManageCourse = new InterceptReq('/manage_courses/fetch', 'FetchManageCourse')
  itcCourseProperties = new InterceptReq('/course/properties', 'CourseProperties')
  itcFetchCourseInstance = new InterceptReq(
    '/manage_courses/fetch_course_instances',
    'FetchCourseInstance'
  )
  itcFetchCourseActivities = new InterceptReq(
    '/manage_courses/course_activities/fetch',
    'FetchCourseActivities'
  )
  itcFetchUploadLessonOptions = new InterceptReq(
    '/manage_courses/upload_lesson/fetch_options',
    'FetchUploadLessonOptions'
  )

  loginAsCourseAdminInJapan(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, 'Course.instance.admin.auCourseAdTimeZ')
  }
  loginAsCourseLeaderInUSA(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, 'Course.instance.leader.auTimeUSA')
  }
  loginAsCourseLeadFacilitatorInMoscow(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, 'Course.instance.leadFacilitator.auTimeMoscow')
  }
  getFullCatalogUrl(fullCatalogId) {
    return `/web/org-full-catalog-${fullCatalogId}`
  }
  getManageCourseUrl() {
    return cy.wrap(OrgConst.LEARNING_ADMIN_URL)
  }
  searchCourse(title) {
    this.itcFetchManageCourse.set()
    cy.get('.cw-top-header__search-input').within(() => {
      cy.inputByPlaceholder('Search courses', title).type(`{enter}`)
    })
    this.itcFetchManageCourse.wait()
  }
  clickCourseBy(title) {
    this.itcCourseProperties.set()
    cy.getElementWithLabel(title, 'a').click()
    this.itcCourseProperties.wait()
  }
  clickSideBarBy(name = Field.OVERVIEW) {
    cy.getElementWithLabel(name, 'a.cec-sidebar__nav-link').click()
  }
  clickCourseInstanceBy(type = 'Self-study') {
    this.itcFetchCourseActivities.set()
    cy.getElementWithLabel(type, 'td')
      .first()
      .parent()
      .within(($row) => {
        cy.wrap($row).clickExact3DotsDropdownItem(Field.VIEW)
      })
    this.itcFetchCourseActivities.wait()
  }
  clickButtonAddLearningActivity() {
    cy.getElementWithLabel('Add Learning Activities', 'a').first().click()
  }
  clickAddLearningActivityBy(type) {
    cy.getElementWithLabel(type, 'span').parents('div.cursor-pointer').click()
  }
  couldSeeTimezoneInEditCourseActivity(type) {
    cy.getElementWithLabel(type, 'span')
      .parents('.item-re-order')
      .within(() => {
        cy.expectElementWithLabelVisible('Time Zone', 'label')
        cy.getElementWithLabel('Time Zone', 'label').siblings('select').should('be.visible')
      })
  }
  hoverOnCourseActivityScheduleBy(courseTitle, type, currentTimezone, activityTimezone) {
    cy.getElementWithLabel(courseTitle, '.pt-1.text-black').within(() => {
      cy.get('.course-instance-list').within(() => {
        cy.getElementWithLabel(type, 'td')
          .parents('tr')
          .within(($courseActivity) => {
            cy.get($courseActivity).as('courseActivity')
            cy.get('.date-tooltip-wrapper').realHover()
            this.learning.verifyDisplayConvertTimezoneTooltipIn(currentTimezone, activityTimezone)
          })
      })
    })
  }
  loginAsCourseLeadFacilitatorInMoscow(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, 'Course.instance.leadFacilitator.auTimeMoscow')
  }
  loginAsCourseFacilitator(redirectUrl = '/') {
    cy.visitThenSignIn(redirectUrl, 'Course.instance.facilitator.auTimeLondon')
  }
  accessFireCloudCourseDetailBy(courseId) {
    this.itcFetchCourseInstance.set()
    cy.visit(
      OrgConst.FIRE_CLOUD_FULL_CATALOG_URL +
        `/manage-courses?p_p_id=learningAdminManageCoursesPortlet&_learningAdminManageCoursesPortlet_mvcRenderCommandName=%2Fcourse%2Fedit&_learningAdminManageCoursesPortlet_id=${courseId}&_learningAdminManageCoursesPortlet_tab=course-instances`
    )
    this.itcFetchCourseInstance.wait()
  }
  accessCourseBy(orgFullCatalogId, courseId, tab = 'course-instances') {
    cy.visit(
      `/web/org-full-catalog-${orgFullCatalogId}/manage-courses?p_p_id=learningAdminManageCoursesPortlet&p_p_lifecycle=0&_learningAdminManageCoursesPortlet_mvcRenderCommandName=%2Fcourse%2Fedit&_learningAdminManageCoursesPortlet_id=${courseId}&_learningAdminManageCoursesPortlet_tab=${tab}`
    )
  }
  clickThreeDotLearnerResourceBy(scheduleDate) {
    cy.get('.course-instance-list').within(() => {
      cy.getElementWithLabel(scheduleDate, 'span')
        .parents('.cursor-pointer')
        .within(() => {
          cy.getThreeDots().click()
          cy.get('@cwThreeDots').clickDropdownName('Learner Resources')
        })
    })
  }
}
export default LearningAdmin
