import InterceptReq from '../../../base/InterceptReq'
import OrgStorage from './OrgStorage'

class LmsStorageDetail extends OrgStorage {
  itcFetchCourses = new InterceptReq('/organization/manage_storage/lms/get', 'fetchCourses')
  setItcCourses() {
    this.itcFetchCourses.set()
  }
  waitItcCourses() {
    this.itcFetchCourses.wait()
  }
  verifyCoursesSortAscendingByName() {
    cy.getCellData('name', 'fetchCourses', true).expectLocaleCompareSortAscending()
  }
  verifyCoursesSortDescendingByStorageUsage() {
    cy.getCellData('storageUsage', 'fetchCourses', true).expectByteSortDescending()
  }
  verifyCoursesSortDescendingByBandwidthUsage() {
    cy.getCellData('bandwidthUsage', 'fetchCourses', true).expectByteSortDescending()
  }
  verifySearchedCourse(course) {
    cy.cwTable()
      .rowName(course.name)
      .within(($topicRow) => {
        this.checkColumnData($topicRow, 1)
        this.checkColumnData($topicRow, 2)
        this.checkColumnData($topicRow, 3)
      })
    this.verifyPaginationSearchedCourse()
  }
  verifyPaginationSearchedCourse() {
    cy.get('ul.pagination li').then(($li) => {
      expect($li).to.have.length.of.at.most(3)
    })
    cy.get('ul.pagination').contains('li > a', '1').should('be.visible')
    this.checkPagination('previous')
    this.checkPagination('next')
  }
}

export default LmsStorageDetail
