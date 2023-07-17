import Environment from '../../base/Environment'
import Popup from '../../components/Popup'
import Field from '../../constants/Field'
import SignInAs from '../../utilities/SignInAs'
import { OrgConst } from '../base-org-management/OrgStub'
import { SubOrgConst } from '../base-org-management/SubOrgStub'
import OrgStructureIntercept from './base/OrgStructureIntercept'
import OrgUnitAction from './operation/OrgUnitAction'
import OrgStructureLoginStub from './stub/OrgStructureLoginStub'
import OrgStructureYamlStub from './stub/OrgStructureYamlStub'

class OrgUnitInfo {
  environment = new Environment()
  itc = new OrgStructureIntercept()

  _isOrgAdmin
  _portletKeyId = '#_orgManagementPortlet_'

  constructor(orgAdmin = true) {
    this.stub = new OrgStructureYamlStub()
    this.login = new OrgStructureLoginStub()
    this.action = new OrgUnitAction()
    this._isOrgAdmin = orgAdmin
    this._itcDeleteCop = this.itc.deleteCop
    this._itcFetchCopPermission = this.itc.fetchCopPermission
    this._itcFetchOrgNav = this.itc.fetchOrgNav
    this._itcModifyOrgUnit = this.itc.modifyOrgUnit
    this._itcFetchChildOrgArea = this.itc.fetchChildOrgArea
    this._itcFetchOrgDetail = this.itc.fetchOrgDetail
    this._itcFetchOrgOnCreateCop = this.itc.fetchOrgOnCreateCop
    this._itcSearchCommunities = this.itc.searchCommunities
    this._itcFetchUserOrgOnCreateCop = this.itc.fetchUserOrgOnCreateCop
    this._itcRenderCopAdmin = this.itc.renderCopAdmin
    this.fetchOrgMembers = this.itc.fetchOrgMembers
    this.fetchOrgTeamLeaders = this.itc.fetchOrgTeamLeaders
    this._itcGetCommunities = this.itc.getCommunities
  }

  interceptCommunitiesSearch(callback) {
    this._itcSearchCommunities.set()
    callback()
    this._itcSearchCommunities.wait()
  }
  interceptFetchOrgNav() {
    this._itcFetchOrgNav.set()
  }

  waitFetchOrgNav() {
    this._itcFetchOrgNav.wait()
  }

  orgAdminAccessToMemberSubOrgUnit(orgUnitName) {
    SignInAs.orgAdmin(this.urlOrgStructure())
    this.interceptFetchOrgNav()
    this.action.accessSubOrgUnit(orgUnitName)
    this.waitFetchOrgNav()
    this.action.accessManageMembersTab()
    cy.wait(1000)
  }

  checkBreakCrump(name) {
    cy.cecCard()
      .eq(1)
      .within(($cards) => {
        cy.wrap($cards)
          .last()
          .cecCardTitle()
          .find(`ul.list-unstyled > li > a:contains(${name})`, { timeout: 10000 })
      })
  }

  checkSubOrgDropdown(name) {
    cy.cecCard().cardLeftContent().getCwDropdown().getDropdownName(name).should('be.visible')
  }

  checkOrgNameAtInfoPanel(name) {
    cy.cecCard().cardMainContent().cecDetailPanel().as('detailPanel')
    return cy.get('@detailPanel').contains('div > h1', name)
  }

  clickOnCreateSubOrgFromLeftPanel() {
    cy.cecCard().cardLeftContent().contains('button.btn-primary', 'Create sub organization').click()
  }

  popupModifySubOrg(orgInfo) {
    cy.getPopup().as('popup')
    cy.get('@popup').parents('.portlet-personnel-management-wrapper').as('popupParent')
    cy.get('@popup')
      .getPopupBody()
      .within(() => {
        cy.contains('label', 'Organization Name').parent().typeInput(orgInfo.name)
        if (orgInfo.businessArea) {
          cy.contains('label', 'Business area').parent().multiSelectType(orgInfo.businessArea)
        }
        if (orgInfo.type) {
          cy.contains('label', Field.TYPE).parent().multiSelectType(orgInfo.type)
        }
        if (orgInfo.workingHour) {
          cy.contains('label', 'Working hours').parent().typeInput(orgInfo.workingHour, 'number')
        }
        if (orgInfo.type == 'Company Code' && orgInfo.companyCode) {
          this._itcFetchChildOrgArea.set()
          cy.contains('label', 'Company Code').parent().multiSelectType(orgInfo.companyCode)
          this._itcFetchChildOrgArea.wait()
          cy.contains('label', 'Personnel Area').parent().multiSelectType(orgInfo.personnelArea)
        }
      })
    this.interceptFetchOrgNav()
    this._itcModifyOrgUnit.set()
    cy.get('@popup').getPopupFooter().contains('button', Field.SAVE).click()
    this._itcModifyOrgUnit.wait()
    cy.waitLoadingOverlayNotExist()
    cy.toast().closeToast()
  }

