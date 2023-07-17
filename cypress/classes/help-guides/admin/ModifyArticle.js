import InterceptReq from '../../base/InterceptReq'
import Field from '../../constants/Field'
import { OrgConst } from '../../org-management/base-org-management/OrgStub'
import Faker from '../../utilities/Faker'
import AdminHelpGuide from './AdminHelpGuide'
import ArticleListScreen from './ArticleListScreen'

class ModifyArticle {
  _itcEditor = new InterceptReq('/help_guide/editor_config/fetch', 'Editor')
  _faker

  constructor() {
    this._faker = new Faker()
  }
  verifyContentHeader(title, button) {
    cy.get(title).should('to.be', 'visible').and('contain', 'Create new article')
    cy.get(button).should('to.be', 'disabled').and('contain', Field.PUBLISH)
  }
  includeVideoToggle(subject, isEnable) {
    cy.get(subject)
      .find('.text-noselect')
      .children()
      .within(($toggleButton) => {
        cy.wrap($toggleButton).eq(0).as('button')
        cy.wrap($toggleButton).eq(1).as('label')
        if (isEnable) {
          cy.get('@button').toggleIsEnable()
        }
        cy.get('@label').should('contain.text', 'Include a Video')
      })
  }
  verifyContentBody(title, toggleButton, richText) {
    cy.get(title).find('input').should('have.attr', 'placeholder', 'Enter Title Here')
    this.includeVideoToggle(toggleButton, false)
    cy.get(richText).find('#cke__helpGuideAdminPortlet_context').should('to.be', 'visible')
  }
  verifyPropertyHeader(subject, context) {
    cy.get(subject).should('contain.text', context)
  }
  verifySubPropertyHeader(subject, context) {
    cy.get(subject).should('have.class', 'text-black font-weight-bold').and('contain.text', context)
  }
  verifyHeaderOfProperty(subject, context, isPropertyHeader) {
    isPropertyHeader
      ? this.verifyPropertyHeader(subject, context)
      : this.verifySubPropertyHeader(subject, context)
  }
  hasTitle(title) {
    cy.get('@inputTitle').find('input').should('have.value', title)
  }
  includeVideoOn(turnOn = true) {
    cy.get('@toggleVideo').cwToggleButton('Include a Video').wait(1000).toggleIsEnable(turnOn)
  }
  verifyPropertyTopicBody(subject) {
    cy.get(subject)
      .find('li')
      .within(($topicBody) => {
        cy.wrap($topicBody).getCheckboxList().filter(`:contains('Communities of Purpose')`)
        cy.wrap($topicBody).getCheckboxList().filter(`:contains('Learning Management')`)
        cy.wrap($topicBody).getCheckboxList().filter(`:contains('User Settings')`)
        cy.wrap($topicBody).getCheckboxList().filter(`:contains('Security')`)
      })
  }
  verifyPropertyRoleBody(subject) {
    cy.get(subject)
      .find('li')
      .within(($roleBody) => {
        cy.wrap($roleBody).getCheckboxList().filter(`:contains('Learning Admins')`)
        cy.wrap($roleBody).getCheckboxList().filter(`:contains('Community Admins')`)
        cy.wrap($roleBody).getCheckboxList().filter(`:contains('General')`)
      })
  }
  hasFeatureImage(subject, hasImage) {
    cy.get(subject).find('li').children().as('featureImageBody')
    cy.get('@featureImageBody').eq(0).find('a').as('imageUpload')
    cy.get('@featureImageBody').eq(1).as('buttonRemove')
    cy.get('@imageUpload')
      .should('contain.class', 'align-items-center')
      .and('contain.text', 'Include a featured image')
    if (hasImage) {
      cy.get('@buttonRemove')
        .should('have.attr', 'href', 'javascript:;')
        .and('contain.text', Field.REMOVE)
        .and('be.visible')
    } else {
      cy.get('@buttonRemove').should('contain.class', 'disabled').and('contain.text', Field.REMOVE)
    }
  }
  hasVideoFile() {
    cy.get('#slideshow_group').within(($uploadedVideo) => {
      cy.wrap($uploadedVideo).find('.thumbnail-wrapper > img').as('thumbnailImage')
      cy.wrap($uploadedVideo)
        .find('.video-caption-wrapper > .description-wrapper > div')
        .as('videoCaption')
      cy.get('@videoCaption').eq(0).as('videoName')
      cy.get('@videoCaption').eq(1).get('span').as('videoLabel')
      cy.get('@videoCaption').eq(2).as('videoFileSize')
      cy.wrap($uploadedVideo)
        .find('.video-caption-wrapper > div')
        .eq(1)
        .children()
        .as('videoUploadProgress')
      cy.get('@videoUploadProgress').eq(0).as('uploadProgress')
      cy.get('@videoUploadProgress').eq(1).as('removeIcon')

      cy.get('@uploadProgress').should('be.visible')
      cy.get('@removeIcon').should('be.visible')
    })
  }
  verifyUploadVideoWithLink() {
    cy.get('.accordion__body').within(() => {
      cy.expectInputValueByPlaceholder('Please enter your url here', 'https://vimeo.com/155485237')
      cy.get('iframe')
        .getIframeBody()
        .within((iframeBody) => {
          cy.wait(3000)
          cy.wrap(iframeBody).get('.vp-video-wrapper.transparent').should('be.visible')
        })
    })
  }
  isSelected(subject, name) {
    cy.get(subject).isCheckedByName(name)
  }
  isNotSelected(subject, name) {
    cy.get(subject).isNotChecked(name)
  }
  expectAllValueNotSelect(subject, topicRoleList) {
    topicRoleList.forEach((name) => {
      this.isNotSelected(subject, name)
    })
  }
  verifyTextByIndexInIframe(subject, index, context) {
    cy.get(subject).eq(index).should('contain.text', context).and('be.visible')
  }
  verifyImageInIframe(subject, index) {
    cy.get(subject).find('> span > img').eq(index).should('be.exist')
  }
  verifyMangeByAndVisibility() {
    cy.get('@managedByBody')
      .find('ul > li > div')
      .within(($manageByBody) => {
        cy.getDropdownSelected('_helpGuideAdminPortlet_cw-dropdown_').should(
          'have.text',
          'Platform'
        )
        cy.wrap($manageByBody)
          .find(`div[class="form-group"]`)
          .children('div')
          .as('visibilitySection')
        cy.get('@visibilitySection').eq(0).as('formHeader')
        cy.get('@visibilitySection').eq(1).as('formBody')
        cy.get('@formHeader').should('contain.text', 'Visibility')
        cy.get('@formBody').within(($formBody) => {
          cy.wrap($formBody).getRadioButton('All users').checkedRadioButton()
          cy.wrap($formBody).getRadioButton('Organization Members')
        })
      })
  }
  hasTextEditor() {
    cy.wait(10000) // please DO NOT remove this because of textEditor
    cy.get('iframe[title="Rich Text Editor, _helpGuideAdminPortlet_context"]')
      .getIframeBody()
      .within(($iframeBody) => {
        cy.wrap($iframeBody).get('> h1').should('have.text', 'Steps')
        cy.wrap($iframeBody)
          .get('> ol > li')
          .within(($steps) => {
            this.verifyTextByIndexInIframe($steps, 0, 'Sign in to system')
            this.verifyTextByIndexInIframe($steps, 1, 'Click My Avatar > Account Settings')
            cy.get($steps)
              .eq(2)
              .within(($text) => {
                cy.wrap($text).should('contain.text', 'Input new email in')
                cy.wrap($text).should('contain.text', '> Save')
                cy.wrap($text).should('contain.text', '=> There is an')
                cy.wrap($text).should('contain.text', 'in your email')
                cy.wrap($text).get('strong').should('have.text', 'Account Email').and('be.visible')
                cy.wrap($text)
                  .get('u')
                  .should('have.text', 'Confirm Email Change')
                  .and('be.visible')
              })
            this.verifyTextByIndexInIframe($steps, 3, 'Back to system and enter the code > Confirm')
          })
        cy.wrap($iframeBody).get('> strong').should('have.text', 'Acceptance Criteria')
        cy.wrap($iframeBody)
          .get('> ul > li')
          .within(($expectedResult) => {
            cy.get($expectedResult)
              .eq(0)
              .contains('The user will sign in with new email in next sign in')
              .within(($text) => {
                cy.wrap($text).get('em').should('contain.text', 'next sign in').and('be.visible')
              })
          })
        this.verifyImageInIframe($iframeBody, 0)
      })
  }
  adminOnlyOrgTextEditor() {
    cy.get('iframe[title="Rich Text Editor, _helpGuideAdminPortlet_context"]')
      .getIframeBody()
      .within(($iframeBody) => {
        cy.wrap($iframeBody).get('> h1').should('have.text', 'Steps')
        cy.wrap($iframeBody)
          .get('> ol > li')
          .within(($steps) => {
            this.verifyTextByIndexInIframe($steps, 0, 'Sign in to system > access to CoP as Admin')
            this.verifyTextByIndexInIframe($steps, 1, 'Click Admin')
            cy.wrap($steps)
              .eq(2)
              .contains('Click Invite')
              .within(($text) => {
                cy.wrap($text).get('strong').should('have.text', 'Invite').and('be.visible')
              })
            cy.wrap($steps)
              .eq(3)
              .contains('Invite to CoP by your connection or email')
              .within(($text) => {
                cy.wrap($text).get('em').should('have.text', 'your connection').and('be.visible')
                cy.wrap($text).get('u').should('have.text', 'email').and('be.visible')
              })
            cy.get($steps)
              .eq(4)
              .contains('Click Invite')
              .within(($text) => {
                cy.wrap($text).get('strong').should('have.text', 'Invite').and('be.visible')
              })
          })
        cy.wrap($iframeBody).get('> h2').should('have.text', 'Expected result')
        cy.wrap($iframeBody)
          .get('> ul > li')
          .within(($expectedResult) => {
            cy.get($expectedResult)
              .eq(0)
              .contains('The user will get Invitation Email')
              .within(($text) => {
                cy.wrap($text)
                  .get('strong')
                  .should('have.text', 'Invitation Email')
                  .and('be.visible')
              })
            cy.get($expectedResult)
              .eq(1)
              .within(($text) => {
                cy.wrap($text)
                  .get('strong > a')
                  .should('contain.attr', 'href', 'https://uat-connect.crosswired.com')
                  .and('be.visible')
              })
          })
        cy.wrap($iframeBody).get('> em').should('have.text', 'Your connection').and('be.visible')
        this.verifyImageInIframe($iframeBody, 0)
        cy.wrap($iframeBody).get('> u').should('have.text', 'Email').and('be.visible')
        this.verifyImageInIframe($iframeBody, 1)
      })
  }

