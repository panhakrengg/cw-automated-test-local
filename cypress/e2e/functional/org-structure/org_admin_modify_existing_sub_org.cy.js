import Epic from '../../../classes/Epic'
import Story from '../../../classes/Story'
import Field from '../../../classes/constants/Field'
import { OrgConst } from '../../../classes/org-management/base-org-management/OrgStub'
import OrgUnitInfo from '../../../classes/org-management/org-structure/OrgUnitInfo'
import SignInAs from '../../../classes/utilities/SignInAs'

const YAML = require('yamljs')

describe(Epic.OrgStructure, () => {
  let orgUnitInfo = new OrgUnitInfo()
  let orgInfo

  before(() => {
    cy.readFile('cypress/fixtures/org-structure/org-info.yaml').then((orgInfoString) => {
      orgInfo = YAML.parse(orgInfoString)
    })
  })

  context(Story.unitInfo, () => {
    beforeEach(() => {
      orgUnitInfo.interceptFetchOrgNav()
      SignInAs.orgAdmin(OrgConst.TABS.ORGANIZATION_STRUCTURE)
    })

    it('Org Admin modify existing Sub Org', () => {
      Story.ticket('QA-349')
      let tempOrgInfo = Object.assign({}, orgInfo)
      orgUnitInfo.waitFetchOrgNav()
      cy.get('@itcFetchOrgNav').then((res) => {
        const { success, result } = res.response.body
        if (!success) return
        const orgNavs = JSON.parse(result)
        const isExists = orgNavs.items[0].orgs.some((org) => orgInfo.ModifyOrgTo.name == org.value)
        if (isExists) {
          tempOrgInfo.ModifyOrgTo.name = orgInfo.OrgToBeModify.name
          tempOrgInfo.OrgToBeModify.name = orgInfo.ModifyOrgTo.name
        }
        orgUnitInfo.updateOrgAndCheckDropdownList(tempOrgInfo)
        orgUnitInfo.interceptFetchOrgNav()
        cy.get('@subOrgTable').clickRowName(tempOrgInfo.ModifyOrgTo.name)
        orgUnitInfo.waitFetchOrgNav()
        orgUnitInfo.checkBreakCrump(tempOrgInfo.ModifyOrgTo.name)
        orgUnitInfo.checkOrgNameAtInfoPanel(tempOrgInfo.ModifyOrgTo.name).as('infoPanel')
        cy.get('@mainContent').within(($content) => {
          cy.wrap($content).find('.border-bottom:nth-child(4)').as('communities')
          cy.get('@communities').cwTable().rowName(tempOrgInfo.ModifyOrgTo.name)
        })
        if (tempOrgInfo.ModifyOrgTo.name != orgInfo.OrgToBeModify.name) {
          cy.get('@infoPanel')
            .parent()
            .within(($infoPanel) => cy.wrap($infoPanel).clickDropdownItem(Field.EDIT))
          orgUnitInfo.popupModifySubOrg(orgInfo.OrgToBeModify)
        }
      })
    })
  })
})
