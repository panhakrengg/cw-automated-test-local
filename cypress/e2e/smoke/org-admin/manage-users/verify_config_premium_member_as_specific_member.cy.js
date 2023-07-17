import Epic from '../../../../classes/Epic'
import ManageUser from '../../../../classes/org-management/ManageUser'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, () => {
  const manageUser = new ManageUser()
  let orgUser

  before(() => {
    cy.readFile('cypress/fixtures/users-orgmgt.yaml').then((orgMgString) => {
      orgUser = YAML.parse(orgMgString).Users.uat.orgMgtUser.screenName
    })
  })

  beforeEach(() => {
    manageUser.setItc()
  })

  context(Story.manageUsersMembersProfileEncryption, () => {
    it('Verify Members table when config Premium Members as "Specific Members"', () => {
      Story.ticket('QA-423')
      manageUser.signInAsOrgAdmin()
      manageUser.waitItc()
      manageUser.expectedTotalMemberDisplay()
      manageUser.searchMemberByName(orgUser)
      manageUser.getRowData(orgUser)
      manageUser.expectedThreeDotOptionIsVisible('Change Member Subscription')
      manageUser.expectedThreeDotContainSevenOptions()
      manageUser.expectedInvitePopupContainSubscriptionBlock()
    })
  })
})
