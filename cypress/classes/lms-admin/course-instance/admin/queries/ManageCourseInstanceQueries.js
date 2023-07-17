import Field from '../../../../constants/Field'
import Converter from '../../../../utilities/Converter'

class ManageCourseInstanceQueries {
  #INSTANCE_LIST = {
    activeInstanceIndex: 0,
    archiveInstanceIndex: 1,
  }

  getManageCourseInstanceUrl(courseId) {
    return `/manage-courses?p_p_id=learningAdminManageCoursesPortlet&_learningAdminManageCoursesPortlet_mvcRenderCommandName=%2Fcourse%2Fedit&_learningAdminManageCoursesPortlet_id=${courseId}&_learningAdminManageCoursesPortlet_tab=course-instances`
  }

  #getActiveCourseInstanceTable() {
    return cy.get('.course-instance-list').eq(this.#INSTANCE_LIST.activeInstanceIndex)
  }

  #getArchivedCourseInstanceTable() {
    return cy.get('.course-instance-list').eq(this.#INSTANCE_LIST.archiveInstanceIndex)
  }

  #getCourseInstanceByTitle(title, tableIndex = 0) {
    cy.wrap([]).as('rowData')
    cy.wait(3000)
    cy.get('.course-instance-list')
      .eq(tableIndex)
      .within(($table) => {
        if ($table.find(`span[title="${title}"]`).length) {
          cy.wrap($table).get(`span[title="${title}"]`).parent().parent().as('rowData')
        }
      })
    return cy.get('@rowData')
  }

  getActiveCourseInstanceByTitle(title) {
    return this.#getCourseInstanceByTitle(title, this.#INSTANCE_LIST.activeInstanceIndex)
  }

  getArchivedCourseInstanceByTitle(title) {
    return this.#getCourseInstanceByTitle(title, this.#INSTANCE_LIST.archiveInstanceIndex)
  }

  getAllActiveCourseInstances() {
    cy.wrap([]).as('rowData')
    cy.wait(3000)
    this.#getActiveCourseInstanceTable().within(($table) => {
      if ($table.find('tr').length) cy.wrap($table).get(`tr`).as('rowData')
    })
    return cy.get('@rowData')
  }

  getAllArchivedCourseInstances() {
    cy.wrap([]).as('rowData')
    cy.wait(3000)
    this.#getArchivedCourseInstanceTable().within(($table) => {
      if ($table.find('tr').length) cy.wrap($table).get(`tr`).as('rowData')
    })
    return cy.get('@rowData')
  }

  getTotalArchived() {
    cy.get(`span:contains('Archived') > i`)
      .invoke('text')
      .then(($text) => {
        const totalArchived = Converter.removeSpecialCharacter($text)
        cy.wrap(totalArchived).as('totalInstances')
      })
    return cy.get('@totalInstances')
  }

  getButtonCreateNewInstance() {
    return cy.getElementWithLabel(Field.CREATE_A_NEW_INSTANCE, 'button.btn-primary')
  }
}

export default ManageCourseInstanceQueries
