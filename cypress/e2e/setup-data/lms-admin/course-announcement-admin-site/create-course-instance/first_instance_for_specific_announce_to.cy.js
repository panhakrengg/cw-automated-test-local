import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCourseInstance from '../../../../../classes/lms/admin/setup-data/SetUpCourseInstance'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  const setupInstance = new SetUpCourseInstance()

  before(() => {
    setupInstance.setCourseAnnouncementAdminYaml()
    new SignInLmsAs().lnAdmin_Emery()
  })

  context(Story.courseAnnouncementAdminSite, () => {
    it('Setup instance "First Instance for specific announce"', () => {
      setupInstance.setCourseBaseYaml('courseFuncForCreateAnnouncement')
      setupInstance.setInstanceBaseYaml('forSpecificAnnounceToFirst')

      setupInstance.createNewInstanceFromManageCourse()
    })
  })
})
