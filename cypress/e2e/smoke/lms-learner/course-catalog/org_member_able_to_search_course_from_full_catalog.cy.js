import Epic from '../../../../classes/Epic'
import Learning from '../../../../classes/lms/Learning'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'
import Field from '../../../../classes/constants/Field'

describe(Epic.LmsLearner, () => {
  const learning = new Learning()
  const faker = new Faker()
  let courseInfo

  before(() => {
    new YamlHelper('lms/sample-lms')
      .read()
      .its('CourseData.mvcPattern')
      .then((mvcPattern) => {
        courseInfo = mvcPattern
      })

    SignInAs.orgMember()
  })

  context(Story.courseCatalog, () => {
    it('Org Member able to search course from full catalog', () => {
      Story.ticket('QA-1491')
      learning.visitLearningPage()
      learning.expectToSeeCourseAfterSearchInMyLearning(
        courseInfo, Field.VIEW, false, false)
    })
  })
})
