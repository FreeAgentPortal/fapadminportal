export interface PermissionGroup {
  label: string;
  value: string;
  permissions: Permission[];
}

export interface Permission {
  label: string;
  value: string;
  description: string;
}

export const ADMIN_PERMISSIONS: PermissionGroup[] = [
  {
    label: "User Management",
    value: "users",
    permissions: [
      {
        label: "View Users",
        value: "users.read",
        description: "View user profiles and information",
      },
      {
        label: "Create Users",
        value: "users.create",
        description: "Create new user accounts",
      },
      {
        label: "Update Users",
        value: "users.update",
        description: "Edit user profiles and settings",
      },
      {
        label: "Delete Users",
        value: "users.delete",
        description: "Remove user accounts",
      },
      {
        label: "Manage User Roles",
        value: "users.roles",
        description: "Assign and modify user roles",
      },
      {
        label: "View User Activity",
        value: "users.activity",
        description: "View user login and activity logs",
      },
    ],
  },
  {
    label: "Team Management",
    value: "teams",
    permissions: [
      {
        label: "View Teams",
        value: "teams.read",
        description: "View team information and rosters",
      },
      {
        label: "Create Teams",
        value: "teams.create",
        description: "Create new teams",
      },
      {
        label: "Update Teams",
        value: "teams.update",
        description: "Edit team information and settings",
      },
      {
        label: "Delete Teams",
        value: "teams.delete",
        description: "Remove teams",
      },
      {
        label: "Manage Team Members",
        value: "teams.members",
        description: "Add/remove team members",
      },
      {
        label: "Team Financial Management",
        value: "teams.finances",
        description: "Manage team payments and billing",
      },
    ],
  },
  {
    label: "Athlete Management",
    value: "athletes",
    permissions: [
      {
        label: "View Athletes",
        value: "athletes.read",
        description: "View athlete profiles and statistics",
      },
      {
        label: "Create Athletes",
        value: "athletes.create",
        description: "Create new athlete profiles",
      },
      {
        label: "Update Athletes",
        value: "athletes.update",
        description: "Edit athlete information",
      },
      {
        label: "Delete Athletes",
        value: "athletes.delete",
        description: "Remove athlete profiles",
      },
      {
        label: "Manage Athlete Eligibility",
        value: "athletes.eligibility",
        description: "Manage athlete eligibility status",
      },
      {
        label: "View Athlete Analytics",
        value: "athletes.analytics",
        description: "Access athlete performance analytics",
      },
    ],
  },
  {
    label: "Content Management",
    value: "content",
    permissions: [
      {
        label: "View Content",
        value: "content.read",
        description: "View website content and media",
      },
      {
        label: "Create Content",
        value: "content.create",
        description: "Create new content and media",
      },
      {
        label: "Update Content",
        value: "content.update",
        description: "Edit existing content",
      },
      {
        label: "Delete Content",
        value: "content.delete",
        description: "Remove content and media",
      },
      {
        label: "Publish Content",
        value: "content.publish",
        description: "Publish and unpublish content",
      },
      {
        label: "Moderate Content",
        value: "content.moderate",
        description: "Review and moderate user-generated content",
      },
    ],
  },
  {
    label: "System Administration",
    value: "system",
    permissions: [
      {
        label: "View System Logs",
        value: "system.logs",
        description: "Access system and audit logs",
      },
      {
        label: "Manage System Settings",
        value: "system.settings",
        description: "Configure system-wide settings",
      },
      {
        label: "Database Management",
        value: "system.database",
        description: "Perform database operations",
      },
      {
        label: "Server Management",
        value: "system.server",
        description: "Manage server configurations",
      },
      {
        label: "Security Management",
        value: "system.security",
        description: "Manage security settings and policies",
      },
      {
        label: "Backup Management",
        value: "system.backup",
        description: "Manage system backups and restores",
      },
    ],
  },
  {
    label: "Financial Management",
    value: "finances",
    permissions: [
      {
        label: "View Financial Reports",
        value: "finances.read",
        description: "View financial reports and analytics",
      },
      {
        label: "Manage Payments",
        value: "finances.payments",
        description: "Process and manage payments",
      },
      {
        label: "Manage Subscriptions",
        value: "finances.subscriptions",
        description: "Handle subscription management",
      },
      {
        label: "Generate Invoices",
        value: "finances.invoices",
        description: "Create and manage invoices",
      },
      {
        label: "Tax Management",
        value: "finances.taxes",
        description: "Manage tax-related operations",
      },
      {
        label: "Refund Management",
        value: "finances.refunds",
        description: "Process refunds and chargebacks",
      },
    ],
  },
  {
    label: "Communication",
    value: "communication",
    permissions: [
      {
        label: "View Messages",
        value: "communication.read",
        description: "View user communications and messages",
      },
      {
        label: "Send Messages",
        value: "communication.send",
        description: "Send messages to users",
      },
      {
        label: "Broadcast Messages",
        value: "communication.broadcast",
        description: "Send broadcast messages to multiple users",
      },
      {
        label: "Manage Notifications",
        value: "communication.notifications",
        description: "Manage system notifications",
      },
      {
        label: "Email Management",
        value: "communication.email",
        description: "Manage email campaigns and templates",
      },
      {
        label: "SMS Management",
        value: "communication.sms",
        description: "Manage SMS communications",
      },
    ],
  },
  {
    label: "Support Management",
    value: "support",
    permissions: [
      {
        label: "View Support Tickets",
        value: "support.read",
        description: "View support tickets and requests",
      },
      {
        label: "Create Support Tickets",
        value: "support.create",
        description: "Create support tickets on behalf of users",
      },
      {
        label: "Update Support Tickets",
        value: "support.update",
        description: "Update and respond to support tickets",
      },
      {
        label: "Close Support Tickets",
        value: "support.close",
        description: "Close and resolve support tickets",
      },
      {
        label: "Assign Tickets",
        value: "support.assign",
        description: "Assign tickets to support agents",
      },
      {
        label: "Support Analytics",
        value: "support.analytics",
        description: "View support metrics and analytics",
      },
    ],
  },
  {
    label: "API Management",
    value: "api",
    permissions: [
      {
        label: "View API Keys",
        value: "api.read",
        description: "View API keys and integrations",
      },
      {
        label: "Create API Keys",
        value: "api.create",
        description: "Generate new API keys",
      },
      {
        label: "Update API Keys",
        value: "api.update",
        description: "Modify API key permissions",
      },
      {
        label: "Delete API Keys",
        value: "api.delete",
        description: "Revoke API keys",
      },
      {
        label: "API Analytics",
        value: "api.analytics",
        description: "View API usage analytics",
      },
      {
        label: "Rate Limit Management",
        value: "api.limits",
        description: "Manage API rate limits",
      },
    ],
  },
  {
    label: "Analytics & Reports",
    value: "analytics",
    permissions: [
      {
        label: "View Analytics",
        value: "analytics.read",
        description: "View system analytics and reports",
      },
      {
        label: "Create Reports",
        value: "analytics.create",
        description: "Generate custom reports",
      },
      {
        label: "Export Data",
        value: "analytics.export",
        description: "Export data and reports",
      },
      {
        label: "User Analytics",
        value: "analytics.users",
        description: "Access user behavior analytics",
      },
      {
        label: "Performance Analytics",
        value: "analytics.performance",
        description: "View system performance metrics",
      },
      {
        label: "Business Intelligence",
        value: "analytics.business",
        description: "Access business intelligence reports",
      },
    ],
  },
  {
    label: "Scouts Functionality",
    value: "scouts",
    permissions: [
      {
        label: "View Scout Reports",
        value: "scouts.read",
        description: "View scout reports and analytics",
      },
      {
        label: "Create Scout Reports",
        value: "scouts.create",
        description: "Create new scout reports",
      },
      {
        label: "Update Scout Reports",
        value: "scouts.update",
        description: "Update existing scout reports",
      },
      {
        label: "Delete Scout Reports",
        value: "scouts.delete",
        description: "Delete scout reports",
      },
    ],
  }
];

