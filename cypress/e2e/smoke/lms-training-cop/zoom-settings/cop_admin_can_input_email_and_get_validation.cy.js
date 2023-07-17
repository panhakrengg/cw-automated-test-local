import Epic from '../../../../classes/Epic'
import ZoomSettings from '../../../../classes/lms-training-cop/zoom_settings'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, {tags: '@skipFeatureChange'}, () => {
  let zoomInfo
  const zoomSettings = new ZoomSettings()
  before(() => {
    cy.readFile('cypress/fixtures/lms-training-cop/zoom-setting.yaml').then((zoomSettingString) => {
      const zoomMockupData = YAML.parse(zoomSettingString)
      zoomInfo = zoomMockupData.EditZoom.zoomInfo.edit.introductionYourself
      zoomInfo.hostEmail = 'abc.example.com'
      zoomSettings.setZoomInfo(zoomInfo)
      zoomSettings.setZoomSettingsUrl(zoomMockupData.ZoomSettings.learnTennisTraining.url)
    })
  })
  context(Story.zoomSettings, () => {
    it('CoP Admin can input email and get validation', () => {
      Story.ticket('QA-1127')
      SignInAs.copAdmin()
      zoomSettings.visitZoomSettings()
      zoomSettings.addZoomAccount()
      zoomSettings.fillInZoomInfo()
      zoomSettings.expectInvalidEmailFormat()
    })
  })
})
