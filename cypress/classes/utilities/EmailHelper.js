import Environment from '../base/Environment'
import EmailApiPrd from './email/EmailApiPrd'
import MailDevApi from './email/MailDevApi'
import EmailAssertion from './email/EmailAssertion'

class EmailHelper extends EmailAssertion {
  #waitTime = 2000
  #prdEmail = new EmailApiPrd()
  #uatEmail = new MailDevApi()
  env = new Environment()

  constructor() {
    super()
  }
  #wait() {
    cy.wait(this.#waitTime)
  }
  #getRecipientEmail(recipient) {
    return typeof recipient === 'object' ? recipient['email'] : recipient
  }
  getReceivedEmail(subject, recipient, removeExists) {
    let email = this.#getRecipientEmail(recipient)
    this.#wait()
    this.env.performAction(
      () => {
        this.#uatEmail.findEmailBySubject(subject, email, removeExists)
      },
      () => {
        this.#prdEmail.findEmailByScreenName(recipient['screenName'], removeExists)
      }
    )
    return cy.get('@getReceivedEmail')
  }
  getReceivedEmailBySubjectCount(subject, recipientEmail, removeExists) {
    this.#wait()
    this.env.performAction(() => {
      this.#uatEmail.findEmailBySubjectCount(subject, recipientEmail, removeExists)
    })
    return cy.get('@getReceivedEmailBySubjectCount')
  }
  getReceivedEmailSubject(subject, recipient, removeExists) {
    this.#wait()
    this.env.performAction(
      () => {
        this.#uatEmail.findEmailSubject(subject, recipient['email'], removeExists)
      },
      () => {
        this.#prdEmail.getEmailSubjectBy(recipient['screenName'])
      }
    )
    return cy.get('@getReceivedEmailSubject')
  }
}

export default EmailHelper
