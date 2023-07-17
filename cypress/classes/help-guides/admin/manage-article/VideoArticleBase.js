import Story from '../../../Story'
import ManageArticle from './ManageArticle'

class VideoArticleBase extends ManageArticle {
  _vimeoUrl
  _youTubeUrl
  _uploadVideoPath
  _videoArticle
  _vimeoArticle
  _videoUploadArticle

  logIn() {
    throw new Error('You have to implement the method logIn!')
  }

  before() {
    throw Error('You have to implement the method before to fetch mockup data!')
  }

  execute() {
    before(() => {
      this.before()
    })
    beforeEach(() => {
      this.itcAdminHelpGuide.interceptList()
      this.logIn()
    })
    it('Uploaded Video Article without Featured Image - Select File Upload', () => {
      Story.ticket('QA-34')
      this.removeAllArticles(this._videoUploadArticle)
      this.newArticle()
      this.enterArticleTitle(this._videoUploadArticle)
      this.enableIncludeVideo()
      this.uploadVideo(this._uploadVideoPath)
      this.publish()
      this.expectVideoArticleInArticlesAdminPage(this._videoUploadArticle)
      this.goToHomePage()
      this.expectVideoArticleInArticlesHomePage(this._videoUploadArticle)
      this.goToAdminPage()
      this.removeAllArticles(this._videoUploadArticle)
    })
    it('Vimeo Video Article without Featured Image', () => {
      Story.ticket('QA-30')
      this.removeAllArticles(this._vimeoArticle)
      this.newArticle()
      this.enterArticleTitle(this._vimeoArticle)
      this.enableIncludeVideo()
      this.addVimeoLink(this._vimeoUrl)
      this.publish()
      this.expectVideoArticleInArticlesAdminPage(this._vimeoArticle)
      this.goToHomePage()
      this.expectVideoArticleInArticlesHomePage(this._vimeoArticle)
      this.goToAdminPage()
      this.removeAllArticles(this._vimeoArticle)
    })
    it('YouTube Video without Featured Image on CW Domain', () => {
      Story.ticket('QA-31')
      this.removeAllArticles(this._videoArticle)
      this.newArticle()
      this.enterArticleTitle(this._videoArticle)
      this.enableIncludeVideo()
      this.addYouTubeLink(this._youTubeUrl)
      this.publish()
      this.expectVideoArticleInArticlesAdminPage(this._videoArticle)
      this.goToHomePage()
      this.expectVideoArticleInArticlesHomePage(this._videoArticle)
      this.goToAdminPage()
      this.removeAllArticles(this._videoArticle)
    })
    it('Delete Uploaded Video in Help Guide Article', () => {
      Story.ticket('QA-36')
      this.newArticle()
      this.enableIncludeVideo()
      this.uploadVideo(this._uploadVideoPath)
      this.removeUploadedVideo()
      this.expectedUploadVideoDropzoneVisible()
    })
  }
}

export default VideoArticleBase
