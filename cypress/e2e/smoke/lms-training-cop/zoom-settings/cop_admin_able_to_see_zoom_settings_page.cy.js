import Epic from '../../../../classes/Epic'
import ZoomSettings from '../../../../classes/lms-training-cop/zoom_settings'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, {tags: '@skipFeatureChange'}, () => {
  const zoomSettings = new ZoomSettings()
  before(() => {
    cy.readFile('cypress/fixtures/lms-training-cop/zoom-setting.yaml').then((zoomSettingString) => {
      const zoomSetting = YAML.parse(zoomSettingString).ZoomSettings
      zoomSettings.setZoomSettingsUrl(zoomSetting.learnTennisTraining.url)
    })
  })
  context(Story.zoomSettings, () => {
    it('CoP Admin able to see zoom settings page', () => {
      Story.ticket('QA-1124')
      SignInAs.copAdmin()
      zoomSettings.verifyZoomSettingsPage()
    })
  })
})
