import EntryYamlManagement from '../../../utilities/EntryYamlManagement'
import UserRole from '../../../utilities/user-role/UserRole'

export default class PostingAndSharingYaml {
  #postingAndSharingYamlPath = 'cop-posts/posting-and-sharing'
  #oCoPSharingNotify = 'Communities.oCoPSharingNotify'
  #oCoPAcceptSharing = 'Communities.oCoPAcceptSharing'
  #tCoPSharingNotify = 'Communities.tCoPSharingNotify'
  #oCoPFromDetailAsMyOrganization = 'SharePostToAnotherCommunity.oCoPFromDetailAsMyOrganization'
  #tCoPFromDetailAsAllLoginUsers = 'SharePostToAnotherCommunity.tCoPFromDetailAsAllLoginUsers'
  #oCoPFromHomeAsMyCommunity = 'SharePostToAnotherCommunity.oCoPFromHomeAsMyCommunity'
  #tCoPFromHomeAsMyCommunity = 'SharePostToAnotherCommunity.tCoPFromHomeAsMyCommunity'
  #oCoPFromHomeAsOnlyMe = 'SharePostToAnotherCommunity.oCoPFromHomeAsOnlyMe'
  #tCoPFromHomeAsOnlyMe = 'SharePostToAnotherCommunity.tCoPFromHomeAsOnlyMe'
  #fromHomeAsOnlyMe = 'SharePostToCurrentCommunity.fromHomeAsOnlyMe'
  #tCoPCommentLikeNotify = 'Communities.tCoPCommentLikeNotify'
  #ownerFromHomeAllLoggedIn = 'CommentPosts.ownerFromHomeAllLoggedIn'
  #oCoPCommentLikeNotify = 'Communities.oCoPCommentLikeNotify'
  #adminFromHomeMyOrganization = 'CommentPosts.adminFromHomeMyOrganization'
  #memberFromHomeMyCommunity = 'CommentPosts.memberFromHomeMyCommunity'
  #ownerFromHomeOnlyMe = 'CommentPosts.ownerFromHomeOnlyMe'
  #oCoPFromDetailAsMyCommunity = 'SharePostToCurrentCommunity.oCoPFromDetailAsMyCommunity'
  #tCoPFromDetailAsMyCommunity = 'SharePostToCurrentCommunity.tCoPFromDetailAsMyCommunity'
  #memberFromDetailAllLogin = 'CommentPosts.memberFromDetailAllLogin'
  #memberFromDetailMyOrganization = 'CommentPosts.memberFromDetailMyOrganization'
  #memberFromDetailMyCommunity = 'CommentPosts.memberFromDetailMyCommunity'
  #adminFromDetailOnlyMe = 'CommentPosts.adminFromDetailOnlyMe'
  #member2CommentsLikes = 'CommentPosts.member2CommentsLikes'
  #member3CommentsLikes = 'CommentPosts.member3CommentsLikes'
  #adminCommentOnPostHasFollower = 'CommentPosts.adminCommentOnPostHasFollower'
  #memberCommentOnSharePostAllLoggedIn = 'CommentPosts.memberCommentOnSharePostAllLoggedIn'
  #memberCommentOnSharePostMyOrganization = 'CommentPosts.memberCommentOnSharePostMyOrganization'
  #ownerCommentOnSharePostMyCommunity = 'CommentPosts.ownerCommentOnSharePostMyCommunity'
  #memberCommentOnOwnSharePostOnlyMe = 'CommentPosts.memberCommentOnOwnSharePostOnlyMe'
  #memberCommentOnSharePostHasFollower = 'CommentPosts.memberCommentOnSharePostHasFollower'

  #readYamlData(entryPath, callback) {
    EntryYamlManagement._readDataEntry(this.#postingAndSharingYamlPath, entryPath, callback)
  }

  /* ======================== Users =========================== */
  getCopMemberEnola() {
    return cy.stubUser(UserRole.CoPAdministrationUser.MEMBER_ENOLA)
  }
  getCopContactManagerMurl() {
    return cy.stubUser(UserRole.CoPAdministrationUser.CONTACT_MANAGER_MURL)
  }
  getCopOwnerPhoebe() {
    return cy.stubUser(UserRole.CoPAdministrationUser.OWNER_PHOEBE)
  }
  getCopAdminBettye() {
    return cy.stubUser(UserRole.CoPAdministrationUser.ADMIN_BETTYE)
  }
  getCopOwnerKristy() {
    return cy.stubUser(UserRole.CoPAdministrationUser.OWNER_KRISTY)
  }

  /* ======================== Share Post =========================== */

