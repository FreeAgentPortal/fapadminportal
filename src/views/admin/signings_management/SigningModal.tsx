"use client";
import React, { useEffect, useState } from "react";
import { Modal, Form, Input, DatePicker, Select, Button, Spin } from "antd";
import { SaveOutlined, FileTextOutlined } from "@ant-design/icons";
import useApiHook from "@/hooks/useApi";
import { useInterfaceStore } from "@/state/interface";
import ISigning from "@/types/ISigning";
import dayjs from "dayjs";
import { useSelectedProfile } from "@/hooks/useSelectedProfile";

const { TextArea } = Input;
const { Option } = Select;

interface SigningModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  editingSigning?: ISigning | null;
}

const SigningModal: React.FC<SigningModalProps> = ({ visible, onCancel, onSuccess, editingSigning }) => {
  const [form] = Form.useForm();
  const { addAlert } = useInterfaceStore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [athleteSearchText, setAthleteSearchText] = useState("");
  const [teamSearchText, setTeamSearchText] = useState("");
  const [debouncedAthleteSearch, setDebouncedAthleteSearch] = useState("");
  const [debouncedTeamSearch, setDebouncedTeamSearch] = useState("");
  const { selectedProfile } = useSelectedProfile();

  // Fetch athletes for selection
  const { data: athletesData, isLoading: athletesLoading } = useApiHook({
    url: `/profiles/athlete`,
    key: ["athletes-select", debouncedAthleteSearch],
    method: "GET",
    keyword: debouncedAthleteSearch,
  }) as { data: any; isLoading: boolean };

  // Fetch teams for selection
  const { data: teamsData, isLoading: teamsLoading } = useApiHook({
    url: `/profiles/team`,
    key: ["teams-select", debouncedTeamSearch],
    method: "GET",
    keyword: debouncedTeamSearch,
  }) as { data: any; isLoading: boolean };

  const { mutate: mutateSigning } = useApiHook({
    method: editingSigning ? "PUT" : "POST",
    key: "signing.mutate",
    queriesToInvalidate: ["signings"],
  }) as any;

  const athletes = athletesData?.payload || [];
  const teams = teamsData?.payload || [];

  // Debounce athlete search - wait 1 second after typing stops
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedAthleteSearch(athleteSearchText);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [athleteSearchText]);

  // Debounce team search - wait 1 second after typing stops
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedTeamSearch(teamSearchText);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [teamSearchText]);

  const handleAthleteSearch = (value: string) => {
    setAthleteSearchText(value);
  };

  const handleTeamSearch = (value: string) => {
    setTeamSearchText(value);
  };

  // Handle form submission
  const handleSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);

      const signingData = {
        ...values,
        signedDate: values.signedDate.toISOString(),
        admin: selectedProfile?._id,
      };

      const endpoint = editingSigning ? `/feed/signing/${editingSigning._id}` : `/feed/signing`;

      mutateSigning(
        { url: endpoint, formData: signingData },
        {
          onSuccess: () => {
            addAlert({
              type: "success",
              message: editingSigning ? "Signing updated successfully!" : "Signing created successfully!",
            });
            onSuccess();
            handleCancel();
          },
          onError: (error: any) => {
            addAlert({
              type: "error",
              message: error?.response?.data?.message || "Failed to save signing. Please try again.",
            });
          },
          onSettled: () => {
            setIsSubmitting(false);
          },
        }
      );
    } catch (error) {
      console.error(error);
      addAlert({
        type: "error",
        message: "Failed to save signing. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setIsSubmitting(false);
    onCancel();
  };

  // Populate form when editing
  useEffect(() => {
    if (editingSigning && visible) {
      form.setFieldsValue({
        athlete: editingSigning.athlete?._id || editingSigning.athlete,
        team: editingSigning.team?._id || editingSigning.team,
        signedDate: editingSigning.signedDate ? dayjs(editingSigning.signedDate) : null,
        notes: editingSigning.notes,
      });
    } else if (!editingSigning && visible) {
      form.resetFields();
    }
  }, [editingSigning, visible, form]);

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#ffffff" }}>
          <FileTextOutlined />
          {editingSigning ? "Edit Signing" : "Create New Signing"}
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      styles={{
        mask: { backgroundColor: "rgba(0, 0, 0, 0.7)" },
        content: {
          backgroundColor: "rgba(20, 20, 20, 0.95)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },
        header: {
          backgroundColor: "transparent",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        },
      }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: "1rem" }}>
        <Form.Item
          label={<span style={{ color: "#ffffff" }}>Athlete</span>}
          name="athlete"
          rules={[{ required: true, message: "Please select an athlete" }]}
        >
          <Select
            placeholder="Select an athlete"
            showSearch
            onSearch={handleAthleteSearch}
            filterOption={false}
            options={athletes.map((athlete: any) => ({
              value: athlete._id,
              label: athlete.fullName,
            }))}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "#ffffff",
            }}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: "#ffffff" }}>Team</span>}
          name="team"
          rules={[{ required: true, message: "Please select a team" }]}
        >
          <Select
            placeholder="Select a team"
            showSearch
            onSearch={handleTeamSearch}
            filterOption={false}
            options={teams.map((team: any) => ({
              value: team._id,
              label: team.name,
            }))}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "#ffffff",
            }}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: "#ffffff" }}>Signed Date</span>}
          name="signedDate"
          rules={[{ required: true, message: "Please select the signing date" }]}
        >
          <DatePicker
            style={{
              width: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#ffffff",
            }}
            format="YYYY-MM-DD"
          />
        </Form.Item>

        <Form.Item label={<span style={{ color: "#ffffff" }}>Notes</span>} name="notes">
          <TextArea
            rows={4}
            placeholder="Add any additional notes about this signing..."
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#ffffff",
            }}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: "2rem" }}>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
            <Button onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isSubmitting}>
              {editingSigning ? "Update Signing" : "Create Signing"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SigningModal;
