import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpActivities from '../../../../../classes/lms/admin/activities-library/SetUpActivities'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  let fileObj
  const setupActivityLibrary = new SetUpActivities()

  before(() => {
    setupActivityLibrary.setOrgInstanceActivityYaml()

    setupActivityLibrary.itcSearchActivityLibrary.set()
    new SignInLmsAs().lnAdmin_Emery(setupActivityLibrary.getActivityLibraryOrgUrl())
  })

  context(Story.organizationCourseInstanceActivities, () => {
    it('Setup file activity "TOActivity file as image"', () => {
      setupActivityLibrary.setFileObject('tOActivityImage')

      setupActivityLibrary.createFile()
    })
  })
})
