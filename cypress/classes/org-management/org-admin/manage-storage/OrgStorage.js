import moment from 'moment'
import InterceptReq from '../../../base/InterceptReq'
import QuickTip from '../../../components/QuickTip'
import Converter from '../../../utilities/Converter'
import DateUtil from '../../../utilities/DateUtil'
import { OrgConst } from '../../base-org-management/OrgStub'
import SignInAs from '../../../utilities/SignInAs'
import Field from '../../../constants/Field'

class OrgStorage {
  quickTip = new QuickTip()
  static manageStorage = 'Manage Storage'
  viewCommunity = 0
  viewLms = 1

  #itcFetchCommunities = new InterceptReq(
    '/organization/manage_storage/communities/get',
    'fetchCommunities'
  )
  #itcFetchCourses = new InterceptReq('/organization/manage_storage/lms/get', 'fetchCourses')

  #itcOverview = new InterceptReq('/organization/manage_storage/overview/get', 'fetchOverview')

  setItcOverview() {
    this.#itcOverview.set()
  }

  waitOverview() {
    this.#itcOverview.wait()
  }

  setItcCommunities() {
    this.#itcFetchCommunities.set()
  }
  waitCommunities() {
    this.#itcFetchCommunities.wait()
  }

  setItcCourses() {
    this.#itcFetchCourses.set()
  }
  waitItcCourses() {
    this.#itcFetchCourses.wait()
  }

  generateDropdownReport($item, index) {
    if (index) {
      let dropdownItemDate = moment().subtract(index, 'month').format(this.getReportDateFormat())
      cy.wrap($item).should('contain.text', dropdownItemDate)
    } else {
      cy.wrap($item).eq(index).should('contain.text', this.getCurrentReportDate())
    }
  }
  getReportDateFormat() {
    return 'MMM, YYYY'
  }
  getCurrentReportDate() {
    let dateUtil = new DateUtil()

    return dateUtil.getCurrentDate('MMM, YYYY')
  }
  getElementDetailRow() {
    cy.get('.bg-light-gray').within(($bg) => {
      cy.wrap($bg).children('.row').eq(2).as('elementDetailRow')
    })
  }
  goToStorageDetail(viewIndex) {
    this.getElementDetailRow()
    cy.get('@elementDetailRow').find('a[role="button"]').eq(viewIndex)
      .contains(Field.VIEW).click()
  }
  verifyCommunitiesSortDescending() {
    cy.getCellData('name', 'fetchCommunities', true).expectLocaleCompareSortDescending()
  }
  accessManageStorageByOrgAdmin() {
    SignInAs.orgAdmin(OrgConst.TABS.MANAGE_STORAGE)
  }
  clickSortBy(name, intercept) {
    intercept.set()
    cy.cwTable()
    cy.get('@cwTableTh').clickTableHeader(name)
    intercept.wait()
  }
  verifyCommunitiesSortDescendingByStorageUsage() {
    cy.getCellData('storageUsage', 'fetchCommunities', true).expectByteSortDescending()
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
  search(keywords) {
    cy.get('#_orgManageStoragePortlet_orgManageStorage input[placeholder="Search"]').type(
      `"${keywords}" {enter}`
    )
  }
  clearSearch() {
    cy.get('#_orgManageStoragePortlet_orgManageStorage input[placeholder="Search"]').clear()
  }
  checkColumnData(subject, index) {
    this.expectSizeUsageBy(subject, index)
  }
  checkPagination(name) {
    cy.get('ul.pagination').invoke('attr', 'xlink:href').contains(`${name}`).should('be.visible')
  }
  expectSizeUsageBy(rowSubject, rowIndex) {
    cy.wrap(rowSubject)
      .get(`td:nth-child(${rowIndex})`)
      .find('> div span')
      .invoke('text')
      .then(($text) => {
        expect(Converter.getNumberFrom($text)).to.exist
      })
  }
  expectCopShowInList(copName) {
    cy.get('.cw-table-wrapper').within(() => {
      cy.getElementWithLabel(copName, 'span').should('be.visible')
    })
  }
}

export default OrgStorage
