// AntdAppWrapper.tsx
import React from "react";
import { App as AntdApp, ConfigProvider } from "antd";
import { default as themeOverride } from "@/styles/theme.json";

interface AntdAppWrapperProps {
  children: React.ReactNode;
}

const AntdAppWrapper: React.FC<AntdAppWrapperProps> = ({ children }) => {
  return (
    <ConfigProvider theme={{ ...themeOverride }}>
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
};

export default AntdAppWrapper;
