import Epic from '../../../../classes/Epic'
import VideoArticleManageByOrgAdminOfMoreThanOneOrganization from '../../../../classes/help-guides/admin/manage-article/VideoArticleManageByOrgAdminOfMoreThanOneOrganization'
import Story from '../../../../classes/Story'

describe(Epic.HelpGuides, { retries: 1 }, () => {
  context(Story.adminArticleCreateWithVideo, () => {
    context('Organization Admin of more than one organization', () => {
      new VideoArticleManageByOrgAdminOfMoreThanOneOrganization().execute()
    })
  })
})
