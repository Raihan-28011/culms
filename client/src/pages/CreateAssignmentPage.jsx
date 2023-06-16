import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";

import "./css/createassignmentpage.css";
import axios from "../axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import NotificationWidget from "../components/NotificationWidget";

const CreateAssignmentPage = () => {
  const { user, course, homePath, getAssignments } = useOutletContext();
  const [droppedFiles, setDroppedFiles] = useState([]);
  const [title, setTitle] = useState("");
  const [points, setPoints] = useState();
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState("");
  const [notify, setNotify] = useState({
    type: "info",
    msg: [
      <span>1. Assignment must include a title. </span>,
      <span>2. Assignment must have some points.</span>,
      <span>3. Assignent description must be non-empty. </span>,
    ],
    interval: undefined,
  });
  const navigate = useNavigate();

  const handleUpload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let arr = [...e.dataTransfer.files];
    document.getElementById("assg-attachments").files = e.dataTransfer.files;
    arr.forEach((value) => {
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        () => {
          setDroppedFiles((prev) => [
            ...prev,
            { name: value.name, data: reader.result },
          ]);
        },
        false
      );
      reader.readAsArrayBuffer(value);
    });
  };

  const handleRemove = (index) => {
    setDroppedFiles([...droppedFiles.filter((_, ind) => index !== ind)]);
    const elem = document.getElementById("assg-attachments");
    const arr = [...elem.files];
    let fList = new DataTransfer();
    for (let i = 0; i < arr.length; ++i) {
      if (i === index) continue;
      fList.items.add(arr[i]);
    }
    elem.files = fList.files;
  };

  const handleCreate = (e) => {
    console.log(attachments);
    const req = {
      assignment_id: new Date().getMilliseconds().toString(16).toUpperCase(),
      assignment_for: course.c_id,
      title: title,
      description: description,
      points: Number(points),
      attachments: attachments,
    };
    axios.post("/courses/assignments/create", req).then((res) => {
      // console.log(res.data);
    });

    let elem = [...document.getElementById("assg-attachments").files];
    let formData = new FormData();
    for (let i = 0; i < elem.length; ++i) {
      formData.append("assg-attachments", elem[i]);
    }
    axios
      .post(
        `/courses/assignments/create/upload/?prefix=${req.assignment_id}${course.c_id}`,
        formData
      )
      .then((res) => {
        console.log(res.data);
      });
    getAssignments(course.c_id);
    navigate(`${homePath}`);
  };

  const handleNotificationClose = () => {
    setNotify((prev) => {
      return { ...prev, type: "", msg: "" };
    });
  };

  useEffect(() => {
    setAttachments(droppedFiles.map((val) => val.name).join("%$%"));
  }, [droppedFiles]);

  return user.u_id === course.created_by ? (
    <div className="create-assignment flex-column">
      {notify.type.length > 0 && notify.msg.length > 0 ? (
        <NotificationWidget
          type={notify.type}
          msg={notify.msg}
          interval={notify.interval}
          close={handleNotificationClose}
        />
      ) : null}
      <div className="create-assignment-head flex-row">
        <div className="create-assignment-input flex-column">
          <label>Assignment Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="create-assignment-input flex-column">
          <label>Points</label>
          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
          />
        </div>
      </div>
      <div className="create-assignment-input flex-column">
        <label>Assignment Description</label>
        <ReactQuill
          theme="snow"
          value={description}
          onChange={(s) => setDescription(s)}
        />
      </div>
      <input
        type="file"
        id="assg-attachments"
        name="assg-attachments"
        multiple
        hidden
      />
      {droppedFiles.length === 0 ? (
        <div
          className="create-assignment-upload flex-column"
          onDrop={handleUpload}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <img src="/pdf_add_logo2.svg" alt="" />
          <span>Drag and drop pdf files</span>
        </div>
      ) : (
        <div className="assignment-uploaded-files flex-row">
          {droppedFiles.map((value, index) => {
            return (
              <div className="dropped-file-item flex-row" key={index}>
                <img src="/pdfLogo4.svg" alt="pdf logo" />
                <span>{value.name}</span>
                <button onClick={(e) => handleRemove(index)}>&times;</button>
              </div>
            );
          })}
        </div>
      )}
      <button className="button1" onClick={handleCreate}>
        Create
      </button>
    </div>
  ) : null;
};

export default CreateAssignmentPage;
