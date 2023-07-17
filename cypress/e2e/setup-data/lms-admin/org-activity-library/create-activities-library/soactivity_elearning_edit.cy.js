import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpActivities from '../../../../../classes/lms/admin/activities-library/SetUpActivities'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.LmsAdmin, () => {
  const setupActivityLibrary = new SetUpActivities()

  before(() => {
    setupActivityLibrary.setOrgActivityLibraryYaml()

    setupActivityLibrary.itcSearchActivityLibrary.set()
    SignInAs.orgAdmin_Amy(setupActivityLibrary.getActivityLibraryOrgUrl())
  })

  context(Story.organizationActivityLibrary, () => {
    it('Setup elearning activity "SOActivity elearning for edit - The Shortest Interactive eLearning"', () => {
      setupActivityLibrary.setElearningObject('sOActivityElearningEdit')

      setupActivityLibrary.createElearning()
    })
  })
})
