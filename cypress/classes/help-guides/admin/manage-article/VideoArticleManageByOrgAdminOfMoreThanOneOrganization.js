import AdminHelpGuideLogin from '../../base-help-guides/member-management/AdminHelpGuideLogin'
import VideoArticleBase from './VideoArticleBase'

class VideoArticleManageByOrgAdminOfMoreThanOneOrganization extends VideoArticleBase {
  logIn() {
    this.adminHelpGuideLogin.signInAsAdminTwoOrgToTab()
  }
  before() {
    cy.readFile('cypress/fixtures/help-guide.yaml').then((helpguideString) => {
      const videoArticle = YAML.parse(helpguideString).CreateVideoArticle.admin.articles
      this._vimeoUrl = videoArticle.vimeoUrl
      this._youTubeUrl = videoArticle.youTubeUrl
      this._uploadVideoPath = videoArticle.uploadVideoPath
      this._videoArticle = videoArticle.adminTwoOrg.video.name.new
      this._vimeoArticle = videoArticle.adminTwoOrg.vimeo.name.new
      this._videoUploadArticle = videoArticle.adminTwoOrg.upload.name.new
    })
  }
}

export default VideoArticleManageByOrgAdminOfMoreThanOneOrganization