  deleteSubOrg(name) {
    this.waitFetchOrgNav()
    cy.cecCard().cardMainContent().find('> .border-bottom').eq(2).as('content')
    cy.get('@content').within(() => cy.cwTable().rowName(name).as('tr'))
    cy.get('@tr')
      .its('length')
      .then((size) => {
        for (let index = 0; index < size; index++) {
          cy.get('@tr')
            .first()
            .within(($tr) => cy.wrap($tr).last().as('lastTr'))

          cy.get('@lastTr').within(($tr) => cy.wrap($tr).clickDropdownItem(Field.DELETE))
          this.interceptFetchOrgNav()
          cy.get('@content').swal2().swal2Confirm(Field.YES_DELETE).click()
          this.waitFetchOrgNav()
          cy.waitLoadingOverlayNotExist()
        }
      })
  }

  updateOrgAndCheckDropdownList(orgInfo) {
    cy.cecCard().cardMainContent().as('mainContent')
    cy.get('@mainContent').within(($content) => {
      cy.wrap($content).find('> .border-bottom:nth-child(3)').as('subOrg')
    })
    cy.get('@subOrg').within(() => {
      cy.cwTable().as('subOrgTable')
      cy.get('@subOrgTable').rowName(orgInfo.OrgToBeModify.name).as('orgToBeModifyRow')
    })
    cy.get('@orgToBeModifyRow').within(($row) => cy.wrap($row).clickDropdownItem(Field.EDIT))
    this.popupModifySubOrg(orgInfo.ModifyOrgTo)
    this.waitFetchOrgNav()
    this.checkSubOrgDropdown(orgInfo.ModifyOrgTo.name)
  }

  urlOrgStructure() {
    return OrgConst.TABS.ORGANIZATION_STRUCTURE
  }
  visitOrgStructure() {
    this.interceptFetchOrgNav()
    cy.visit(this.urlOrgStructure())
    this.waitFetchOrgNav()
  }

  createAndDeleteSubOrg(orgInfo) {
    this.clickOnCreateSubOrgFromLeftPanel()
    this.popupModifySubOrg(orgInfo)
    this.waitFetchOrgNav()
    this.checkBreakCrump(orgInfo.name)
    this.checkSubOrgDropdown(orgInfo.name)
    this.checkOrgNameAtInfoPanel(orgInfo.name)
    this.visitOrgStructure()
    this.deleteSubOrg(orgInfo.name)
  }

  accessToInstructionOrg() {
    this.interceptFetchOrgNav()
    this.accessSubOrgUnit()
    this.waitFetchOrgNav()
    this.interceptFetchOrgNav()
    this._itcFetchOrgDetail.set()
    this.accessSubOrgUnit('Instruction Session')
    this.waitFetchOrgNav()
  }

  getCommunitiesSection() {
    return cy.cecCard().cardMainContent().find('> .border-bottom:nth-child(4)', { timeout: 10000 })
  }

  checkIfExistPrimaryCopAndDelete() {
    this._itcFetchOrgDetail.wait()
    cy.get('@itcFetchOrgDetail').then((res) => {
      const { success, result } = res.response.body
      if (!success) return
      const orgDetail = JSON.parse(result)
      if (!orgDetail || !orgDetail.communities) return
      const existingPrimaryCop = orgDetail.communities.find((cop) => 'Primary' == cop.type)
      if (existingPrimaryCop) {
        this.deleteCop(existingPrimaryCop.url)
        cy.url().should('include', '/u/home/dashboard')
        this.visitOrgStructure()
        this.accessToInstructionOrg()
      }
    })
  }

