import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import { OrgConst } from '../../../../classes/org-management/base-org-management/OrgStub'
import ReportDefect from '../../../../classes/utilities/ReportDefect'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.OrgAdmin, () => {
  context(Story.orgAdminManageConsents, () => {
    it('Team Leader get access denied on manage consents', () => {
      Story.ticket('QA-394', ['CW-16516'])
      SignInAs.teamLeaderRootOrgUnit()
      cy.visit(OrgConst.TABS.MANAGE_CONSENTS, { failOnStatusCode: false })
      cy.pageNotFound()
    })

    after(() => {
      ReportDefect.markCwDefect()
    })
  })
})
