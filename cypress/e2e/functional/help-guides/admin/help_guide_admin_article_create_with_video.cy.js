import Epic from '../../../../classes/Epic'
import VideoArticleManageByHelpGuideAdmin from '../../../../classes/help-guides/admin/manage-article/VideoArticleManageByHelpGuideAdmin'
import Story from '../../../../classes/Story'

describe(Epic.HelpGuides, { retries: 1 }, () => {
  context(Story.adminArticleCreateWithVideo, () => {
    context('Help Guide Admin', () => {
      new VideoArticleManageByHelpGuideAdmin().execute()
    })
  })
})
