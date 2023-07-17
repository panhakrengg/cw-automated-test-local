import InterceptReq from '../../base/InterceptReq'

class DiscussionIntercepts {
  static fetchRecentThreads = new InterceptReq(
    '/forum/thread/fetch_recent_threads',
    'FetchRecentThreads'
  )
  static findExcludeCategories = new InterceptReq(
    '/forum/categories/find_exclude',
    'FindExcludeCategories'
  )
  static fetchThreadDetail = new InterceptReq(
    '/forum/thread/fetch_thread_detail',
    'FetchThreadDetail'
  )
  static removeThread = new InterceptReq('/forum/thread/remove', 'RemoveThread')
  static findCategoriesForum = new InterceptReq('/forum/categories/find', 'FindCategoriesForum')
  static fetchCategoryForum = new InterceptReq('/forum/category/fetch', 'FetchCategoryForum')
  static removeCategoryForum = new InterceptReq('/forum/category/remove', 'RemoveCategoryForum')
  static updateVotesThread = new InterceptReq('/forum/thread/update_votes', 'UpdateVotesThread')
  static modifyComment = new InterceptReq('/forum/comment/modify', 'ModifyComment')
  static fetchEditorConfigComment = new InterceptReq(
    '/forum/comment/editor_config/fetch',
    'FetchEditorConfigComment'
  )
  static fetchCommentsThread = new InterceptReq(
    '/forum/thread/fetch_comments',
    'FetchCommentsThread'
  )
}
export default DiscussionIntercepts
