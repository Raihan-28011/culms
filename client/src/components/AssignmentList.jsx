import React, { useEffect, useState } from "react";

import "./css/assignmentlist.css";
import { useNavigate } from "react-router-dom";

const AssignmentList = (props) => {
  const { assignmentList, active, homePath } = props;
  const [curActive, setCurActive] = useState("");
  const navigate = useNavigate();

  const handleCurrentSelected = (e) => {
    // toggle();
    const elem = e.currentTarget;
    const curElem = document.querySelector(
      ".assignment-list .current-selected"
    );
    if (!elem.classList.contains("current-selected")) {
      curElem?.classList.remove("current-selected");
      elem.classList.add("current-selected");
      const to =
        homePath + `/assignments/${elem.getAttribute("data-assignment-id")}`;
      navigate(to);
    }
  };

  useEffect(() => {
    const l = location.pathname.match(/assignments\/[\d\w]+/);
    if (l) {
      const path = String(l[0]).split("/");
      const assignmentid = path[path.length - 1];
      setCurActive(assignmentid);
    } else {
      setCurActive("");
    }
  }, [location.pathname]);

  return (
    <div className="assignment-list flex-column">
      <label>Assignments</label>
      <div className="assignment-list-items flex-column">
        {assignmentList.map((value, index) => {
          return (
            <div
              className={
                "assignment-list-item flex-row" +
                (curActive === value.assignment_id ? " current-selected" : "")
              }
              data-assignment-id={value.assignment_id}
              onClick={handleCurrentSelected}
              key={index}
            >
              <span> {value.title} </span>
            </div>
          );
        })}
        {assignmentList.length === 0 ? (
          <button
            className="button-outlined"
            style={{
              marginTop: "1rem",
              width: "100%",
              height: "2.5rem",
            }}
            onClick={(e) => navigate(`${homePath}/assignments/create`)}
          >
            {" "}
            + Add Assignment{" "}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default AssignmentList;