  initPropertySection(name, alias) {
    cy.get('@propertySection')
      .find(`:contains(${name})`)
      .parent('li.nav-item')
      .children('div')
      .within(($aSection) => {
        cy.wrap($aSection).get('a').as(`${alias}Header`).get('.collapse-wrapper').as(`${alias}Body`)
      })
  }

  initAlias() {
    this.initMainContent()
    this.rightContent()
    this.propertiesBody()
  }

  initHeader() {
    cy.get('.help-guide-header').as('helpGuideHeader')
    cy.get('@helpGuideHeader').within(($header) => {
      cy.wrap($header).find('span').as('title')
      cy.wrap($header).find('button').as('actionButton')
    })
  }

  initMainContent() {
    cy.get('.edit-article-wrapper').cardMainContent()
    cy.get('@cardMainContent').cecCardHeader().find('a').as('lexicon')
    this.initHeader()

    cy.get('@cardMainContent').children('div').children('div').as('section')
    cy.get('@section').eq(0).as('inputTitle')
    cy.get('@section').eq(1).as('toggleVideo')
    cy.get('@section').eq(2).as('richTextEditor')
  }

  propertiesBody() {
    const MIN_PROPERTY_ITEM = 3
    cy.get('@propertiesBody')
      .get('ul li[class="nav-item border-bottom border-bottom-style-dash user-select-none"]')
      .as('propertySection')
      .parent()
      .within(() => {
        cy.get('@propertySection')
          .its('length')
          .then((totalSection) => {
            if (totalSection > MIN_PROPERTY_ITEM) {
              this.initPropertySection('Managed by', 'managedBy')
            }
          })
        this.initPropertySection('Topics', 'topic')
        this.initPropertySection('Roles', 'role')
        this.initPropertySection('Featured Image', 'featuredImage')
      })
  }

