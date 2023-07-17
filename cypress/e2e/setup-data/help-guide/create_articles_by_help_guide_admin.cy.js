import AdminHelpGuideLogin from '../../../classes/help-guides/base-help-guides/member-management/AdminHelpGuideLogin.js'
import AdminOperation from '../../../classes/help-guides/base-help-guides/operation/AdminOperation.js'
import Faker from '../../../classes/utilities/faker.js'

describe('Create Articles', () => {
  const adminHelpGuideLogin = new AdminHelpGuideLogin()
  const faker = new Faker()
  const fillTitle = (name) => {
    cy.get('#_helpGuideAdminPortlet_title').type(faker.getAuTextNotDelete(name))
  }
  const selectTopicsRoles = (topicRole) => {
    cy.get('span').contains('General').parent('label').find('input').click()
    topicRole.forEach((name) => {
      cy.get('span').contains(faker.getAuTextNotDelete(name)).parent('label').find('input').click()
    })
  }
  const turnOnIncludeVideo = () => {
    cy.get('.slider').click()
  }
  const clickUploadVideo = () => {
    cy.get('.d-lg-block > :nth-child(2) > .radio-container').click()
    cy.wait(500)
  }
  const uploadVideo = () => {
    turnOnIncludeVideo()
    clickUploadVideo()
    cy.fixture('attachments/Video1.mp4', 'binary')
      .then(Cypress.Blob.binaryStringToBlob)
      .then((fileContent) => {
        cy.get('input.cw-dropzone-file').attachFile({
          fileContent,
          fileName: 'Video1.mp4',
          mimeType: 'video/mp4',
          encoding: 'utf8',
        })
      })
  }
  const fillBody = (body) => {
    cy.get('.cke_wysiwyg_frame').then(($iframe) => {
      const $body = $iframe.contents().find('.cw-editor')
      cy.wrap($body).type(body)
    })
  }

  const articleWithoutVideo = (name, body, topics, roles) => {
    fillTitle(name)
    selectTopicsRoles(topics)
    selectTopicsRoles(roles)
    fillBody(body)
    AdminOperation.clickPublish()
  }
  const articleWithUploadVideo = (name, body, topics, roles) => {
    fillTitle(name)
    selectTopicsRoles(topics)
    selectTopicsRoles(roles)
    uploadVideo()
    fillBody(body)
    AdminOperation.clickPublish()
  }

  beforeEach(() => {
    adminHelpGuideLogin.signInAsAdminToTab('articles')
    AdminOperation.clickNewArticleButton()
  })

  it('Change Email', (article = 'Change email (has video file)') => {
    const topics = ['Automate', 'Security', 'User Settings']
    const roles = ['General', 'Trainers']

    articleWithUploadVideo(article, 'Steps', topics, roles)
  })
  it('Managing Your Accepted Consent Forms', (article = 'Managing Your Accepted Consent Forms') => {
    const topics = ['Automate', 'Security']
    const roles = ['General']
    const body =
      'There is an easy way to review and manage the consent forms you have accepted! This gives you total control over any consent you have given so far. To view your consents, head to “Account Settings”:'

    articleWithoutVideo(article, body, topics, roles)
  })
  it('Consent Forms', (article = 'Consent Forms') => {
    const topics = ['Automate', 'Security']
    const roles = ['General']
    const body =
      'We are happy to announce the release of a new feature we have been working on to guarantee user consent on shared information and data. This also ensures users accept all community and course guidelines. We have developed this feature focusing on security and its adherence to the General Data Protection Regulation (GDPR).'

    articleWithoutVideo(article, body, topics, roles)
  })
})
