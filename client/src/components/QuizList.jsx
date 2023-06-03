import React, { useEffect, useState } from "react";

import "./css/quizlist.css";
import { useNavigate } from "react-router-dom";

const QuizList = (props) => {
  const { quizList, active, homePath } = props;
  const [curActive, setCurActive] = useState("");
  const navigate = useNavigate();

  const handleCurrentSelected = (e) => {
    // toggle();
    const elem = e.currentTarget;
    const curElem = document.querySelector(".quiz-list .current-selected");
    if (!elem.classList.contains("current-selected")) {
      curElem?.classList.remove("current-selected");
      elem.classList.add("current-selected");
      const to = homePath + `/quizzes/${elem.getAttribute("data-quiz-id")}`;
      navigate(to);
    }
  };

  useEffect(() => {
    const l = location.pathname.match(/quizzes\/[\d\w]+/);
    if (l) {
      const path = String(l[0]).split("/");
      const quizid = path[path.length - 1];
      setCurActive(quizid);
    } else {
      setCurActive("");
    }
  }, [location.pathname]);

  return (
    <div className="quiz-list flex-column">
      <label>Quizes</label>
      <div className="quiz-list-items flex-column">
        {quizList.map((value, index) => {
          return (
            <div
              className={
                "quiz-list-item flex-row" +
                (curActive === value.quiz_id ? " current-selected" : "")
              }
              data-quiz-id={value.quiz_id}
              onClick={handleCurrentSelected}
              key={index}
            >
              <span> {value.title} </span>
            </div>
          );
        })}
        {quizList.length === 0 ? (
          <button
            className="button-outlined"
            style={{
              marginTop: "1rem",
              width: "100%",
              height: "2.5rem",
            }}
            onClick={(e) => navigate(`${homePath}/quizzes/create`)}
          >
            {" "}
            + Add Quiz{" "}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default QuizList;
