"use client";
import React, { useState } from "react";
import styles from "./BasicInfo.module.scss";
import { Form, message } from "antd";
import { IAthlete } from "@/types/IAthleteType";
import { availablePositions } from "@/data/positions";
import useApiHook from "@/hooks/useApi";
import dayjs from "dayjs";
import Informational from "./components/informational/Informational.component";
import Editing from "./components/editing/Editing.component";

interface BasicInfoProps {
  athleteData: IAthlete;
  onDataUpdate?: (updatedData: Partial<IAthlete>) => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ athleteData, onDataUpdate }) => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  const { mutate: updateAthleteApi } = useApiHook({
    url: `/athlete/${athleteData._id}`,
    method: "PUT",
    key: ["athlete", athleteData._id],
  }) as any;

  const handleUpdate = (data: any) => {
    updateAthleteApi(
      { url: `/athlete/${athleteData._id}`, formData: data },
      {
        onSuccess: (response: any) => {
          message.success("Athlete information updated successfully");
          setIsEditing(false);
          onDataUpdate?.(response.payload);
        },
        onError: (error: any) => {
          message.error("Failed to update athlete information");
          console.error("Update error:", error);
        },
      }
    );
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        const formattedData = {
          ...values,
          birthdate: values.birthdate ? values.birthdate.toISOString() : null,
          positions:
            values.positions?.map(
              (posName: string) =>
                availablePositions.find((p) => p.name === posName) || { name: posName, abbreviation: posName }
            ) || [],
        };
        handleUpdate(formattedData);
      })
      .catch((error) => {
        message.error("Please fill in all required fields");
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Editing
        athleteData={athleteData}
        form={form}
        onSave={handleSave}
        onCancel={handleCancel}
        isLoading={updateAthleteApi?.isPending}
      />
    );
  }

  return <Informational athleteData={athleteData} onEditClick={() => setIsEditing(true)} />;
};

export default BasicInfo;
