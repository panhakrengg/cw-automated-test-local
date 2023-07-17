import Epic from '../../../../classes/Epic'
import Learning from '../../../../classes/lms/Learning'
import SignInAs from '../../../../classes/utilities/SignInAs'
import Story from '../../../../classes/Story'

describe(Epic.LmsLearner, () => {
  const data = {
    sortBy: {
      mostRecent: 'Most Recent',
      mostPopular: 'Most Popular',
      alphaAZ: 'Alphabetic A-Z',
      alphaZA: 'Alphabetic Z-A',
    },
    filters: {
      courseTypes: {
        title: 'Course Types',
        items: ['Learning Path', 'Course', 'Micro-Learning'],
      },
      languages: {
        title: 'Languages',
        items: ['English', 'Portuguese', 'Spanish'],
      },
      categoriesCommunities: {
        title: 'Categories/Communities',
        items: ['Crosswired', 'FireCloud Zone'],
        exclude: ['Communities'],
      },
      tagsSills: {
        title: 'Tags and Skills',
        items: [
          'Compliance & Leadership',
          'Member Health & Well-Being',
          'Missiology & Evangelism',
          'Online Communities',
          'Spiritual Formation',
        ],
      },
      deliveryMethods: {
        title: 'Delivery Methods',
        items: ['Self-study', 'Virtual Classroom', 'Physical Classroom', 'Blended Learning'],
      },
      providers: {
        title: 'Providers',
        items: ['A Life Overseas', 'International Daniel Team', 'Interserve', 'Khalibre'],
      },
      startDate: {
        title: 'Start Date',
        items: ['This Week', 'This Month', 'This Year', 'Custom'],
      },
    },
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
  }

  const learning = new Learning()

  before(() => {
    SignInAs.member_Arielle()
  })

  context(Story.courseCatalog, () => {
    it('Org Member able to see Course Catalog page', () => {
      Story.ticket('QA-1794')
      learning.visitLearningPage()
      learning.switchToCourseCatalog()
      learning.expectHeaderElementsAreVisible()
      learning.expectSortByDropdownIsVisibleWithItems(data.sortBy)
      learning.expectOnlyCourseTypeFilterIsExpended(data.filters)
      learning.expectCourseFiltersAreListed(data.filters)
      learning.expectDatePickerIsVisible(data.months)
    })
  })
})
