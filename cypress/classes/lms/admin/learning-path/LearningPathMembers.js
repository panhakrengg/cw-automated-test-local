import InterceptReq from '../../../base/InterceptReq'
import Field from '../../../constants/Field'
import { CoPConst } from '../../../lms-training-cop/base/CoPStub'

class LearningPathMembers {
  #itcGetLearningPathMember = new InterceptReq('/learning_path/member/get', 'GetLearningPathMember')

  #itcRemoveLearningPathMember = new InterceptReq(
    '/learning_path/member/remove',
    'RemoveLearningPathMember'
  )

  visitMembers(lPId) {
    this.#itcGetLearningPathMember.set()
    cy.visit(this.#getCopLearningPathAdminUrl(lPId, 'members'))
    this.#itcGetLearningPathMember.wait()
    cy.cecTable()
  }

  _visitOrgLmsLearningPath(orgFullCatalogId, lPID, tabName = 'members') {
    this.#itcGetLearningPathMember.set()
    cy.visit(
      `/web/org-full-catalog-${orgFullCatalogId}/manage-learning-paths?p_p_id=learningPathAdminPortlet&p_p_lifecycle=0&_learningPathAdminPortlet_learningPathId=${lPID}&_learningPathAdminPortlet_mvcRenderCommandName=%2Flearning_path%2Fdetail#_learningPathAdminPortlet_tab=${tabName}`
    )
    this.#itcGetLearningPathMember.wait()
  }

  _expectToSeeLearningPathMemberInfo(user, name, status) {
    this.#expectToSeeTableHeader()
    this.#expectToSeeCorrectUserInfo(user, name, status)
  }

  _expectToSortLearningPathMemberDescending() {
    this.#getLearningPathMembersResult().then((result) => {
      cy.wrap(result.map((c) => new Date(c['joinedDate']).getTime())).expectSortDescending()
    })
  }

  _removeLearningPathMember() {
    cy.get('@cwTableTh')
      .getTableRow(0)
      .within(($rowData) => {
        cy.wrap($rowData).clickDropdownItem(Field.DELETE)
        this.#itcRemoveLearningPathMember.set()
        cy.wrap($rowData).swal2().swal2Confirm(Field.YES_REMOVE).click()
        this.#itcRemoveLearningPathMember.wait()
      })
  }

  _clickOnDateLabelToSortMember() {
    this.#itcGetLearningPathMember.set()
    cy.get('@cwTableTh').contains('Date joined').click()
    this.#itcGetLearningPathMember.wait()
    cy.waitLoadingOverlayNotExist()
  }

  #getLearningPathMembersResult() {
    return new Cypress.Promise((resolve) => {
      this.#itcGetLearningPathMember
        .getResponse()
        .its('response.body.result.members')
        .then((result) => {
          resolve(result)
        })
    })
  }

  #expectToSeeTableHeader() {
    const tableHeader = ['User', 'Email', 'Date joined', 'Status']
    tableHeader.forEach((header) => {
      cy.get('@cwTableTh').contains(header).should('be.visible')
    })
  }

  #expectToSeeCorrectUserInfo(user, userVisibility, status) {
    this.#expectToSeeTableRow(userVisibility, user.email, status)
  }

  #expectToSeeTableRow(name, email, status = 'In Progress') {
    cy.get('@cwTableTh')
      .getTableRow(0)
      .within(($rowData) => {
        this.#checkTableRowData($rowData, 1, name)
        this.#checkTableRowData($rowData, 2, email)
        this.#checkTableRowData($rowData, 4, status)
      })
  }

  #checkTableRowData(rowData, index, content) {
    cy.wrap(rowData).getTableDataByIndex(index).contains(content)
  }

  #getCopLearningPathAdminUrl(lPId, tab = 'overview') {
    return (
      `${CoPConst.URL}/admin/admin?p_p_id=copMemberManagementPortlet&p_p_lifecycle=0&` +
      '_copMemberManagementPortlet_learningPathId=' +
      `${lPId}` +
      '&_copMemberManagementPortlet_mvcRenderCommandName=%2Flearning_path%2Fdetail#' +
      '_copMemberManagementPortlet_tab=' +
      `${tab}`
    )
  }
}
export default LearningPathMembers