  createPrimaryCop() {
    this._itcFetchOrgOnCreateCop.set()
    this.getCommunitiesSection().contains('button', 'Create primary community').click()
    this._itcFetchOrgOnCreateCop.wait()
    cy.cecCard().as('createCopCard')
    cy.get('@createCopCard').contains('button[name="btnNext"]', 'Next, Set Banner Image').click()
    cy.intercept('*setupCommunityPortlet_primary=true&p_p_resource_id=%2Fcreate%2Fcommunity').as(
      'createCop'
    )
    cy.get('@createCopCard')
      .contains('button[name="btnNext"]', 'Create Community of Purpose')
      .click()
    cy.wait('@createCop', { timeout: 30000 })
  }

  deleteCop(copUrl) {
    this._itcFetchCopPermission.set()
    this._itcRenderCopAdmin.set()
    cy.visit(`${copUrl}/admin/admin#_copMemberManagementPortlet_option=settings`)
    this._itcRenderCopAdmin.wait()
    this._itcFetchCopPermission.wait()
    cy.cecCard()
      .cardMainContent()
      .find('> div > div.rounded-top > div:last > div:last')
      .within(($deletion) => {
        cy.wrap($deletion).find('a[data-toggle="collapse"]').click()
        cy.contains('button[name="btn-delete"]', 'Delete this Community of Purpose').click()
        cy.wrap($deletion).swal2().as('confirmation')
      })
    cy.get('@confirmation')
      .getSwal2Content()
      .within(($content) => {
        cy.wrap($content).getCheckboxList().as('confirmCheckbox')
        cy.get('#btn-confirm').contains(Field.YES_DELETE).as('btnConfirm')
      })
    cy.get('@confirmCheckbox').first().find('input[type="checkbox"]').check()
    cy.get('@confirmCheckbox').last().find('input[type="checkbox"]').check()
    this._itcDeleteCop.set()
    cy.get('@btnConfirm').click()
    this._itcDeleteCop.wait()
    cy.wait(10000)
  }

  checkCreateCopSucessAndGoBack(copUrl) {
    cy.cecCard().find('.content').as('content')
    cy.get('@content').contains(`a[href="${copUrl}"]`, 'Go to My New Community')
    this.interceptFetchOrgNav()
    cy.get('@content').contains('a', 'Go back to my organization').click()
    this.waitFetchOrgNav()
  }

  checkCopOnCommunitiesOfOrg(name, url) {
    this.getCommunitiesSection().as('communities')
    cy.get('@communities').within(() => {
      cy.cwTable()
      this.verifyCommunity(name, 'Primary', url)
    })
  }

  checkCopOnManageCommunities(name) {
    this.interceptCommunitiesSearch(() => cy.visit(OrgConst.TABS.MANAGE_COMMUNITIES))
    cy.cecCard().as('cecCard')
    cy.get('@cecCard').cecCardHeader().as('cardHeader')
    this.interceptCommunitiesSearch(() => cy.get('@cardHeader').typeInput(`${name} {enter}`))
    cy.get('@cecCard').cardMainContent().cwTable().rowName(name)
  }

