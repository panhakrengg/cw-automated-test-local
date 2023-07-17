import Epic from '../../../../classes/Epic'
import NoVideoArticleManageByOrgAdminOfOneOrganizationOnly from '../../../../classes/help-guides/admin/manage-article/NoVideoArticleManageByOrgAdminOfOneOrganizationOnly'
import Story from '../../../../classes/Story'

describe( Epic.HelpGuides, {retries: 1}, () => {
  context(Story.adminArticleCreateWithoutVideo, () => {
    context('Organization Admin of one organization only', () => {
      new NoVideoArticleManageByOrgAdminOfOneOrganizationOnly().execute()
    })
  })
})
