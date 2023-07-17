import Account from '../account/Account'
import InterceptAction from '../base/InterceptAction'
import InterceptReq from '../base/InterceptReq'
import Field from '../constants/Field'
import { OrgConst } from '../org-management/base-org-management/OrgStub'
import CourseDetail from './CourseDetail'
import LearningAdmin from './LearningAdmin'

class ManageCourses extends LearningAdmin {
  courseDetail = new CourseDetail()
  account = new Account()
  #orgName

  constructor(orgName = 'fireCloud') {
    super()
    this.#orgName = orgName
  }

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
  itcFetchActivityConfig = new InterceptReq(
    '/course/activity/editor_config/fetch',
    'FetchActivityConfig '
  )
  itcAddVisitDiscussionActivity = new InterceptAction(
    '/add/visited-discussion/activity',
    'AddVisitDiscussionActivity'
  )
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
      .siblings('td.pr-0')
      .within(() => {
        cy.clickButtonByName(Field.VIEW)
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
      .first()
      .within(() => {
        cy.expectElementWithLabelVisible('Time Zone', 'label')
        cy.getElementWithLabel('Time Zone', 'label').siblings('select').should('be.visible')
      })
  }
  hoverOnCourseActivityScheduleBy(courseTitle, type) {
    cy.getElementWithLabel(courseTitle, '.pt-1.text-black').within(() => {
      cy.get('.course-instance-list').within(() => {
        cy.getElementWithLabel(type, 'td')
          .parents('tr')
          .within(($courseActivity) => {
            cy.get($courseActivity).as('courseActivity')
            cy.get('.date-tooltip-wrapper').realHover()
          })
      })
    })
  }
  accessManageCourseBy(fullCatalogId) {
    cy.visit(this.getFullCatalogUrl(fullCatalogId))
  }
  accessCourseInstanceBy(courseId, courseInstanceId, sidebar = 'Course Activities') {
    this.getManageCourseUrl().then((url) => {
      cy.visit(
        url +
          `?p_p_id=learningAdminManageCoursesPortlet&p_p_lifecycle=0&_learningAdminManageCoursesPortlet_mvcRenderCommandName=%2Fcourse_instance%2Fedit&_learningAdminManageCoursesPortlet_id=${courseInstanceId}&_learningAdminManageCoursesPortlet_courseId=${courseId}#_learningAdminManageCoursesPortlet_tab=${sidebar}`
      )
    })
    this.clickSideBarBy(sidebar) //bug: remove after bug is fixed
  }
  accessFireCloudCourseInstanceBy(courseId, courseInstanceId, sidebar = 'Course Activities') {
    cy.visit(
      OrgConst.FIRE_CLOUD_FULL_CATALOG_URL +
        `?p_p_id=learningAdminManageCoursesPortlet&p_p_lifecycle=0&_learningAdminManageCoursesPortlet_mvcRenderCommandName=%2Fcourse_instance%2Fedit&_learningAdminManageCoursesPortlet_id=${courseInstanceId}&_learningAdminManageCoursesPortlet_courseId=${courseId}#_learningAdminManageCoursesPortlet_tab=${sidebar}`
    )
    this.clickSideBarBy(sidebar) //bug: remove after bug is fixed
  }
  expectToShowTimezoneInEditCourseActivityBy(type) {
    this.clickButtonAddLearningActivity()
    this.clickAddLearningActivityBy(type)
    this.couldSeeTimezoneInEditCourseActivity(type)
  }
  invokeTimezoneTooltipElementVisibility() {
    cy.get('#_learningAdminManageCoursesPortlet_viewDetailToggle > div:nth-child(2)').within(
      ($courseActivity) => {
        cy.wrap($courseActivity).as('courseActivity')
        cy.wrap($courseActivity)
          .get('.tooltip-body')
          .invoke('css', 'visibility', 'visible')
          .should('have.css', 'visibility', 'visible')
        cy.get('.date-tooltip-wrapper').realHover({ force: true })
      }
    )
  }
  clickActivityToExpandAccordionBy(title) {
    cy.get('#_learningAdminManageCoursesPortlet_activityAccordion').within(() => {
      cy.getElementWithLabel(title, 'span').parents('a[data-toggle="collapse"]').click()
    })
  }
  updateTimezone(timezone) {
    this.account.visitAccountSettings()
    cy.waitLoadingOverlayNotExist()
    cy.wait(2000) // wait for element is ready
    cy.getElementWithLabel('Time Zone', 'label')
      .parent()
      .within(($timezone) => {
        cy.wrap($timezone).clickDropdownSelect(timezone)
        cy.wait(2000) // wait for element is ready, cannot click save immediately
      })
    this.account.clickButtonSaveGeneralInGeneralSetting()
  }
  expectedUserContainStatus(email, status = 'In Progress') {
    cy.getElementWithLabel(email, 'td')
      .parent()
      .then(() => {
        cy.expectElementWithLabelVisible(status, 'td')
      })
  }
}
export default ManageCourses
