import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import Field from '../../../../../classes/constants/Field'
import AdminHelpGuide from '../../../../../classes/help-guides/admin/AdminHelpGuide'
import ModifyBannerScreen from '../../../../../classes/help-guides/admin/ModifyBannerScreen'
import Navigation from '../../../../../classes/help-guides/admin/Navigation'
import AdminHelpGuideLogin from '../../../../../classes/help-guides/base-help-guides/member-management/AdminHelpGuideLogin'
import AdminHelpGuideIntercept from '../../../../../classes/help-guides/base-help-guides/operation/AdminHelpGuideIntercept'
import HelpGuidesHome from '../../../../../classes/help-guides/home/HelpGuidesHome'

const adminBanner = new ModifyBannerScreen()
const adminHelpGuideLogin = new AdminHelpGuideLogin()
const navigation = new Navigation()
const helpGuideHome = new HelpGuidesHome()

describe(Epic.HelpGuides, { tags: '@skipPrd' }, () => {
  const bannerData = () => {
    cy.cecCard()
      .get('.cec-card-two-columns-small-left-side')
      .cardRightContent()
      .get('.cec-card__header_fix_height')
      .eq(1)
      .as('bannerHeader')
    cy.cecCard()
      .eq(2)
      .within(($cecCard) => {
        cy.wrap($cecCard).cecCardBody().as('bannerBody')
      })
  }
  context(Story.adminBanner, () => {
    it('Help Guide Admin able to see Banner screen', () => {
      Story.ticket('QA-295')
      describe('Sign in as admin', () => {
        adminBanner.interceptBannerDetail()
        adminHelpGuideLogin.signInAsAdminToTab()
        navigation.clickBanner()
      })
      adminBanner.waitBannerDetail()
      describe('Verify banner header', () => {
        bannerData()
        cy.get('@bannerHeader').within(($bannerHeader) => {
          cy.wrap($bannerHeader)
            .get('.font-size-22')
            .should('contain.text', 'Banner')
            .and('be.visible')
        })
        //})
        // describe('Verify banner page title', () => {
        //   bannerData()
        //   cy.get('@bannerBody').within(($bannerBody) => {
        //     cy.wrap($bannerBody)
        //       .find('.form-group:nth-child(1)')
        //       .within(($pageTitle) => {
        //         cy.wrap($pageTitle).get('label').as('pageTitleLabel')
        //         cy.wrap($pageTitle).get('#_helpGuideAdminPortlet_page-title').as('pageTitleContext')

        //         cy.get('@pageTitleLabel').should('contain.text', 'Page title').and('be.visible')
        //         cy.get('@pageTitleContext')
        //           .should('have.attr', 'placeholder', `What's New and Help Guide`)
        //           .and('have.attr', 'type', 'text')
        //           .and('be.visible')
        //       })
        //   })
      })
      describe('Verify banner short description', () => {
        bannerData()
        cy.get('@bannerBody').within(($bannerBody) => {
          cy.wrap($bannerBody)
            .find('.form-group:nth-child(2)')
            .within(($pageDescription) => {
              cy.wrap($pageDescription).get('label').as('pageDescriptionLabel')
              cy.wrap($pageDescription)
                .get('#_helpGuideAdminPortlet_description')
                .as('pageDescriptionContext')

              cy.get('@pageDescriptionLabel')
                .should('contain.text', 'Short Description')
                .and('be.visible')
              cy.get('@pageDescriptionContext')
                .should(
                  'have.attr',
                  'placeholder',
                  `Your one stop place to get all the latest updates, guides, and instructions to help you be productive and be engaged through our vast features`
                )
                .and(
                  'have.value',
                  'We are always here to help you to get more information about our system. Feel free to check. We will try to upload contents as much as we can.'
                )
                .and('be.visible')
            })
        })
      })
      describe('Verify banner upload image', () => {
        bannerData()
        cy.get('@bannerBody').then(($bannerBody) => {
          cy.wrap($bannerBody)
            .find('.form-group:nth-child(3)')
            .within(($imageUpload) => {
              cy.wrap($imageUpload).get('label').as('imageLabel')
              cy.wrap($imageUpload).get('div').as('imageBox')
              cy.wrap($imageUpload).get('ul > li').as('imageRecommendation')

              cy.get('@imageLabel').should('contain.text', 'Upload Image')
              cy.get('@imageBox').within(($imageBox) => {
                cy.wrap($imageBox)
                  .should('contain.class', 'cw-form-image-wrapper')
                  .and('be.visible')
                cy.wrap($imageBox)
                  .get('button')
                  .should('have.class', 'btn-outline-primary')
                  .and('contain.text', 'Upload Image')
                  .and('be.visible')
                cy.wrap($imageBox)
                  .get('@imageRecommendation')
                  .should('have.class', 'list-inline-item font-italic')
                  .and(
                    'contain.text',
                    'Recommended Size: 458px * 262px with transparent background'
                  )
                  .and('be.visible')
              })
            })
        })
      })
      describe('Verify banner footer', () => {
        bannerData()
        cy.get('@bannerBody').then(($bannerBody) => {
          cy.wrap($bannerBody)
            .find('.form-group:nth-child(4)')
            .within(($footer) => {
              cy.wrap($footer).get('button').eq(0).as('footerLeftButton')
              cy.wrap($footer).get('button').eq(1).as('footerRightButton')

              cy.get('@footerLeftButton')
                .should('have.class', 'btn-outline-primary')
                .and('contain.text', Field.CANCEL)
                .and('be.visible')
              cy.get('@footerRightButton')
                .should('have.class', 'btn-primary')
                .and('contain.text', Field.SAVE)
                .and('be.visible')
            })
        })
      })
    })
  })
})
