class InstanceOverviewQueries {
  getCourseInstanceOverviewUrl(courseInstanceId) {
    return `/web/ci${courseInstanceId}/course-detail`
  }

  getCourseInstanceHeader() {
    return cy.get(`.cec-card__title > span.multi-line-text-ellipsis-two`)
  }

  getCourseAnnouncement() {
    return cy.get('.bg-white.border')
  }
}

export default InstanceOverviewQueries
