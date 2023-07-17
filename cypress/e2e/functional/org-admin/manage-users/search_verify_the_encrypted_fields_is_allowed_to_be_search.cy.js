const YAML = require('yamljs')
import Epic from '../../../../classes/Epic'
import ManageUsers from '../../../../classes/org-management/org-structure/ManageUsers'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, () => {
  context(Story.manageUsersMembersProfileEncryption, () => {
    const manageUsers = new ManageUsers()
    let twoFaSmokePlan

    before(() => {
      cy.readFile('cypress/fixtures/users-orgmgt.yaml').then((OrgMgtUsersString) => {
        twoFaSmokePlan = YAML.parse(OrgMgtUsersString)['Users']['uat']['twoFaSmokePlan']
        manageUsers.accessManageUsersTabByAdmin()
      })
    })

    it('Search - Verify the encrypted fields is allowed to be search', () => {
      manageUsers.verifyFirstLoadBasicAndPremiumMemberCount()
      manageUsers.verifySearchUserAndResultCount(twoFaSmokePlan['familyName'], true)
      manageUsers.verifySearchUserAndResultCount(twoFaSmokePlan['givenName'], true)
      manageUsers.verifySearchUserAndResultCount(twoFaSmokePlan['email'])
      manageUsers.verifySearchUserAndResultCount(twoFaSmokePlan['screenName'])
      manageUsers.verifyClearSearchBoxLinkLabel()
      manageUsers.verifyTriggerClearSearchBoxLinkLabel()
    })
  })
})
