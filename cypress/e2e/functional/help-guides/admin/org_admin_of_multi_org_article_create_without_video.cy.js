import Epic from '../../../../classes/Epic'
import NoVideoArticleManageByOrgAdminOfMoreThanOneOrganization from '../../../../classes/help-guides/admin/manage-article/NoVideoArticleManageByOrgAdminOfMoreThanOneOrganization'
import Story from '../../../../classes/Story'

describe(Epic.HelpGuides, { retries: 1 }, () => {
  context(Story.adminArticleCreateWithoutVideo, () => {
    context('Organization Admin of more than one organization', () => {
      new NoVideoArticleManageByOrgAdminOfMoreThanOneOrganization().execute()
    })
  })
})
