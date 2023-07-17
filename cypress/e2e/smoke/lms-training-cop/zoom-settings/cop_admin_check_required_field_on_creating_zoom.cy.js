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
      zoomSettings.setZoomSettingsUrl(zoomMockupData.ZoomSettings.learnTennisTraining.url)
    })
  })
  context(Story.zoomSettings, () => {
    it('CoP Admin check required field on creating zoom', () => {
      Story.ticket('QA-1217')
      SignInAs.copAdmin()
      zoomSettings.visitZoomSettings()
      zoomSettings.addZoomAccount()
      zoomSettings.checkRequiredField(zoomInfo)
    })
  })
})
