import InterceptReq from '../../../base/InterceptReq'
import OrgStorage from './OrgStorage'
import Field from '../../../constants/Field'

class CommunityStorageDetail extends OrgStorage {
  itcFetchCommunities = new InterceptReq(
    '/organization/manage_storage/communities/get',
    'fetchCommunities'
  )
  setItcCommunities() {
    this.itcFetchCommunities.set()
  }
  waitCommunities() {
    this.itcFetchCommunities.wait()
  }
  verifyCommunitiesSortAscending() {
    cy.getCellData('name', 'fetchCommunities', true).expectLocaleCompareSortAscending()
  }
  verifyCommunitiesSortDescending() {
    cy.getCellData('name', 'fetchCommunities', true).expectLocaleCompareSortDescending()
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
  verifyCommunitiesTableHeaders(communityTable, headers) {
    cy.wrap(headers).each((header) => {
      cy.wrap(communityTable).theadByName(header)
    })
  }
  verifyCommunity(community, storageStatic) {
    this.setItcCommunities()
    this.search(community.label)
    this.waitCommunities()
    cy.cwTable()
      .rowName(community.label)
      .within(($row) => {
        this.checkCommunityData($row, community)
        this.checkUsageInViewDetailPopup($row, community.label, true, storageStatic)
      })
  }
  checkCommunityData(row, community) {
    cy.wrap(row).contains('td:nth-child(1)', community.label).should('be.visible')
    this.expectSizeUsageBy(row, 2)
    this.expectSizeUsageBy(row, 3)
    this.expectSizeUsageBy(row, 4)
    this.expectSizeUsageBy(row, 5)
  }
  checkUsageInViewDetailPopup(row, copName, isOrgCoP, storageStatic) {
    cy.wrap(row)
      .getThreeDots()
      .first()
      .within(($threeDots) => {
        cy.wrap($threeDots).get('a#_orgManageStoragePortlet_dropdownMenuLinkdropdown_4').click()
        cy.wrap($threeDots).clickDropdownName('View details')
        cy.wrap($threeDots)
          .getPopup()
          .getPopupBody()
          .within(($popup) => {
            cy.wrap($popup).find('img.img-fluid')
            cy.wrap($popup).get('.text-center > h4').should('have.text', copName)
            cy.wrap($popup).get('span > i').should('have.text', '(Owner)')
            cy.wrap($popup).contains(storageStatic.maxStorage + ':')
            cy.wrap($popup).contains(storageStatic.maxBandwidth + ':')
            cy.wrap($popup).contains(storageStatic.storageUsagePopup + ':')
            cy.wrap($popup).contains(storageStatic.bandwidthUsagePopup + ':')

            cy.wrap($popup).get('.row').eq(2).as('tableStorageHeader')
            cy.get('@tableStorageHeader').get('.col-9 h4').contains(Field.DETAILS)
            cy.get('@tableStorageHeader').get('.col-3 h4').contains('Storage')
            cy.wrap($popup).get('div.row').as('row')
            cy.get('@row').filter('.row:contains("File Sharing")')
            cy.get('@row').filter('.row:contains("Others")')
            if (isOrgCoP) {
              // BUG:
              // cy.get('@row')
              //   .filter('.row')
              //   .should('not.contain.text', `${storageStatic.courseAndCourseInstance}`)
              //   .should('not.contain.text', `${storageStatic.communityLessonLibrary}`)
            } else {
              cy.get('@row').filter(`.row:contains("${storageStatic.courseAndCourseInstance}")`)
              cy.get('@row').filter(`.row:contains("${storageStatic.communityLessonLibrary}")`)
            }
          })
        cy.wrap($threeDots).getPopup().closePopup()
      })
  }
  verifyCommunitiesQuickTips(quickTip) {
    this.quickTip.title(quickTip.title)
    this.quickTip.desc(quickTip.desc)
    this.quickTip.listContain(quickTip.list[0])
    this.quickTip.listContain(quickTip.list[1], 1)
    this.quickTip.listContain(quickTip.list[2], 2)
    this.quickTip.hasMoreTipsLink()
  }
  #getCecBaseCardBody(callback = () => {}) {
    cy.cecCard()
      .cecCardBodyWithIndex(1)
      .within(($cardBody) => {
        callback($cardBody)
      })
  }
  verifyDropdownChangeReport(communityStorage) {
    cy.cecCard().cecCardTitle().contains(communityStorage.label)
    this.#getCecBaseCardBody(($cardBody) => {
      cy.get('h1.font-size-22').contains(communityStorage.quickTip.title)
      cy.wrap($cardBody).getDropdownToggle().parent('.cw-dropdown').within(() => {
        cy.getDropdownList().each(($item, index) => {
          super.generateDropdownReport($item, index)
        })
      })
    })
  }
  verifyCommunityListHeader(communityStorage) {
    cy.get('.d-flex.flex-column.align-items-lg-center')
      .find('h1.font-weight-light')
      .contains(communityStorage.label)
    cy.cwTable().within(($communityTable) => {
      this.verifyCommunitiesTableHeaders($communityTable, communityStorage.table.headers)
    })
  }
  verifyCircularStorage(storageStatic) {
    cy.get('#circulargauge_control_1_Axis_0_Annotation_0').should('be.visible')
    cy.get('#circulargauge_control_1_Axis_0_Annotation_1').should('be.visible')
    cy.get('svg#circulargauge_control_1_svg').should('be.visible')
    cy.get(`div p strong:contains("${storageStatic.totalStorage}")`).should('be.visible')
    cy.get('#circulargauge_control_2_Axis_0_Annotation_0').should('be.visible')
    cy.get('#circulargauge_control_2_Axis_0_Annotation_1').should('be.visible')
    cy.get('#circulargauge_control_2_svg').should('be.visible')
    cy.get(`div p strong:contains("${storageStatic.totalBandwidth}")`).should('be.visible')
  }
}

export default CommunityStorageDetail
