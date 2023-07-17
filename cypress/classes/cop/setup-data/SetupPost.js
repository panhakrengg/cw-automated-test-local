import InterceptReq from '../../base/InterceptReq'
import Field from '../../constants/Field'
import SignInAs from '../../utilities/SignInAs'

class SetupPost {
  constructor() {
    this.login = new Login()
    this.itc = new Intercept()
  }

  setPostObj(obj) {
    this.postObj = obj
  }

  #selectVisibility() {
    cy.clickLinkByName('Post Visibility')
    cy.get('.accordion-post-visibility').within(() => {
      cy.getElementWithLabel(this.postObj.visibility, 'label').click()
    })
  }

  #fillPost() {
    cy.inputByPlaceholder('Add title', this.postObj.title)
    this.#selectVisibility()
  }

  #clickPublish() {
    this.itc.post.set()
    cy.clickButtonByName(Field.PUBLISH)
    this.itc.post.wait()
  }

  createPost(postObj) {
    this.setPostObj(postObj)
    this.#fillPost()
    this.#clickPublish()
  }
}
class Intercept {
  post = new InterceptReq('/post', 'Post')
  fetchPost = new InterceptReq('/post/fetch_post', 'FetchPost')
  defaultPropertiesPost = new InterceptReq('/post/default_properties', 'DefaultPropertiesPost')
}
class Login {
  #getCreatePostUrl(url) {
    return `${url}/manage-posts/edit-post?p_p_id=editPostPortlet&p_p_lifecycle=0`
  }

  itc = new Intercept()

  #visitCreatePost(signInAs = () => {}) {
    this.itc.fetchPost.set()
    this.itc.defaultPropertiesPost.set()
    signInAs()
    // this.itc.fetchPost.wait()
    // this.itc.defaultPropertiesPost.wait()
  }

  toCreatePostAsOwner_Phoebe(url) {
    this.#visitCreatePost(SignInAs.copOwner_Phoebe(this.#getCreatePostUrl(url)))
  }

  toCreatePostAsAdmin_Bettye(url) {
    this.#visitCreatePost(SignInAs.copAdmin_Bettye(this.#getCreatePostUrl(url)))
  }
}
export default SetupPost
