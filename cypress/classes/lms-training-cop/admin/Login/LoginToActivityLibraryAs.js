import ActivityLibraryItc from '../../../lms-admin/base/intercepts/ActivityLibraryItc'
import SignInAs from '../../../utilities/SignInAs'
import ActivityLibraryListQuery from '../activity-library/queries/ActivityLibraryListQuery'

export default class LoginToActivityLibraryAs extends ActivityLibraryListQuery {
  copAdminBettye(url) {
    ActivityLibraryItc.itcSearchActivityLibrary.set()
    SignInAs.copAdmin_Bettye(super.getTCopAdminActivityLibrary(url))
    ActivityLibraryItc.itcSearchActivityLibrary.wait()
    cy.waitLoadingOverlayNotExist()
  }

  copOwnerKristy(url) {
    ActivityLibraryItc.itcSearchActivityLibrary.set()
    SignInAs.copOwner_Kristy(super.getTCopAdminActivityLibrary(url))
    ActivityLibraryItc.itcSearchActivityLibrary.wait()
    cy.waitLoadingOverlayNotExist()
  }
}
