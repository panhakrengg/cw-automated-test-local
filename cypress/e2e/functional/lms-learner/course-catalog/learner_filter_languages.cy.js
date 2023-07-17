import { Lms } from '../../../../classes/constants/Lms'
import Epic from '../../../../classes/Epic'
import LearningCoP from '../../../../classes/lms-training-cop/LearningCoP'
import Learning from '../../../../classes/lms/Learning'
import Story from '../../../../classes/Story'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsLearner, () => {
  const signInAsLms = new SignInLmsAs()
  const learning = new Learning()
  const learningCoP = new LearningCoP()

  context(Story.courseCatalog, () => {
    let filterLanguage

    before(() => {
      new YamlHelper('lms/course-filter/course-language').read().then(({ FilterLanguage }) => {
        filterLanguage = FilterLanguage
      })
    })

    it('Learner filter languages', () => {
      Story.ticket('QA-1773')

      context('Go to course catalog', () => {
        signInAsLms.couMember_Litzy()
        learning.visitLearningPage()
        learning.switchToCourseCatalog()
      })

      context('Filter and only see German', () => {
        learningCoP.expandFilterBy(Lms.languages)
        learningCoP.expandFilterBy(Lms.categoriesCommunities)
        learning.filterByLabelName(Lms.fireCloudZone)
        learning.filterByLabelName(Lms.germanLanguage)
        learningCoP._expectToSeeOnlyMyLearningByLanguages(filterLanguage.german)
        cy.wait(2000)
      })

      context('Filter and only see French', () => {
        learning.unCheckFilterByLabelName(Lms.germanLanguage)
        learning.filterByLabelName(Lms.frenchLanguage)
        learningCoP._expectToSeeOnlyMyLearningByLanguages(filterLanguage.french)
        cy.wait(2000)
      })

      context('Filter and only see French and Chinese', () => {
        learning.filterByLabelName(Lms.chineseLanguage)
        learningCoP._expectToSeeOnlyMyLearningByLanguages(filterLanguage.frenchChinese)
      })
    })
  })
})
