import React, { useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";

const TinyEditor = ({
  handleChange,
  initialContent,
  height = 600,
}: {
  handleChange: (content: string) => void;
  initialContent?: string;
  height?: number;
}) => {
  const editorRef = useRef<any>(null);

  // Update editor content when initialContent changes
  useEffect(() => {
    if (editorRef.current && initialContent !== undefined) {
      const currentContent = editorRef.current.getContent();
      if (currentContent !== initialContent) {
        editorRef.current.setContent(initialContent || "");
      }
    }
  }, [initialContent]);

  return (
    <Editor
      onInit={(evt, editor) => {
        editorRef.current = editor;
        // Set initial content if available
        if (initialContent) {
          editor.setContent(initialContent);
        }
      }}
      initialValue={initialContent || ""}
      onChange={(e) => {
        if (editorRef.current) {
          handleChange(editorRef.current.getContent());
        }
      }}
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      init={{
        placeholder: "Type your message here...",
        height,
        plugins:
          "paste  print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount imagetools contextmenu colorpicker textpattern help",
        menubar: "insert view",
        toolbar:
          "paste | undo redo | formatselect | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | link unlink image media | codesample | searchreplace visualblocks code fullscreen | insertdatetime table | help wordcount",
        content_style:
          "body { font-family: Helvetica, Arial, sans-serif; font-size: 14px; background: transparent; color: #fff; }",
        codesample_languages: [
          { text: "HTML/XML", value: "markup" },
          { text: "JavaScript", value: "javascript" },
          { text: "CSS", value: "css" },
        ],
        skin: "oxide-dark",
        content_css: "dark",
      }}
    />
  );
};

export default TinyEditor;