  checkCopOnMyCommunities(name, copUrl, orgName = OrgConst.NAME) {
    this._itcGetCommunities.set()
    cy.visit('my-communities')
    this._itcGetCommunities.wait()
    this._itcGetCommunities.set()
    cy.get('div.search-wrapper').typeInput(`${name} {enter}`)
    this._itcGetCommunities.wait()
    cy.get(`.community-list-wrapper > ul.list-group > li.list-group-item a[href="${copUrl}"]`).as(
      'communityLi'
    )
    cy.get('@communityLi').should('contain.text', name)
    cy.get('@communityLi')
      .parent()
      .parent()
      .contains('span > span.text-gray', `Part of ${orgName}`)
      .should('be.visible')
  }
  verifyOrgUnitBodyLeftInfo() {
    cy.cecCard()
      .cardLeftContent()
      .as('orgUnitRow')
      .within(($leftContent) => {
        cy.wrap($leftContent)
          .getCwDropdown()
          .get('.dropdown-toggle')
          .should('be.visible')
          .and(
            'have.class',
            'form-control dropdown-toggle d-flex cursor-pointer align-items-center'
          )
          .contains('div.text-truncate > div > span', 'Select a Sub-organization')
        cy.wrap($leftContent)
          .find('> button.btn')
          .should('not.have.attr', 'disabled')
          .contains('Create sub organization')
          .click()
        this.unitInfoPopupBody('', '', 'Organization', '0')
        Popup.verifyPopupFooter($leftContent, Field.CANCEL, Field.SAVE)
        Popup.verifyPopupHeader($leftContent, 'Create Sub Organization').click()
      })
  }
  verifyOrgUnitBodyRightInfo() {
    cy.get(
      '#_orgManagementPortlet_tabListDesktop > .e-tab-header > .e-toolbar-items > .e-toolbar-item'
    ).as('mainContent')
    cy.get('@mainContent')
      .eq(0)
      .should('have.class', 'e-active')
      .and('be.visible')
      .find('> .e-tab-wrap > .e-text-wrap > .e-tab-text')
      .should('contain.text', 'Organization Unit Info')
    cy.get('@mainContent')
      .eq(1)
      .should('be.visible')
      .find('> .e-tab-wrap > .e-text-wrap > .e-tab-text')
      .should('contain.text', 'Manage Members')
    cy.get('@mainContent')
      .eq(2)
      .should('be.visible')
      .find('> .e-tab-wrap > .e-text-wrap > .e-tab-text')
      .should('contain.text', 'On-Assignment Members')
  }
  verifyOrgUnitHeaderInfo() {
    cy.cecCard().cecCardTitle().as('headerInfo')
    cy.get('@headerInfo')
      .find('> img.cw-icon-xl')
      .should('be.visible')
      .and('have.class', 'cw-icon-xl')
      .and('have.attr', 'width', '25')
      .and('have.attr', 'height', '25')
    cy.get('@headerInfo')
      .find('ul > li:first')
      .should('contain.text', OrgConst.ROOT_ORG_NAME)
      .and('be.visible')
      .and('have.css', 'text-transform', 'uppercase')
  }
  verifyOrgUnitInfoPanel() {
    cy.get(this._portletKeyId + 'orgManagement .cec-card__main-content .cec-detail-panel').within(
      ($infoPanel) => {
        cy.wrap($infoPanel)
          .get('> div:first-child')
          .within(($infoFirstRow) => {
            const orgName = this._isOrgAdmin ? OrgConst.ROOT_ORG_NAME : 'Design Frontend'
            cy.wrap($infoFirstRow).find('> h1').should('contain.text', orgName)
            this.verifyThreeDots($infoFirstRow)
          })
      }
    )
  }

  verifySubOrgSection() {
    cy.get(this._portletKeyId + 'orgManagement .cec-card__main-content')
      .find('> div')
      .eq(2)
      .as('subOrgInfoSection')
    let headerText = this._isOrgAdmin ? 'Sub-organizations (' : 'Sub-organizations (1)'

    if (headerText == 'Sub-organizations (1)' && this.environment.isBeta()) {
      //FYI: broken data in BETA. PCoP is broken, so cannot remove the cop and org unit.
      headerText = 'Sub-organizations (2)'
    }

    cy.get('@subOrgInfoSection').find('h1').contains(headerText)
    cy.get('@subOrgInfoSection').cwTable().first().as('subOrgTable')

    cy.get('@subOrgTable').within(($table) => {
      cy.wrap($table).getTableHeader('Sub Organization name')
      cy.wrap($table).getTableHeader(Field.TYPE)
      if (this._isOrgAdmin) {
        this.verifyRootSubOrg($table)
      } else {
        this.verifyTeamLeadSubOrg($table)
      }
    })
  }

  verifyCreateNewSubOrg() {
    cy.get(this._portletKeyId + 'orgManagement .cec-card__main-content')
      .find('> div')
      .eq(2)
      .as('subOrgInfoSection')

    cy.get('@subOrgInfoSection').find('button').contains('Create sub organization').click()

    cy.get('@subOrgInfoSection').within(($org) => {
      cy.wrap($org).as('orgUnitRow')
      this.unitInfoPopupBody('', '', '', '')
      Popup.verifyPopupFooter($org, Field.CANCEL, Field.SAVE)
      Popup.verifyPopupHeader($org, 'Create Sub Organization').click()
    })
  }

  verifyTeamLeadSubOrg(subject) {
    const subOrgIS = 'Instruction Session'
    cy.wrap(subject).rowName(subOrgIS).as('orgUnitRow')
    this.verifySubOrgItems(subOrgIS, 'Organization')
    this.verifySubOrgTableThreeDots(subOrgIS, 'Support', 'Organization', '16')
  }

