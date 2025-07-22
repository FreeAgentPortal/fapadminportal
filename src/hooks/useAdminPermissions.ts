import { useState } from "react";
import { DEFAULT_ROLE_PERMISSIONS } from "@/data/adminPermissions";

export const useAdminPermissions = (initialPermissions: string[] = []) => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(initialPermissions);

  // Get permissions for multiple roles (combines permissions from all roles)
  const getPermissionsForRoles = (roles: string[]): string[] => {
    const combinedPermissions = new Set<string>();
    roles.forEach((role) => {
      const rolePermissions = DEFAULT_ROLE_PERMISSIONS[role as keyof typeof DEFAULT_ROLE_PERMISSIONS] || [];
      rolePermissions.forEach((permission) => combinedPermissions.add(permission));
    });
    return Array.from(combinedPermissions);
  };

  // Update permissions and sync with form
  const updatePermissions = (permissions: string[], formInstance?: any) => {
    setSelectedPermissions(permissions);
    if (formInstance) {
      formInstance.setFieldValue("permissions", permissions);
    }
  };

  // Apply role-based default permissions
  const applyRoleDefaults = (roles: string[], formInstance?: any) => {
    const permissions = getPermissionsForRoles(roles);
    updatePermissions(permissions, formInstance);
    return permissions;
  };

  // Reset to initial state
  const resetPermissions = (formInstance?: any) => {
    updatePermissions([], formInstance);
  };

  return {
    selectedPermissions,
    setSelectedPermissions,
    updatePermissions,
    applyRoleDefaults,
    resetPermissions,
    getPermissionsForRoles,
  };
};
