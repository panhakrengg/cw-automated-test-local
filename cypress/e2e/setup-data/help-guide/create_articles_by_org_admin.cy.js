import AdminHelpGuideLogin from '../../../classes/help-guides/base-help-guides/member-management/AdminHelpGuideLogin.js'
import AdminHelpGuideIntercept from '../../../classes/help-guides/base-help-guides/operation/AdminHelpGuideIntercept.js'
import AdminOperation from '../../../classes/help-guides/base-help-guides/operation/AdminOperation.js'
import Faker from '../../../classes/utilities/faker.js'

describe('Create Articles', () => {
  const faker = new Faker()
  const itcAdminHelpGuide = new AdminHelpGuideIntercept()
  const adminHelpGuideLogin = new AdminHelpGuideLogin()
  const clickNewArticleButton = () => {
    cy.get('button').contains('New article').click()
    itcAdminHelpGuide.waitInterceptAdmin()
  }
  const fillTitle = (name) => {
    cy.get('#_helpGuideAdminPortlet_title').type(name)
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
  const addVimeoVideo = () => {
    turnOnIncludeVideo()
    cy.get('.position-relative.w-100 > .form-control').type('https://vimeo.com/155485237')
  }
  const addYoutubeVideo = () => {
    turnOnIncludeVideo()
    cy.get('.btn > .icon').click()
    cy.get('.position-relative.show > .dropdown-menu > :nth-child(2)').click()
    cy.get('.position-relative.w-100 > .form-control').type(
      'https://www.youtube.com/watch?v=pAZNRlUACfs'
    )
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
  const articleWithVimeo = (name, body, topics, roles) => {
    fillTitle(name)
    selectTopicsRoles(topics)
    selectTopicsRoles(roles)
    addVimeoVideo()
    fillBody(body)
    AdminOperation.clickPublish()
  }
  const articleWithYoutube = (name, body, topics, roles) => {
    fillTitle(name)
    selectTopicsRoles(topics)
    selectTopicsRoles(roles)
    addYoutubeVideo()
    fillBody(body)
    AdminOperation.clickPublish()
  }

  beforeEach(() => {
    itcAdminHelpGuide.interceptAdmin()
    adminHelpGuideLogin.signInAsOrgAdminToTab('articles')
    clickNewArticleButton()
  })

  it('Course With category', (article = 'Create a course with category (without featured image)') => {
    const topics = ['Automate', 'Learning Management']
    const roles = ['Learning Admins']

    articleWithoutVideo(article, 'Steps', topics, roles)
  })

  it('Course without category', (article = 'Create a course without category') => {
    const topics = ['Automate', 'Course', 'Learning Management']
    const roles = ['Learning Admins', 'Organization Admins']

    articleWithoutVideo(article, 'Steps', topics, roles)
  })

  it('Create Organization Community of Purpose', (article = 'Create organization community of purpose') => {
    const topics = ['Automate', 'Communities of Purpose']
    const roles = ['Learning Admins']

    articleWithoutVideo(article, 'Steps', topics, roles)
  })

  it('Invite User to Community of Purpose', (article = 'Invite user to community of purpose (has vimeo)') => {
    const topics = ['Automate', 'Security']
    const roles = ['Learning Admins']

    articleWithVimeo(article, 'Steps', topics, roles)
  })

  it('Invite User to Organization', (article = 'Invite user to organization (has youtube)') => {
    const topics = ['Automate', 'Security']
    const roles = ['Learning Admins']

    articleWithYoutube(article, 'Steps', topics, roles)
  })
})
