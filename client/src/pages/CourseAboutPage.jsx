import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import CheckBox from "../components/CheckBox";
import ContentCreatePage from "./ContentCreatePage";
import axios from "../axios";
import NotificationWidget from "../components/NotificationWidget";

const CourseAboutPage = () => {
  const [curTime, setCurTime] = useState(new Date().getMilliseconds());
  const {
    course,
    user,
    getCourseLessons,
    courseLessons,
    homePath,
    quizList,
    getQuizzes,
    assignmentList,
    getAssignments,
  } = useOutletContext();
  const [showCreateContent, setShowCreateContent] = useState(false);
  const [checked, setChecked] = useState(false);
  const [notify, setNotify] = useState({
    type: "",
    msg: [],
    interval: undefined,
  });
  const navigate = useNavigate();

  const handleContentClick = (e) => {
    e.stopPropagation();
    navigate(
      `${homePath}/contents/${Number(
        e.currentTarget.getAttribute("data-content-id")
      )}`
    );
  };

  const handleQuizClick = (e) => {
    e.stopPropagation();
    navigate(
      `${homePath}/quizzes/${e.currentTarget.getAttribute("data-quiz-id")}`
    );
  };

  const handleContentDelete = (e) => {
    e.stopPropagation();
    axios
      .delete(
        `/courses/contents/?content_id=${e.currentTarget.getAttribute(
          "data-content-id"
        )}&content_for=${course.c_id}`
      )
      .then((res) => {
        if (res.data === "Content successfully deleted") {
          setNotify({
            type: "info",
            msg: [<span>Lesson deleted!</span>],
            interval: 3000,
          });
        } else {
          setNotify({
            type: "error",
            msg: [<span>Could not delete lesson</span>],
            interval: 3000,
          });
        }
      });
    getCourseLessons(course.c_id);
  };

  const handleQuizDelete = (e) => {
    e.stopPropagation();
    axios
      .delete(
        `/courses/quizzes/?quiz_id=${e.currentTarget.getAttribute(
          "data-quiz-id"
        )}`
      )
      .then((res) => {
        if (res.data === "Quiz successfully deleted") {
          setNotify({
            type: "info",
            msg: [<span>Quiz deleted!</span>],
            interval: 3000,
          });
        } else {
          setNotify({
            type: "error",
            msg: [<span>Could not delete Quiz</span>],
            interval: 3000,
          });
        }
      });
    getQuizzes(course.c_id);
  };

  const handleAssignmentDelete = (e) => {
    e.stopPropagation();
    axios
      .delete(
        `/courses/assignments/?assignment_id=${e.currentTarget.getAttribute(
          "data-assignment-id"
        )}`
      )
      .then((res) => {
        if (res.data === "Assignment successfully deleted") {
          setNotify({
            type: "info",
            msg: [<span>Assignment deleted!</span>],
            interval: 3000,
          });
        } else {
          setNotify({
            type: "error",
            msg: [<span>Could not delete assignment</span>],
            interval: 3000,
          });
        }
      });
    getAssignments(course.c_id);
  };

  const handleAssignmentClick = (e) => {
    e.stopPropagation();
    navigate(
      `${homePath}/assignments/${e.currentTarget.getAttribute(
        "data-assignment-id"
      )}`
    );
  };

  const handleNotificationClose = () => {
    setNotify((prev) => {
      return { ...prev, type: "", msg: "" };
    });
  };

  return (
    <div className="course-page-right flex-column">
      {notify.msg.length > 0 && notify.type.length > 0 ? (
        <NotificationWidget
          type={notify.type}
          msg={notify.msg}
          interval={notify.interval}
          close={handleNotificationClose}
        />
      ) : null}
      <div className="head flex-column">
        <div className="flex-row">
          <span>{course.title}</span>
          <span
            style={{
              borderColor: `var(--color${(curTime % 5) + 1}-100)`,
            }}
          >
            {course.course_code}
          </span>
        </div>
        <span>{course.creatorName}</span>
        <span
          style={{
            backgroundColor: `var(--color${(curTime % 5) + 1}-20)`,
            color: `var(--color${(curTime % 5) + 1}-100)`,
          }}
          title="Click to copy"
          onClick={(e) => navigator.clipboard.writeText(course.enrollment_code)}
        >
          {course.enrollment_code}
        </span>
      </div>
      <div className="body flex-column">
        <div className="desc flex-column">
          <span>Course Description</span>
          <span>{course.description}</span>
        </div>
        <div className="contents flex-column">
          <div className="contents-head flex-row">
            <span>Course Lessons</span>{" "}
            {user.u_id === course.created_by ? (
              <button
                className="button-outlined"
                onClick={() => setShowCreateContent(true)}
              >
                +
              </button>
            ) : null}
          </div>
          {showCreateContent ? (
            <ContentCreatePage
              close={() => setShowCreateContent(false)}
              course={course}
              user={user}
              content_id={courseLessons.length + 1}
              refresh={() => getCourseLessons(course.c_id)}
            />
          ) : null}
          <div className="contents-body flex-column">
            {courseLessons.map((value, index) => {
              return (
                <div
                  className="list-items flex-row"
                  key={index}
                  onClick={handleContentClick}
                  data-content-id={value.content_id}
                >
                  <div className="list-items-left flex-row">
                    <span className="square-box"></span>
                    <span className="list-item-title">{value.title}</span>
                  </div>
                  {user.u_id === course.created_by ? (
                    <div className="list-items-right flex-row">
                      <div className="list-items-edit-button">
                        <img src="/edit_logo.svg" alt="Delete button" />
                      </div>
                      <div
                        className="list-items-delete-button"
                        data-content-id={value.content_id}
                        onClick={handleContentDelete}
                      >
                        <img src="/delete_logo.svg" alt="Delete button" />
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
            {courseLessons.length === 0 && (
              <div className="empty-content-list">Empty</div>
            )}
          </div>
        </div>
        <div className="contents flex-column">
          <div className="contents-head flex-row">
            <span>Quizzes</span>{" "}
            {user.u_id === course.created_by ? (
              <button
                className="button-outlined"
                onClick={() => navigate(`${homePath}/quizzes/create`)}
              >
                +
              </button>
            ) : null}
          </div>
          <div className="quizzes-body flex-column">
            {quizList.map((value, index) => {
              return (
                <div
                  className="list-items flex-row"
                  key={index}
                  onClick={handleQuizClick}
                  data-quiz-id={value.quiz_id}
                >
                  {/* <CheckBox
                    checked={checked}
                    onChange={() => setChecked((prev) => !prev)}
                  />{" "}
                  <span className="list-item-title">{value.title}</span> */}
                  <div className="list-items-left flex-row">
                    <span className="square-box"></span>
                    <span className="list-item-title">{value.title}</span>
                  </div>
                  {user.u_id === course.created_by ? (
                    <div className="list-items-right flex-row">
                      <div className="list-items-edit-button">
                        <img src="/edit_logo.svg" alt="Delete button" />
                      </div>
                      <div
                        className="list-items-delete-button"
                        data-quiz-id={value.quiz_id}
                        onClick={handleQuizDelete}
                      >
                        <img src="/delete_logo.svg" alt="Delete button" />
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
            {quizList.length === 0 && (
              <div className="empty-content-list">Empty</div>
            )}
          </div>
        </div>
        <div className="contents flex-column">
          <div className="contents-head flex-row">
            <span>Assignments</span>{" "}
            {user.u_id === course.created_by ? (
              <button
                className="button-outlined"
                onClick={() => navigate(`${homePath}/assignments/create`)}
              >
                +
              </button>
            ) : null}
          </div>
          <div className="assignments-body flex-column">
            {assignmentList.map((value, index) => {
              return (
                <div
                  className="list-items flex-row"
                  key={index}
                  onClick={handleAssignmentClick}
                  data-assignment-id={value.assignment_id}
                >
                  <div className="list-items-left flex-row">
                    <span className="square-box"></span>
                    <span className="list-item-title">{value.title}</span>
                  </div>
                  {user.u_id === course.created_by ? (
                    <div className="list-items-right flex-row">
                      <div className="list-items-edit-button">
                        <img src="/edit_logo.svg" alt="Delete button" />
                      </div>
                      <div
                        className="list-items-delete-button"
                        data-assignment-id={value.assignment_id}
                        onClick={handleAssignmentDelete}
                      >
                        <img src="/delete_logo.svg" alt="Delete button" />
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
            {assignmentList.length === 0 && (
              <div className="empty-content-list">Empty</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseAboutPage;
