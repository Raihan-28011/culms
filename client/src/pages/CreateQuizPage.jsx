import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import ReactQuill from "react-quill";

import "./css/createquizpage.css";
import axios from "../axios";
import NotificationWidget from "../components/NotificationWidget";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "script"],
    ["blockquote", "code"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    [{ script: "sub" }],
    [{ script: "super" }],
    [{ align: [] }],
    [{ color: [] }],
    [{ background: [] }],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
  "script",
  "indent",
  "blockquote",
  "link",
  "image",
  "align",
  "code",
  "color",
  "background",
  "clean",
];

const CreateQuizPage = () => {
  const { user, course, quizList, homePath, getQuizzes } = useOutletContext();
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [questionList, setQuestionList] = useState([
    {
      question: "",
      answer: 0,
      explanation: "",
      points: 0,
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      option5: "",
    },
  ]);
  const [title, setTitle] = useState("");
  const [curQuestion, setCurQuestion] = useState("");
  const [options, setOptions] = useState(Array(5));
  const [answerSelected, setAnswerSelected] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [points, setPoints] = useState("");
  const [questionToSee, setQuestionToSee] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [notify, setNotify] = useState({
    type: "info",
    msg: [
      <span>1. Quiz must include one or more questions. </span>,
      <span>
        2. Click on the option number to select the option as an answer.{" "}
      </span>,
      <span>3. A question has to have a point</span>,
    ],
    interval: undefined,
  });
  const navigate = useNavigate();

  const handleAnswerSelected = (e) => {
    let elem = e.target;
    if (!elem.classList.contains("create-quiz-option")) return;
    let curElem = document.querySelector(
      ".create-quiz-options .answer-selected"
    );
    if (!elem.classList.contains("answer-selected")) {
      elem.classList.add("answer-selected");
      curElem?.classList.remove("answer-selected");
      setAnswerSelected(Number(elem.getAttribute("data-index")));
    }
  };

  const handleSubmitQuestion = (e) => {
    if (curQuestion.length === 0) {
      setNotify({
        type: "error",
        msg: [
          <span>Can not add empty question!</span>,
          <span>Add a question.</span>,
        ],
        interval: 3000,
      });
      return;
    }

    if (options[0]?.length === 0) {
      setNotify({
        type: "error",
        msg: [<span>Question must have at least 1 option</span>],
        interval: 3000,
      });
      return;
    }

    if (points === 0) {
      setNotify({
        type: "error",
        msg: [
          <span>Question must have a point associated with it!</span>,
          <span>Insert a number into the points input filed</span>,
        ],
        interval: 3000,
      });
      return;
    }

    if (answerSelected === 0) {
      setNotify({
        type: "error",
        msg: [
          <span>Must select an option for answer!</span>,
          <span>Click on the option number to select it as an answer</span>,
        ],
        interval: 3000,
      });
      return;
    }

    let len = questionList.length - 1;
    setQuestionList((prev) => {
      let n = [
        ...prev,
        {
          question: "",
          answer: 0,
          explanation: "",
          points: "",
          option1: "",
          option2: "",
          option3: "",
          option4: "",
          option5: "",
        },
      ];
      n[len] = {
        ...n[len],
        question: curQuestion,
        answer: answerSelected,
        explanation: explanation,
        points: Number(points),
        option1: options[0],
        option2: options[1],
        option3: options[2],
        option4: options[3],
        option5: options[4],
      };
      return n;
    });
    setTotalPoints((prev) => prev + Number(points));
    setAnswerSelected(0);
    setOptions(Array(5));
    setExplanation("");
    setCurQuestion("");
    setPoints("");
    setShowAddQuestion(true);
  };

  const handleCreateQuiz = (e) => {
    if (title.length === 0) {
      setNotify((prev) => {
        return {
          ...prev,
          type: "error",
          msg: [<span>Quiz must have a title!</span>],
          interval: 3000,
        };
      });
      return;
    }

    if (questionList.length === 0) {
      setNotify((prev) => {
        return {
          ...prev,
          type: "error",
          msg: [<span>Quiz must have atleast 1 question!</span>],
          interval: 3000,
        };
      });
      return;
    }

    let req = {
      quiz_id: new Date().getMilliseconds().toString(16).toUpperCase(),
      quiz_for: course.c_id,
      title: title,
      points: totalPoints,
      questions: questionList.filter((value) => value.question.length > 0),
    };
    axios.post("/courses/quizzes/create", req).then((res) => {});
    getQuizzes(course.c_id);
    navigate(`${homePath}`);
  };

  const handleNotificationClose = () => {
    setNotify((prev) => {
      return { ...prev, type: "", msg: "" };
    });
  };

  return (
    <div className="create-quiz flex-column">
      {notify.type.length > 0 && notify.msg.length > 0 ? (
        <NotificationWidget
          type={notify.type}
          msg={notify.msg}
          interval={notify.interval}
          close={handleNotificationClose}
        />
      ) : null}
      <div className="create-quiz-create-button flex-row">
        <button className="button1" onClick={handleCreateQuiz}>
          Create
        </button>
      </div>
      <div className="create-quiz-input flex-column">
        <label>Quiz Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="flex-column" style={{ gap: "0.5rem" }}>
        <div className="question-list-head flex-row">
          <label>Question List</label>
          <button
            className="button1"
            onClick={(e) => setShowAddQuestion(false)}
          >
            +
          </button>
        </div>

        <div className="create-quiz-question-list flex-column">
          <div className="flex-row">
            <span
              onClick={(e) => {
                setQuestionToSee(
                  questionList.length <= 2
                    ? 0
                    : questionToSee === 0
                    ? questionList.length - 2
                    : questionToSee - 1
                );
              }}
            >
              <img src="/left_arrow.svg" alt="" />
            </span>
            <label>Questions</label>
            <span
              onClick={(e) => {
                setQuestionToSee(
                  questionList.length <= 2
                    ? 0
                    : questionToSee === questionList.length - 2
                    ? 0
                    : questionToSee + 1
                );
              }}
            >
              <img src="/right_arrow.svg" alt="" />
            </span>
          </div>
          {questionList.length > 1 ? (
            [questionList[questionToSee]].map((value, index) => {
              return value.question.length > 0 ? (
                <div
                  className="create-quiz-question-list-item flex-column"
                  key={index}
                >
                  <div className="question-list-item-left flex-row">
                    <label>{questionToSee + 1}</label>
                    <span
                      className="flex-column"
                      dangerouslySetInnerHTML={{ __html: value.question }}
                    ></span>
                    <span>{value.points} Points</span>
                  </div>
                  <div className="question-list-item-right flex-column">
                    {[
                      value.option1,
                      value.option2,
                      value.option3,
                      value.option4,
                      value.option5,
                    ].map((val, ind) => {
                      return val?.length > 0 ? (
                        <div
                          className={
                            "question-list-item-options flex-row" +
                            (ind + 1 === value.answer ? " answer-selected" : "")
                          }
                          key={ind}
                        >
                          <label>{ind + 1}</label>
                          <span
                            dangerouslySetInnerHTML={{ __html: val }}
                          ></span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              ) : null;
            })
          ) : (
            <div className="empty"> Empty </div>
          )}
        </div>
      </div>
      {!showAddQuestion ? (
        <>
          <div className="quiz-question flex-column">
            <div className="create-quiz-input flex-column">
              <div className="create-quiz-question-head flex-row">
                <label>Question {questionList.length}</label>
                <div className="create-quiz-input flex-column">
                  <label>Points</label>
                  <input
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                  />
                </div>
              </div>
              <ReactQuill
                formats={formats}
                modules={modules}
                theme="snow"
                value={curQuestion}
                onChange={(s) => setCurQuestion(s)}
              />
            </div>
            <div className="create-quiz-options flex-column">
              <label>Options</label>
              {[1, 2, 3, 4, 5].map((_, index) => {
                return (
                  <div
                    className={"create-quiz-option flex-row"}
                    key={index}
                    data-index={index + 1}
                    onClick={handleAnswerSelected}
                  >
                    <label>{index + 1}</label>
                    <ReactQuill
                      formats={formats}
                      modules={modules}
                      theme="snow"
                      value={options[index]}
                      onChange={(e) =>
                        setOptions((prev) => {
                          let n = [...prev];
                          n[index] = e;
                          return n;
                        })
                      }
                    />
                  </div>
                );
              })}
            </div>
            <div className="explanation flex-column">
              <label>Explanation</label>
              <ReactQuill
                formats={formats}
                modules={modules}
                theme="snow"
                value={explanation}
                onChange={(s) => setExplanation(s)}
              />
            </div>
          </div>
          <button className="button1" onClick={handleSubmitQuestion}>
            Submit Question
          </button>
        </>
      ) : null}
      {/* {showAddQuestion ? (

      ) : null} */}
    </div>
  );
};

export default CreateQuizPage;
