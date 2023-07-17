import SignInAs from '../../../../utilities/SignInAs'
import MyLearningQueries from '../../queries/MyLearningQueries'

class MyLearningLogin extends MyLearningQueries {
  asLearnerDelphia() {
    SignInAs.learnerDelphia(super.getUrl())
  }
}

export default MyLearningLogin
