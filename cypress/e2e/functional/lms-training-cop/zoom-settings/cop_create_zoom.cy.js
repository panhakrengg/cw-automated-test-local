import Epic from '../../../../classes/Epic'
import ZoomSettings from '../../../../classes/lms-training-cop/zoom_settings'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, {tags: '@skipFeatureChange'}, () => {
  let courseId
  let courseInstanceId
  const faker = new Faker()
  const zoomSettings = new ZoomSettings()
  before(() => {
    cy.readFile('cypress/fixtures/lms-training-cop/zoom-setting.yaml').then((zoomSettingString) => {
      const zoomMockupData = YAML.parse(zoomSettingString)
      const course = zoomMockupData.CourseData.tennisWarmUpGuide
      faker.setPathFixture(course)
      courseId = faker.getUrlId()
      faker.setPathFixture(course.courseInstance.checkingVirtualClass)
      courseInstanceId = faker.getUrlId()
      zoomSettings.setZoomInfo(zoomMockupData.CreateZoom.zoomInfo.creatingNew.classTraining)
      zoomSettings.setZoomSettingsUrl(zoomMockupData.ZoomSettings.learnTennisTraining.url)
    })
  })
  context(Story.zoomSettings, () => {
    it('CoP Admin create zoom', () => {
      Story.ticket('QA-927')
      SignInAs.copAdmin()
      zoomSettings.visitZoomSettings()
      zoomSettings.removeAccount()

      zoomSettings.addZoomAccount()
      zoomSettings.fillInZoomInfo()
      zoomSettings.add()
      zoomSettings.expectToSeeAddSuccessToast()
      zoomSettings.expectToSeeNewZoomAccount()

      zoomSettings.accessToCiCourseActivitiesBy(courseId, courseInstanceId)
      zoomSettings.addLearningActivities()
      zoomSettings.addVirtualClass()
      zoomSettings.addVirtualClassZoomAccount()
      zoomSettings.expectToSeeZoomAccount()

      zoomSettings.visitZoomSettings()
      zoomSettings.removeAccount()
    })
  })
})
