import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "./css/contentlist.css";

const ContentList = (props) => {
  const {
    contentList,
    active,
    homePath,
    // toggle,
    // shouldToggle,
    showCreatePopup,
  } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const [curActive, setCurActive] = useState(active);

  const handleCurrentSelected = (e) => {
    // toggle();
    const elem = e.currentTarget;
    const curElem = document.querySelector(".content-list .current-selected");
    if (!elem.classList.contains("current-selected")) {
      curElem?.classList.remove("current-selected");
      elem.classList.add("current-selected");
      const to = homePath + `/contents/${elem.getAttribute("data-content-id")}`;
      navigate(to);
    }
  };

  useEffect(() => {
    const l = location.pathname.match(/contents\/\d+/);
    if (l) {
      const path = String(l[0]).split("/");
      const contentid = Number(path[path.length - 1]);
      setCurActive(contentid);
    } else {
      setCurActive(-1);
    }
  }, [location.pathname]);

  // useEffect(() => {
  //   let elem = document.querySelector(".content-list .current-selected");
  //   if (shouldToggle && elem) elem.classList.remove("current-selected");
  // }, [shouldToggle]);

  return (
    <div className="content-list flex-column">
      <label>Lesson List</label>
      <div className="content-list-items">
        {contentList.map((value, index) => {
          return (
            <div
              className={
                "content-list-item flex-row" +
                (Number(curActive) === Number(value.content_id)
                  ? " current-selected"
                  : "")
              }
              onClick={handleCurrentSelected}
              data-content-id={value.content_id}
              key={index}
            >
              {/* <div className="content-list-item-left"></div>
            <div className="content-list-item-right"> */}
              <span>{value.title}</span>
              {/* </div> */}
            </div>
          );
        })}
        {contentList.length === 0 ? (
          <button
            className="button-outlined"
            style={{
              marginTop: "1rem",
              width: "100%",
              height: "2.5rem",
            }}
            onClick={(e) => showCreatePopup()}
          >
            {" "}
            + Add Lesson{" "}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default ContentList;
