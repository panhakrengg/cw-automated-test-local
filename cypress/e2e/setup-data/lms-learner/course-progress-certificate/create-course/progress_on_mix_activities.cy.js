import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourse from '../../../../../classes/lms/admin/setup-data/SetUpCourse'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsLearner, () => {
  const setupCourse = new SetUpCourse()

  before(() => {
    setupCourse.setMixActivitiesYaml()
    new SignInLmsAs().lnAdmin_Emery()
  })

  context(Story.courseProgressCertificate, () => {
    it('Progress on mix activities', () => {
      setupCourse.setCourseBaseYaml('progressOnMixActivities')

      setupCourse.createNewCourse()
    })
  })
})