  rightContent() {
    cy.get('.edit-article-wrapper')
      .cardRightContent()
      .find('#_helpGuideAdminPortlet_managementBarCollapse')
      .as('propertiesBody')
  }
  interceptEditor() {
    this._itcEditor.set()
  }
  waitEditor(time = 0) {
    this._itcEditor.wait()
    if (time) cy.wait(time)
  }
  newDataIsUnselect(propertyName, data) {
    this.rightContent()
    this.propertiesBody()
    cy.get('@' + propertyName + 'Body').within(($propertyName) => {
      cy.wrap($propertyName).contains(data).should('not.be.checked')
    })
  }
  selectValue(propertyName, data) {
    this.rightContent()
    cy.get('@propertiesBody').within(($propertiesBody) => {
      cy.wrap($propertiesBody)
        .find(`:contains('${propertyName}')`)
        .parent('li')
        .within(($propertyName) => {
          cy.wrap($propertyName).checkboxByLabel(data).check()
        })
    })
  }
  clickPublish() {
    this.initMainContent()
    cy.scrollTo('top')
    cy.get('@actionButton').click()
  }
  resetArticleProperties(article, propertyName, propertyValue) {
    const adminHelpGuide = new AdminHelpGuide()
    const articleListScreen = new ArticleListScreen()

    articleListScreen.searchArticle(article)
    articleListScreen.clickArticleName(article)
    this.selectValue(propertyName, propertyValue)
    this.clickPublish()
    adminHelpGuide.itcAdminHelpGuide.waitList()
  }
  showMainContentHeader() {
    cy.get('@lexicon').hasSvgIcon()
    cy.get('@title').contains('Create new article')
    cy.get('@actionButton').should('be.disabled').contains(Field.PUBLISH)
  }
  showEnterTitle() {
    cy.get('@inputTitle').find('input').should('have.attr', 'placeholder', 'Enter Title Here')
    cy.get('@inputTitle').contains('0/255')
  }
  showIncludeVideo() {
    this.includeVideoOn(false)
    cy.get('@toggleVideo').toggleSwitch()
    cy.get('@toggleVideo').getRadioButton('Youtube/Vimeo').checkedRadioButton()
    cy.get('@toggleVideo')
      .get('.accordion__body')
      .within(() => {
        cy.getInputByPlaceholder('Please enter your url here').should('be.visible')
      })
    cy.get('@toggleVideo').clickRadioButton('Upload a video')
    cy.get('@toggleVideo').verifyDragDropThumbnail(
      'Drag and drop your video here, or use the button below.',
      '.mp4, .m4v',
      '1024 MB'
    )
  }
  showTextEditor() {
    cy.get('@richTextEditor').verifyEditorToolBar()
    cy.get('iframe[title="Rich Text Editor, _helpGuideAdminPortlet_context"]')
      .getIframeBody()
      .should('be.visible')
  }
  verifyMainContent() {
    this.showMainContentHeader()
    this.showEnterTitle()
    this.showIncludeVideo()
    this.showTextEditor()
  }
  expectTotalProperties(total) {
    cy.get('@propertiesBody').find('ul.nav-nested>li').should('have.length', total)
  }
  hasManagedBy(orgInfoObj) {
    orgInfoObj ? this.expectHasManagedBy(orgInfoObj) : this.expectNoManagedBy()
  }
  expectHasManagedBy(orgInfoObj) {
    cy.get('@managedByBody')
      .getDropdownList()
      .within(($dropdown) => {
        cy.wrap($dropdown).find('a').should('have.length', orgInfoObj.totalOrg)
        const visibleOrg = orgInfoObj.visibleOrg
        visibleOrg.forEach((orgName) => {
          cy.wrap($dropdown).find('a > span').should('contain.text', orgName)
        })
      })
  }
  expectNoManagedBy() {
    cy.get('@propertiesBody')
      .find('li.nav-item')
      .first()
      .should('not.contain.text', 'Managed By')
      .should('not.contain.text', 'Visibility')
      .should('contain.text', 'Topic')
  }
  hasVisibility(available) {
    available ? this.expectVisibilityAvailable() : this.expectVisibilityNotAvailable()
  }
  expectVisibilityAvailable() {
    cy.get('@managedByBody').within(($managedBy) => {
      cy.wrap($managedBy).get('div.font-weight-bold').should('contain.text', 'Visibility')
      cy.wrap($managedBy).getRadioButton('All users').checkedRadioButton()
      cy.wrap($managedBy).getRadioButton('Organization Members').should('be.visible')
      cy.wrap($managedBy).clickRadioButton('Organization Members')
      cy.wrap($managedBy).getCheckboxList().its('length').should('be.gte', 1)
      cy.wrap($managedBy).getCheckboxList().checkboxByLabel(OrgConst.NAME)
    })
  }
  expectVisibilityNotAvailable(orgName = OrgConst.NAME) {
    cy.get('@managedByBody').within(($managedBy) => {
      cy.wrap($managedBy).contains(`Only members of ${orgName} can see this article.`)
    })
  }
  hasTopics() {
    cy.get('@topicBody').within(($topics) => {
      const topics = [
        'Communities of Purpose',
        'Course Settings',
        'Learning Management',
        'Security',
        'User Settings',
      ]
      cy.wrap($topics).should('be.visible')
      cy.wrap($topics).getCheckboxList().its('length').should('be.gte', 5)
      topics.forEach((name) => {
        cy.wrap($topics).checkboxByLabel(this._faker.getAuTextNotDelete(name))
      })
    })
  }
  hasRoles() {
    cy.get('@roleBody').within(($roles) => {
      const roles = ['Community Admins', 'General', 'Learning Admins', 'Trainers']
      cy.wrap($roles).should('be.visible')
      cy.wrap($roles).getCheckboxList().its('length').should('be.gte', 3)
      roles.forEach((name) => {
        cy.wrap($roles).checkboxByLabel(this._faker.getAuTextNotDelete(name))
      })
    })
  }
  expectedUserCouldSeeBelongOrgImage(imageTitle) {
    cy.get('@imgSelectorContainer').then(($imgSelectorContainer) => {
      cy.wrap($imgSelectorContainer)
        .find(`.entry-card .card-interactive span[title='${imageTitle}']`)
        .should('exist')
    })
  }
  expectedUserCouldNotSeeNotBelongOrgImage(imageTitle) {
    cy.get('@imgSelectorContainer').then(($imgSelectorContainer) => {
      cy.wrap($imgSelectorContainer)
        .find(`.entry-card .card-interactive span[title='${imageTitle}']`)
        .should('not.exist')
    })
  }
  clickCloseIcon() {
    cy.get('.close.btn-unstyled').click()
  }
}
export default ModifyArticle
