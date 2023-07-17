import InterceptReq from '../base/InterceptReq'
import Field from '../constants/Field'

class CourseDetailResource {
  #itcFetchResources = new InterceptReq(
    '/course_catalog/course/detail/fetch_recourses',
    'fetchResources'
  )
  #itcFetchCourseCatalogActivities = new InterceptReq(
    '/course_catalog/course/activities',
    'fetchCourseCatalogActivities'
  )

  visitCourseDetailResourceBy(courseInstanceId) {
    this.visitCourseDetail(courseInstanceId)
    this.#itcFetchResources.set()
    this.clickCourseLink('Resources')
    this.#itcFetchResources.wait()
  }

  visitCourseDetail(courseInstanceId) {
    this.#itcFetchCourseCatalogActivities.set()
    cy.visit(`/web/ci${courseInstanceId}/course-detail`)
    this.#itcFetchCourseCatalogActivities.wait()
  }

  clickCourseLink(linkName) {
    cy.cecCard().cardRightContent().find('.nav').contains(linkName).click()
  }

  expectToSeeCourseDetailResourcePage() {
    cy.cardMainContent().within(($mainContent) => {
      cy.wrap($mainContent).find('.cec-px-6').should('contain.text', 'Resources')
      cy.wrap($mainContent).get('.justify-content-end > button').should('not.exist')
      cy.wrap($mainContent)
        .get('table th')
        .then(($header) => {
          cy.wrap($header).should('have.length', '2')
          cy.wrap($header).expectItemNameWithIndex(0, Field.NAME)
          cy.wrap($header).expectItemNameWithIndex(1, Field.SIZE)
        })
      cy.wrap($mainContent)
        .get('table')
        .within(($table) => {
          cy.wrap($table)
            .rowName(Field.FOLDERS)
            .should('be.visible')
            .next()
            .getCheckbox()
            .should('not.exist')
          cy.wrap($table)
            .rowName(Field.FILES)
            .should('be.visible')
            .next()
            .getCheckbox()
            .should('not.exist')
        })
    })
  }

  download(fileName) {
    this.getTable().rowName(fileName).find('.cursor-pointer').click()
  }

  getTable() {
    return cy.cecCard().cardMainContent().find('table tr').parents('table').should('be.visible')
  }

  accessToFolder(folderName) {
    this.#itcFetchResources.set()
    this.getTable().rowName(folderName).find('span').click()
    this.#itcFetchResources.wait()
  }
}

export default CourseDetailResource
