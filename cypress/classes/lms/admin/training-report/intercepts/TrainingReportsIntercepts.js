import InterceptReq from '../../../../../classes/base/InterceptReq'

class TrainingReportsIntercepts {
  static getFilterOptions = new InterceptReq(
    '/training-report/get_filter_options',
    'GetFilterOptionsTrainingReports'
  )
  static getTrainingReport = new InterceptReq('/training-report/get', 'GetTrainingReport')
}

export default TrainingReportsIntercepts
