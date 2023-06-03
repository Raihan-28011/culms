import React, { useEffect, useState } from "react";

import "./css/dashboard.css";
import CourseCard from "../components/CourseCard";
import axios from "../axios";
import CourseCreatePopup from "../components/CourseCreatePopup";
import CourseEnrollPopup from "../components/CourseEnrollPopup";
import CheckBox from "../components/CheckBox";

function Dashboard(props) {
  const [user, setUser] = useState();
  const [selectedSelector, setSelectedSelector] = useState("created");
  const [createdCourses, setCreatedCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCreatedCards, setSelectedCreatedCards] = useState([]);
  const [selectedEnrolledCards, setSelectedEnrolledCards] = useState([]);
  const [preSelect, setPreselect] = useState(false);
  const [preSelectEnrolled, setPreselectEnrolled] = useState(false);
  const [clearSelection, setClearSelect] = useState(false);
  const [clearSelectionEnrolled, setClearSelectEnrolled] = useState(false);

  const handleSelector = (e) => {
    const elem = e.currentTarget;
    const curSelector = document.querySelector(
      ".dashboard-body-head-left .current-selected"
    );
    if (!elem.classList.contains("current-selected")) {
      curSelector.classList.remove("current-selected");
      elem.classList.add("current-selected");
      setSelectedSelector((prev) => elem.getAttribute("name"));
      setSelectedCreatedCards([]);
      setSelectedEnrolledCards([]);
      setClearSelect(false);
      setClearSelectEnrolled(false);
    }
    setPreselect(false);
    setPreselectEnrolled(false);
  };

  function getEnrolledCourses(usr) {
    axios.get(`/courses/enrolled/?u_id=${usr.u_id}`).then((res) => {
      if (res.status !== 200) {
        console.error("Dashboard:enrolled_courses: " + res.data);
        return;
      }

      setEnrolledCourses((prev) => res.data);
    });
  }

  function getCreatedCourses(usr) {
    axios.get(`/courses/created/?u_id=${usr.u_id}`).then((res) => {
      if (res.status !== 200) {
        console.error("Dashboard:get_courses: " + res.data);
        return;
      }

      setCreatedCourses((prev) => res.data);
    });
  }

  const handleDeleteCourses = (e) => {
    if (selectedSelector === "created") {
      selectedCreatedCards.forEach((value) => {
        axios.delete(`/courses/created/?c_id=${value}`).then((res) => {
          getCreatedCourses(user);
        });
      });
      setSelectedCreatedCards([]);
    } else if (selectedSelector === "enrolled") {
      selectedEnrolledCards.forEach((value) => {
        axios
          .delete(`/courses/enrolled/?c_id=${value}&u_id=${user.u_id}`)
          .then((res) => {
            getEnrolledCourses(user);
          });
      });
      setSelectedEnrolledCards([]);
    }
  };

  useEffect(() => {
    if (
      selectedSelector === "created" &&
      selectedCreatedCards.length === createdCourses.length
    ) {
      setPreselect(true);
    } else if (preSelect) {
      setPreselect(false);
    }
    if (
      selectedSelector === "enrolled" &&
      selectedEnrolledCards.length === enrolledCourses.length
    ) {
      setPreselectEnrolled(true);
    } else if (preSelectEnrolled) {
      setPreselectEnrolled(false);
    }

    if (selectedCreatedCards.length === 0) setClearSelect(false);
    if (selectedEnrolledCards.length === 0) setClearSelectEnrolled(false);
  }, [selectedCreatedCards, selectedEnrolledCards]);

  useEffect(() => {
    const usr = JSON.parse(localStorage.getItem("user"));
    setUser((prev) => usr);
    getCreatedCourses(usr);
    getEnrolledCourses(usr);
  }, []);

  return (
    <div className="dashboard">
      {user &&
        showPopup &&
        (selectedSelector === "created" ? (
          <CourseCreatePopup
            u_id={user?.u_id}
            user={user}
            refresh={getCreatedCourses}
            close={() => setShowPopup(false)}
          />
        ) : (
          <CourseEnrollPopup
            u_id={user?.u_id}
            user={user}
            refresh={getEnrolledCourses}
            close={() => setShowPopup(false)}
          />
        ))}
      {/* <div className="dashboard-head flex-row">
        <div className="dashboard-head-cards flex-row">
          <div className="dashboard-head-cards-left flex-row">
            <span>#</span>
          </div>
          <div className="dashboard-head-cards-right flex-column">
            <span>Total Students</span>
            <span>1000</span>
          </div>
        </div>
        <div className="dashboard-head-cards flex-row">
          <div className="dashboard-head-cards-left flex-row">
            <span>#</span>
          </div>
          <div className="dashboard-head-cards-right flex-column">
            <span>Total Students</span>
            <span>1000</span>
          </div>
        </div>
        <div className="dashboard-head-cards flex-row">
          <div className="dashboard-head-cards-left flex-row">
            <span>#</span>
          </div>
          <div className="dashboard-head-cards-right flex-column">
            <span>Total Students</span>
            <span>1000</span>
          </div>
        </div>
      </div> */}
      <div className="dashboard-body flex-column">
        <div className="dashboard-body-head flex-row">
          <div className="dashboard-body-head-left flex-row">
            <div
              className="dashboard-body-head-left-left flex-row current-selected"
              name="created"
              onClick={handleSelector}
            >
              <span>Created</span>
            </div>
            <div
              className="dashboard-body-head-left-right flex-row"
              name="enrolled"
              onClick={handleSelector}
            >
              <span>Enrolled</span>
            </div>
          </div>
          <div className="dashboard-body-head-right flex-row">
            <input type="search" placeholder="Search" />
            <div
              className="course-add-button flex-row"
              onClick={(e) => setShowPopup((prev) => !prev)}
            >
              <span>+</span>
            </div>
          </div>
        </div>
        {selectedSelector === "created" && selectedCreatedCards.length > 0 ? (
          <div className="selection-action-area flex-row">
            <div className="left flex-row">
              <button className="flex-row">
                <CheckBox
                  checked={preSelect}
                  width={"1rem"}
                  onChange={() => setPreselect((prev) => !prev)}
                />{" "}
                Select all
              </button>
              <button className="flex-row" onClick={handleDeleteCourses}>
                <img src="/delete_logo.svg" alt="" /> Delete
              </button>
            </div>
            <div className="right flex-row">
              <button
                className="flex-row"
                onClick={(e) => {
                  setClearSelect(true);
                }}
              >
                <span>&times;</span> <span>{selectedCreatedCards.length}</span>{" "}
                Selected
              </button>
            </div>
          </div>
        ) : null}
        {selectedSelector === "enrolled" && selectedEnrolledCards.length > 0 ? (
          <div className="selection-action-area flex-row">
            <div className="left flex-row">
              <button className="flex-row">
                <CheckBox
                  checked={preSelectEnrolled}
                  width={"1rem"}
                  onChange={() => setPreselectEnrolled((prev) => !prev)}
                />{" "}
                Select all
              </button>
              <button className="flex-row" onClick={handleDeleteCourses}>
                <img src="/delete_logo.svg" alt="" /> Delete
              </button>
            </div>
            <div className="right flex-row">
              <button
                className="flex-row"
                onClick={(e) => {
                  setClearSelectEnrolled(true);
                }}
              >
                <span>&times;</span> <span>{selectedEnrolledCards.length}</span>{" "}
                Selected
              </button>
            </div>
          </div>
        ) : null}
        <div className="dashboard-body-body flex-row">
          {selectedSelector === "created" &&
            createdCourses.length > 0 &&
            createdCourses.map((val, index) => {
              return (
                <CourseCard
                  key={index}
                  u_id={user.u_id}
                  {...val}
                  creatorName={user.name}
                  enrollment_code={val.enrollment_code}
                  preSelect={preSelect}
                  clearSelection={clearSelection}
                  select={() => {
                    setSelectedCreatedCards((prev) => {
                      let ret = [...prev, val.c_id];
                      return ret;
                    });
                  }}
                  deselect={() => {
                    setSelectedCreatedCards((prev) => {
                      let ret = prev.filter((value) => value !== val.c_id);
                      return ret;
                    });
                  }}
                />
              );
            })}

          {selectedSelector === "enrolled" &&
            enrolledCourses.length > 0 &&
            enrolledCourses.map((val, index) => {
              return (
                <CourseCard
                  key={index}
                  u_id={user.u_id}
                  {...val}
                  enrollment_code={val.enrollment_code}
                  preSelect={preSelectEnrolled}
                  clearSelection={clearSelectionEnrolled}
                  select={() => {
                    setSelectedEnrolledCards((prev) => {
                      let ret = [...prev, val.c_id];
                      return ret;
                    });
                  }}
                  deselect={() => {
                    setSelectedEnrolledCards((prev) => {
                      let ret = prev.filter((value) => value !== val.c_id);
                      return ret;
                    });
                  }}
                />
              );
            })}
          {(selectedSelector === "created" && createdCourses.length === 0) ||
          (selectedSelector === "enrolled" && enrolledCourses.length === 0) ? (
            <div className="empty flex-row"> No courses </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
