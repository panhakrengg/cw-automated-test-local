import DiscussionIntercepts from '../../../discussion/intercepts/DiscussionIntercepts'
import DiscussionQueries from '../../../discussion/queries/DiscussionQueries'
import SignInAs from '../../../utilities/SignInAs'

class LoginToDiscussionAs extends DiscussionQueries {
  #toDiscussion(signIn = () => {}) {
    DiscussionIntercepts.fetchRecentThreads.set()
    signIn()
    cy.reload()
    DiscussionIntercepts.fetchRecentThreads.wait()
  }

  copMemberEnola(copUrl) {
    this.#toDiscussion(SignInAs.copMember_Enola(super.getCoPDiscussionUrl(copUrl)))
  }

  copAdminBettye(copUrl) {
    this.#toDiscussion(SignInAs.copAdmin_Bettye(super.getCoPDiscussionUrl(copUrl)))
  }

  copAdminKendal(copUrl) {
    this.#toDiscussion(SignInAs.copAdmin_Kendal(super.getCoPDiscussionUrl(copUrl)))
  }

  copOwnerKristy(copUrl) {
    this.#toDiscussion(SignInAs.copOwner_Kristy(super.getCoPDiscussionUrl(copUrl)))
  }
}
export default LoginToDiscussionAs
