import InterceptReq from '../../../../base/InterceptReq'

export class InterceptActionRequest {
  static itcAdminFetchManageMember = new InterceptReq(
    '/admin/fetch_manage_members',
    'AdminFetchManageMember'
  )

  static itcNotificationUnreadCount = new InterceptReq(
    '/notifications/unread/count',
    'NotificationUnreadCount'
  )

  static itcAdminDeleteMember = new InterceptReq('/admin/delete_member', 'AdminDeleteMember')
}
