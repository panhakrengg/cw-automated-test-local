import InterceptReq from '../../../../base/InterceptReq'

class InstanceOverviewItc {
  static activitiesCourseCatalog = new InterceptReq(
    '/course_catalog/course/activities',
    'ActivitiesCourseCatalog'
  )
}

export default InstanceOverviewItc
