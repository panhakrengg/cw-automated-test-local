import Epic from '../../../../../classes/Epic'
import SetUpActivities from '../../../../../classes/lms/admin/activities-library/SetUpActivities'
import Story from '../../../../../classes/Story'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'

describe(Epic.LmsAdmin, () => {
  let fileObj
  const setupActivityLibrary = new SetUpActivities()

  before(() => {
    setupActivityLibrary.setOrgInstanceActivityYaml()

    setupActivityLibrary.itcSearchActivityLibrary.set()
    new SignInLmsAs().lnAdmin_Emery(setupActivityLibrary.getActivityLibraryOrgUrl())
  })

  context(Story.organizationCourseInstanceActivities, () => {
    it('Setup file activity "SOActivity link - Crosswired"', () => {
      setupActivityLibrary.setHyperlinkObject('sOActivityLink')

      setupActivityLibrary.createHyperlink()
    })
  })
})
