import SignInAs from '../../../utilities/SignInAs'
import PostIntercept from '../../home/intercepts/PostIntercept'

export default class LoginToHomeAs {
  copMemberEnola(url) {
    PostIntercept.itcGetProfileComment.set()
    SignInAs.copMember_Enola(url)
    PostIntercept.itcGetProfileComment.wait()
  }

  copAdminBettye(url) {
    PostIntercept.itcGetProfileComment.set()
    SignInAs.copAdmin_Bettye(url)
    PostIntercept.itcGetProfileComment.wait()
  }

  copOwnerPhoebe(url) {
    PostIntercept.itcGetProfileComment.set()
    SignInAs.copOwner_Phoebe(url)
    PostIntercept.itcGetProfileComment.wait()
  }

  copContactManagerMurl(url) {
    PostIntercept.itcGetProfileComment.set()
    SignInAs.copContactManager_Murl(url)
    PostIntercept.itcGetProfileComment.wait()
  }

  copOwnerKristy(url) {
    PostIntercept.itcGetProfileComment.set()
    SignInAs.copOwner_Kristy(url)
    PostIntercept.itcGetProfileComment.wait()
  }
}
