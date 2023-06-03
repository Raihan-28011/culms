import React, { useEffect, useState } from "react";

import "./css/coursecard.css";
import CheckBox from "./CheckBox";
import { useNavigate } from "react-router-dom";

function CourseCard(props) {
  const {
    u_id,
    c_id,
    course_code,
    title,
    creatorName,
    enrollment_code,
    select,
    deselect,
    preSelect,
    clearSelection,
  } = props;
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  const handleClick = (e) => {
    navigate(`/users/${u_id}/courses/${c_id}`);
  };

  useEffect(() => {
    if (preSelect && !checked) {
      select();
      setChecked(true);
    } else if (!preSelect && checked) {
      deselect();
      setChecked(false);
    }
  }, [preSelect]);

  useEffect(() => {
    if (clearSelection && checked) {
      deselect();
      setChecked(false);
    }
  }, [clearSelection]);

  return (
    <div
      className="course-card flex-column"
      style={{
        outline: checked ? "1px solid var(--color3-100)" : "none",
      }}
      onClick={handleClick}
    >
      <div className="course-card-upper flex-column">
        <div className="upper flex-row">
          <div
            className="course-code flex-row"
            style={{ backgroundColor: `var(--color${(c_id % 5) + 1}-100)` }}
          >
            <span>{course_code.toUpperCase()}</span>
          </div>
          <CheckBox
            checked={checked}
            onChange={() => {
              if (checked) deselect();
              else select();
              setChecked((prev) => {
                return !prev;
              });
            }}
          />
        </div>
        <span className="course-name">{title}</span>
        <span className="creator-name">{creatorName}</span>
      </div>
      <div className="course-card-lower flex-row">
        <div
          className="enrollment-code flex-row"
          style={{
            backgroundColor: `var(--color${(c_id % 5) + 1}-20)`,
            color: `var(--color${(c_id % 5) + 1}-100)`,
          }}
        >
          <span>{enrollment_code.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
