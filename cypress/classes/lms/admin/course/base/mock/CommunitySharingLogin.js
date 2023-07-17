import SignInAs from '../../../../../utilities/SignInAs'
import CommunitySharingQueries from '../../queries/CommunitySharingQueries'

export default class CommunitySharingLogin extends CommunitySharingQueries {
  asOrgAdminAmy(courseId) {
    SignInAs.orgAdmin_Amy(super.getUrl(courseId))
  }

  asCategoryAdminKenton(courseId) {
    SignInAs.categoryAdminKenton(super.getUrl(courseId))
  }
}
