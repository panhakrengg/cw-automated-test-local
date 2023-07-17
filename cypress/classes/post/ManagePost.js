import Field from '../constants/Field'

class ManagePost {
  visitListPost() {}

  getNewPostUrl() {
    return '/web/training-automate/manage-posts/edit-post?p_p_id=editPostPortlet&p_p_lifecycle=0'
  }

  visitTrainingManagePost() {
    cy.visit('/web/training-automate/manage-posts/posts')
  }

  visitTrainingNewPost() {
    cy.visit(
      '/web/training-automate/manage-posts/edit-post?p_p_id=editPostPortlet&p_p_lifecycle=0'
    )
  }

  deletePost(post) {
    cy.get('tbody tr td span')
      .contains(post.title)
      .parent('a')
      .siblings('input')
      .check()
    cy.get(
      '.col-md-9 > .cw-top-header > .justify-content-end > .cw-top-header__btn-delete'
    ).click()
    cy.contains(Field.YES_REMOVE).click()
  }

  createPost(post) {
    cy.readFile('cypress/fixtures/post.yaml').then((CwPost) => {
      cy.wrap(YAML.parse(CwPost)).as('CwStubPost')
    })
    cy.get('@CwStubPost').then((CwStubPost) => {
      cy.location('pathname').should(
        'contain',
        '/web/training-automate/manage-posts/edit-post'
      )
      cy.get('.header > #_editPostPortlet_collapsePostCategoryTimeline').click()
      cy.contains('Add this to Timeline').should('be.visible')
      cy.intercept(
        '/web/training-automate/manage-posts/edit-post?p_p_id=editPostPortlet&p_p_lifecycle=2&p_p_cacheability=cacheLevelPage&p_p_resource_id=%2Fpost'
      ).as('getPostSuccessRequest')
      cy.get('#_editPostPortlet_title').type(post.title)
      if (post.typeAs !== CwStubPost.PostStatic.typeAs.standard.label) {
        // Default post type already select standard
        cy.get('#_editPostPortlet_postType').select(post.typeAs)
        cy.wrap([1, 2, 3]).each((value) => {
          cy.fixture(`attachments/Banner${value}.jpg`)
            .then(Cypress.Blob.base64StringToBlob)
            .then((fileContent) => {
              cy.get('input.cw-dropzone-file').attachFile({
                fileContent,
                fileName: `Banner${value}.jpg`,
                mimeType: 'image/jpeg',
              })
              cy.get('.upload-indicator', { timeout: 8000 }).should(
                'contain',
                'Uploaded'
              )
            })
        })
      } else if (post.typeAs == CwStubPost.PostStatic.typeAs.video.label) {
        cy.get('#_editPostPortlet_sourceType').select(post.videoAs)
        if (post.videoAs == 'YouTube') {
          cy.get('#_editPostPortlet_sourceUrl').type(
            'https://www.youtube.com/watch?v=ebXbLfLACGM&'
          )
        }
      }
      cy.typeInEditor(post.postBody)
      cy.get('.header > #_editPostPortlet_collapsePostVisibility').click()
      let visibilityElement = `#visibility${post.visibility.value}`
      cy.get(visibilityElement).check({ force: true })
      if (post.isDraft) {
        cy.get('.cec-card__header-action > .d-sm-inline-block').click()
      } else {
        cy.get('.cec-card__header-action > .btn-primary').click()
      }
      cy.wait('@getPostSuccessRequest')
    })
  }
}

export default ManagePost
