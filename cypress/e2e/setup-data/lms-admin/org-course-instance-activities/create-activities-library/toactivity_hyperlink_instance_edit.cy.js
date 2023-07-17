import Epic from '../../../../../classes/Epic'
import SetUpActivities from '../../../../../classes/lms/admin/activities-library/SetUpActivities'
import Story from '../../../../../classes/Story'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  const setupActivityLibrary = new SetUpActivities()

  before(() => {
    setupActivityLibrary.setOrgInstanceActivityYaml()

    setupActivityLibrary.itcSearchActivityLibrary.set()
    new SignInLmsAs().lnAdmin_Emery(setupActivityLibrary.getActivityLibraryOrgUrl())
  })

  context(Story.organizationCourseInstanceActivities, () => {
    it('Setup file activity "TOActivity link - YouTube for edit from instance"', () => {
      setupActivityLibrary.setHyperlinkObject('tOActivityLinkInstanceEdit')

      setupActivityLibrary.createHyperlink()
    })
  })
})
