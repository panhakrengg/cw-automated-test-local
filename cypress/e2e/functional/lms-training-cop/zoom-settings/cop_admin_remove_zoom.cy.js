import Epic from '../../../../classes/Epic'
import ZoomSettings from '../../../../classes/lms-training-cop/zoom_settings'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, { tags: '@skipFeatureChange' }, () => {
  let courseId
  let courseInstanceId
  let virtualActivityName
  let zoomAccountName
  const faker = new Faker()
  const zoomSettings = new ZoomSettings()
  before(() => {
    cy.readFile('cypress/fixtures/lms-training-cop/zoom-setting.yaml').then((zoomSettingString) => {
      const zoomMockupData = YAML.parse(zoomSettingString)
      const course = zoomMockupData.CourseData.tennisWarmUpGuide
      const virtualActivity = course.courseInstance.checkingVirtualClass
      const zoomInfo = zoomMockupData.ZoomSettings.learnTennisTraining.zoomInfo.sharingExperience
      zoomAccountName = zoomInfo.zoomAccountName
      virtualActivityName = virtualActivity.activities.useRemoveZoom.title
      faker.setPathFixture(course)
      courseId = faker.getUrlId()
      faker.setPathFixture(virtualActivity)
      courseInstanceId = faker.getUrlId()
      zoomSettings.setZoomInfo(zoomInfo)
      zoomSettings.setZoomSettingsUrl(zoomMockupData.ZoomSettings.learnTennisTraining.url)
    })
  })
  context(Story.zoomSettings, () => {
    it('CoP Admin remove zoom', () => {
      Story.ticket('QA-1211')
      SignInAs.copAdmin()
      zoomSettings.visitZoomSettings()
      zoomSettings.removeAccount()

      zoomSettings.accessToCiCourseActivitiesBy(courseId, courseInstanceId)
      zoomSettings.expandActivity(virtualActivityName)
      zoomSettings.expectToSeeMessageZoomHasBeenRemoved()

      zoomSettings.visitZoomSettings()
      zoomSettings.addZoomAccount()
      zoomSettings.fillInZoomInfo()
      zoomSettings.add()

      zoomSettings.accessToCiCourseActivitiesBy(courseId, courseInstanceId)
      zoomSettings.editVirtualActivity(virtualActivityName)
      zoomSettings.addVirtualClassZoomAccount()
      zoomSettings.addVirtualActivityZoomAccount()
      zoomSettings.saveVirtualActivity()
    })
  })
})
