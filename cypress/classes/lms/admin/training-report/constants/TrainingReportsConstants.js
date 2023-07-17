export const AdvancedFilters = {
  ADVANCED_FILTERS: 'Advanced Filters',
  APPLY: 'Apply',
  CATEGORY_COMMUNITY: 'Category and Community',
  CLEAR_FILTER: 'Clear Filter',
  COURSES: 'Courses',
  COURSE_COMPLETION_STATUS: 'Course completion status',
  COURSE_END_DATE: 'Course End Date',
  COURSE_LOCATION: 'Course Location',
  COURSE_START_DATE: 'Course Start Date',
  DELIVERY_METHODS: 'Delivery Methods',
  INCLUDE_LEARNERS_WHO_NOT_ORG_MEM: 'Include learners who are not organization members',
  LEARNER_NAME: 'Learner name',
  SEARCH_COURSES_OR_LEARNERS: 'Search courses or learners',
  SHOW_LEARNERS_WHO_HAVE_NOT_BOOKED_COURSE: 'Show learners who have not booked the selected course',
}

export const TrainingReportColumns = {
  // Please DO NOT Reorder this column values because it stands based on training report columns ordering
  NAME_ORG_PROFILE: 'Name (Organization Profile)',
  EMAIL_ORG_PROFILE: 'Email (Organization Profile)',
  NAME_PUBLIC_PROFILE: 'Name (Public Profile)',
  ACCOUNT_EMAIL: 'Account Email',
  COURSE_TITLE: 'Course Title',
  INSTANCE_TITLE: 'Instance Title',
  STATUS: 'Status',
  DELIVERY_METHOD: 'Delivery Method',
  COMPLETION_DATE: 'Completion Date',
  COURSE_START_DATE: 'Course Start Date',
  COURSE_END_DATE: 'Course End Date',
  LOCATION: 'Location',
  FACILITATOR: 'Facilitator',
  CATEGORY_COMMUNITY: 'Category and Community',
  PERCENTAGE_COMPLETE: 'Percentage Complete',
}

export const TrainingReportColumnsByRole = {
  LEARNING_ADMIN: [
    TrainingReportColumns.ACCOUNT_EMAIL,
    TrainingReportColumns.COMPLETION_DATE,
    TrainingReportColumns.COURSE_TITLE,
    TrainingReportColumns.DELIVERY_METHOD,
    TrainingReportColumns.INSTANCE_TITLE,
    TrainingReportColumns.NAME_ORG_PROFILE,
    TrainingReportColumns.NAME_PUBLIC_PROFILE,
    TrainingReportColumns.STATUS,
  ],
  CATEGORY_ADMIN: [
    TrainingReportColumns.ACCOUNT_EMAIL,
    TrainingReportColumns.COMPLETION_DATE,
    TrainingReportColumns.COURSE_TITLE,
    TrainingReportColumns.DELIVERY_METHOD,
    TrainingReportColumns.INSTANCE_TITLE,
    TrainingReportColumns.NAME_PUBLIC_PROFILE,
    TrainingReportColumns.STATUS,
  ],
}

export const TrainingReportColumnsInCourseLevel = {
  COURSE_ADMIN: [
    TrainingReportColumns.NAME_PUBLIC_PROFILE,
    TrainingReportColumns.ACCOUNT_EMAIL,
    TrainingReportColumns.INSTANCE_TITLE,
    TrainingReportColumns.STATUS,
    TrainingReportColumns.COMPLETION_DATE,
  ],
}

export const TrainingReportColumnsInInstanceLevel = {
  COURSE_ADMIN: [
    TrainingReportColumns.NAME_PUBLIC_PROFILE,
    TrainingReportColumns.ACCOUNT_EMAIL,
    TrainingReportColumns.STATUS,
    TrainingReportColumns.COMPLETION_DATE,
  ],
  COURSE_ADMIN_NOT_SEE: [TrainingReportColumns.INSTANCE_TITLE],
}
