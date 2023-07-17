import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import Field from '../../../../classes/constants/Field'
import { OrgConst } from '../../../../classes/org-management/base-org-management/OrgStub'
import CommunityStorageDetail from '../../../../classes/org-management/org-admin/manage-storage/CommunityStorageDetail'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.OrgAdmin, () => {
  let suite, staticData, webLearnInternational
  let communityStorageDetail = new CommunityStorageDetail()

  const resetToDefaultLimit = ($copRow) => {
    cy.wrap($copRow).getThreeDots().first().click().clickDropdownName('Manage Storage')
    cy.wrap($copRow).getPopup().getPopupFooter().as('popupFooter')
    cy.get('@popupFooter').within(($popupFooter) => {
      cy.wrap($popupFooter)
        .find('button')
        .first()
        .invoke('text')
        .then(($text) => {
          if ($text.trim() === Field.SAVE) {
            cy.get('@popupFooter').parent().find('.link-icon').click()
          } else {
            cy.get('@popupFooter').btnCancel($text.trim()).click()
          }
        })
    })
  }

  before(() => {
    cy.readFile('cypress/fixtures/organization/weblearn/org-admin/manage-storage.yaml').then(
      (manageStorageString) => {
        suite = YAML.parse(manageStorageString).ManageStorageSuite
        staticData = YAML.parse(manageStorageString).ManageStorageStatic
        webLearnInternational = suite.orgMgt.rootOrg.webLearnUnit.communities.webLearnInternational
      }
    )
  })

  beforeEach(() => {
    communityStorageDetail.setItcCommunities()
    communityStorageDetail.setItcOverview()
    SignInAs.orgAdmin(OrgConst.TABS.MANAGE_STORAGE)
    communityStorageDetail.waitOverview()
    communityStorageDetail.goToStorageDetail(communityStorageDetail.viewCommunity)
  })

  context(Story.manageStorage, () => {
    it('Org Admin reset CoP storage and bandwidth and CoP the value reset to default storage', () => {
      Story.ticket('QA-556')
      cy.cecCard().inputFeedback().type(`"${webLearnInternational.label}" {enter}`)
      communityStorageDetail.waitCommunities()
      cy.cwTable().rowName(webLearnInternational.label).as('webLearnInternational')
      cy.get('@webLearnInternational').within(($copRow) => {
        let defaultStorage = staticData.defaultStorage.maxStorage.value + ' GB'
        let defaultBandwidth = staticData.defaultStorage.maxBandwidth.value + ' GB'
        cy.wrap($copRow).get('td').eq(2).as('storageLimit')
        cy.wrap($copRow).get('td').eq(4).as('bandwidthLimit')

        cy.get('@storageLimit')
          .invoke('text')
          .then((valueStorage) => {
            if (valueStorage.trim() !== defaultStorage) {
              resetToDefaultLimit($copRow)
            }
          })
        cy.get('@bandwidthLimit')
          .find('.text-ellipsis')
          .invoke('text')
          .then((valueBandwidth) => {
            if (valueBandwidth.trim() !== defaultBandwidth) {
              resetToDefaultLimit($copRow)
            }
          })

        cy.get('@storageLimit').contains(defaultStorage).should('be.visible')
        cy.get('@bandwidthLimit').contains(defaultBandwidth).should('be.visible')
        cy.wrap($copRow).getThreeDots().first().click().clickDropdownName('Manage Storage')
        cy.wrap($copRow)
          .getPopup()
          .within(($popup) => {
            cy.wrap($popup).getPopupBody().as('body')
            cy.get('@body').within(($body) => {
              cy.wrap($body).get('#_orgManageStoragePortlet_maxStorage').as('inputMaxStorage')
              cy.get('#_orgManageStoragePortlet_maxBandwidth').as('inputMaxBandwidth')

              cy.get('@inputMaxStorage').clear().type(webLearnInternational.storageLimit.edit)
              cy.get('@inputMaxBandwidth').clear().type(webLearnInternational.bandwidthLimit.edit)
            })
            cy.wrap($popup).getPopupFooter().btnConfirm(Field.SAVE).click()
          })

        cy.get('@storageLimit').contains(`${webLearnInternational.storageLimit.value}`)
        cy.get('@bandwidthLimit').contains(`${webLearnInternational.bandwidthLimit.value}`)
      })
    })
  })
})