  verifyRootSubOrg($subject) {
    const subOrgDF = 'Design Frontend'
    describe(`Org unit ${subOrgDF}`, () => {
      cy.wrap($subject).rowName(subOrgDF).as('orgUnitRow')

      cy.get('@orgUnitRow').within(() => {
        this.verifySubOrgItems(subOrgDF, 'Organization')
        this.verifySubOrgTableThreeDots(subOrgDF, 'Development Work', 'Organization', '40')
      })
    })

    const subOrgDFP = SubOrgConst.DRAWING_FEATURE_PLAN
    cy.wrap($subject).rowName(subOrgDFP).as('orgUnitRow')
    cy.get('@orgUnitRow').within(() => {
      this.verifySubOrgItems(subOrgDFP, 'Organization')
      this.verifySubOrgTableThreeDots(subOrgDFP, 'Support', 'Organization', '24')
    })

    const subOrgSLT = 'Start Learning Time'
    cy.wrap($subject).rowName(subOrgSLT).as('orgUnitRow')
    cy.get('@orgUnitRow').within(() => {
      this.verifySubOrgItems(subOrgSLT, 'Company Code')
      this.verifySubOrgTableThreeDots(
        subOrgSLT,
        'Mobilization',
        'Company Code',
        '8',
        'p100',
        'introduction'
      )
    })
  }

  verifyCommunitiesSection() {
    cy.get(this._portletKeyId + 'orgManagement .cec-card__main-content')
      .find('> .border-bottom:nth-child(4)', { timeout: 10000 })
      .within(($orgCommunities) => {
        cy.wrap($orgCommunities).find('h1').contains('Communities (')
        cy.wrap($orgCommunities).cwTable('tableCommunities', 'headerCommunities')
        cy.getTableHeader('Community name')
        cy.getTableHeader(Field.TYPE)
        cy.getTableHeader('Primary admin')
        cy.getTableHeader('Date created')
        if (this._isOrgAdmin) {
          this.verifyTableRootCommunities()
        } else {
          this.verifyTableSubOrgCommunities()
        }

        cy.wrap($orgCommunities)
          .find('button')
          .contains('Create primary community')
          .should('have.attr', 'disabled', 'disabled')
          .and('have.class', 'text-uppercase')

        cy.wrap($orgCommunities)
          .find('div.cw-split-dropdown')
          .within(($createNewCommunity) => {
            cy.wrap($createNewCommunity)
              .find('button')
              .contains('Create new community')
              .should('be.visible')
              .and('not.be.disabled')

            this.verifyCreateNewCommunityDropdown(
              $createNewCommunity,
              ($liCreateNewCommunity) => {
                cy.wrap($liCreateNewCommunity).last().click()
                this.verifyAssignExistingCommunity($liCreateNewCommunity)
              },
              1
            )
            this.verifyCreateNewCommunityDropdown($createNewCommunity, ($liCreateNewCommunity) => {
              this._itcFetchUserOrgOnCreateCop.set()
              cy.wrap($liCreateNewCommunity).first().find('a.dropdown-item').click()
              this._itcFetchUserOrgOnCreateCop.wait()
              cy.url().should('include', '/create-cop')
            })
          })
      })
  }

  verifyCouldCreateCop() {
    cy.waitPortletReady()
    cy.get(':nth-child(1) > .cec-card > .header-group').should('contain.text', 'Training')
    cy.get(':nth-child(2) > .cec-card > .header-group').should('contain.text', 'Organization')
  }

  verifyTableSubOrgCommunities() {
    if (!this.environment.isPrd())
      this.verifyCommunity('Design Frontend', 'Primary', '/web/design-frontend')
    this.verifyCommunity('Frontend Org Automate', 'Organization', '/web/frontend-org-automate')
    this.verifyCommunity(
      'Frontend Training Automate',
      'Training',
      '/web/frontend-training-automate'
    )
  }

  verifyTableRootCommunities() {
    this.verifyCommunity(OrgConst.ROOT_ORG_NAME, 'Primary', OrgConst.ROOT_ORG_URL)
    this.verifyCommunity(
      'WebLearn Training Automate',
      'Training',
      '/web/weblearn-training-automate'
    )
  }

