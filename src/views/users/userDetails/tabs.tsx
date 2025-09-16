import React from "react";
import Info from "./subviews/info/Info.view";
import PlanInformation from "./subviews/planInformation/PlanInformation.view";
import Receipts from "./subviews/receipts/Receipts.view";
import User from "@/types/User";

interface TabsConfig {
  key: string;
  label: string;
  children: React.ReactNode;
}

export const getUserDetailsTabs = (
  userData: User,
  onDataUpdate: (updatedData: Partial<User>) => void
): TabsConfig[] => {
  return [
    {
      key: "info",
      label: "Auth Info",
      children: <Info userData={userData} onDataUpdate={onDataUpdate} />,
    },
    {
      key: "plan",
      label: "Plan Information",
      children: <PlanInformation userData={userData} onDataUpdate={onDataUpdate} />,
    },
    {
      key: "receipts",
      label: "Receipts",
      children: <Receipts userData={userData} onDataUpdate={onDataUpdate} />,
    },
  ];
};
