import QuickTip from '../../../utilities/QuickTip'
import YamlHelper from '../../../utilities/YamlHelper'

class ModifyCourseInstance {
  expectQuickTip() {
    const quickTip = new QuickTip()

    new YamlHelper('validation/quick-tip').read().then(({ QuickTip }) => quickTip.setTemplate(QuickTip.createNewInstance))
    quickTip.verifyQuickTip()
  }
}

export default ModifyCourseInstance
