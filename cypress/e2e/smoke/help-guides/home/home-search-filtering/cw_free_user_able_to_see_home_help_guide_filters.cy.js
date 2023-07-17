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
    it('Cw Free User able to see home help guide filters', () => {
      Story.ticket('QA-240')
      context('Role dropdown filter', () => {
        helpGuidesHome.clickRolesDropdown()
        helpGuidesHome.expectedFilterContainValue(
          '@rolesDropdown',
          faker.getAuTextNotDelete('Community Admins')
        )
      })

      context('Topic dropdown filter', () => {
        helpGuidesHome.clickTopicsDropdown()
        helpGuidesHome.expectedFilterContainValue(
          '@topicsDropdown',
          faker.getAuTextNotDelete('Communities of Purpose')
        )
      })

      context('Disabled clear button', () => {
        helpGuidesHome.expectedDisabledClearFilterButton()
      })
    })
  })
})
