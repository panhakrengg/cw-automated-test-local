function memberPermissionOptionsShort(memberPermission) {
  const permissions = JSON.parse(JSON.stringify(memberPermission))
  permissions.dropdown = ['Only community members', 'Not allowed']
  return permissions
}
export const DefaultAdminSettings = {
  visibility: {
    title: 'Visibility',
    items: [
      'Standard',
      '(Appears in search results but has limited access in Collaboration for non-members)',
      'Unlisted',
      '(Visible only to members of this community)',
    ],
  },
  visibilityMW: {
    title: 'Visibility',
    items: [
      'Standard',
      '(Appears in search results but only accessible to members of this Community of Purpose)',
      'Unlisted',
      '(Visible only to members of this community)',
    ],
  },
  defaultPostAuthor: {
    title: 'Default Post Author',
    items: [
      {
        option: 'Myself',
        optionName: 'getUserFullName',
      },
      {
        option: 'My Community of Purpose',
        optionName: 'getCopName',
      },
    ],
  },
  featuresOrg: {
    title: 'Features',
    items: ['Discussion', 'Knowledge Base', 'File Sharing', 'Contact Management', 'Kanban Boards'],
  },
  featuresTraining: {
    title: 'Features',
    items: ['Discussion', 'File Sharing', 'Contact Management', 'Kanban Boards'],
  },
  featuresTopical: {
    title: 'Features',
    items: ['Discussion', 'File Sharing', 'Contact Management'],
  },
  featuresMW: {
    title: 'Features',
    items: ['Contact Management', 'Kanban Boards'],
  },
  memberPermission: {
    title: 'Member Permission',
    items: ['Member request to join your community', 'Anyone can request to join', 'Not allowed'],
    dropdown: ['Only community members', 'Community & organization members', 'Not allowed'],
  },
  memberPermissionMW: {
    title: 'Member Permission',
    items: ['Member request to join your community', 'Anyone can request to join', 'Not allowed'],
    dropdown: ['Only community members', 'Not allowed'],
  },
  ownership: {
    title: 'Ownership',
    items: [
      {
        option: 'Owned by:',
        optionName: 'getUserFullName',
      },
    ],
    popup: {
      header: 'Confirm Password',
      content: ['Confirm your password before continuing'],
    },
  },
  deletion: {
    title: 'Deletion',
    items: ['Once deleted, this Community of Purpose cannot be retrieved.'],
    btnTitle: 'Delete this Community of Purpose',
    popup: {
      header: 'You are about to delete your Community of Purpose',
      content: [
        'I understand that all data in this community will be permanently deleted. Member accounts will not be deleted.',
        'I understand that this action can’t be undone.',
      ],
    },
  },
  banner: {
    title: 'Banner',
    slideshowLabel: 'Banner Slideshow',
    addBannerImage: "Add banner images on your community's home page.",
    featureCourseLabel:
      "Feature courses, learning paths, and images on your community's home page.",
    btnUploadImage: 'Upload Image',
    btnAddCourse: 'Add Course',
    btnSave: 'Save',
    popupImage: {
      title: 'Add to slideshow',
      recommendedImage: 'Recommended image size 900 x 400 px Maximum file size 5 MB',
      btnChangeImage: 'Change image',
      btnSave: 'Save',
    },
    popupCourse: {
      title: 'Add to slideshow',
      noCourseLabel: 'There are currently no courses or learn',
      btnAdd: 'Add',
    },
  },
}

