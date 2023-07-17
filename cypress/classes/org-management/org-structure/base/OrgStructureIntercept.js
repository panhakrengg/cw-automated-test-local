import InterceptAction from '../../../base/InterceptAction'
import InterceptRender from '../../../base/InterceptRender'
import InterceptReq from '../../../base/InterceptReq'

class OrgStructureIntercept {
  confirmPassword = new InterceptReq('/account_settings/confirm_password', 'ConfirmPassword')
  deleteCop = new InterceptReq('/admin/delete_cop', 'DeleteCop')
  disable2Fa = new InterceptReq('/org_management/account/disable_2fa', 'Disable2Fa')
  fetchChildOrgArea = new InterceptReq('/org_management/fetch_child_org_areas', 'FetchChildOrgArea')
  fetchCopPermission = new InterceptReq('/admin/member_permission/get', 'FetchCopPermission')
  fetchCreateCopTypes = new InterceptReq('/create_cop/fetch_cop_types', 'FetchCreateCopTypes')
  fetchOrgDetail = new InterceptReq('/org_management/fetch_org_detail', 'FetchOrgDetail')
  fetchOrgMembers = new InterceptReq('/org_management/fetch_org_members', 'FetchOrgMembers')
  fetchOrgNav = new InterceptReq('/org_management/fetch_org_navigation', 'FetchOrgNav')
  fetchOrgOnCreateCop = new InterceptReq('/create_cop/fetch_org', 'FetchOrgOnCreateCop')
  fetchOrgTeamLeaders = new InterceptReq('/org_management/fetch_team_leaders','FetchOrgTeamLeaders')
  fetchUserOrgOnCreateCop = new InterceptReq('/create_cop/fetch_user_organizations', 'FetchUserOrg')
  fetchUserUnderOrg = new InterceptReq('/manage_users/fetch_users_under_org', 'FetchUserUnderOrg')
  forceResetPassword = new InterceptReq('/organization/force/reset_password', 'ForceResetPassword')
  getCommunities = new InterceptReq('/communities/get', 'GetCommunities')
  getMembers = new InterceptReq('/manage_users/members/get', 'GetMembers')
  inviteUserOrganization = new InterceptReq('/organization/invite_members', 'InviteUserOrg')
  modifyAccountStatus = new InterceptReq('/org_management/account/modify_status','ModifyAccountStatus')
  modifyOrgProfile = new InterceptReq('/org_profile/modify', 'ModifyOrgProfile')
  modifyOrgUnit = new InterceptReq('/org_management/org_unit_info/modify', 'ModifyOrgUnit')
  modifyStatus = new InterceptReq('/org_management/account/modify_status', 'ModifyStatus')
  modifySubscription = new InterceptAction('/modify/org_member/premium_subscription','ModifySubscription')
  pendingSpouse = new InterceptReq('/profile/connection/pending_spouse/fetch', 'PendingSpouse')
  removeUserOrganization = new InterceptReq('/organization/manage_user/remove', 'RemoveUserOrg')
  renderCopAdmin = new InterceptRender('/web/instruction-session/admin/admin', 'RenderCopAdmin')
  required2Fa = new InterceptReq('/organization/manage_user/required_2fa', 'Required2Fa')
  resetPassword = new InterceptReq('/organization/force/reset_password', 'ResetPassword')
  searchCommunities = new InterceptReq('/manage_communities/search', 'SearchCommunities')
  searchUserUnderOrg = new InterceptReq('/manage_users/fetch_users_under_org', 'SearchUserUnderOrg')
}

export default OrgStructureIntercept
