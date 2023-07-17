import Epic from '../../../classes/Epic'
import Story from '../../../classes/Story'
import Environment from '../../../classes/base/Environment'
import CardPanelTwoColumn from '../../../classes/components/CardPanelTwoColumn'
import QuickTip from '../../../classes/components/QuickTip'
import { OrgConst } from '../../../classes/org-management/base-org-management/OrgStub'
import SignInAs from '../../../classes/utilities/SignInAs'

describe(Epic.OrgAdmin, () => {
  beforeEach(() => {
    SignInAs.orgAdmin(OrgConst.TABS.ORGANIZATION_SETTINGS)
  })
  const env = new Environment()
  let quickTip = new QuickTip()
  let cardPanelTwoColumn = new CardPanelTwoColumn()

  context(Story.settings, () => {
    it('Org Admin see settings tab', () => {
      Story.ticket('QA-155')

      describe('show quick tips', () => {
        quickTip.title('Organization Settings')
        quickTip.desc('We recommend:')
        quickTip.listContain(
          'Uploading a PNG image that has a square (1:1) aspect ratio for your Organization Logo'
        )
        quickTip.listContain('Increasing the minimum password length for added security', 1)
        quickTip.hasMoreTipsLink()
      })
      describe('show title', () => {
        cardPanelTwoColumn.title('Settings')
      })
      describe('show branding', () => {
        cy.get('.cec-card__body > :nth-child(1)').within(($branding) => {
          cy.wrap($branding).contains('Branding')
          cy.wrap($branding).click()
          cy.get('.org-change-logo-wrapper').within(($orgLogo) => {
            cy.wrap($orgLogo).find('> .font-weight-bold').should('have.text', 'Organization Logo')
            cy.wrap($orgLogo)
              .find('> .text-gray')
              .should('have.text', 'Recommended size for better resolution (300 x 300 px)')
          })
          cy.get('.org-change-favicon-wrapper').within(($orgFavicon) => {
            cy.wrap($orgFavicon).find('> .font-weight-bold').should('have.text', 'Favicon')
            cy.wrap($orgFavicon)
              .find('> .text-gray')
              .should(
                'have.text',
                'Upload a .png or .ico file. Recommended size for better resolution (32 x 32 px)'
              )
            cy.wrap($orgFavicon).find('button').should('have.class', 'btn').contains('Select Files')
          })
        })
      })
      describe('show custom email', () => {
        cy.get('.cec-card__body > :nth-child(3)').within(($customEmail) => {
          cy.wrap($customEmail).contains('Custom Email')
          cy.wrap($customEmail).click()
          describe('expect show form customize email users receive to join organization ', () => {
            cy.get('#collapsecustomEmail div:first').within(($formJoinOrg) => {
              cy.wrap($formJoinOrg).get('.cw-toggle-button').should('be.visible')
              cy.wrap($formJoinOrg)
                .get('.control-label')
                .should(
                  'contain.text',
                  'Customize the email that users receive when they get invited to join your organization'
                )

              cy.editorElementContain('h1', 'Custom Email Invite users')
            })
          })
          describe('expect show form customize welcome email users', () => {
            cy.get('div#collapsecustomEmail div:nth-child(2)').then(($formWelcomeOrg) => {
              cy.wrap($formWelcomeOrg).get('.cw-toggle-button').should('be.visible')
              cy.wrap($formWelcomeOrg)
                .get('.control-label')
                .should(
                  'contain.text',
                  'Customize the welcome email users receive after they join your organization'
                )
              cy.editorElementContain('h1', 'Custom Email welcome users', 1)
            })
          })
        })
      })
      describe('show custom support page', () => {
        cy.get('.cec-card__body > :nth-child(4)').within(($customSupport) => {
          cy.wrap($customSupport).contains('Custom Support Page')
          cy.wrap($customSupport).click()
          cy.get('#collapsecustomSupportPage > .d-flex > .cw-toggle-button').should('be.visible')
          cy.wrap($customSupport)
            .get('.control-label')
            .should('contain.text', 'Enable a custom support page for your organization members')
          cy.editorElementContain('p', 'Browse the Help Guides')
          cy.wrap($customSupport).get('.btn-outline-primary').should('contain.text', 'Preview Page')
        })
      })
      describe('show account security', () => {
        cy.get('.cec-card__body > :nth-child(5)').within(($accountSecurity) => {
          cy.wrap($accountSecurity).contains('Account Security')
          cy.wrap($accountSecurity).click()
          cy.wrap($accountSecurity)
            .get('p.text-black')
            .should('contain.text', `Improve your members' account security through these settings`)
          cy.wrap($accountSecurity).get('label.mb-3').should('contain.text', '2-Step Verification')
          cy.get('input[id^="_orgManagementSettingsPortlet_org"]').should(
            'have.attr',
            'type',
            'checkbox'
          )
          cy.wrap($accountSecurity)
            .get('.form-group > label > span')
            .should('contain.text', 'All members are required to set up 2-step Verification')
          cy.wrap($accountSecurity)
            .get('label.mt-3')
            .should('contain.text', 'Minimum password length')
          cy.wrap($accountSecurity).get('input.form-control').should('have.value', 8)
          cy.wrap($accountSecurity).get('.mt-2 > span').should('contain.text', 'Valid values: 8-64')
        })
      })
    })
  })
})
