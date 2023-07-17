const YAML = require('yamljs')
import Epic from '../../../../classes/Epic'
import ManageMembers from '../../../../classes/org-management/org-structure/ManageMembers'
import ManageUsers from '../../../../classes/org-management/org-structure/ManageUsers'
import Story from '../../../../classes/Story'

import OrgUnitInfo from '../../../../classes/org-management/org-structure/OrgUnitInfo'

describe(Epic.OrgAdmin, () => {
  context(Story.manageUsersMembersProfileEncryption, () => {
    const manageUsers = new ManageUsers()
    const orgUnitInfo = new OrgUnitInfo()
    const manageMembers = new ManageMembers()
    let memberRootOrg

    before(() => {
      cy.readFile('cypress/fixtures/users-orgmgt.yaml').then((OrgMgtUsersString) => {
        memberRootOrg =
          YAML.parse(OrgMgtUsersString)['Users'][orgUnitInfo.environment.getEnvYaml()][
            'memberRootOrg'
          ]
      })
    })

    it('Org Admin able to view and update members in Org and Org Unit', () => {
      Story.ticket('QA-428')
      manageUsers.findUserRowByAdmin(memberRootOrg['email'])
      manageUsers.verifyViewOrgProfileEditIcon()
      orgUnitInfo.visitOrgStructure()
      manageMembers.accessManageMembersTab()
      manageMembers.getRowData(memberRootOrg['email'], 'member')
      manageUsers.verifyViewOrgProfileEditIcon()
    })
  })
})
