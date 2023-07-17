import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import Environment from '../../../../classes/base/Environment'
import Learning from '../../../../classes/lms/Learning'
import YamlHelper from '../../../../classes/utilities/YamlHelper'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsLearner, { retries: 1 }, () => {
  const signInLmsAs = new SignInLmsAs()
  const learning = new Learning()
  let tCopFilter
  let communityCourseData
  let lmsCategoryFilter
  let orgLmsSpecificCategoryCourseData
  let communityAndOrgLmsSpecificCategoryCourseData = {}

  before(() => {
    new YamlHelper('lms-training-cop/cop-info')
      .read()
      .its('CopInfo')
      .then((CopInfo) => {
        tCopFilter = CopInfo.trainingCop.tCopFilter.name
      })
    new YamlHelper('lms-training-cop/course-filter/categories-communities')
      .read()
      .its('CourseData')
      .then((CourseData) => {
        communityCourseData = CourseData
      })
    new YamlHelper('lms/course-filter/categories-communities')
      .read()
      .then(({ CategoryData, CourseData }) => {
        lmsCategoryFilter = CategoryData.categoriesFilter.name
        orgLmsSpecificCategoryCourseData = CourseData
        Object.assign(
          communityAndOrgLmsSpecificCategoryCourseData,
          communityCourseData,
          orgLmsSpecificCategoryCourseData
        )
      })
  })

  context(Story.courseCatalog, () => {
    it('Learner filter categories/communities', () => {
      Story.ticket('QA-1791')
      signInLmsAs.lnAdmin_Emery()
      learning.visitLearningPage()
      learning.switchToCourseCatalog()

      learning.expectToSeeCoursesOfFilteredCommunity(tCopFilter, communityCourseData)

      if (!new Environment().isPrd) {
        learning.expectToSeeCoursesOfFilteredCommunityAndOrgLmsCategory(
          lmsCategoryFilter,
          communityAndOrgLmsSpecificCategoryCourseData
        )

        learning.expectToSeeCoursesOfFilteredOrgLmsCategory(orgLmsSpecificCategoryCourseData)
      }
    })
  })
})
