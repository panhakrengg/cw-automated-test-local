import AdminHelpGuideLogin from '../../base-help-guides/member-management/AdminHelpGuideLogin'
import VideoArticleBase from './VideoArticleBase'

class VideoArticleManageByOrgAdminOfOneOrganizationOnly extends VideoArticleBase {
  logIn() {
    this.adminHelpGuideLogin.signInAsOrgAdminToTab()
  }

  before() {
    cy.readFile('cypress/fixtures/help-guide.yaml').then((helpguideString) => {
      const videoArticle = YAML.parse(helpguideString).CreateVideoArticle.admin.articles
      this._vimeoUrl = videoArticle.vimeoUrl
      this._youTubeUrl = videoArticle.youTubeUrl
      this._uploadVideoPath = videoArticle.uploadVideoPath
      this._videoArticle = videoArticle.organizationAdmin.video.name.new
      this._vimeoArticle = videoArticle.organizationAdmin.vimeo.name.new
      this._videoUploadArticle = videoArticle.organizationAdmin.upload.name.new
    })
  }
}

export default VideoArticleManageByOrgAdminOfOneOrganizationOnly
