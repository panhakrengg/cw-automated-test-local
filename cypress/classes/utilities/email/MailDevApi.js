import Environment from '../../base/Environment'

class MailDevApi {
  #entryAPI = ''
  #url = ''
  env = new Environment()

  constructor() {
    this.#url = Cypress.env('mail')[this.env.getEnvPrefix()]
    this.#entryAPI = `${this.#url}/api/Messages?sortColumn=receivedDate&sortIsDescending=true`
  }

  #filterBySubjectAndRecipient(receivedEmailsBody, subject, recipientEmail) {
    let emails = null
    emails = receivedEmailsBody.filter(
      (mail) => mail.subject === subject && mail.to.includes(recipientEmail)
    )
    if (!emails.length) {
      emails = receivedEmailsBody.filter(
        (mail) => mail.subject.includes(subject) && mail.to.includes(recipientEmail)
      )
    }
    return emails
  }

  defineReceivedEmailAlias(emails, removeExists) {
    if (emails && emails.length > 0) {
      cy.wrap(emails).as('getReceivedEmailBySubjectCount')
      if (removeExists) {
        this.removeExisted(emails)
      }
    } else {
      cy.wrap(null).as('getReceivedEmailBySubjectCount')
    }
  }

  findEmailBySubject(subject, recipientEmail, removeExists) {
    cy.request(this.#entryAPI).then(($emails) => {
      if ($emails.body) {
        const emails = this.#filterBySubjectAndRecipient($emails.body, subject, recipientEmail)
        if (emails && emails.length > 0) {
          cy.request(`${this.#url}/api/Messages/${emails[0].id}/html`)
            .its('body')
            .as('getReceivedEmail')
          if (removeExists) {
            this.removeExisted(emails)
          }
        } else {
          cy.wrap(null).as('getReceivedEmail')
          throw new Error(
            `No email found with subject: ${subject} and recipient: ${recipientEmail}`
          )
        }
      }
    })
  }
  findEmailBySubjectCount(subject, recipientEmail, removeExists) {
    cy.request(this.#entryAPI).then(($emails) => {
      if ($emails.body) {
        this.defineReceivedEmailAlias(
          this.#filterBySubjectAndRecipient($emails.body, subject, recipientEmail),
          removeExists
        )
      }
    })
  }
  findEmailSubject(subject, recipientEmail, removeExists) {
    cy.request(this.#entryAPI).then(($emails) => {
      if ($emails.body) {
        const emails = this.#filterBySubjectAndRecipient($emails.body, subject, recipientEmail)
        if (emails.length) {
          cy.request(`${this.#url}/api/Messages/${emails[0].id}`)
            .its('body.subject')
            .as('getReceivedEmailSubject')
          if (removeExists) {
            this.removeExisted(emails)
          }
        } else {
          cy.wrap(null).as('getReceivedEmailSubject')
          throw new Error(
            `No email found with subject: ${subject} and recipient: ${recipientEmail}`
          )
        }
      }
    })
  }
  deleteReceivedEmails(subject, recipientEmail) {
    cy.request(this.#entryAPI).then(($emails) => {
      if ($emails.body) {
        this.deleteEmails(this.#filterBySubjectAndRecipient($emails.body, subject, recipientEmail))
      }
    })
  }
  deleteEmails(existsEmails) {
    if (existsEmails && existsEmails.length) {
      existsEmails.forEach((mail) => {
        cy.request('DELETE', `${this.#url}/api/Messages/${mail.id}`)
      })
    }
  }
  removeExisted(emails) {
    this.env.performAction(() => {
      this.deleteEmails(emails)
    })
  }
}

export default MailDevApi
