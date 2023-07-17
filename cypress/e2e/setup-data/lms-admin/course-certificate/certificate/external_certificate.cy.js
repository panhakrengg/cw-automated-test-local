import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetupCertificate from '../../../../../classes/lms/admin/certificate/SetupCertificate'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  const setUpCertificate = new SetupCertificate()

  before(() => {
    setUpCertificate.setCourseCertificateYaml()
  })

  context(Story.courseCertificate, () => {
    it('Setup Default Course Certificate', () => {
      setUpCertificate.setCertificateFireCloudBaseYaml('external')

      new SignInLmsAs().lnAdmin_Emery(setUpCertificate.getSettingsUrl())

      setUpCertificate.createCertificate(false)
    })
  })
})
