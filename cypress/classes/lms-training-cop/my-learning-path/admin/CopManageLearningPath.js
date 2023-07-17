import InterceptReq from '../../../base/InterceptReq'
import Field from '../../../constants/Field'
import CoPInfoYamlStub from '../../stub/CoPInfoYamlStub'
import CreateLearningPathYaml from '../../stub/CreateLearningPathYaml'
import ExistLearningPathYamlStub from '../../stub/ExistLearningPathYamlStub'

class CoPManageLearningPath {
  _copAdminUrl
  aliasLearningItem = `@learningItem`
  #stubList = {
    copInfo: new CoPInfoYamlStub(),
    existLearningPath: new ExistLearningPathYamlStub(),
    createLearningPath: new CreateLearningPathYaml(),
  }

  constructor() {
    this.stub = this.#stubList
  }

  _itcFetchLearningPathResource = new InterceptReq(
    '/learning-path/fetch-learning-path-resource',
    'FetchLearningPathResource'
  )
  _itcFetchLearningPathGetDetail = new InterceptReq(
    '/learning_path/get_detail',
    'FetchLearningPathGetDetail'
  )

  setCopAdminUrl(url) {
    this._copAdminUrl = url + '/admin/admin'
  }

  getManageLearningPathUrl() {
    return `${this._copAdminUrl}#_copMemberManagementPortlet_option=manage-learning-paths`
  }

  visitManageLearningPath(options) {
    this._itcFetchLearningPathResource.set()
    cy.visit(this.getManageLearningPathUrl(), options)
    this._itcFetchLearningPathResource.wait()
  }

  clickCreateNewButton() {
    cy.get('.flex-wrap > .d-none > .btn').click()
  }

  selectDropDownAllLearningPaths() {
    this._itcFetchLearningPathResource.wait()
    cy.get('.learning-path-control.d-none').within(($learningPath) => {
      cy.wrap($learningPath).getDropdownToggle().eq(0).as('dropdownLearningPath')
    })
    cy.get('@dropdownLearningPath').within(($dropdown) => {
      cy.wrap($dropdown).click().next().find('li').eq(1).click()
    })
    this._itcFetchLearningPathResource.wait()
  }

  selectLearningItem(name) {
    cy.get(`h4:contains("${name}")`).parents('.learning-path-item').as('learningItem')
  }

  clickThreeDotsOnLearningItem() {
    const actionMenuDesktopSelector = `.learning-path-info .action-menu.ml-auto`
    cy.get(this.aliasLearningItem)
      .find(actionMenuDesktopSelector)
      .within(() => {
        cy.getThreedotsIcon().click()
        cy.getThreeDots().getDropdownList()
      })
  }

  clickDelete() {
    cy.get('@cwDropDownList').contains(Field.DELETE).click()
  }

  clickOverview() {
    this._itcFetchLearningPathGetDetail.set()
    cy.get('@cwDropDownList').contains(Field.OVERVIEW).click()
    this._itcFetchLearningPathGetDetail.wait()
  }

  clickEdit() {
    this._itcFetchLearningPathGetDetail.set()
    cy.get('@cwDropDownList').contains(Field.EDIT).click()
    this._itcFetchLearningPathGetDetail.wait()
  }

  clickAddCourse() {
    this._itcFetchLearningPathGetDetail.set()
    cy.get('@cwDropDownList').contains('Add Course').click()
    this._itcFetchLearningPathGetDetail.wait()
  }

  filterAllLearningPaths() {
    cy.get('.learning-path-control')
      .first()
      .within(($filter) => {
        cy.wrap($filter).clickCwSplitDropdownToggle('All Learning Paths')
      })
  }
}

export default CoPManageLearningPath
