import React, { useEffect, useState } from "react";

import "./css/courseenrollpopup.css";
import axios from "../axios";

function CourseEnrollPopup(props) {
  const { u_id, user, refresh, close } = props;
  const [enrollmentCode, setEnrollmentCode] = useState("");
  let [enrollTime, setEnrollTime] = useState();

  const handleEnrollCourse = (e) => {
    axios
      .post("/courses/enroll", {
        enrollmentCode,
        u_id,
      })
      .then((res) => {
        refresh(user);
        close();
      });
  };

  useEffect(() => {
    setEnrollTime(new Date().getTime());
  }, []);

  return (
    <div className="course-enroll-popup">
      <div className="overlay"></div>
      <div className="popup flex-column">
        <div className="popup-head">
          <span>Enroll Course</span>
        </div>
        <div className="popup-body flex-column">
          <div className="popup-body-row flex-column">
            <label>Enrollment Code*</label>
            <input
              type="text"
              value={enrollmentCode}
              onChange={(e) => setEnrollmentCode(e.target.value)}
              style={{
                backgroundColor: `var(--color${(enrollTime % 5) + 1}-20)`,
                borderColor: "transparent",
                color: `var(--color${(enrollTime % 5) + 1}-100)`,
                fontWeight: "bold",
              }}
            />
          </div>
        </div>
        <div className="popup-tail flex-row">
          <button
            style={{
              backgroundColor:
                enrollmentCode.length !== 0
                  ? `var(--color${(enrollTime % 5) + 1}-100)`
                  : "var(--color-gray2-100)",
              color:
                enrollmentCode.length !== 0
                  ? "var(--color-white)"
                  : "var(--color-gray1-100)",
            }}
            onClick={
              enrollmentCode.length !== 0 ? handleEnrollCourse : () => {}
            }
          >
            Enroll
          </button>
          <button className="button2" onClick={close}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default CourseEnrollPopup;
