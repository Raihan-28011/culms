import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import "./css/lessoneditor.css";

const LessonEditor = ({ value, setValue }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "script"],
      ["blockquote", "code"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      [{ script: "sub" }],
      [{ script: "super" }],
      [{ align: [] }],
      [{ color: [] }],
      [{ background: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "script",
    "indent",
    "blockquote",
    "link",
    "image",
    "align",
    "code",
    "color",
    "background",
    "clean",
  ];

  const handleChange = (s) => {
    setValue((prev) => s.substring(0, 4000));
  };

  return (
    <div className="lesson-editor">
      <ReactQuill
        formats={formats}
        modules={modules}
        theme="snow"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export default LessonEditor;