export const OrgCopSettingsOwner = {
  collapses: {
    visibility: DefaultAdminSettings.visibility,
    defaultPostAuthor: DefaultAdminSettings.defaultPostAuthor,
    features: DefaultAdminSettings.featuresOrg,
    memberPermission: DefaultAdminSettings.memberPermission,
    ownership: DefaultAdminSettings.ownership,
    deletion: DefaultAdminSettings.deletion,
    banner: DefaultAdminSettings.banner,
  },
}
export const MWCopSettingsOwner = {
  collapses: {
    visibility: DefaultAdminSettings.visibilityMW,
    defaultPostAuthor: DefaultAdminSettings.defaultPostAuthor,
    features: DefaultAdminSettings.featuresMW,
    memberPermission: DefaultAdminSettings.memberPermissionMW,
    ownership: DefaultAdminSettings.ownership,
    deletion: DefaultAdminSettings.deletion,
    banner: DefaultAdminSettings.banner,
  },
}
export const MWCopSettingsAdmin = {
  collapses: {
    visibility: DefaultAdminSettings.visibilityMW,
    features: DefaultAdminSettings.featuresMW,
    memberPermission: DefaultAdminSettings.memberPermissionMW,
    banner: DefaultAdminSettings.banner,
  },
}
export const OrgCopSettingsAdmin = {
  collapses: {
    visibility: DefaultAdminSettings.visibility,
    features: DefaultAdminSettings.featuresOrg,
    memberPermission: DefaultAdminSettings.memberPermission,
    banner: DefaultAdminSettings.banner,
  },
}
export const TrainingCopSettingsOwner = {
  collapses: {
    visibility: DefaultAdminSettings.visibility,
    defaultPostAuthor: DefaultAdminSettings.defaultPostAuthor,
    features: DefaultAdminSettings.featuresTraining,
    memberPermission: DefaultAdminSettings.memberPermission,
    ownership: DefaultAdminSettings.ownership,
    deletion: DefaultAdminSettings.deletion,
    banner: DefaultAdminSettings.banner,
  },
}
export const TrainingCopSettingsAdmin = {
  collapses: {
    visibility: DefaultAdminSettings.visibility,
    features: DefaultAdminSettings.featuresTraining,
    memberPermission: DefaultAdminSettings.memberPermission,
    banner: DefaultAdminSettings.banner,
  },
}
export const TopicalCopSettingsOwner = {
  collapses: {
    visibility: DefaultAdminSettings.visibility,
    defaultPostAuthor: DefaultAdminSettings.defaultPostAuthor,
    features: DefaultAdminSettings.featuresTopical,
    memberPermission: memberPermissionOptionsShort(DefaultAdminSettings.memberPermission),
    ownership: DefaultAdminSettings.ownership,
    deletion: DefaultAdminSettings.deletion,
    banner: DefaultAdminSettings.banner,
  },
}
export const TopicalCopSettingsAdmin = {
  collapses: {
    visibility: DefaultAdminSettings.visibility,
    features: DefaultAdminSettings.featuresTopical,
    memberPermission: memberPermissionOptionsShort(DefaultAdminSettings.memberPermission),
    banner: DefaultAdminSettings.banner,
  },
}
export const CwTrainingCopSettingsOwner = {
  collapses: {
    visibility: DefaultAdminSettings.visibility,
    defaultPostAuthor: DefaultAdminSettings.defaultPostAuthor,
    features: DefaultAdminSettings.featuresTraining,
    memberPermission: memberPermissionOptionsShort(DefaultAdminSettings.memberPermission),
    ownership: DefaultAdminSettings.ownership,
    deletion: DefaultAdminSettings.deletion,
    banner: DefaultAdminSettings.banner,
  },
}
export const CwTrainingCopSettingsAdmin = {
  collapses: {
    visibility: DefaultAdminSettings.visibility,
    features: DefaultAdminSettings.featuresTraining,
    memberPermission: memberPermissionOptionsShort(DefaultAdminSettings.memberPermission),
    banner: DefaultAdminSettings.banner,
  },
}
export const copAdminDropdownOptions = {
  manageMember: 'Manage Members',
  memberRequests: 'Membership Requests',
  manageConsent: 'Manage Consent',
  socialAnalytics: 'Social Analytics',
  settings: 'Settings',
}
