import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import ReportDefect from '../../../../classes/utilities/ReportDefect'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, {tags: '@skipFeatureChange'}, () => {
  let zoomSettingsUrl
  before(() => {
    cy.readFile('cypress/fixtures/lms-training-cop/zoom-setting.yaml').then((zoomSettingString) => {
      zoomSettingsUrl = YAML.parse(zoomSettingString).ZoomSettings.learnTennisTraining.url
    })
  })
  context(Story.zoomSettings, () => {
    it('CoP Member will see page not found when access zoom settings page', () => {
      Story.ticket('QA-1125', ['CW-16516'])
      SignInAs.copMember()
      cy.visit(zoomSettingsUrl, { failOnStatusCode: false })
      cy.pageNotFound()
    })

    after(() => {
      ReportDefect.markCwDefect()
    })
  })
})
