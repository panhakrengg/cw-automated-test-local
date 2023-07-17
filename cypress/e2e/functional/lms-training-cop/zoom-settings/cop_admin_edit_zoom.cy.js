import Epic from '../../../../classes/Epic'
import ZoomSettings from '../../../../classes/lms-training-cop/zoom_settings'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, {tags: '@skipFeatureChange'}, () => {
  let courseId
  let courseInstanceId
  let oldZoomInfo
  let editZoomInfo
  let oldZoomAccountName
  let editZoomAccountName
  let virtualActivityName
  const faker = new Faker()
  const editZoomSettings = new ZoomSettings()
  const revertZoomSettings = new ZoomSettings()
  before(() => {
    cy.readFile('cypress/fixtures/lms-training-cop/zoom-setting.yaml').then((zoomSettingString) => {
      const zoomMockupData = YAML.parse(zoomSettingString)
      const zoomInfo = zoomMockupData.EditZoom.zoomInfo
      const course = zoomMockupData.CourseData.tennisWarmUpGuide
      const virtualActivity = course.courseInstance.checkingVirtualClass
      editZoomInfo = zoomInfo.edit.introductionYourself
      oldZoomInfo = zoomInfo.existing.introductionYourself
      oldZoomAccountName = oldZoomInfo.zoomAccountName
      editZoomAccountName = editZoomInfo.zoomAccountName
      virtualActivityName = virtualActivity.activities.useEditZoom.title
      faker.setPathFixture(course)
      courseId = faker.getUrlId()
      faker.setPathFixture(virtualActivity)
      courseInstanceId = faker.getUrlId()
      editZoomSettings.setZoomSettingsUrl(zoomMockupData.ZoomSettings.learnTennisTraining.url)
    })
  })
  context(Story.zoomSettings, () => {
    it('CoP Admin edit zoom', () => {
      Story.ticket('QA-928')
      SignInAs.copAdmin()
      editZoomSettings.visitZoomSettings()
      editZoomSettings.editZoom(oldZoomAccountName)
      editZoomSettings.setZoomInfo(editZoomInfo)
      editZoomSettings.fillInZoomInfo()
      editZoomSettings.add()
      editZoomSettings.expectToSeeNewZoomAccount()

      editZoomSettings.accessToCiCourseActivitiesBy(courseId, courseInstanceId)
      editZoomSettings.editVirtualActivity(virtualActivityName)
      editZoomSettings.expectUsedZoomAccountUpdated()

      editZoomSettings.visitZoomSettings()
      revertZoomSettings.editZoom(editZoomAccountName)
      revertZoomSettings.setZoomInfo(oldZoomInfo)
      revertZoomSettings.fillInZoomInfo()
      revertZoomSettings.add()
    })
  })
})
