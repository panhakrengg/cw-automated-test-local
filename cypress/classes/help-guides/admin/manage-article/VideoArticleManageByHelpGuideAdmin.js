import VideoArticleBase from './VideoArticleBase'

class VideoArticleManageByHelpGuideAdmin extends VideoArticleBase {
  logIn() {
    this.adminHelpGuideLogin.signInAsAdminToTab()
  }
  before() {
    cy.readFile('cypress/fixtures/help-guide.yaml').then((helpguideString) => {
      const videoArticle = YAML.parse(helpguideString).CreateVideoArticle.admin.articles
      this._vimeoUrl = videoArticle.vimeoUrl
      this._youTubeUrl = videoArticle.youTubeUrl
      this._uploadVideoPath = videoArticle.uploadVideoPath
      this._videoArticle = videoArticle.helpGuideAdmin.video.name.new
      this._vimeoArticle = videoArticle.helpGuideAdmin.vimeo.name.new
      this._videoUploadArticle = videoArticle.helpGuideAdmin.upload.name.new
    })
  }
}

export default VideoArticleManageByHelpGuideAdmin
