import { OrgConst } from '../../../../org-management/base-org-management/OrgStub'

class CourseInstanceOverviewQueries {
  getCourseInstanceOverviewUrl(courseId, instanceId) {
    return (
      OrgConst.FIRE_CLOUD_FULL_CATALOG_URL +
      `/manage-courses?p_p_id=learningAdminManageCoursesPortlet&p_p_lifecycle=0&_learningAdminManageCoursesPortlet_mvcRenderCommandName=%2Fcourse_instance%2Fedit&_learningAdminManageCoursesPortlet_id=${instanceId}&_learningAdminManageCoursesPortlet_courseId=${courseId}&_learningAdminManageCoursesPortlet_tab=overview`
    )
  }

  getCourseInstanceTitle() {
    return cy.get('.cec-card__title > span')
  }

  getPublishToggle() {
    cy.cecCard()
      .cardRightContent()
      .within(() => {
        cy.get('.cec-card__header .d-none .cw-toggle-button > label > input').as('toggle')
      })
    return cy.get('@toggle')
  }

  getPublishState() {
    cy.wait(300) // Note: Invoke check immediately
    return this.getPublishToggle().invoke('prop', 'checked')
  }

  getIdThenDefineAlias() {
    cy.url().then((url) => {
      const id = url
        .split('_learningAdminManageCoursesPortlet_id=')
        .pop()
        .split('&_learningAdminManageCoursesPortlet_')[0]
      cy.wrap(id).as('instanceId')
    })
  }

  getId() {
    return cy.get('@instanceId')
  }
}

export default CourseInstanceOverviewQueries
