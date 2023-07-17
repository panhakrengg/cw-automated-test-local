import InterceptReq from '../../../../base/InterceptReq'

class WebNotificationsIntercepts {
  static deleteNotifications = new InterceptReq('/notifications/delete', 'DeleteNotifications')
  static countUnreadNotifications = new InterceptReq(
    '/notifications/unread/count',
    'CountUnreadNotifications'
  )
  static fetchNotifications = new InterceptReq('/notifications/fetch', 'FetchNotifications')
}
export default WebNotificationsIntercepts
