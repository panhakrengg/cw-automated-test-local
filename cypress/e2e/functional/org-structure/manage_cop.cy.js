// import OrgUnitInfo from '../../../classes/org-management/org-structure/OrgUnitInfo'

// describe('Org Management - Org Unit - Org Structure - Unit info', () => {
//   //TODO: skipped this as now we are having issue from the CW side. reference https://khalibre.atlassian.net/browse/CW-13151
//   context.skip('Create primary cop - Instruction Session', () => {
//     let orgUnitInfo = new OrgUnitInfo()

//     beforeEach(() => {
//       orgUnitInfo.interceptFetchOrgNav()
//       cy.visitThenSignIn(
//         '/web/weblearn/organization-structure',
//         'OrgMgtUsers.orgMgt.admins.organization'
//       )
//     })

//     it('Create, verify and delete', () => {
//       const name = 'Instruction Session'
//       const primaryCopUrl = '/web/instruction-session'
//       orgUnitInfo.waitFetchOrgNav()
//       orgUnitInfo.accessToInstructionOrg()
//       orgUnitInfo.checkIfExistPrimaryCopAndDelete()
//       orgUnitInfo.createPrimaryCop()
//       orgUnitInfo.checkCreateCopSucessAndGoBack(primaryCopUrl)
//       orgUnitInfo.accessToInstructionOrg()
//       orgUnitInfo.checkCopOnCommunitiesOfOrg(name, primaryCopUrl)
//       orgUnitInfo.checkCopOnManageCommunities(name)
//       orgUnitInfo.checkCopOnMyCommunities(name, primaryCopUrl)
//       orgUnitInfo.deleteCop(primaryCopUrl)
//     })
//   })
// })
