import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";

import "./css/assignmentpage.css";
import axios from "../axios";

const AssignmentPage = () => {
  const { user, course, homePath } = useOutletContext();
  const [assignmentList, setAssignmentList] = useState([]);
  const [assignmentId, setAssignmentId] = useState(0);
  const [c_id, setCid] = useState();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const location = useLocation();
  const [droppedFiles, setDroppedFiles] = useState([]);
  const [submittedAttachments, setSubmittedAttachments] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [obtainedPoints, setObtainedPoints] = useState(-1);
  const navigate = useNavigate();

  const handleUpload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDroppedFiles([...e.dataTransfer.files]);
  };

  const handleRemove = (index) => {
    setDroppedFiles([...droppedFiles.filter((_, ind) => index !== ind)]);
  };

  const handleSubmitAssignment = (e) => {
    const req = {
      assignment_id: assignmentList[assignmentId].assignment_id,
      participant_id: user.u_id,
      submitted_attachments: submittedAttachments,
      obtained_points: -1,
    };
    axios.post("/courses/assignments/submit", req);

    let formData = new FormData();
    for (let i = 0; i < droppedFiles.length; ++i) {
      formData.append("assg-submits", droppedFiles[i]);
    }
    axios
      .post(
        `/courses/assignments/submit/upload/?prefix=${req.assignment_id}${user.u_id}`,
        formData
      )
      .then((res) => {
        console.log(res.data);
      });

    getSubmission();
    navigate(location);
  };

  const getSubmission = () => {
    const l = location.pathname.match(/assignments\/[\d\w]+/);
    const path = String(l[0]).split("/");
    const assg_id = path[path.length - 1];
    if (course.created_by !== user.u_id) {
      axios
        .get(
          `courses/assignments/submissions/?assignment_id=${assg_id}&participant_id=${user.u_id}`
        )
        .then((res) => {
          if (res.data) {
            let files = [...res.data.submitted_attachments.split("%$%")];
            setDroppedFiles(
              files.map((val) => {
                return { name: val };
              })
            );
            setObtainedPoints(res.data.obtained_points);
            setSubmitted(true);
          }
        });
    }
  };

  function initialSetup() {
    setDroppedFiles([]);
    axios.get(`courses/assignments/?c_id=${course.c_id}`).then((res) => {
      setAssignmentList(res.data);
      const l = location.pathname.match(/assignments\/[\d\w]+/);
      const path = String(l[0]).split("/");
      const assignmentid = path[path.length - 1];
      for (let i = 0; i < res.data.length; ++i)
        if (res.data[i].assignment_id === assignmentid) {
          setAssignmentId((prev) => {
            return i;
          });
          const files = [...res.data[i].attachments.split("%$%")];
          setUploadedFiles(files);
          break;
        }
    });
    setCid(() => course.c_id);
    setSubmittedAttachments("");
    setSubmitted(false);
    getSubmission();
  }

  useEffect(() => {
    initialSetup();
  }, []);

  useEffect(() => {
    initialSetup();
  }, [location.pathname, submitted]);

  useEffect(() => {
    setSubmittedAttachments(droppedFiles.map((val) => val.name).join("%$%"));
  }, [droppedFiles]);

  return assignmentList.length > 0 ? (
    <div className="assignment-page flex-column">
      <div className="assignment-title flex-column">
        <span>{assignmentList[assignmentId].title}</span>
        <span>
          {user.u_id !== course.created_by
            ? obtainedPoints !== -1
              ? obtainedPoints + " / "
              : "? / "
            : ""}
          {assignmentList[assignmentId].points} points
        </span>
      </div>
      <div className="assignment-description">
        <span
          dangerouslySetInnerHTML={{
            __html: assignmentList[assignmentId].description,
          }}
        ></span>
      </div>
      <div className="assignment-uploaded-files flex-row">
        {uploadedFiles.map((value, index) => {
          return (
            <a
              href={`/upload/${assignmentList[assignmentId].assignment_id}${course.c_id}${value}`}
              target="__blank"
              key={index}
            >
              <div className="assigned-file-item flex-row" key={index}>
                <img src="/pdfLogo4.svg" alt="pdf logo" />
                <span>{value}</span>
              </div>
            </a>
          );
        })}
      </div>
      {user.u_id !== course.created_by ? (
        <div className="assignment-submit-box flex-column">
          <div className="assignment-submit-box-head flex-column">
            <span>{submitted ? "Submitted works" : "Submit your work"}</span>
            <span>Due: ?</span>
          </div>
          {droppedFiles.length === 0 ? (
            <div
              className="assignment-submit-dad-box flex-column"
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
            <div className="assignment-submit-submitted-files flex-column">
              {droppedFiles.map((value, index) => {
                return (
                  <div
                    className="assignment-submitted-file-item flex-row"
                    key={index}
                  >
                    {submitted ? (
                      <a
                        href={`/upload/${assignmentList[assignmentId].assignment_id}${user.u_id}${value.name}`}
                        target={"__blank"}
                      >
                        <div className="flex-row">
                          <img src="/pdfLogo4.svg" alt="pdf logo" />
                          <span>{value.name}</span>
                        </div>
                      </a>
                    ) : (
                      <div className="flex-row">
                        <img src="/pdfLogo4.svg" alt="pdf logo" />
                        <span>{value.name}</span>
                      </div>
                    )}
                    {!submitted ? (
                      <button onClick={(e) => handleRemove(index)}>
                        &times;
                      </button>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
          {!submitted ? (
            <button
              className="button1"
              onClick={handleSubmitAssignment}
              disabled={submitted}
              style={{
                backgroundColor: submitted
                  ? "var(--color-gray1-100)"
                  : "var(--color3-100)",
              }}
            >
              {submitted ? "Submitted" : "Submit"}
            </button>
          ) : null}
        </div>
      ) : (
        <div className="assignment-submissions-tab flex-column">
          <label>Links</label>
          <span
            onClick={() =>
              navigate(
                `${homePath}/assignments/${assignmentList[assignmentId].assignment_id}/submissions`
              )
            }
          >
            Submissions
          </span>
        </div>
      )}
    </div>
  ) : null;
};

export default AssignmentPage;
