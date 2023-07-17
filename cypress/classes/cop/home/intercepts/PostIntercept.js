import InterceptReq from '../../../base/InterceptReq'

export default class PostIntercept {
  static itcGetProfileComment = new InterceptReq('/post/get_comment_profiles', 'GetProfileComment')
  static itcFetchRecentPosts = new InterceptReq('/post/fetch_recent_posts', 'FetchRecentPosts')
  static itcFetchPosts = new InterceptReq('/post_activity/fetch_posts', 'FetchPosts')
  static itcAddComment = new InterceptReq('/post/add_comment', 'AddComment')
  static itcFetchVisibilityOptions = new InterceptReq(
    '/post/fetch_visibility_options',
    'FetchVisibilityOptions'
  )
  static itcFetchShareableCommunities = new InterceptReq(
    '/post_activity/fetch_shareable_communities',
    'FetchShareableCommunities'
  )
}
