import InterceptReq from '../../base/InterceptReq'
import Field from '../../constants/Field'
import SignInAs from '../../utilities/SignInAs'

class SetupQuickPost {
  constructor() {
    this.login = new Login()
    this.itc = new Intercepts()
  }

  setCoPInfoObject(copYaml, quickPostYaml) {
    this.copBaseYaml = copYaml
    this.quickPostBaseYaml = quickPostYaml
  }

  setQuickCoPObject(quickPostYaml) {
    this.quickPostBaseYaml = quickPostYaml
  }

  #setSharePostObject(sharePostObj) {
    this.sharePostBaseYaml = sharePostObj
  }

  visitCoPHome() {
    this.itc.fetchAuthorInfo.set()
    this.itc.fetchCarouselCoP.set()
    this.itc.getCommentProfilesPost.set()
    cy.visit(this.copBaseYaml.url)
    this.itc.fetchAuthorInfo.wait()
    this.itc.fetchCarouselCoP.wait()
    this.itc.getCommentProfilesPost.wait()
    this.#closeTooltipIfExists()
  }

  #closeTooltipIfExists() {
    cy.wait(1000)
    cy.get('section #main-content')
      .invoke('text')
      .then((text) => {
        if (text.includes('Share your story with the greater community.')) {
          cy.get('#homeTooltip .swal2-close').click()
        }
      })
  }

  #clickQuickPost() {
    this.itc.fetchVisibilityOptions.set()
    cy.getElementWithLabel('Share your update here.', '.cursor-pointer').click()
    this.itc.fetchVisibilityOptions.wait()
  }
  #clickPostToCreateQuickPost() {
    this.itc.quickPost.set()
    cy.clickButtonByName(Field.POST)
    cy.getElementWithLabel(Field.POSTING).should('be.exist')
    this.itc.quickPost.wait()
    cy.getElementWithLabel(Field.POSTING).should('not.exist')
  }
  #clickPostToSharePost() {
    cy.clickButtonByName(Field.POST)
    this.itc.getCommentProfilesPost.wait()
    cy.getElementWithLabel(Field.POST).should('not.exist')
  }

  #getPostTitle() {
    return this.quickPostBaseYaml.title
  }

  #fillQuickPost(wrapper) {
    cy.wrap(wrapper).typeInTextarea(this.#getPostTitle())
    if (this.quickPostBaseYaml.visibility) {
      cy.wrap(wrapper).getMultiSelect().click()
      cy.wrap(wrapper).multiSelectByName(this.quickPostBaseYaml.visibility)
    }
  }

  #fillSharePost(wrapper) {
    if (this.sharePostBaseYaml.share.visibility) {
      cy.wrap(wrapper).getMultiSelect().click()
      cy.wrap(wrapper).multiSelectByName(this.sharePostBaseYaml.share.visibility)
    }
    cy.wrap(wrapper).typeInTextarea(this.sharePostBaseYaml.share.shareYourThoughts)
  }

  #fillQuickPostThenPost() {
    cy.getPopup().within(($popup) => {
      this.#fillQuickPost($popup)
      this.#clickPostToCreateQuickPost()
    })
  }

  #closeToolTipIfExist() {
    cy.get('section#content').within(($card) => {
      if ($card.find('.swal2-popup .swal2-close').length) {
        cy.get('.swal2-popup .swal2-close').click()
        cy.wait(1000)
      }
    })
  }

  createQuickPost() {
    this.#closeToolTipIfExist()
    cy.get('.post-activity-feed-wrapper')
      .invoke('text')
      .then((text) => {
        if (!text.includes(this.#getPostTitle().substring(0, 50))) {
          this.#clickQuickPost()
          this.#fillQuickPostThenPost()
        }
      })
  }

  sharePost(sharePostObj) {
    this.#setSharePostObject(sharePostObj)

    cy.get('.post-activity-feed-wrapper')
      .invoke('text')
      .then((text) => {
        if (!text.includes(this.sharePostBaseYaml.share.shareYourThoughts)) {
          this.#clickShareIcon()
          cy.swal2().within(($popup) => {
            this.#selectCommunityToSharePost()
            this.#clickNext()
            this.#fillSharePost($popup)
            this.#clickPostToSharePost()
          })
        }
      })
  }

  visitThenCreateQuickPost() {
    this.visitCoPHome()
    this.createQuickPost()
  }

  followPost(postTitle) {
    this.itc.followUnfollowPost.set()
    cy.getElementWithLabel(postTitle, 'article').within(($article) => {
      cy.wrap($article).clickDropdownItem('Follow Post')
    })
    this.itc.followUnfollowPost.wait()
  }

  #clickShareIcon() {
    const originalPost = this.sharePostBaseYaml.title

    this.itc.fetchShareableCommunities.set()
    cy.getElementWithLabel(originalPost, 'article')
      .first()
      .within(($article) => {
        cy.wrap($article).get('.cec-card__action a').eq(2).click()
      })
    this.itc.fetchShareableCommunities.wait()
  }

  #selectCommunityToSharePost() {
    cy.getElementWithLabel(this.sharePostBaseYaml.share.to, '.cop-item').scrollIntoView().click()
  }

  #clickNext() {
    this.itc.fetchVisibilityOptions.set()
    cy.clickButtonByName(Field.NEXT)
    this.itc.fetchVisibilityOptions.wait()
  }
}

class Intercepts {
  fetchAuthorInfo = new InterceptReq('/post/fetch_author_info', 'FetchAuthorInfo')
  fetchCarouselCoP = new InterceptReq('/cop/carousel/fetch', 'FetchCarouselCoP')
  fetchVisibilityOptions = new InterceptReq(
    '/post/fetch_visibility_options',
    'FetchVisibilityOptions'
  )
  getCommentProfilesPost = new InterceptReq('/post/get_comment_profiles', 'GetCommentProfilesPost')
  quickPost = new InterceptReq('/quick_post', 'QuickPost')
  followUnfollowPost = new InterceptReq('/post/follow_unfollow', 'FollowUnfollowPost')
  fetchShareableCommunities = new InterceptReq(
    '/post_activity/fetch_shareable_communities',
    'FetchShareableCommunities'
  )
}

class Login {
  itc = new Intercepts()

  #visitCoPHome(signInAs = () => {}) {
    this.itc.fetchAuthorInfo.set()
    this.itc.fetchCarouselCoP.set()
    this.itc.getCommentProfilesPost.set()
    signInAs()
    // this.itc.fetchAuthorInfo.wait()
    // this.itc.fetchCarouselCoP.wait()
    // this.itc.getCommentProfilesPost.wait()
  }

  toCoPHomeAsMember_Enola(url) {
    this.#visitCoPHome(SignInAs.copMember_Enola(url))
  }

  toCoPHomeAsOwner_Phoebe(url) {
    this.#visitCoPHome(SignInAs.copOwner_Phoebe(url))
  }

  toCoPHomeAsContactManager_Murl(url) {
    this.#visitCoPHome(SignInAs.copContactManager_Murl(url))
  }

  toCoPHomeAsMember_Murl(url) {
    this.#visitCoPHome(SignInAs.copContactManager_Murl(url))
  }

  toCoPHomeAsAdmin_Bettye(url) {
    this.#visitCoPHome(SignInAs.copAdmin_Bettye(url))
  }
}
export default SetupQuickPost
