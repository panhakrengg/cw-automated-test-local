class LmsUserRole {
  static #ORG_LMS_USERS = 'OrgLmsUsers'
  static #ORG_LMS_USERS_ADMIN = `${this.#ORG_LMS_USERS}.admins`
  static #ORG_LMS = {
    CATEGORY_ADMIN: `${this.#ORG_LMS_USERS_ADMIN}.categories`,
    COURSE_ADMIN: `${this.#ORG_LMS_USERS_ADMIN}.courses`,
    COURSE_LEADER: `${this.#ORG_LMS_USERS}.leaders`,
    INSTANCE_ADMIN: `${this.#ORG_LMS_USERS_ADMIN}.instances`,
    LEARNER: `${this.#ORG_LMS_USERS}.learners`,
    LEARNING_ADMIN: `${this.#ORG_LMS_USERS_ADMIN}.learnings`,
    LEARNING_PATH_ADMIN: `${this.#ORG_LMS_USERS_ADMIN}.learningPaths`,
  }
  static #CW_LMS_USERS = 'CWLmsUsers'
  static #CW_LMS_USERS_ADMIN = `${this.#CW_LMS_USERS}.admins`
  static #CW_LMS = {
    LEARNING_ADMIN: `${this.#CW_LMS_USERS_ADMIN}.learnings`,
  }
  static LMS_USERS = {
    CATEGORY_ADMIN: {
      AU_LN_CTG_AD_KENTON: `${this.#ORG_LMS.CATEGORY_ADMIN}.auLnCtgAd_Kenton`,
    },
    COURSE_ADMIN: {
      AU_AC_FUNC: `${this.#ORG_LMS.COURSE_ADMIN}.auAcFunc`,
      AU_LN_COU_AD_TRESSIE: `${this.#ORG_LMS.COURSE_ADMIN}.auLnCouAd_Tressie`,
      AU_LN_COU_FACI_JOANIE: `${this.#ORG_LMS.COURSE_ADMIN}.auLnCouFaci_Joanie`,
      AU_LN_COU_LEAD_FACI_MAVERICK: `${this.#ORG_LMS.COURSE_ADMIN}.auLnCouLeadFaci_Maverick`,
      AU_LN_COU_LEAD_GILES: `${this.#ORG_LMS.COURSE_ADMIN}.auLnCouLead_Giles`,
    },
    COURSE_LEADER: {
      AU_ETANYA: `${this.#ORG_LMS.COURSE_LEADER}.aueTanya`,
    },
    LEANER: {
      AU_FUNC_MEMBERS: `${this.#ORG_LMS.LEARNER}.auAcFuncMembers`,
      AU_LN_COU_MEM_LITZY: `${this.#ORG_LMS.LEARNER}.auLnCouMem_Litzy`,
      AU_LN_CTG_MEM_QUESTIN: `${this.#ORG_LMS.LEARNER}.auLnCtgMem_Quentin`,
      AU_LN_IST_MEM_DELPHIA: `${this.#ORG_LMS.LEARNER}.auLnIstMem_Delphia`,
      AU_LN_IST_MEM_MALLORY: `${this.#ORG_LMS.LEARNER}.auLnIstMem_Mallory`,
      AU_OPT_OUT_CA: `${this.#ORG_LMS.LEARNER}.auOptOutCa`,
      AU_OPT_OUT_LEANER: `${this.#ORG_LMS.LEARNER}.auOptOutLearner`,
      AU_OPT_OUT_MEMBER: `${this.#ORG_LMS.LEARNER}.auOptOutMember`,
      AU_LEARNER_ONLYME_KULAS: `${this.#ORG_LMS.LEARNER}.auLearnerOnlyMe_Kulas`,
      AU_LEARNER_Change_Email_JEN: `${this.#ORG_LMS.LEARNER}.auLearnerChangeEmail_Jen`,
    },
    LEARNING_ADMIN: {
      AU_LN_ADMIN_EMERY: `${this.#ORG_LMS.LEARNING_ADMIN}.auLnAdmin_Emery`,
      AU_OPT_OUT_OWNER: `${this.#ORG_LMS.LEARNING_ADMIN}.auOptOutOwner`,
      LEARN_MGT_ADMIN: `${this.#ORG_LMS.LEARNING_ADMIN}.learnMgtAdmin`,
      LEARN_CW_ADMIN: `${this.#CW_LMS.LEARNING_ADMIN}.learnCwAdmin`,
    },
    INSTANCE_ADMIN: {
      AU_LN_IST_AD_FRANCES: `${this.#ORG_LMS.INSTANCE_ADMIN}.auLnIstAd_Frances`,
      AU_LN_IST_FACI_BRITNEY: `${this.#ORG_LMS.INSTANCE_ADMIN}.auLnIstFaci_Britney`,
      AU_LN_IST_LEAD_FACI_AMINA: `${this.#ORG_LMS.INSTANCE_ADMIN}.auLnIstLeadFaci_Amina`,
    },
    LEARNING_PATH_ADMIN: {
      AU_LEARNING_PATH_F: `${this.#ORG_LMS.LEARNING_PATH_ADMIN}.auLearningPathF`,
    },
  }
}

export default LmsUserRole
