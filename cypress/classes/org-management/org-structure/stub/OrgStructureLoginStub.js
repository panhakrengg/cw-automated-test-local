import SignInAs from '../../../utilities/SignInAs'
import { OrgConst } from '../../base-org-management/OrgStub'
import { SubOrgConst } from '../../base-org-management/SubOrgStub'
import OrgStructureIntercept from '../base/OrgStructureIntercept'
import OrgUnitAction from '../operation/OrgUnitAction'

export default class OrgStructureLoginStub extends OrgUnitAction {
  itc = new OrgStructureIntercept()

  asOrgAdmin() {
    this.itc.fetchOrgDetail.set()
    SignInAs.orgAdmin(OrgConst.TABS.ORGANIZATION_STRUCTURE)
    this.itc.fetchOrgDetail.wait()
  }
  asTeamLeaderRootOrg() {
    this.itc.fetchOrgDetail.set()
    SignInAs.teamLeaderRootOrgUnit(OrgConst.TABS.ORGANIZATION_STRUCTURE)
    this.itc.fetchOrgDetail.wait()
  }
  toRootOrgUnitManageMembersTabAsOrgAdmin() {
    this.itc.fetchOrgDetail.set()
    SignInAs.orgAdmin(OrgConst.TABS.ORGANIZATION_STRUCTURE)
    this.itc.fetchOrgDetail.wait()
    this.accessManageMembersTab()
  }

  toRootOrgUnitManageMembersTabAsTeamLeaderRootOrg() {
    SignInAs.teamLeaderRootOrgUnit(OrgConst.TABS.ORGANIZATION_STRUCTURE)
    this.accessManageMembersTab()
  }

  toSubOrgUnitAsTeamLeaderRootOrg(orgUnitName) {
    this.itc.fetchOrgDetail.set()
    SignInAs.teamLeaderRootOrgUnit(OrgConst.TABS.ORGANIZATION_STRUCTURE)
    this.itc.fetchOrgDetail.wait()
    this.accessSubOrgUnit(orgUnitName)
  }

  toSubOrgUnitAsTeamLeaderDesignFrontend(orgUnitName) {
    this.itc.fetchOrgDetail.set()
    SignInAs.teamLeaderDesignFrontend(OrgConst.TABS.ORGANIZATION_STRUCTURE)
    this.itc.fetchOrgDetail.wait()
    this.accessSubOrgUnit(orgUnitName)
  }

  toSubOrgUnitManageMembersTabAsTeamLeaderDesignFrontend(orgUnitName) {
    this.itc.fetchOrgDetail.set()
    SignInAs.teamLeaderDesignFrontend(OrgConst.TABS.ORGANIZATION_STRUCTURE)
    this.itc.fetchOrgDetail.wait()
    this.accessSubOrgUnit(orgUnitName)
    this.accessManageMembersTab()
  }

  toSubOrgUnitManageMembersTabAsOrgAdminDrawingFeaturePlan() {
    this.itc.fetchOrgDetail.set()
    SignInAs.orgAdmin(OrgConst.TABS.ORGANIZATION_STRUCTURE)
    this.itc.fetchOrgDetail.wait()
    this.accessSubOrgUnit(SubOrgConst.DRAWING_FEATURE_PLAN)
    this.accessManageMembersTab()
  }
}
