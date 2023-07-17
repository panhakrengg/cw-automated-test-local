import Epic from '../../../../classes/Epic'
import FacilitatorResources from '../../../../classes/lms-training-cop/FacilitatorResources'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsTrainingCop, () => {
  let files
  let courseId
  const faker = new Faker()
  const resources = new FacilitatorResources()
  const unSupportedFiles = new YamlHelper('sample-unsupport-files')
  const facilitatorResources = new YamlHelper('lms-training-cop/courses/facilitator-resources')
  before(() => {
    unSupportedFiles.read().then(({ UnsupportedFiles }) => {
      files = UnsupportedFiles
    })
    facilitatorResources.read().then(({ CourseData }) => {
      const course = CourseData.tennisWarmUpGuide
      faker.setPathFixture(course)
      courseId = faker.getUrlId()
    })
  })
  context(Story.manageCourse, () => {
    it('CoP Admin upload unsupported files', () => {
      Story.ticket('QA-1334')
      SignInAs.copAdmin()
      resources.visitFacilitatorResourceBy(courseId)
      resources.verifyUploadUnSupportFiles(files)
      resources.expectResourcesNotExist(files)
    })
  })
})
