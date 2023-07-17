import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetupLearningPath from '../../../../../classes/lms/admin/setup-data/SetupLearningPath'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'

describe(Epic.LmsAdmin, () => {
  let learningPath
  const setupLp = new SetupLearningPath()

  before(() => {
    new YamlHelper('lms-admin/lms-change-log/log-learning-path')
      .read()
      .then(({ EditLearningPaths }) => {
        learningPath = EditLearningPaths.lpForEditLog.previous
      })
  })

  context(Story.lmsChangeLogLearningPath, () => {
    it('Create learning path "LP for editing to check log"', () => {
      setupLp.login.toCreateLearningPathAsLearningPathF()
      setupLp.createLearningPath(learningPath)
    })
  })
})
