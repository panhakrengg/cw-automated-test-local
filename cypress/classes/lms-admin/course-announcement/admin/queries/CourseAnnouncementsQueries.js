import Field from '../../../../constants/Field'
import { OrgConst } from '../../../../org-management/base-org-management/OrgStub'
import { AnnouncementLabel } from '../constant/CourseAnnouncementsConstant'

class CourseAnnouncementsQueries {
  getCourseAnnouncementsUrl(courseId) {
    return (
      OrgConst.FIRE_CLOUD_FULL_CATALOG_URL +
      `/manage-courses?p_p_id=learningAdminManageCoursesPortlet&p_p_lifecycle=0&_learningAdminManageCoursesPortlet_mvcRenderCommandName=%2Fcourse%2Fedit&_learningAdminManageCoursesPortlet_id=${courseId}&_learningAdminManageCoursesPortlet_tab=course-announcements`
    )
  }

  getAnnouncementRow(announcementBody) {
    return cy.getElementWithLabel(announcementBody, 'tr')
  }

  getModifyAnnouncementBody() {
    return cy.get('.cec-p-6')
  }

  getTimeZoneDropdown() {
    return cy.getElementWithLabel('Time Zone', 'label').parent()
  }

  getFirst255AnnouncementBody(announcementBody) {
    return announcementBody.substring(0, 255)
  }

  getInstanceLabel(totalInstance) {
    return totalInstance > 1 ? AnnouncementLabel.INSTANCES : AnnouncementLabel.INSTANCE
  }
  getIsButtonPopupVisible() {
    cy.wait(1000)
    cy.get('body.public-page').then(($body) => {
      cy.wrap($body.find(`button:contains("${Field.PUBLISH}")`) > 0).as('isPopupVisible')
    })

    return cy.get('@isPopupVisible')
  }
  getTogglePublishValidState() {
    return cy.cwToggleInput(AnnouncementLabel.PUBLISH_ANNOUNCEMENT).invoke('prop', 'checked')
  }
}

export default CourseAnnouncementsQueries
