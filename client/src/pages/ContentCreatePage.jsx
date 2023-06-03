import React, { useState } from "react";

import "./css/contentcreatepage.css";
import LessonEditor from "../components/LessonEditor";
import axios from "../axios";

const ContentCreatePage = ({ close, course, user, content_id, refresh }) => {
  const [heading, setHeading] = useState("");
  const [summary, setSummary] = useState("");
  const [lesson, setLesson] = useState("");
  const [toc, setToc] = useState([]);
  const [time, setTime] = useState(new Date().getMilliseconds());

  // const handleToggle = (e) => {
  //   const elem = e.currentTarget;
  //   const curElem = document.querySelector(
  //     ".content-create-page-sidebar .toggle-buttons .current-selected"
  //   );
  //   if (!elem.classList.contains("current-selected")) {
  //     curElem.classList.remove("current-selected");
  //     elem.classList.add("current-selected");
  //     let name = elem.getAttribute("data-button-name");
  //     setCurSelected(name);
  //   }
  // };

  const handleCreate = (e) => {
    if (heading.length === 0 || summary.length === 0 || lesson.length === 0) {
      return;
    }

    axios
      .post("/courses/contents/create", {
        content_id,
        content_for: course.c_id,
        title: heading,
        summary,
        lesson,
      })
      .then((res) => {
        if (res.data !== "Lesson successfully created") {
          console.error("Something erroneous happened");
          return;
        }
      });
    refresh();
    close();
  };

  return (
    <div className="overlay">
      <div className="content-create-page flex-column">
        <label
          style={{
            color: `var(--color${(time % 5) + 1}-100)`,
          }}
        >
          Create Lesson
        </label>
        <div className="content-create-page-body flex-column">
          <div className="content-heading-input flex-column">
            <label>Title*</label>
            <input
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              maxLength={65}
              required
            />
            <span>{heading.length}/65</span>
          </div>
          <div className="content-summary-input flex-column">
            <label>Summary</label>
            <textarea
              type="text"
              value={summary}
              onChange={(e) => {
                let lines = e.target.value.split("\n").length;
                if (lines < 7) lines = 6;
                e.target.style.setProperty(
                  "min-height",
                  `${lines * 1.5 + 1}rem`
                );
                setSummary(e.target.value);
              }}
              maxLength={1024}
              required
            />
            <span>{summary.length}/1024</span>
          </div>
          <div className="content-lesson-input flex-column">
            <label>Lesson*</label>
            <LessonEditor value={lesson} setValue={setLesson} />
          </div>
          <div className="button-groups flex-row">
            <button
              className="button1"
              style={{
                backgroundColor: `var(--color${(time % 5) + 1}-100)`,
              }}
              onClick={handleCreate}
            >
              Create
            </button>
            <button className="button2" onClick={(e) => close()}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCreatePage;
