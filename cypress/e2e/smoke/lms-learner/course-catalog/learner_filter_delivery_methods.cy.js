import Epic from '../../../../classes/Epic'
import Learning from '../../../../classes/lms/Learning'
import Story from '../../../../classes/Story'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsLearner, () => {
  const signInLmsAs = new SignInLmsAs()
  const learning = new Learning()
  let filterResult

  before(() => {
    new YamlHelper('lms/course-filter/delivery-method-and-all')
      .read()
      .its('FilterDeliveryMethod')
      .then((filterDeliveryMethod) => {
        filterResult = filterDeliveryMethod
      })
    signInLmsAs.couMember_Litzy()
  })

  context(Story.courseCatalog, () => {
    it('Learner filter delivery methods', () => {
      Story.ticket('QA-1790')
      learning.visitLearningPage()
      learning.searchCourse('“DeliveryMethod”')
      learning.expectOnlyVirtualClassesByApplyVirtualFilter(filterResult.virtual)
      learning.expectOnlyPhysicalClassesByApplyPhysicalFilter(filterResult.physical)
      learning.expectOnlySelfStudyBlendedClassesByApplySelfStudyBlendedFilter(
        filterResult.selfStudyBlended
      )
    })
  })
})
