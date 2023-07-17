import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetupLearningPath from '../../../../../classes/lms/admin/setup-data/SetupLearningPath'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'

describe(Epic.LmsAdmin, () => {
  let learningPath, courses
  const setupLp = new SetupLearningPath()

  before(() => {
    new YamlHelper('lms-admin/lms-change-log/log-learning-path')
      .read()
      .then(({ CourseInLearningPaths }) => {
        learningPath = CourseInLearningPaths.lpForRemoveCourseLog
      })
  })

  context(Story.lmsChangeLogLearningPath, () => {
    it('Create learning path "LP for remove course to check log"', () => {
      setupLp.login.toCreateLearningPathAsLearningPathF()
      setupLp.createLearningPath(learningPath)
    })
  })
})
