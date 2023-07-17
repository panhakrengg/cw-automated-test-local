import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import QuickTip from '../../../../classes/components/QuickTip'
import { OrgConst } from '../../../../classes/org-management/base-org-management/OrgStub'
import OrgStorage from '../../../../classes/org-management/org-admin/manage-storage/OrgStorage'
import SignInAs from '../../../../classes/utilities/SignInAs'
import Field from '../../../../classes/constants/Field'

describe(Epic.OrgAdmin, () => {
  let orgStorage = new OrgStorage()
  let quickTip = new QuickTip()

  beforeEach(() => {
    SignInAs.orgAdmin(OrgConst.TABS.MANAGE_STORAGE)
  })
  context(Story.manageStorage, () => {
    it('Org Admin see LMS storage detail', () => {
      Story.ticket('QA-171')
      orgStorage.goToStorageDetail(orgStorage.viewLms)

      quickTip.title('LMS Storage')
      quickTip.desc(
        'Go to the Lesson Library to identify lessons that utilize the most storage space.'
      )
      quickTip.hasMoreTipsLink()
      cy.cecCard().cecCardTitle().contains('LMS')
      cy.get('@cecCard')
        .cecCardBodyWithIndex(1)
        .within(($cardBody) => {
          cy.get('h1.font-size-22').contains('LMS Storage')
          cy.wrap($cardBody).get('.row:nth-child(1) .col-sm-6').eq(1).as('dropdownCol')

          cy.get('@dropdownCol').within(() => {
            cy.getDropdownList().each(($item, index) => {
              orgStorage.generateDropdownReport($item, index)
            })
          })
          cy.get('div.col-lg-12').within(($detailSection) => {
            cy.wrap($detailSection).get('h1.font-size-22').contains(Field.DETAILS)
            cy.wrap($detailSection).get('p strong').as('tableHeader')
            cy.get('@tableHeader').eq(0).contains('Storage usage')
            cy.get('@tableHeader').eq(1).contains('Bandwidth usage')

            // Row courses
            cy.get('.d-flex p.cec-mb-0').contains('Courses')
            // TODO: Check storage data usage
            // TODO: Check bandwidth usage

            // Row Activity Library
            cy.get('.d-flex p.cec-mb-0').contains('Activity Library')
            // TODO: Check storage data usage
            // TODO: Check bandwidth usage
            cy.buttonLink('Go to Activity Library')
          })

          cy.get('.flex-lg-row > .font-weight-light').contains('Courses (')

          cy.cwTable().as('tableCourses')
          cy.get('@tableCourses').within(($communityTable) => {
            cy.wrap($communityTable).theadByName('Course name')
            cy.wrap($communityTable).theadByName('Storage usage')
            cy.wrap($communityTable).theadByName('Bandwidth usage')
            // TODO: Check existing course
          })

          cy.buttonLink('Go to Activity Library').click()
        })
    })
  })
})
