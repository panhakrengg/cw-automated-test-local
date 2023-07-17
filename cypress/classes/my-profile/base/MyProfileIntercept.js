import InterceptReq from '../../base/InterceptReq'

export default class MyProfileIntercept {
  getProfileOptions = new InterceptReq('/my_profile/get/options', 'GetProfileOptions')
  fetchViewMode = new InterceptReq('/profile/view_mode/fetch', 'FetchViewMode')
  checkExternalLink = new InterceptReq(
    '/course_activities/check_external_link',
    'CheckExternalLink'
  )
  
  fetchExpertise = new InterceptReq('/profile/fetch_expertise', 'FetchExpertise')
  modifiedCommunity = new InterceptReq('/profile/community/modify', 'ModifiedCommunity')
  fetchCommunity = new InterceptReq('/profile/community/fetch', 'FetchCommunity')
  getProfileImage = new InterceptReq('/my_profile/get/image', 'GetProfileImage')
  modifyCertificate = new InterceptReq('/profile/certificates/modify', 'ModifyCertificate')
  changeProfilePicture = new InterceptReq(
    '/my-profile/change-profile-picture',
    'ChangeProfilePicture'
  )
}
