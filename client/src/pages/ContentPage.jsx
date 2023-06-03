import React, { useEffect, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";

import "./css/contentpage.css";
import ContentList from "../components/ContentList";
import axios from "../axios";

const ContentPage = () => {
  const { user, course } = useOutletContext();
  const [courseLessons, setCourseLessons] = useState();
  const [curLesson, setCurLesson] = useState(-1);
  const [c_id, setCid] = useState();
  const [content_id, setContentId] = useState();
  const [lesson, setLesson] = useState("");
  // const [toc, setToc] = useState([]);
  const location = useLocation();

  // const extractToc = (text) => {
  //   const regex = /<h1>[\w\s-:!`~@#$%^&*()\[\]{}|\\;'"\/.,]+<\/h1>/g;
  //   const array = [...text.matchAll(regex)];
  //   setToc(() => [
  //     ...array.map((value) => {
  //       let ret = String(value);
  //       return ret.substring(4, ret.length - 5);
  //     }),
  //   ]);
  // };

  function initialSetup() {
    axios.get(`courses/contents/?c_id=${course.c_id}`).then((res) => {
      setCourseLessons(res.data);
      const l = location.pathname.match(/contents\/\d+/);
      const path = String(l[0]).split("/");
      const contentid = Number(path[path.length - 1]);
      const cid = Number(path[path.length - 3]);
      setContentId(() => contentid);
      setCid(() => cid);
      if (res.data.length > 0) {
        let item = res.data.find((value) => value.content_id == contentid);
        setLesson(item.lesson);
        setCurLesson(item);
        // extractToc(res.data[contentid - 1].lesson);
      }
    });
  }

  useEffect(() => {
    initialSetup();
  }, []);

  useEffect(() => {
    initialSetup();
  }, [location.pathname]);

  return content_id && lesson.length > 0 ? (
    <div className="content-page flex-row">
      {/* <div className="content-sidebar">
        <div className="content-sidebar-head">{"<-"} </div>
        <div className="content-sidebar-body">
          <ContentList contentList={contents} active={content_id} />
        </div>
      </div> */}
      <div className="content-main-body">
        <div className="content-main-body-heading">{curLesson.title}</div>
        {/* <div className="content-main-body-toc flex-column">
          <span>Table of Contents</span>
          {toc.map((value, index) => {
            return (
              <div key={index} className="content-toc-list-item flex-row">
                <span>{value}</span>
              </div>
            );
          })}
          {toc.length === 0 && <div> Empty </div>}
        </div> */}
        <div className="content-main-body-subheading">{curLesson.summary}</div>
        <hr />
        <div
          className="content-main-body-content"
          dangerouslySetInnerHTML={{
            __html: lesson,
          }}
        ></div>
      </div>
    </div>
  ) : null;
};

export default ContentPage;
