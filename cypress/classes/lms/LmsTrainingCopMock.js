import Environment from '../base/Environment'
import YamlHelper from '../utilities/YamlHelper'

class LmsTrainingCopMock {
  constructor() {
    this.copInfo = new YamlHelper('/lms-training-cop/cop-info')
  }

  learnTennisUrl(CopInfo) {
    return CopInfo.trainingCop.learnTennis.url[new Environment().getEnvYaml()]
  }

  setLearnerLearnTennisUrl(learningCop) {
    this.copInfo.read().then(({ CopInfo }) => {
      learningCop.setTrainingCopUrl(this.learnTennisUrl(CopInfo))
    })
  }

  setAdminLearnTennisUrl(copManageCourse) {
    this.copInfo.read().then(({ CopInfo }) => {
      copManageCourse.setCopAdminUrl(this.learnTennisUrl(CopInfo))
    })
  }
}

export default LmsTrainingCopMock
