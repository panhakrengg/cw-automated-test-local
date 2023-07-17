import Field from '../../../../constants/Field'
import { OrgConst } from '../../../../org-management/base-org-management/OrgStub'

class CourseActivitiesQueries {
  getCourseInstanceActivitiesUrl(courseId, instanceId) {
    return (
      OrgConst.FIRE_CLOUD_FULL_CATALOG_URL +
      `/manage-courses?p_p_id=learningAdminManageCoursesPortlet&p_p_lifecycle=0&_learningAdminManageCoursesPortlet_mvcRenderCommandName=%2Fcourse_instance%2Fedit&_learningAdminManageCoursesPortlet_id=${instanceId}&_learningAdminManageCoursesPortlet_courseId=${courseId}&_learningAdminManageCoursesPortlet_tab=activities`
    )
  }

  getAddLearningActivityButton() {
    return cy.getElementWithLabel('Add Learning Activities', 'a').first()
  }

  getAllActivityTypesInCreateActivityPopup() {
    cy.swal2().within(() => {
      cy.get('div.cursor-pointer').as('activityTypes')
    })
    return cy.get('@activityTypes')
  }

  getActivityTypeInCreateActivityPopupByType(activityType) {
    cy.swal2().within(() => {
      cy.getElementWithLabel(activityType, 'span').parents('.row.mx-0').parent().as('activityType')
    })
    return cy.get('@activityType')
  }

  getTheLastCourseActivity() {
    cy.get('div[role="activitiesList"] > .re-order-wrapper').within(() => {
      cy.get('.item-re-order').last().as('activities')
    })
    return cy.get('@activities')
  }

  getChooseFromActivityLibraryLink() {
    return cy.getElementWithLabel('choose from the activity library.', 'a')
  }

  getActivityByTitle(title) {
    cy.get('div[role="activitiesList"]').within(() => {
      cy.getElementWithLabel(title, 'span.text-black')
        .parents('a[data-toggle="collapse"]')
        .as('activity')
    })
    return cy.get('@activity')
  }

  getTotalActivitiesByTitle(title) {
    cy.wrap([]).as('totalActivities')
    cy.get('.course-activities-holder').within(($holder) => {
      const total = $holder.find(`span.text-black:contains(${title})`).length
      if (total) {
        cy.wrap(total).as('totalActivities')
      }
    })
    return cy.get('@totalActivities')
  }

  getEditDetailsLink() {
    return cy.getElementWithLabel(Field.EDIT_DETAILS, 'a')
  }

  getInputActivityTitle() {
    return cy.get('input[placeholder="Enter the title"]')
  }

  getAccordionActivityItem(activityTitle) {
    return this.getActivityByTitle(activityTitle).first().parents('.accordion__header').parent()
  }
}

export default CourseActivitiesQueries
