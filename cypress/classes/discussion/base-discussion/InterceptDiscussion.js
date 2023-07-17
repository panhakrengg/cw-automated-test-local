import InterceptReq from '../../base/InterceptReq'

class InterceptDiscussion {
  static itcFetchRecentThreads = new InterceptReq(
    '/forum/thread/fetch_recent_threads',
    'FetchRecentThreads'
  )
  static FetchSubscribedThreads = new InterceptReq(
    '/forum/subscribe/fetch_threads',
    'FetchSubscribedThreads'
  )
  static FetchSubscribedCategories = new InterceptReq(
    '/forum/subscribe/fetch_categories',
    'FetchSubscribedCategories'
  )
  static itcFindExcludeCategories = new InterceptReq(
    '/forum/categories/find_exclude',
    'FindExcludeCategories'
  )
  static itcRemoveThread = new InterceptReq('/forum/thread/remove', 'RemoveThread')
  static itcFetchMyThreads = new InterceptReq('/forum/thread/fetch_my_threads', 'itcFetchMyThreads')
  static itcFetchTopThread = new InterceptReq('/forum/thread/fetch_top_threads', 'FetchTopThread')
  static itcFetchThreadDetail = new InterceptReq(
    '/forum/thread/fetch_thread_detail',
    'FetchThreadDetail'
  )
  static itcFetchUnAnsweredThread = new InterceptReq(
    '/forum/thread/fetch_unanswered_threads',
    'FetchUnAnsweredThread'
  )
  static itcFetchThreadComments = new InterceptReq(
    '/forum/thread/fetch_comments',
    'FetchThreadComments'
  )
  static itcFetchCategory = new InterceptReq('/forum/category/fetch', 'FetchCategory')
  static itcEditCategory = new InterceptReq('/forum/category/edit', 'EditCategory')
  static itcSearchCategory = new InterceptReq('/forum/search', 'SearchCategory')
  static itcFindCategories = new InterceptReq('/forum/categories/find', 'FindCategories')
  static itcUpdateVote = new InterceptReq('/forum/thread/update_votes', 'UpdateVote')
  static itcFetchComment = new InterceptReq('/forum/thread/fetch_comments', 'FetchComment')
  static itcFetchEditorConfig = new InterceptReq(
    '/forum/comment/editor_config/fetch',
    'FetchEditorConfig'
  )
  static itcMoveCategory = new InterceptReq('/forum/category/move', 'MoveCategory')
  static itcMoveThread = new InterceptReq('/forum/thread/move', 'MoveThread')

  static itcFetchDiscussionUpdate = new InterceptReq(
    '/discussions_update/recent/fetch',
    'FetchDiscussionUpdate'
  )
}

export default InterceptDiscussion
