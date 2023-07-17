import InterceptReq from '../../../../base/InterceptReq'

export default class CommunitySharingItc {
  static fetchExistingCommunities = new InterceptReq(
    '/shared_course/existing_communities/fetch',
    'FetchExistingCommunities'
  )
  static fetchSharingItemsCourse = new InterceptReq(
    '/course/sharing_items/fetch',
    'FetchSharingItemsCourse'
  )
  static fetchAssociatedTrainingCops = new InterceptReq(
    '/admin/associated_training_cops/fetch',
    'FetchAssociatedTrainingCops'
  )
  static submitReviewRequest = new InterceptReq(
    '/course_sharing/review_request/submit',
    'SubmitReviewRequest'
  )
}
