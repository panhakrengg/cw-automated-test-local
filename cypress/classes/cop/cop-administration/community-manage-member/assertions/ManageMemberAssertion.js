import Field from '../../../../constants/Field'
import EmailCommunity from '../../../../notification/email/EmailCommunity'
import Converter from '../../../../utilities/Converter'
import EmailHelper from '../../../../utilities/EmailHelper'
import { NonCWUsersMock } from '../../../../utilities/NonCWUsersMock'
import ManageMemberQuery from '../queries/ManageMemberQuery'

export default class ManageMemberAssertion extends ManageMemberQuery {
  #emailHelper = new EmailHelper()

  expectToSeeInvitedUserInTable(user, isCwUser = true) {
    const { email, screenName, fullName } = user
    super.getTableRowMemberByEmail(email).within(() => {
      if (isCwUser) {
        cy.get('td:nth-child(1)').within(() => {
          cy.get(`span:contains('${screenName}'), span:contains('${fullName}')`).should(
            'be.visible'
          )
        })
      } else {
        cy.get('td:nth-child(1)')
          .invoke('text')
          .then(($text) => {
            cy.wrap($text.trim()).should('be.empty')
          })
      }

      cy.get('td:nth-child(2)').within(() => {
        cy.expectElementWithLabelVisible(email, 'span')
      })

      cy.get('td:nth-child(3)')
        .invoke('text')
        .then(($text) => {
          cy.wrap($text.trim()).should('be.empty')
        })

      cy.get('td:nth-child(4)').within(() => {
        cy.expectElementWithLabelVisible('Member', 'span')
        cy.get('a > .link-icon > svg').should('be.visible')
        cy.get('li > a.dropdown-item').then(($items) => {
          expect($items).to.have.length(2)
          expect($items).to.contain(Field.SEND_REMINDER)
          expect($items).to.contain(Field.DELETE)
        })
      })
    })
  }

  expectToSeeInvitedNonCwUserInTable(user) {
    this.expectToSeeInvitedUserInTable(user, false)
  }

  expectToSeeMultipleInvitedNonCwUsersInTable(emails = []) {
    emails.forEach((email) => {
      if (email.includes('noncw')) {
        const num = Converter.getNumberFromString(email)
        new NonCWUsersMock().readNonCwUserFromYaml(num).then((user) => {
          this.expectToSeeInvitedNonCwUserInTable(user)
        })
      }
    })
  }

  #expectedInvitationEmailTemplate(subject, receiverEmail, emailProp = {}, links = []) {
    this.#emailHelper
      .getReceivedEmail(subject, receiverEmail, true)
      .emailTableBody()
      .then(($template) => {
        this.#emailHelper.setTemplate($template)
        for (const key in emailProp) {
          this.#emailHelper.verifyTextInTemplate(emailProp[key])
        }
        links.forEach((link) => {
          const { name, url, alias } = link
          this.#emailHelper.verifyLinkButton(name, url, alias)
        })
      })
  }

  verifyInvitationEmailTemplate(user, cop, isConnectedUser = true) {
    const emailCommunity = new EmailCommunity(cop.name.value)
    const subject = cop.isOrgCop
      ? emailCommunity.getOrgInvitationSubject()
      : emailCommunity.getInvitationSubject()

    this.#expectedInvitationEmailTemplate(
      subject,
      user.email,
      {
        header: emailCommunity.getInvitationHeader(),
        salute: isConnectedUser ? emailCommunity.getSalute(user.fullName) : 'Hi there,',
        personalNote: emailCommunity.getPersonalNote(cop.personalNote),
        body: emailCommunity.getInvitationBody(),
      },
      super.getEmailTemplateLinks(false, cop.url)
    )
  }

  verifyReminderInvitationEmailTemplate(user, cop, isConnectedUser = true, isNonCwUser = false) {
    const emailCommunity = new EmailCommunity(cop.name.value)
    const subject = cop.isOrgCop
      ? emailCommunity.getOrgReminderInvitationSubject()
      : emailCommunity.getReminderInvitationSubject()
    const header = isNonCwUser
      ? emailCommunity.getReminderNonCwUserInvitationHeader()
      : emailCommunity.getReminderInvitationHeader()

    this.#expectedInvitationEmailTemplate(
      subject,
      user.email,
      {
        header: header,
        salute: isConnectedUser ? emailCommunity.getSalute(user.fullName) : 'Hi there,',
        personalNote: emailCommunity.getPersonalNote(cop.personalNote),
        body: isNonCwUser ? emailCommunity.getReminderNonCwUserInvitationBody() : '',
      },
      super.getEmailTemplateLinks(isNonCwUser, cop.url)
    )
  }

  verifyInvitationEmailTemplateForNonCwUser(user, cop) {
    const emailCommunity = new EmailCommunity(cop.name.value)
    const subject = cop.isOrgCop
      ? emailCommunity.getOrgInvitationSubject()
      : emailCommunity.getInvitationSubject()
    this.#expectedInvitationEmailTemplate(
      subject,
      user.email,
      {
        header: emailCommunity.getInvitationHeader(),
        salute: 'Hi there,',
        personalNote: emailCommunity.getPersonalNote(cop.personalNote),
        body: emailCommunity.getInvitationBody(),
        info: emailCommunity.getAcceptInvitationInfo(),
      },
      super.getEmailTemplateLinks(true)
    )
  }

  verifyRegistrationScreen(copName, email, isTrainingCop) {
    cy.get('.registration-content-body').within(() => {
      cy.expectElementWithLabelVisible(
        `You are about to join ${copName}’s Community Site`,
        'p.font-size-22'
      )
      if (!isTrainingCop) {
        cy.expectElementWithLabelVisible(copName, '.wp-info > b')
      }
      cy.get('input[name="_registration_emailAddress"]').should('have.value', email)
      cy.get('h4:contains("Free")').siblings('input').should('have.prop', 'checked', true)
    })
  }
}
