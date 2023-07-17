import CertificateAction from '../actions/CertificateAction'
import CertificateAssertion from '../assertions/CertificateAssertion'
import CertificateLogin from './mock/CertificateLogin'
import CertificateYaml from './mock/CertificateYaml'
export default class CertificateBase {
  constructor() {
    this.login = new CertificateLogin()
    this.certificateYaml = new CertificateYaml()
    this.certificateAction = new CertificateAction()
    this.certificateAssertion = new CertificateAssertion()
  }
}
