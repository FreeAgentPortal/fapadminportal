/**
 * Utility functions for role-based access control
 */

/**
 * Check if a user has any of the required roles
 * @param userRoles - Array of roles the user currently has
 * @param requiredRoles - Array of roles that are allowed (user needs at least one)
 * @returns boolean - true if user has at least one of the required roles
 */
export const hasRequiredRole = (userRoles: string[] | undefined | null, requiredRoles: string[]): boolean => {
  if (!userRoles || !Array.isArray(userRoles) || userRoles.length === 0) {
    return false;
  }

  if (!requiredRoles || requiredRoles.length === 0) {
    return true; // No roles required, allow access
  }

  return userRoles.some((role) => requiredRoles.includes(role));
};

/**
 * Check if a user has all of the required roles
 * @param userRoles - Array of roles the user currently has
 * @param requiredRoles - Array of roles that are all required
 * @returns boolean - true if user has all of the required roles
 */
export const hasAllRequiredRoles = (userRoles: string[] | undefined | null, requiredRoles: string[]): boolean => {
  if (!userRoles || !Array.isArray(userRoles) || userRoles.length === 0) {
    return false;
  }

  if (!requiredRoles || requiredRoles.length === 0) {
    return true; // No roles required, allow access
  }

  return requiredRoles.every((role) => userRoles.includes(role));
};

/**
 * Check if a user has a specific role
 * @param userRoles - Array of roles the user currently has
 * @param role - Specific role to check for
 * @returns boolean - true if user has the specific role
 */
export const hasRole = (userRoles: string[] | undefined | null, role: string): boolean => {
  if (!userRoles || !Array.isArray(userRoles)) {
    return false;
  }

  return userRoles.includes(role);
};

/**
 * Check if content should be hidden based on user roles
 * Used for navigation and UI elements that should be hidden when user lacks permissions
 * @param userRoles - Array of roles the user currently has
 * @param requiredRoles - Array of roles that are allowed (user needs at least one)
 * @returns boolean - true if content should be hidden (user lacks required roles)
 */
export const shouldHideForRoles = (userRoles: string[] | undefined | null, requiredRoles: string[]): boolean => {
  return !hasRequiredRole(userRoles, requiredRoles);
};

/**
 * Common role constants to avoid magic strings
 */
export const ROLES = {
  ADMIN: "admin",
  DEVELOPER: "developer",
  USER: "user",
  MANAGER: "manager",
  SUPER_ADMIN: "super-admin",
  MODERATOR: "moderator",
} as const;

/**
 * Common role groups for easy access control
 */
export const ROLE_GROUPS = {
  ADMIN_ROLES: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  DEV_ROLES: [ROLES.DEVELOPER],
  ADMIN_AND_DEV: [ROLES.ADMIN, ROLES.DEVELOPER, ROLES.SUPER_ADMIN],
  MANAGEMENT_ROLES: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SUPER_ADMIN],
};