  verifyCreateNewCommunityDropdown(subject, callback, index = 0) {
    cy.wrap(subject)
      .find('button.dropdown-toggle-split')
      .should('have.attr', 'data-toggle', 'dropdown')
      .click()

    cy.wrap(subject).find('> ul.dropdown-menu > li').eq(index).within(callback)
  }

  verifyAssignExistingCommunity(subject) {
    if (!subject) return
    cy.wrap(subject)
      .getPopup()
      .getPopupBody()
      .within(($popupBody) => {
        cy.wrap($popupBody)
          .find('.search-box-wrapper > div > input.form-control')
          .should('have.attr', 'placeholder', 'Search your communities')
          .and('not.be.disabled')
          .and('be.visible')
        cy.wrap($popupBody).find('.d-flex > span').first().contains('Communities (')
        cy.wrap($popupBody)
          .getPopupFooter()
          .find('span')
          .contains(
            'Association with previous organization will be lost after assigning to a new one.'
          )
        cy.wrap($popupBody)
          .getPopupFooter()
          .find('button')
          .contains('Assign')
          .should('have.attr', 'disabled', 'disabled')
      })
    Popup.verifyPopupHeader(subject, 'Assign existing community').click()
  }

  verifyCommunity(name, type, url) {
    cy.cwRowName(name)
      .as('rowCommunity')
      .within(() => {
        cy.get('@rowCommunity').find('> td').eq(1).should('contain.text', type)
        cy.get('@rowCommunity').getThreeDots()
        cy.get('@cwThreeDots')
          .find('> a:first')
          .should('have.attr', 'data-toggle', 'dropdown')
          .click()
        cy.get('@cwThreeDots')
          .find('> ul.dropdown-menu > li > a')
          .should('have.attr', 'href', Cypress.config('baseUrl') + url)
        cy.get('@cwThreeDots')
          .find('> a:first')
          .should('have.attr', 'data-toggle', 'dropdown')
          .click()
      })
  }

  unitInfoPopupBody(
    name,
    businessAreaText,
    type,
    workingHour,
    companyCode = '',
    personnelArea = '',
    personnelSubArea = ''
  ) {
    cy.get('@orgUnitRow').getPopupBody().find('div.row').as('popupRow')

    cy.get('@popupRow').should('have.length', 3)
    cy.get('@popupRow').eq(0).as('firstRow')
    cy.get('@popupRow').eq(1).as('secondRow')
    cy.get('@popupRow').eq(2).as('thirdRow')

    cy.get('@firstRow').within(($row) => {
      cy.wrap($row).find('label:first').should('contain.text', 'Organization Name')
      cy.wrap($row).find('label:last').should('contain.text', 'Business area')
      if (name) {
        cy.wrap($row).find('input:first').should('contain.value', name)
      }
      if (businessAreaText) {
        cy.wrap($row)
          .find('.multiselect > .multiselect__tags > .multiselect__single')
          .should('contain.text', businessAreaText)
      }

      const businessArea = cy.wrap($row).find('ul.multiselect__content > li')
      businessArea.first().should('contain.text', 'Mobilization')
      businessArea.next().should('contain.text', 'Support')
      businessArea.next().should('contain.text', 'Church Planting')
      businessArea.next().should('contain.text', 'Development Work')
    })

    cy.get('@secondRow').within(($row) => {
      cy.wrap($row).find('label:first').should('contain.text', 'Type')
      cy.wrap($row).find('label:last').should('contain.text', 'Working hours')

      if (type) {
        cy.wrap($row).get('div.multiselect .multiselect__single').should('contain.text', type)
      }
      if (workingHour) {
        cy.wrap($row).find('input:last').should('have.value', workingHour)
      }
    })
    cy.get('@thirdRow').within(($popupThirdRow) => {
      const comCode = cy.wrap($popupThirdRow).find('div.col-12').eq(0)
      comCode.find('label').should('contain.text', 'Company Code')
      if (companyCode) {
        comCode
          .next()
          .find('.multiselect')
          .should('not.be.disabled')
          .find('.multiselect__single')
          .should('contain.text', companyCode)
      }
      const perArea = cy.wrap($popupThirdRow).find('div.col-12').eq(1)
      perArea.find('label').should('contain', 'Personnel Area')
      if (personnelArea) {
        perArea
          .next()
          .find('.multiselect')
          .should('not.be.disabled')
          .find('.multiselect__single')
          .should('contain.text', personnelArea)
      }
      const perSubArea = cy.wrap($popupThirdRow).find('div.col-12').eq(2)
      perSubArea.find('label').should('contain', 'Personnel Sub Area')
      if (personnelSubArea) {
        perSubArea
          .next()
          .find('.multiselect')
          .should('not.be.disabled')
          .find('.multiselect__single')
          .should('contain.text', personnelSubArea)
      }
    })
  }