  getOCoPFromDetailAsMyOrganization(callback) {
    this.#readYamlData(this.#oCoPFromDetailAsMyOrganization, callback)
  }

  getTCoPFromDetailAsAllLoginUsers(callback) {
    this.#readYamlData(this.#tCoPFromDetailAsAllLoginUsers, callback)
  }

  getOCoPFromHomeAsMyCommunity(callback) {
    this.#readYamlData(this.#oCoPFromHomeAsMyCommunity, callback)
  }

  getTCoPFromHomeAsMyCommunity(callback) {
    this.#readYamlData(this.#tCoPFromHomeAsMyCommunity, callback)
  }

  getOCoPFromHomeAsOnlyMe(callback) {
    this.#readYamlData(this.#oCoPFromHomeAsOnlyMe, callback)
  }

  getTCoPFromHomeAsOnlyMe(callback) {
    this.#readYamlData(this.#tCoPFromHomeAsOnlyMe, callback)
  }

  getFromHomeAsOnlyMe(callback) {
    this.#readYamlData(this.#fromHomeAsOnlyMe, callback)
  }

  getOCoPFromDetailAsMyCommunity(callback) {
    this.#readYamlData(this.#oCoPFromDetailAsMyCommunity, callback)
  }

  getTCoPFromDetailAsMyCommunity(callback) {
    this.#readYamlData(this.#tCoPFromDetailAsMyCommunity, callback)
  }

  /* ======================== Community ============================ */

  getOCoPSharingNotify(callback) {
    this.#readYamlData(this.#oCoPSharingNotify, callback)
  }

  getOCoPAcceptSharing(callback) {
    this.#readYamlData(this.#oCoPAcceptSharing, callback)
  }

  getTCoPSharingNotify(callback) {
    this.#readYamlData(this.#tCoPSharingNotify, callback)
  }

  /* ======================== Community For Comment ============================ */
  getTCoPCommentLikeNotify(callback) {
    this.#readYamlData(this.#tCoPCommentLikeNotify, callback)
  }

  getOCoPCommentLikeNotify(callback) {
    this.#readYamlData(this.#oCoPCommentLikeNotify, callback)
  }

  /* ======================== Comment ============================ */
  getOwnerFromHomeAllLoggedIn(callback) {
    this.#readYamlData(this.#ownerFromHomeAllLoggedIn, callback)
  }
  getAdminFromHomeMyOrganization(callback) {
    this.#readYamlData(this.#adminFromHomeMyOrganization, callback)
  }
  getMemberFromHomeMyCommunity(callback) {
    this.#readYamlData(this.#memberFromHomeMyCommunity, callback)
  }
  getOwnerFromHomeOnlyMe(callback) {
    this.#readYamlData(this.#ownerFromHomeOnlyMe, callback)
  }
  getMemberFromDetailAllLogin(callback) {
    this.#readYamlData(this.#memberFromDetailAllLogin, callback)
  }
  getMemberFromDetailMyOrganization(callback) {
    this.#readYamlData(this.#memberFromDetailMyOrganization, callback)
  }
  getMemberFromDetailMyCommunity(callback) {
    this.#readYamlData(this.#memberFromDetailMyCommunity, callback)
  }
  getAdminFromDetailOnlyMe(callback) {
    this.#readYamlData(this.#adminFromDetailOnlyMe, callback)
  }
  getMember2CommentsLikes(callback) {
    this.#readYamlData(this.#member2CommentsLikes, callback)
  }
  getMember3CommentsLikes(callback) {
    this.#readYamlData(this.#member3CommentsLikes, callback)
  }
  getAdminCommentOnPostHasFollower(callback) {
    this.#readYamlData(this.#adminCommentOnPostHasFollower, callback)
  }
  getMemberCommentOnSharePostAllLoggedIn(callback) {
    this.#readYamlData(this.#memberCommentOnSharePostAllLoggedIn, callback)
  }
  getMemberCommentOnSharePostMyOrganization(callback) {
    this.#readYamlData(this.#memberCommentOnSharePostMyOrganization, callback)
  }
  getOwnerCommentOnSharePostMyCommunity(callback) {
    this.#readYamlData(this.#ownerCommentOnSharePostMyCommunity, callback)
  }
  getMemberCommentOnOwnSharePostOnlyMe(callback) {
    this.#readYamlData(this.#memberCommentOnOwnSharePostOnlyMe, callback)
  }
  getMemberCommentOnSharePostHasFollower(callback) {
    this.#readYamlData(this.#memberCommentOnSharePostHasFollower, callback)
  }
}
