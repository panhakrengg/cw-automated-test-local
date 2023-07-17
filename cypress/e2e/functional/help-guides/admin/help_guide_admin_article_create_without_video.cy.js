import Epic from '../../../../classes/Epic'
import NoVideoArticleManageByHelpGuideAdmin from '../../../../classes/help-guides/admin/manage-article/NoVideoArticleManageByHelpGuideAdmin'
import Story from '../../../../classes/Story'

describe(Epic.HelpGuides, { retries: 1 }, () => {
  context(Story.adminArticleCreateWithoutVideo, () => {
    context('Help Guide Admin', () => {
      new NoVideoArticleManageByHelpGuideAdmin().execute()
    })
  })
})
