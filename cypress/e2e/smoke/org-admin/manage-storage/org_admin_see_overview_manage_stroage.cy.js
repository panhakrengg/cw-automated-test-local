import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import Environment from '../../../../classes/base/Environment'
import CardPanelTwoColumn from '../../../../classes/components/CardPanelTwoColumn'
import QuickTip from '../../../../classes/components/QuickTip'
import Field from '../../../../classes/constants/Field'
import { OrgConst } from '../../../../classes/org-management/base-org-management/OrgStub'
import OrgStorage from '../../../../classes/org-management/org-admin/manage-storage/OrgStorage'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.OrgAdmin, () => {
  let suite, manageStorageStatic
  const env = new Environment()

  beforeEach(() => {
    SignInAs.orgAdmin(OrgConst.TABS.MANAGE_STORAGE)
  })

  before(() => {
    cy.readFile('cypress/fixtures/organization/weblearn/org-admin/manage-storage.yaml').then(
      (manageStorageString) => {
        suite = YAML.parse(manageStorageString).ManageStorageSuite
        manageStorageStatic = YAML.parse(manageStorageString).ManageStorageStatic
      }
    )
  })

  let quickTip = new QuickTip()
  let orgStorage = new OrgStorage()
  let cardPanelTwoColumn = new CardPanelTwoColumn()

  context(Story.manageStorage, () => {
    it('Org Admin see overview manage storage', () => {
      Story.ticket('QA-170')
      describe('show storage title', () => {
        cardPanelTwoColumn.title(manageStorageStatic.label)
        cy.get('.tip-header-title').compareMobileSnapshot('title')
      })

      describe('show quick tips', () => {
        let mockQuickTip = manageStorageStatic.overview.quickTip
        quickTip.title(mockQuickTip.title)
        quickTip.desc(mockQuickTip.desc)
        quickTip.listContain(mockQuickTip.list[0])
        quickTip.listContain(mockQuickTip.list[1], 1)
        quickTip.listContain(mockQuickTip.list[2], 2)
        quickTip.hasMoreTipsLink()
      })

      describe('show card storage', () => {
        let mockOverview = manageStorageStatic.overview

        describe(Field.OVERVIEW, () => {
          cy.get('div.cec-card__body.bg-light-gray .row').eq(0).as('overview')
          cy.get('@overview').within(($overviewRow) => {
            const $overViewRow = cy.wrap($overviewRow)
            let mockDefaultStorage = manageStorageStatic.defaultStorage
            $overViewRow.get('h1').should('contain.text', Field.OVERVIEW)

            cy.wrap($overviewRow)
              .getDropdownSelected('_orgManageStoragePortlet_cw-dropdown_')
              .should('have.text', orgStorage.getCurrentReportDate())

            cy.wrap($overviewRow)
              .getCwDropdown()
              .getDropdownList()
              .each(($item, index) => {
                orgStorage.generateDropdownReport($item, index)
              })

            cy.wrap($overviewRow).getThreeDots().click()
            cy.wrap($overviewRow).getThreeDots().clickDropdownName('Manage Storage')

            $overViewRow
              .getPopup()
              .within(($popup) => {
                cy.wrap($popup)
                  .getPopupHeader()
                  .get('.font-size-22')
                  .should('contain.text', 'Manage Storage')
                const $popupBody = cy.wrap($popup).getPopupBody()

                $popupBody.find('.font-size-16').should('contain.text', mockDefaultStorage.label)
                $popupBody.get('.row').as('popupBodyRow')
                cy.get('@popupBodyRow').labelText(
                  '_orgManageStoragePortlet_maxCommunityStorage',
                  mockDefaultStorage.maxStorage.label
                )
                cy.get('@popupBodyRow')
                  .inputNumberById('_orgManageStoragePortlet_maxCommunityStorage')
                  .should('have.value', mockDefaultStorage.maxStorage.value)

                cy.get('@popupBodyRow').labelText(
                  '_orgManageStoragePortlet_maxCommunityBandwidth',
                  mockDefaultStorage.maxBandwidth.label
                )
                cy.get('@popupBodyRow')
                  .inputNumberById('_orgManageStoragePortlet_maxCommunityBandwidth')
                  .should('have.value', mockDefaultStorage.maxBandwidth.value)

                cy.wrap($popup).buttonDisabled()

                cy.get('@popupBodyRow')
                  .inputNumberById('_orgManageStoragePortlet_maxCommunityBandwidth')
                  .type(16)
                cy.wrap($popup).buttonNotDisabled()
              })
              .closePopup()
          })
        })

        describe(Field.DETAILS, () => {
          cy.get('.bg-light-gray').within(($bg) => {
            cy.wrap($bg).children('.row').eq(2).as('elementDetailRow').as('detail')
          })
          cy.get('@detail').within(($detailSection) => {
            cy.wrap($detailSection).get('h1.font-size-22').should('have.text', Field.DETAILS)
            cy.wrap($detailSection).get('div.row.justify-content-between').eq(0).as('rowHeader')
            cy.wrap($detailSection)
              .get('div.row.justify-content-between')
              .eq(1)
              .as('rowCommunities')
            cy.wrap($detailSection).get('div.row.justify-content-between').eq(2).as('rowLMS')

            cy.get('@rowHeader').get('.col-sm-4:nth-child(1)').children().should('have.length', 0)
            cy.get('@rowHeader')
              .get('.col-sm-4:nth-child(2) strong')
              .should('contain.text', 'Storage usage')
            cy.get('@rowHeader')
              .get('.col-sm-4:nth-child(3) strong')
              .should('contain.text', 'Bandwidth usage')

            cy.get('@rowCommunities').within(($communities) => {
              cy.wrap($communities)
                .get('.col-12.col-lg-4:nth-child(1) p')
                .should('contain.text', 'Communities')
              cy.wrap($communities)
                .get(':nth-child(2) > .cec-mb-0')
                .should('not.contain.text', '0 B')
              if (!env.isPrd())
                // First month of each month will turn 0, so need to run functionality
                cy.wrap($communities)
                  .get(':nth-child(3) > .justify-content-between > .cec-mb-0')
                  .should('not.contain.text', '0 B')
            })

            cy.get('@rowLMS').within(($lms) => {
              cy.wrap($lms).get('.col-12.col-lg-4:nth-child(1) p').should('contain.text', 'lms')
              cy.wrap($lms).get(':nth-child(2) > .cec-mb-0').should('not.contain.text', '0 B')
              cy.wrap($lms)
                .get(':nth-child(3) > .justify-content-between > .cec-mb-0')
                .should('be.visible')
            })
          })
        })
      })
    })
  })
})
