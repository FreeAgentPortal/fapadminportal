import React, { useState, useEffect } from "react";
import { Form, Button, Select, Input, Space, Typography, Tag, Avatar, Divider } from "antd";
import styles from "./ScoutProfiles.module.scss";
import formStyles from "@/styles/Form.module.scss";
import { Modal } from "antd";
import useApiHook from "@/hooks/useApi";
import { useInterfaceStore } from "@/state/interface";
import { IScoutProfile } from "@/types/IScoutProfile";
import UserItem from "@/components/userItem/UserItem.component";
import User from "@/types/User";
import { UserOutlined, MailOutlined, PhoneOutlined, SearchOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

type CreateScoutProps = {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  form: any;
  editingScout?: IScoutProfile | null;
};

// Common sports options
const sportsOptions = [
  "Baseball",
  "Basketball",
  "Football",
  "Soccer",
  "Hockey",
  "Tennis",
  "Golf",
  "Track & Field",
  "Swimming",
  "Volleyball",
  "Softball",
  "Lacrosse",
  "Wrestling",
  "Cross Country",
  "Other",
];

// Common league options
const leagueOptions = [
  "High School",
  "College/University",
  "Professional",
  "Semi-Professional",
  "Amateur",
  "Youth",
  "Junior",
  "Senior",
  "Adult Recreation",
  "Travel/Club",
  "Other",
];

const CreateScout = ({ isModalVisible, setIsModalVisible, form, editingScout }: CreateScoutProps) => {
  const { addAlert } = useInterfaceStore((state) => state);
  const [userSearchText, setUserSearchText] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Initialize form values when editing
  useEffect(() => {
    if (editingScout) {
      form.setFieldsValue({
        user: editingScout.userId,
        teams: editingScout.teams || [],
        sports: editingScout.sports || [],
        leagues: editingScout.leagues || [],
        bio: editingScout.bio || "",
      });
      // Set selected user for editing mode
      setSelectedUser({
        _id: editingScout.user._id,
        fullName: editingScout.user.fullName,
        email: editingScout.user.email,
        profileImageUrl: editingScout.user.profileImageUrl,
      } as User);
    } else {
      setSelectedUser(null);
      setUserSearchText("");
    }
  }, [editingScout, form]);

  // Create/Update scout profile
  const { mutate: mutateScout, isLoading: isMutating } = useApiHook({
    method: editingScout ? "PUT" : "POST",
    key: "create-scout",
    queriesToInvalidate: ["scout-profiles"],
  }) as any;

  // Query users for scout assignment (exclude those who already have scout profiles)
  const { data: usersData, isFetching: isLoadingUsers } = useApiHook({
    url: "/user",
    key: ["users-list", userSearchText],
    method: "GET",
    filter: `profileRefs.scout;{"$exists":false}`, // Only users without scout profiles
    keyword: userSearchText,
    enabled: isModalVisible && !editingScout, // Only fetch when modal is open and not editing
  }) as any;

  // Handle user search with debounce
  useEffect(() => {
    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [userSearchText]);

  const handleUserSearch = (value: string) => {
    setUserSearchText(value);
  };

  const handleUserSelect = (userId: string) => {
    const user = usersData?.payload?.find((u: User) => u._id === userId);
    if (user) {
      setSelectedUser(user);
      form.setFieldsValue({ userId });
    }
  };

  const handleSubmit = (values: any) => {
    if (!values.user) {
      addAlert({
        type: "error",
        message: "Please select a user to create scout profile for",
        duration: 3000,
      });
      return;
    }

    const formData = {
      user: values.user,
    };

    // Create or update scout profile
    mutateScout(
      {
        url: editingScout ? `/profiles/scout/${editingScout._id}` : `/profiles/scout`,
        formData,
      },
      {
        onSuccess: () => {
          addAlert({
            type: "success",
            message: editingScout ? "Scout profile updated successfully" : "Scout profile created successfully",
            duration: 3000,
          });
          setIsModalVisible(false);
          form.resetFields();
          setSelectedUser(null);
          setUserSearchText("");
        },
        onError: (error: any) => {
          addAlert({
            type: "error",
            message: error?.response?.data?.message || "Failed to save scout profile",
            duration: 3000,
          });
        },
      }
    );
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedUser(null);
    setUserSearchText("");
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <UserOutlined />
          {editingScout ? "Edit Scout Profile" : "Create Scout Profile"}
        </div>
      }
      open={isModalVisible}
      onCancel={handleCancel}
      footer={null}
      width={700}
      className={styles.modal}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} className={formStyles.form}>
        {/* User Selection - Only show when creating new scout */}
        {!editingScout && (
          <>
            <Form.Item label="Select User" name="user" rules={[{ required: true, message: "Please select a user" }]}>
              <Select
                showSearch
                placeholder="Search and select a user"
                filterOption={false}
                onSearch={handleUserSearch}
                onSelect={handleUserSelect}
                loading={isLoadingUsers || isSearching}
                notFoundContent={isLoadingUsers ? "Loading..." : "No users found"}
                style={{ width: "100%" }}
                suffixIcon={<SearchOutlined />}
              >
                {usersData?.payload?.map((user: User) => (
                  <Option key={user._id} value={user._id}>
                    {user.fullName || user.email || "Unknown User"}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Show selected user info */}
            {selectedUser && (
              <div className={styles.selectedUser}>
                <UserItem user={selectedUser} variant="compact" />
              </div>
            )}
            <Divider />
          </>
        )}
        {/* Form Actions */}
        <Form.Item style={{ marginBottom: 0, marginTop: "24px" }}>
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isMutating}>
              {editingScout ? "Update Scout" : `Invite ${selectedUser?.fullName || "Scout"} as Scout`}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateScout;
