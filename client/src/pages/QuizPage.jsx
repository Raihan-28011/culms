import React, { useEffect, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";

import "./css/quizpage.css";
import axios from "../axios";

const QuizPage = () => {
  const { user, course } = useOutletContext();
  const [quizList, setQuizList] = useState([]);
  const [quizId, setQuizId] = useState();
  const [c_id, setCid] = useState();
  const location = useLocation();
  const [currentSelected, setCurrentSelected] = useState(1);
  const [curTime, setCurTime] = useState(new Date().getMilliseconds());
  const [answerSelected, setAnswerSelected] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [submittedOption, setSubmittedOption] = useState(-1);
  const [obtainedPoints, setObtainedPoints] = useState("?");
  const [curQObtainedPoints, setCurQObtainedPoints] = useState("?");

  // const getQuizzes = (c_id) => {};

  const handleOptionSelect = (e) => {
    if (submittedOption !== -1) return;
    if (user.u_id !== course.created_by) {
      const elem = e.currentTarget;
      setAnswerSelected((prev) => {
        let n = [...prev];
        n[currentSelected - 1] = Number(elem.getAttribute("data-index"));
        return n;
      });
    }
  };

  function getQuizzes() {
    axios.get(`courses/quizzes/?c_id=${course.c_id}`).then((res) => {
      setQuizList(res.data);
      const l = location.pathname.match(/quizzes\/[\d\w]+/);
      const path = String(l[0]).split("/");
      const quizid = path[path.length - 1];
      for (let i = 0; i < res.data.length; ++i) {
        if (res.data[i].quiz_id === quizid) {
          setQuizId((prev) => {
            return i + 1;
          });
          break;
        }
      }
    });
  }

  function getSubmissions() {
    if (user.u_id !== course.created_by) {
      const l = location.pathname.match(/quizzes\/[\d\w]+/);
      const path = String(l[0]).split("/");
      const quizid = path[path.length - 1];
      axios
        .get(
          `courses/quizzes/submission/?quiz_id=${quizid}&participant_id=${user.u_id}`
        )
        .then((res) => {
          setSubmissions(res.data);
          setObtainedPoints(res.data.length > 0 ? 0 : "?");
          res.data.forEach((value) => {
            setObtainedPoints((prev) => prev + Number(value.obtained_points));
          });
          if (res.data.length > 0) {
            let answer = res.data.filter(
              (value) => value.question_id === currentSelected
            )[0];
            if (answer) {
              console.log("chosen option: ", answer.chosen_option);
              setSubmittedOption(answer.chosen_option);
              setCurQObtainedPoints(answer.obtained_points);
            } else {
              setSubmittedOption(-1);
              setCurQObtainedPoints("?");
            }
          }
          setAlreadySubmitted(res.data.length > 0);
        });
    }
  }

  function initialSetup() {
    getQuizzes();
    setCid(() => course.c_id);
    setCurrentSelected(1);
    setCurTime(() => new Date().getMilliseconds());
    setSubmittedOption(-1);
    setAnswerSelected([]);
    setObtainedPoints("?");
    setCurQObtainedPoints("?");
    getSubmissions();
  }

  const handleSubmitQuiz = (e) => {
    let question = quizList[quizId - 1].questions[currentSelected - 1];
    console.log(question);
    axios
      .post("courses/quizzes/submit", {
        question_id: question.question_id,
        quiz_id: quizList[quizId - 1].quiz_id,
        participant_id: user.u_id,
        chosen_option: Number(answerSelected[currentSelected - 1] + 1),
        obtained_points:
          question.answer === answerSelected[currentSelected - 1] + 1
            ? Number(question.points)
            : 0,
      })
      .then((res) => {
        getSubmissions();
      });
  };

  useEffect(() => {
    initialSetup();
  }, []);

  useEffect(() => {
    initialSetup();
  }, [location.pathname]);

  return quizId ? (
    <div className="quiz-page flex-column">
      <div className="quiz-page-head flex-row">
        <span>Quiz: {quizList[quizId - 1].title}</span>
        {user.u_id !== course.created_by ? (
          <div
            className="quiz-obtained-points flex-row"
            style={{
              borderColor: `var(--color${(curTime % 5) + 1}-100)`,
            }}
          >
            <span>Obtained:</span>
            <span>
              {obtainedPoints} / {quizList[quizId - 1].points} points
            </span>
          </div>
        ) : null}
      </div>
      <div className="quiz-box flex-column">
        <div className="quiz-box-head flex-row">
          <span
            style={{
              backgroundColor: `var(--color${(curTime % 5) + 1}-100)`,
            }}
          >
            {currentSelected}
          </span>
          <span
            dangerouslySetInnerHTML={{
              __html:
                quizList[quizId - 1].questions[currentSelected - 1].question,
            }}
          ></span>
          <span
            style={{
              borderColor: `var(--color${(curTime % 5) + 1}-100)`,
              // color: `var(--color${(curTime % 5) + 1}-100)`,
            }}
          >
            {user.u_id !== course.created_by &&
              String(curQObtainedPoints) + " / "}
            {quizList[quizId - 1].questions[currentSelected - 1].points} points
          </span>
        </div>

        <div className="quiz-options flex-column">
          {quizList[quizId - 1].questions[currentSelected - 1].options.map(
            (value, index) => {
              return value.length > 0 ? (
                <>
                  <div
                    className={
                      "quiz-option flex-row" +
                      (index === answerSelected[currentSelected - 1] &&
                      submittedOption === -1
                        ? " option-selected"
                        : "") +
                      (submittedOption !== -1 &&
                      submittedOption ===
                        quizList[quizId - 1].questions[currentSelected - 1]
                          .answer &&
                      index === submittedOption - 1
                        ? " right-answer"
                        : "") +
                      (submittedOption !== -1 &&
                      submittedOption !==
                        quizList[quizId - 1].questions[currentSelected - 1]
                          .answer &&
                      index === submittedOption - 1
                        ? " wrong-answer"
                        : "") +
                      (submittedOption !== -1 &&
                      submittedOption !==
                        quizList[quizId - 1].questions[currentSelected - 1]
                          .answer &&
                      index ===
                        quizList[quizId - 1].questions[currentSelected - 1]
                          .answer -
                          1
                        ? " right-answer"
                        : "")
                    }
                    key={index}
                    data-index={index}
                    onClick={handleOptionSelect}
                  >
                    <span>{index + 1}</span>
                    <span dangerouslySetInnerHTML={{ __html: value }}></span>
                  </div>
                  <div
                    className={
                      "quiz-explanation flex-column" +
                      (submittedOption !== -1 &&
                      index + 1 ===
                        quizList[quizId - 1].questions[currentSelected - 1]
                          .answer
                        ? ""
                        : " hidden")
                    }
                  >
                    <span>Explanation</span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html:
                          quizList[quizId - 1].questions[currentSelected - 1]
                            .explanation,
                      }}
                    ></span>
                  </div>
                </>
              ) : null;
            }
          )}
        </div>
        <div className="quiz-tail flex-row">
          {user.u_id !== course.created_by ? (
            <button className="button-outlined">Reset</button>
          ) : (
            <div></div>
          )}
          <div className="carousel flex-row">
            <span
              onClick={(e) => {
                let curSel =
                  currentSelected - 1 < 1
                    ? quizList[quizId - 1].questions.length
                    : currentSelected - 1;
                setCurrentSelected(curSel);
                setCurTime(new Date().getMilliseconds());
                if (submissions.length > 0) {
                  let answer = submissions.filter(
                    (value) => value.question_id === curSel
                  )[0];
                  if (answer) {
                    setSubmittedOption(answer.chosen_option);
                    setCurQObtainedPoints(answer.obtained_points);
                  } else {
                    setSubmittedOption(-1);
                    setCurQObtainedPoints("?");
                  }
                }
              }}
            >
              &#x21E4;
            </span>
            <span>
              Question {currentSelected} of{" "}
              {quizList[quizId - 1].questions.length}
            </span>
            <span
              onClick={(e) => {
                let curSel =
                  currentSelected + 1 > quizList[quizId - 1].questions.length
                    ? 1
                    : currentSelected + 1;
                setCurrentSelected(curSel);
                setCurTime(new Date().getMilliseconds());
                if (submissions.length > 0) {
                  let answer = submissions.filter(
                    (value) => value.question_id === curSel
                  )[0];
                  if (answer) {
                    console.log("Chosen option: ", answer.chosen_option);
                    setSubmittedOption(answer.chosen_option);
                    setCurQObtainedPoints(answer.obtained_points);
                  } else {
                    setSubmittedOption(-1);
                    setCurQObtainedPoints("?");
                  }
                }
              }}
            >
              &#x21E5;
            </span>
          </div>

          {user.u_id !== course.created_by ? (
            <button
              className="button1"
              style={{
                backgroundColor:
                  submittedOption !== -1
                    ? `var(--color-gray1-100)`
                    : `var(--color${(curTime % 5) + 1}-100)`,
              }}
              onClick={handleSubmitQuiz}
              disabled={submittedOption !== -1}
            >
              {submittedOption !== -1 ? "Submitted" : "Submit Answer"}
            </button>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default QuizPage;
