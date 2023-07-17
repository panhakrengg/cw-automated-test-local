import ActivityLogs from '../../../../classes/account/ActivityLogs'
import ActivityCategories from '../../../../classes/constants/ActivityCategories'
import Epic from '../../../../classes/Epic'
import LearningAdmin from '../../../../classes/lms/LearningAdmin'
import Story from '../../../../classes/Story'

const ALL_ACTIVITIES = ActivityCategories.ALL_ACTIVITIES
const PROFILE_UPDATES = ActivityCategories.PROFILE_UPDATES
const COMMUNITIES = ActivityCategories.COMMUNITIES
const CONNECTIONS = ActivityCategories.CONNECTIONS
const ORGANIZATION = ActivityCategories.ORGANIZATION
const SECURITY = ActivityCategories.SECURITY
const TRAINING_AND_DEVELOPMENT = ActivityCategories.TRAINING_AND_DEVELOPMENT
const LEARNING_ADMINISTRATION = ActivityCategories.LEARNING_ADMINISTRATION

describe(Epic.Account, () => {
  const learningAdmin = new LearningAdmin()
  const activityLogs = new ActivityLogs()

  context(Story.activityLog, () => {
    it('Cw Normal User able to see filters on the left side that corresponds to the activity categories', () => {
      Story.ticket('QA-1006')
      learningAdmin.loginAsCourseAdminInJapan()
      activityLogs.accessActivityLog()
      context('Show categories navigation on the left hand', () => {
        activityLogs.showCategoryFilter(ALL_ACTIVITIES)
        activityLogs.showCategoryFilter(PROFILE_UPDATES)
        activityLogs.showCategoryFilter(COMMUNITIES)
        activityLogs.showCategoryFilter(CONNECTIONS)
        activityLogs.showCategoryFilter(ORGANIZATION)
        activityLogs.showCategoryFilter(SECURITY)
        activityLogs.showCategoryFilter(TRAINING_AND_DEVELOPMENT)
        activityLogs.showCategoryFilter(LEARNING_ADMINISTRATION)
      })
      context(`Default filter ${ALL_ACTIVITIES}`, () => {
        activityLogs.containTitleInBody(ALL_ACTIVITIES)
      })
      context(`Click filter ${PROFILE_UPDATES}`, () => {
        activityLogs.clickFilterActivityBy(PROFILE_UPDATES)
        activityLogs.containTitleInBody(PROFILE_UPDATES)
      })
      context(`Click filter ${COMMUNITIES}`, () => {
        activityLogs.clickFilterActivityBy(COMMUNITIES)
        activityLogs.containTitleInBody(COMMUNITIES)
      })
      context(`Click filter ${CONNECTIONS}`, () => {
        activityLogs.clickFilterActivityBy(CONNECTIONS)
        activityLogs.containTitleInBody(CONNECTIONS)
      })
      context(`Click filter ${TRAINING_AND_DEVELOPMENT}`, () => {
        activityLogs.clickFilterActivityBy(TRAINING_AND_DEVELOPMENT)
        activityLogs.containTitleInBody(TRAINING_AND_DEVELOPMENT)
        activityLogs.showNoActivityMessage()
      })
      context(`Click filter ${SECURITY}`, () => {
        activityLogs.clickFilterActivityBy(SECURITY)
        activityLogs.containTitleInBody(SECURITY)
      })
      context(`Click filter ${ORGANIZATION}`, () => {
        activityLogs.clickFilterActivityBy(ORGANIZATION)
        activityLogs.containTitleInBody(ORGANIZATION)
      })
      context(`Click filter ${LEARNING_ADMINISTRATION}`, () => {
        activityLogs.clickFilterActivityBy(LEARNING_ADMINISTRATION)
        activityLogs.containTitleInBody(LEARNING_ADMINISTRATION)
      })
    })
  })
})
