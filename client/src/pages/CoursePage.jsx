import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import "./css/coursepage.css";
import axios from "../axios";
import ContentList from "../components/ContentList";
import ContentPage from "./ContentPage";
import QuizList from "../components/QuizList";
import AssignmentList from "../components/AssignmentList";
import ContentCreatePage from "./ContentCreatePage";

const CoursePage = () => {
  const [user, setUser] = useState();
  const [course, setCourse] = useState();

  const location = useLocation();
  const navigate = useNavigate();
  const [homePath, setHomePath] = useState("");
  const [aboutClicked, setAboutClicked] = useState();
  const [courseLessons, setCourseLessons] = useState([]);
  const [quizList, setQuizList] = useState([]);
  const [assignmentList, setAssignmentList] = useState([]);
  const [showCreateContent, setShowCreateContent] = useState(false);

  const clickAbout = () => {
    let elem = document.querySelector(".about-selected");
    if (elem) {
      elem.classList.remove("about-selected");
      setAboutClicked(false);
    }
  };

  const handleAboutClick = (e) => {
    setAboutClicked(true);
    if (!e.currentTarget.classList.contains("about-selected"))
      e.currentTarget.classList.add("about-selected");
    navigate(homePath);
  };

  const getCourseLessons = (c_id) => {
    axios.get(`courses/contents/?c_id=${c_id}`).then((res) => {
      if (typeof res.data !== String) setCourseLessons(res.data);
    });
  };

  const getQuizzes = (c_id) => {
    axios.get(`courses/quizzes/?c_id=${c_id}`).then((res) => {
      if (typeof res.data !== String) setQuizList(res.data);
    });
  };

  const getAssignments = (c_id) => {
    axios.get(`courses/assignments/?c_id=${c_id}`).then((res) => {
      if (typeof res.data !== String) setAssignmentList(res.data);
    });
  };

  const initialSetup = () => {
    const l = location.pathname.match(/courses\/\d+/);
    const path = String(l[0]).split("/");
    const c_id = Number(path[path.length - 1]);
    axios.get(`/courses/info/?c_id=${c_id}`).then((res) => {
      setCourse(res.data);
    });
    let usr = JSON.parse(localStorage.getItem("user"));
    setUser(usr);
    getCourseLessons(c_id);
    getQuizzes(c_id);
    getAssignments(c_id);
    setHomePath(`/users/${usr.u_id}/courses/${c_id}`);
  };

  useEffect(() => {
    initialSetup();
    // console.log("called");
  }, []);

  useEffect(() => {
    initialSetup();
    if (homePath !== location.pathname) clickAbout();
  }, [location.pathname]);

  return course ? (
    <div className="course-page flex-row">
      {showCreateContent ? (
        <ContentCreatePage
          close={() => setShowCreateContent(false)}
          course={course}
          user={user}
          content_id={courseLessons.length + 1}
          refresh={() => getCourseLessons(course.c_id)}
        />
      ) : null}
      <div className="course-page-sidebar flex-column">
        <div className="course-page-sidebar-body flex-column">
          <div
            className={
              "course-page-sidebar-about flex-row" +
              (homePath === location.pathname ? " about-selected" : "")
            }
            onClick={handleAboutClick}
          >
            <span>About</span>
          </div>
          <ContentList
            contentList={courseLessons}
            active={-1}
            homePath={homePath}
            // toggle={clickAbout}
            // shouldToggle={aboutClicked}
            showCreatePopup={() => setShowCreateContent(true)}
          />
          <QuizList
            quizList={quizList}
            active={-1}
            homePath={homePath}
            showCreatePopup={() => null}
          />
          <AssignmentList
            assignmentList={assignmentList}
            active={-1}
            homePath={homePath}
            showCreatePopup={() => null}
          />
        </div>
        {course.created_by === user.u_id ? (
          <div
            className={
              "course-page-sidebar-cell flex-row" +
              (location.pathname === String(`${homePath}/evaluations`)
                ? " sidebar-cell-selected"
                : "")
            }
            onClick={(e) => navigate(`${homePath}/evaluations`)}
          >
            <img src="/evaluation_icon.svg" alt="" />
            <span>Evaluations</span>
          </div>
        ) : null}
      </div>
      <Outlet
        context={{
          course,
          user,
          courseLessons,
          getCourseLessons,
          homePath,
          quizList,
          getQuizzes,
          assignmentList,
          getAssignments,
        }}
      />
    </div>
  ) : null;
};

export default CoursePage;
