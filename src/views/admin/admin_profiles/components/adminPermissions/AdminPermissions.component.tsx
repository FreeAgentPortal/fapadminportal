import React from "react";
import { Button, Space, Collapse, Checkbox, Typography, Card } from "antd";
import { ADMIN_PERMISSIONS, DEFAULT_ROLE_PERMISSIONS, PermissionGroup } from "@/data/adminPermissions";
import { useInterfaceStore } from "@/state/interface";
import styles from "./AdminPermissions.module.scss";

interface AdminPermissionsProps {
  selectedPermissions: string[];
  onPermissionsChange: (permissions: string[]) => void;
  selectedRoles: string[];
}

const AdminPermissions: React.FC<AdminPermissionsProps> = ({
  selectedPermissions,
  onPermissionsChange,
  selectedRoles,
}) => {
  const { addAlert } = useInterfaceStore((state) => state);

  // Handle individual permission changes
  const handlePermissionChange = (permissionValue: string, checked: boolean) => {
    let updatedPermissions = [...selectedPermissions];

    if (checked) {
      updatedPermissions.push(permissionValue);
    } else {
      updatedPermissions = updatedPermissions.filter((p) => p !== permissionValue);
    }

    onPermissionsChange(updatedPermissions);
  };

  // Handle group permission changes
  const handleGroupPermissionChange = (group: PermissionGroup, checked: boolean) => {
    const groupPermissions = group.permissions.map((p) => p.value);
    let updatedPermissions = [...selectedPermissions];

    if (checked) {
      // Add all group permissions that aren't already selected
      groupPermissions.forEach((permission) => {
        if (!updatedPermissions.includes(permission)) {
          updatedPermissions.push(permission);
        }
      });
    } else {
      // Remove all group permissions
      updatedPermissions = updatedPermissions.filter((p) => !groupPermissions.includes(p));
    }

    onPermissionsChange(updatedPermissions);
  };

  // Check if all permissions in a group are selected
  const isGroupFullySelected = (group: PermissionGroup): boolean => {
    return group.permissions.every((permission) => selectedPermissions.includes(permission.value));
  };

  // Check if some permissions in a group are selected
  const isGroupPartiallySelected = (group: PermissionGroup): boolean => {
    return (
      group.permissions.some((permission) => selectedPermissions.includes(permission.value)) &&
      !isGroupFullySelected(group)
    );
  };

  // Reset permissions to role defaults
  const resetToRoleDefaults = () => {
    if (selectedRoles.length > 0) {
      const combinedPermissions = new Set<string>();
      selectedRoles.forEach((role) => {
        const rolePermissions = DEFAULT_ROLE_PERMISSIONS[role as keyof typeof DEFAULT_ROLE_PERMISSIONS] || [];
        rolePermissions.forEach((permission) => combinedPermissions.add(permission));
      });

      const permissionsArray = Array.from(combinedPermissions);
      onPermissionsChange(permissionsArray);
      addAlert({
        type: "info",
        message: "Permissions reset to role defaults",
        duration: 2000,
      });
    }
  };

  // Clear all permissions
  const clearAllPermissions = () => {
    onPermissionsChange([]);
    addAlert({
      type: "info",
      message: "All permissions cleared",
      duration: 2000,
    });
  };

  // Check if current permissions differ from role defaults
  const hasCustomPermissions = (): boolean => {
    if (selectedRoles.length === 0) return false;

    const combinedDefaults = new Set<string>();
    selectedRoles.forEach((role: string) => {
      const rolePermissions = DEFAULT_ROLE_PERMISSIONS[role as keyof typeof DEFAULT_ROLE_PERMISSIONS] || [];
      rolePermissions.forEach((permission) => combinedDefaults.add(permission));
    });

    const defaultPermissions = Array.from(combinedDefaults).sort();
    const currentPermissions = [...selectedPermissions].sort();

    return JSON.stringify(defaultPermissions) !== JSON.stringify(currentPermissions);
  };

  return (
    <Card
      size="small"
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Space>
            <Typography.Text strong>Granulated Permissions</Typography.Text>
            <Typography.Text type="success">({selectedPermissions.length} selected)</Typography.Text>
          </Space>
          <Space size="small">
            <Button size="small" type="text" onClick={resetToRoleDefaults} disabled={!selectedRoles?.length}>
              Reset to Defaults
            </Button>
            <Button
              size="small"
              type="text"
              danger
              onClick={clearAllPermissions}
              disabled={selectedPermissions.length === 0}
            >
              Clear All
            </Button>
          </Space>
        </div>
      }
      className={`${styles.permissionsCard} permissions-card`}
    >
      {hasCustomPermissions() && (
        <div className={styles.customPermissionWarning}>
          <Typography.Text type="warning">⚠️ Custom permissions applied - differs from role defaults</Typography.Text>
        </div>
      )}

      <Collapse
        ghost
        size="small"
        items={ADMIN_PERMISSIONS.map((group) => ({
          key: group.value,
          label: (
            <Space>
              <Checkbox
                checked={isGroupFullySelected(group)}
                indeterminate={isGroupPartiallySelected(group)}
                onChange={(e) => handleGroupPermissionChange(group, e.target.checked)}
                onClick={(e) => e.stopPropagation()}
              />
              <Typography.Text strong>{group.label}</Typography.Text>
              <Typography.Text type="success">
                ({group.permissions.filter((p) => selectedPermissions.includes(p.value)).length}/
                {group.permissions.length})
              </Typography.Text>
            </Space>
          ),
          children: (
            <div className={styles.permissionGroup}>
              {group.permissions.map((permission) => (
                <div key={permission.value} className={styles.permissionItem}>
                  <Checkbox
                    checked={selectedPermissions.includes(permission.value)}
                    onChange={(e) => handlePermissionChange(permission.value, e.target.checked)}
                  >
                    <div>
                      <Typography.Text>{permission.label}</Typography.Text>
                      <br />
                      <Typography.Text type="success" style={{ fontSize: "12px" }}>
                        {permission.description}
                      </Typography.Text>
                    </div>
                  </Checkbox>
                </div>
              ))}
            </div>
          ),
        }))}
      />
    </Card>
  );
};

export default AdminPermissions;
