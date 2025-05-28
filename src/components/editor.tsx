// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { useCallback } from "react";
import MDEditor from "@uiw/react-md-editor";

interface ReportEditorProps {
  content?: string;
  onMarkdownChange: (markdown: string) => void;
}

export default function ReportEditor({
  content,
  onMarkdownChange,
}: ReportEditorProps) {
  const handleChange = useCallback(
    (value?: string) => {
      if (value !== undefined) {
        onMarkdownChange(value);
      }
    },
    [onMarkdownChange],
  );

  return (
    <div data-color-mode="dark">
      <MDEditor
        value={content}
        onChange={handleChange}
        preview="edit"
        height={400}
      />
    </div>
  );
} 