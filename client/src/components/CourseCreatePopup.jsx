import React, { useEffect, useState } from "react";

import "./css/coursecreatepopup.css";
import axios from "../axios";

function CourseCreatePopup(props) {
  const { u_id, user, refresh, close } = props;
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [enrollmentCode, setEnrollmentCode] = useState("");
  const [createTime, setCreateTime] = useState(new Date().getTime());

  const handleCreateCourse = (e) => {
    axios
      .post("/courses/create", {
        courseCode,
        courseTitle,
        courseDesc,
        enrollmentCode,
        u_id,
      })
      .then((res) => {
        refresh(user);
        close();
      });
  };

  useEffect(() => {
    let code = createTime.toString(34).toUpperCase();
    setEnrollmentCode((prev) => code);
  }, []);

  return (
    <div className="course-create-popup">
      <div className="overlay"></div>
      <div className="popup flex-column">
        <div className="popup-head">
          <span>Create Course</span>
        </div>
        <div className="popup-body flex-column">
          <div className="popup-body-row flex-column">
            <label>Course Code*</label>
            <input
              type="text"
              placeholder="e.g. CSE413"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
            />
          </div>
          <div className="popup-body-row flex-column">
            <label>Course Title*</label>
            <input
              type="text"
              placeholder="e.g. Database Systems"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
            />
          </div>
          <div className="popup-body-row flex-column">
            <label>Course Description</label>
            <textarea
              type="text"
              placeholder="e.g. I don't know"
              value={courseDesc}
              onChange={(e) => setCourseDesc(e.target.value)}
            />
          </div>
          <div className="popup-body-row flex-column">
            <label>Enrollment Code</label>
            <input
              type="text"
              value={enrollmentCode}
              readOnly
              style={{
                backgroundColor: `var(--color${(createTime % 5) + 1}-20)`,
                borderColor: "transparent",
                color: `var(--color${(createTime % 5) + 1}-100)`,
                fontWeight: "bold",
              }}
            />
            <div
              className="copy-button"
              style={{
                backgroundColor: `var(--color${(createTime % 5) + 1}-100)`,
              }}
            ></div>
          </div>
        </div>
        <div className="popup-tail flex-row">
          <button
            style={{
              backgroundColor:
                courseTitle.length !== 0 && courseCode.length !== 0
                  ? `var(--color${(createTime % 5) + 1}-100)`
                  : "var(--color-gray2-100)",
              color:
                courseTitle.length !== 0 && courseCode.length !== 0
                  ? "var(--color-white)"
                  : "var(--color-gray1-100)",
            }}
            onClick={
              courseCode.length !== 0 && courseTitle.length !== 0
                ? handleCreateCourse
                : () => {}
            }
          >
            Create
          </button>
          <button className="button2" onClick={close}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default CourseCreatePopup;
