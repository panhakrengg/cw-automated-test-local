import Epic from '../../../../../classes/Epic'
import HomePageSearch from '../../../../../classes/help-guides/home/HomePageSearch'
import Story from '../../../../../classes/Story'
import Faker from '../../../../../classes/utilities/Faker'

describe(Epic.HelpGuides, () => {
  const homePageSearch = new HomePageSearch()
  const faker = new Faker()

  beforeEach(() => {
    homePageSearch.getHelpGuideFilterData()
    cy.get('@orgMember').then(($orgMember) => {
      homePageSearch.interceptFilter()
      homePageSearch.signInBy($orgMember)
      homePageSearch.waitPage()
      homePageSearch.interceptSearchArticle()
      homePageSearch.initStandardCard()
    })
  })
  context(Story.homeSearchFilter, () => {
    it('Verify search result "Consent Forms"', () => {
      Story.ticket('QA-248')
      cy.get('@articleNameConsentForm').then(($articleNameConsentForm) => {
        const searchTitle = faker.getAuTextNotDelete($articleNameConsentForm)
        const totalSearch = 2
        homePageSearch.searchArticleByEnter(searchTitle)
        homePageSearch.displaySearchResultFor(searchTitle, totalSearch)
        homePageSearch.expectTotalRenderArticles(totalSearch)
      })
    })
    it(`Verify filter result base on security, trainers, or community admins filter options`, () => {
      Story.ticket('QA-243')
      cy.get('@articleNameConsentForm').then(($articleNameConsentForm) => {
        describe(`Search article by name ${$articleNameConsentForm}`, () => {
          const searchTitle = faker.getAuTextNotDelete($articleNameConsentForm)
          homePageSearch.searchArticleByEnter(searchTitle)
        })
        describe('Filter by topic "Security"', () => {
          const totalSelectedTopic = 1
          const totalRenderArticle = 2
          cy.get('@topicsSecurity').then(($topicSecurity) => {
            homePageSearch.clickTopicDropdown()
            homePageSearch.topicTag($topicSecurity)
            homePageSearch.expectTotalSelectedTopics(totalSelectedTopic)
            homePageSearch.expectTotalRenderArticles(totalRenderArticle)
            homePageSearch.clickClearFilter()
          })
        })
        describe('Filter by roles "Trainer" & "Community Admins"', () => {
          const totalSelect = 2
          const totalRenderArticle = 1
          cy.get('@roleTrainers').then(($roleTrainers) => {
            cy.get('@roleCommunityAdmins').then(($roleCommunityAdmins) => {
              const roles = [$roleTrainers, $roleCommunityAdmins]
              homePageSearch.clickRoleDropDown()
              homePageSearch.roleTags(roles)
              homePageSearch.expectTotalSelectedRoles(totalSelect)
              homePageSearch.expectTotalRenderArticles(totalRenderArticle)
              homePageSearch.clickClearFilter()
            })
          })
        })
        describe('Filter by topic "Security" and role "Community Admins"', () => {
          const totalSelectedRole = 1
          const totalSelectedTopic = 1
          const totalFilterArticle = 1
          cy.get('@topicsSecurity').then(($topicSecurity) => {
            cy.get('@roleCommunityAdmins').then(($roleTrainers) => {
              homePageSearch.clickTopicDropdown()
              homePageSearch.topicTag($topicSecurity)
              homePageSearch.clickRoleDropDown()
              homePageSearch.roleTag($roleTrainers)
              homePageSearch.expectTotalSelectedTopics(totalSelectedTopic)
              homePageSearch.expectTotalSelectedRoles(totalSelectedRole)
              homePageSearch.expectTotalRenderArticles(totalFilterArticle)
              homePageSearch.clickClearFilter()
              homePageSearch.clickClearSearch()
              homePageSearch.expectTotalRenderArticles(10)
            })
          })
        })
      })
    })

    it(`Verify search result base on content "Animal"`, () => {
      Story.ticket('QA-248')
      cy.get('@contentExpectedResult').then(($contentExpectedResult) => {
        const totalArticles = 6
        homePageSearch.searchArticleByEnter($contentExpectedResult)
        homePageSearch.initStandardCard()
        homePageSearch.displaySearchResultFor($contentExpectedResult, totalArticles)
        homePageSearch.expectTotalRenderArticles(totalArticles)
        cy.get('@searchContentResults').each(($cardTitle) => {
          cy.get(`.card-title:contains("${$cardTitle}")`).should('be.visible')
        })
      })
    })
  })
})
