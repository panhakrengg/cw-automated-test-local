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
        learningPath = CourseInLearningPaths.lpForUpdateCourseLog
        courses = learningPath.courses
      })
  })

  context(Story.lmsChangeLogLearningPath, () => {
    it('Create learning path "LP for updating course to check log"', () => {
      setupLp.login.toCreateLearningPathAsLearningPathF()
      setupLp.createLearningPath(learningPath)
      setupLp.addCoursesFromOverview(courses)
    })
  })
})
