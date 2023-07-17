import EmailHelper from '../../../utilities/EmailHelper'

class EmailCoPConsent {
  _copName
  _removeExistEmail = true
  emailHelper = new EmailHelper()

  constructor(copName) {
    this._copName = copName
  }

  expectUserNotReceiveEmail(callback, user) {
    this.emailHelper
      .getReceivedEmailBySubjectCount(callback, user, this._removeExistEmail)
      .then(($receiveEmail) => {
        expect($receiveEmail).to.be.null
      })
  }
}

export default EmailCoPConsent
