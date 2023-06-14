import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import "./css/assignmentsubmission.css";
import axios from "../axios";

const AssignmentSubmissions = () => {
  const { course, user } = useOutletContext();
  const [assg, setAssg] = useState();
  const [assignmentId, setAssignmentId] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [curSubmission, setCurSubmission] = useState(-1);
  const [submittedFiles, setSubmittedFiles] = useState([]);
  const [showEvaluatePopup, setShowEvaluatePopup] = useState(false);
  const [points, setPoints] = useState("0");

  const handleEvaluate = (e) => {
    axios.post("/courses/assignments/submissions/evaluate", {
      participant_id: submissions[curSubmission].participant_id,
      points: Number(points),
    });
    setShowEvaluatePopup(false);
    getSubmissions(assignmentId);
  };

  const extractFiles = (index, data) => {
    let files = [...data[index].submitted_attachments.split("%$%")];
    setSubmittedFiles(
      files.map((val) => {
        return val;
      })
    );
  };

  const getSubmissions = (assg_id) => {
    axios
      .get(`/courses/assignments/submissions/all/?assignment_id=${assg_id}`)
      .then((res) => {
        setSubmissions(res.data.rows);
        if (res.data.rows.length > 0) {
          let c = curSubmission === -1 ? 0 : curSubmission;
          setCurSubmission(c);
          extractFiles(c, res.data.rows);
          setPoints(String(res.data.rows[c].obtained_points));
        }
        setAssg(res.data.assg);
      });
  };

  const initialSetup = () => {
    const l = location.pathname.match(/assignments\/[\d\w]+/);
    const path = String(l[0]).split("/");
    const assg_id = path[path.length - 1];
    setAssignmentId(assg_id);
    setSubmittedFiles([]);
    setSubmissions([]);
    getSubmissions(assg_id);
  };

  useEffect(() => {
    initialSetup();
  }, []);

  useEffect(() => {}, [curSubmission]);

  return submissions.length > 0 ? (
    <div className="assignment-submission-page flex-column">
      <div className="assignment-submission-page-head flex-row">
        <label>Submissions</label>
        <button
          className="button1"
          onClick={() => setShowEvaluatePopup((prev) => !prev)}
        >
          Evaluate
        </button>
        {showEvaluatePopup ? (
          <div className="evaluate-popup flex-column">
            <label>{`Evaluate (${assg.points} points)`}</label>
            <input
              type="number"
              placeholder={`? / ${assg.points}`}
              value={points}
              onChange={(e) => setPoints(e.target.value)}
            />
            <div className="button-group flex-row">
              <button className="button1" onClick={handleEvaluate}>
                Evaluate
              </button>
              <button
                className="button2"
                onClick={() => setShowEvaluatePopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        ) : null}
      </div>
      <div className="submissions-carousel flex-column">
        <div className="submission-carousel-head flex-row">
          <div
            className="left-navigator flex-row"
            onClick={() => {
              let curSel =
                curSubmission == 0 ? submissions.length - 1 : curSubmission - 1;
              setCurSubmission(curSel);
              extractFiles(curSel, submissions);
              setPoints(String(submissions[curSel].obtained_points));
            }}
          >
            <img src="/left_arrow.svg" alt="" />
          </div>
          <div className="submitter-name flex-row">
            <span>{submissions[curSubmission].name}</span>
          </div>
          <div
            className="right-navigator flex-row"
            onClick={() => {
              let curSel =
                curSubmission == submissions.length - 1 ? 0 : curSubmission + 1;

              console.log(curSel, submissions[curSel]);
              setCurSubmission(curSel);
              extractFiles(curSel, submissions);
              setPoints(String(submissions[curSel].obtained_points));
            }}
          >
            <img src="/right_arrow.svg" alt="" />
          </div>
        </div>
        <div className="submission-carousel-body flex-column">
          <div className="flex-row" style={{ justifyContent: "space-between" }}>
            <label>Files</label>
            <div className="flex-row">
              Obtained Points:{" "}
              <span>
                {submissions[curSubmission].obtained_points === -1
                  ? "?"
                  : submissions[curSubmission].obtained_points}
                / {assg.points}
              </span>
            </div>
          </div>
          <div className="submission-files-list flex-row">
            {submittedFiles.map((val, index) => {
              return (
                <a
                  href={`/upload/${assignmentId}${submissions[curSubmission].participant_id}${val}`}
                  target={"__blank"}
                  key={index}
                >
                  <div className="submitted-files flex-row">
                    <img src="/pdfLogo4.svg" alt="pdf logo" />
                    <span>{val}</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="empty-submissions-page">No Submissions Yet</div>
  );
};

export default AssignmentSubmissions;
