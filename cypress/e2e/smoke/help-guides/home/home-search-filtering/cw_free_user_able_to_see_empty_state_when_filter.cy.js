import Epic from '../../../../../classes/Epic'
import HelpGuidesHome from '../../../../../classes/help-guides/home/HelpGuidesHome'
import Story from '../../../../../classes/Story'
import Faker from '../../../../../classes/utilities/Faker'

describe(Epic.HelpGuides, () => {
  const helpGuidesHome = new HelpGuidesHome()
  const faker = new Faker()
  beforeEach(() => {
    helpGuidesHome.interceptFilter()
    helpGuidesHome.signInBy('CWUsers.freemium')
    helpGuidesHome.viewWholePage()
  })

  context(Story.homeSearchFilter, () => {
    it('Cw Free User able to see empty state when filter help guide articles', () => {
      Story.ticket('QA-245')
      helpGuidesHome.clickRolesDropdown()
      helpGuidesHome.selectFilterOptionByName('@rolesDropdown', 'Community Admins')
      helpGuidesHome.clickTopicsDropdown()
      helpGuidesHome.selectFilterOptionByName('@topicsDropdown', 'User Settings')
      helpGuidesHome.emptyResult()
      helpGuidesHome.expectedFilterShowTotalSelectedItems('@rolesDropdown')
      helpGuidesHome.expectedFilterShowTotalSelectedItems('@topicsDropdown')
    })
  })
})
