import InterceptReq from '../../../../base/InterceptReq'

export default class ManageMemberItc {
  static itcFetchManageMember = new InterceptReq('/admin/fetch_manage_members', 'FetchManageMember')
  static itcGetCommentProfile = new InterceptReq('/post/get_comment_profiles', 'GetCommentProfile')
  static itcSearchOrgUser = new InterceptReq('/admin/search_org_users', 'SearchOrgUser')
  static itcAdminInviteMembers = new InterceptReq('/admin/invite_members', 'AdminInviteMembers')
  static itcAdminDeleteMember = new InterceptReq('/admin/delete_member', 'AdminDeleteMember')
  static itcCheckMember = new InterceptReq('/subscription_admin/check_member', 'CheckMember')
  static itcRequestReminder = new InterceptReq(
    '/subscription_admin/request_reminder',
    'RequestReminder'
  )
}
