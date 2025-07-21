"use client";
import { useEffect, useRef, useState } from "react";
import { Avatar, Form, Upload, FormInstance } from "antd";
import type { RcFile, UploadProps, UploadChangeParam, UploadFile } from "antd/lib/upload";
import Cropper from "antd-img-crop";
import Loader from "../loader/Loader.component";
import errorHandler from "@/utils/errorHandler";
import Image from "next/image";
import { useInterfaceStore } from "@/state/interface";

type Props = {
  default?: string;
  label?: string;
  name?: string;
  listType?: "picture-card" | "text" | "picture-circle";
  action?: string;
  placeholder?: string;
  tooltip?: string;
  isAvatar?: boolean;
  imgStyle?: React.CSSProperties;
  form: FormInstance;
  aspectRatio?: number;
  bodyData?: any;
  dark?: boolean; // Optional prop to indicate if dark mode is enabled
};

const PhotoUpload = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(props.default);
  const inputRef = useRef<any>(null);
  const { addAlert } = useInterfaceStore((state) => state);

  const beforeUpload = async (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      addAlert({
        type: "error",
        message: "You can only upload JPG/PNG files",
        duration: 5000,
      });
      return false;
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      addAlert({
        type: "error",
        message: "Images must be smaller than 10MB",
        duration: 5000,
      });
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (props.default) {
      setImageUrl(props.default);
    }
  }, [props.default]);

  const handleChange: UploadProps["onChange"] = async (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === "uploading") {
      setLoading(true);
    }
    if (info.file.status === "done") {
      setLoading(false);

      // response might be a payload object with an array of image/type files, select the first one
      if (Array.isArray(info.file.response.payload)) {
        info.file.response.imageUrl = info.file.response.payload[0]?.url;
      }

      // Get this url from response to display image preview
      setImageUrl(info.file.response.imageUrl);
      props.form.setFieldValue(props.name || "image", info.file.response.imageUrl);

      addAlert({
        type: "success",
        message: "Image uploaded successfully",
        duration: 3000,
      });
    }
    if (info.file.status === "error") {
      console.log(info.file.response);
      setLoading(false);
      errorHandler(info.file.response);
    }
  };

  return (
    <>
      <Form.Item
        label={props?.label ?? props.label}
        name={props.name ? props.name : "image"}
        tooltip={props.tooltip ? props.tooltip : undefined}
      >
        <Cropper
          cropShape={props.isAvatar ? "round" : "rect"}
          aspect={props.aspectRatio ?? 16 / 9}
          beforeCrop={beforeUpload}
        >
          <Upload
            id="image"
            listType={props.listType ? props.listType : "picture-card"}
            showUploadList={false}
            type={"drag"}
            onChange={handleChange}
            action={props.action ? props.action : `${process.env.API_URL}/upload/cloudinary`}
            headers={{
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }}
            // add body data to the request
            data={props.bodyData}
          >
            {loading ? (
              <Loader />
            ) : imageUrl ? (
              props.isAvatar ? (
                <div
                  style={{
                    ...props.imgStyle,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Avatar size={200} src={imageUrl} />
                </div>
              ) : (
                <Image
                  src={imageUrl}
                  style={props.imgStyle || { width: "100%" }}
                  width={200}
                  height={200}
                  alt="uploaded image"
                />
              )
            ) : (
              <div
                style={{
                  ...props.imgStyle,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.75)",
                  color: "#000",
                }}
              >
                {props.placeholder ? props.placeholder : "Upload an Image"}
              </div>
            )}
          </Upload>
        </Cropper>
      </Form.Item>
    </>
  );
};

export default PhotoUpload;