// Helper functions for working with permissions
export const getAllPermissions = (): Permission[] => {
  return ADMIN_PERMISSIONS.reduce((acc, group) => {
    return [...acc, ...group.permissions];
  }, [] as Permission[]);
};

export const getPermissionsByGroup = (groupValue: string): Permission[] => {
  const group = ADMIN_PERMISSIONS.find((g) => g.value === groupValue);
  return group ? group.permissions : [];
};

export const getPermissionByValue = (value: string): Permission | undefined => {
  return getAllPermissions().find((permission) => permission.value === value);
};

export const getGroupByPermission = (permissionValue: string): PermissionGroup | undefined => {
  return ADMIN_PERMISSIONS.find((group) =>
    group.permissions.some((permission) => permission.value === permissionValue)
  );
};

// Default role permissions
export const DEFAULT_ROLE_PERMISSIONS = {
  admin: [
    "users.read",
    "users.create",
    "users.update",
    "users.delete",
    "users.roles",
    "users.activity",
    "teams.read",
    "teams.create",
    "teams.update",
    "teams.delete",
    "teams.members",
    "teams.finances",
    "athletes.read",
    "athletes.create",
    "athletes.update",
    "athletes.delete",
    "athletes.eligibility",
    "athletes.analytics",
    "content.read",
    "content.create",
    "content.update",
    "content.delete",
    "content.publish",
    "content.moderate",
    "system.logs",
    "system.settings",
    "system.database",
    "system.server",
    "system.security",
    "system.backup",
    "finances.read",
    "finances.payments",
    "finances.subscriptions",
    "finances.invoices",
    "finances.taxes",
    "finances.refunds",
    "communication.read",
    "communication.send",
    "communication.broadcast",
    "communication.notifications",
    "communication.email",
    "communication.sms",
    "support.read",
    "support.create",
    "support.update",
    "support.close",
    "support.assign",
    "support.analytics",
    "api.read",
    "api.create",
    "api.update",
    "api.delete",
    "api.analytics",
    "api.limits",
    "analytics.read",
    "analytics.create",
    "analytics.export",
    "analytics.users",
    "analytics.performance",
    "analytics.business",
    "scouts.read",
    "scouts.create",
    "scouts.update",
    "scouts.delete",
  ],
  developer: [
    "users.read",
    "users.activity",
    "teams.read",
    "teams.update",
    "athletes.read",
    "athletes.update",
    "athletes.analytics",
    "content.read",
    "content.create",
    "content.update",
    "content.publish",
    "system.logs",
    "system.settings",
    "system.database",
    "system.backup",
    "api.read",
    "api.create",
    "api.update",
    "api.analytics",
    "api.limits",
    "analytics.read",
    "analytics.create",
    "analytics.export",
    "analytics.performance",
  ],
  moderator: [
    "users.read",
    "users.activity",
    "teams.read",
    "athletes.read",
    "content.read",
    "content.update",
    "content.moderate",
    "communication.read",
    "communication.send",
    "communication.notifications",
    "support.read",
    "support.create",
    "support.update",
    "support.close",
    "analytics.read",
    "analytics.users",
  ],
  support: [
    "users.read",
    "teams.read",
    "athletes.read",
    "content.read",
    "communication.read",
    "communication.send",
    "communication.notifications",
    "support.read",
    "support.create",
    "support.update",
    "support.close",
    "support.analytics",
    "analytics.read",
  ],
  scout: [
    "scouts.read",
    "scouts.create",
    "scouts.update",
    "scouts.delete",
  ],
};
