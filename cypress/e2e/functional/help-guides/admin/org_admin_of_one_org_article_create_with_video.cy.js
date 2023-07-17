import Epic from '../../../../classes/Epic'
import VideoArticleManageByOrgAdminOfOneOrganizationOnly from '../../../../classes/help-guides/admin/manage-article/VideoArticleManageByOrgAdminOfOneOrganizationOnly'
import Story from '../../../../classes/Story'

describe(Epic.HelpGuides, { retries: 1 }, () => {
  context(Story.adminArticleCreateWithVideo, () => {
    context('Organization Admin of one organization only', () => {
      new VideoArticleManageByOrgAdminOfOneOrganizationOnly().execute()
    })
  })
})
