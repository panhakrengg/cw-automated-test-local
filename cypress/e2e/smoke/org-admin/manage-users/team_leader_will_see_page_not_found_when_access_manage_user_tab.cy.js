import Epic from '../../../../classes/Epic'
import ManageUsers from '../../../../classes/org-management/org-structure/ManageUsers'
import Story from '../../../../classes/Story'
import ReportDefect from '../../../../classes/utilities/ReportDefect'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.OrgAdmin, () => {
  context(Story.manageUsers, () => {
    const manageUsers = new ManageUsers()

    it('Team Leader will see page not found when access to Manage User Tab', () => {
      Story.ticket('QA-485', ['CW-16516'])
      SignInAs.teamLeaderRootOrgUnit()
      cy.visit(manageUsers._orgManageUsersUrl, { failOnStatusCode: false })
      cy.pageNotFound()
    })

    after(() => {
      ReportDefect.markCwDefect()
    })
  })
})