  verifyPopupEditOrg() {
    if (this._isOrgAdmin) {
      this.environment.isPrd()
        ? this.unitInfoPopupBody(
            OrgConst.NAME,
            'Development Work',
            'Global Company',
            '40',
            'p100',
            'introduction',
            ''
          )
        : this.unitInfoPopupBody(
            OrgConst.NAME,
            'Development Work',
            'Global Company',
            '40',
            'f001',
            'start to understand',
            'online'
          )
    } else {
      this.unitInfoPopupBody('Design Frontend', 'Development Work', 'Organization', '40')
    }
    cy.get('@orgUnitRow').within(($org) => {
      Popup.verifyPopupFooter($org, Field.CANCEL, Field.SAVE)
      Popup.verifyPopupHeader($org, 'Edit Organization Unit Info').click()
    })
  }

  verifyThreeDots(subject) {
    if (!subject) return
    cy.wrap(subject)
      .as('orgUnitRow')
      .find('> div.dropdown-three-dots')
      .within(($threeDots) => {
        cy.wrap($threeDots)
          .get(this._portletKeyId + 'dropdownMenuLinkorgUnit')
          .find('> div.three-dots-icon > span.icon-dot')
          .should('have.length', 3)
        cy.wrap($threeDots)
          .get(this._portletKeyId + 'dropdownMenuLinkorgUnit')
          .click()
        cy.wrap($threeDots)
          .find('> ul.dropdown-menu > li:first > a')
          .should('contain.text', Field.EDIT)
          .and('have.class', 'text-black dropdown-item')
          .click()
        this.verifyPopupEditOrg($threeDots)
      })
  }

  // orgUnitRow
  verifySubOrgItems(name, type) {
    cy.get('@orgUnitRow').get('td').eq(0).as('colName')
    cy.get('@orgUnitRow').get('td').eq(1).as('colType')
    cy.get('@colName')
      .find('a > span')
      .should('contain.text', name)
      .and('have.class', 'cursor-pointer')
    cy.get('@colType').within(() => {
      cy.get('span').should('contain.text', type)
    })
  }

  verifySubOrgTableThreeDots(
    name,
    businessAreaText,
    type,
    workingHour,
    companyCode = '',
    personnelArea = '',
    personnelSubArea = ''
  ) {
    cy.get('@orgUnitRow').within(($tr) => {
      cy.wrap($tr).getThreeDots().click()
      const dropdownList = cy.wrap($tr).getThreeDots().getDropdownList()

      if (dropdownList.length < 1) return
      cy.wrap($tr).getThreeDots().clickDropdownName(Field.EDIT)
      this.unitInfoPopupBody(
        name,
        businessAreaText,
        type,
        workingHour,
        companyCode,
        personnelArea,
        personnelSubArea
      )
      Popup.verifyPopupFooter($tr, Field.CANCEL, Field.SAVE)
      Popup.verifyPopupHeader($tr, 'Edit Organization Unit Info').click()
      if (dropdownList.length == 2) {
        cy.wrap($tr).getThreeDots().clickDropdownName(Field.DELETE)
        cy.swal2().within(($deleteConfirmPopup) => {
          cy.wrap($deleteConfirmPopup)
            .getSwal2Header()
            .should('contain.text', 'Would you like to delete this sub-organization?')
          cy.wrap($deleteConfirmPopup)
            .getSwal2Content()
            .should('contain.text', Field.NOTE_THIS_ACTION_CANNOT_BE_UNDONE)
          cy.wrap($deleteConfirmPopup).swal2cancel(Field.CANCEL)
          cy.wrap($deleteConfirmPopup).swal2confirm(Field.YES_DELETE)
          cy.wrap($deleteConfirmPopup).closeSwal2()
        })
      }
    })
  }
}

export default OrgUnitInfo
