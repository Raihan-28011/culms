import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "../axios";
import "./css/evaluations.css";

function Evaluations() {
  const { user, course, homePath } = useOutletContext();
  const [quizzes, setQuizzes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [quizEvaluations, setQuizEvaluations] = useState([]);
  const [assgEvaluations, setAssgEvaluations] = useState([]);

  useEffect(() => {
    axios.get(`/courses/quizzes/?c_id=${course.c_id}`).then((res) => {
      setQuizzes(res.data);
    });
    axios.get(`/courses/assignments/?c_id=${course.c_id}`).then((res) => {
      setAssignments(res.data);
    });
    axios.get(`/courses/participants/?c_id=${course.c_id}`).then((res) => {
      setParticipants(res.data);
    });
    axios.get(`/courses/evaluations/?c_id=${course.c_id}`).then((res) => {
      setQuizEvaluations(res.data.quiz);
      setAssgEvaluations(res.data.assignments);
      console.log(res.data);
    });
  }, []);

  return (
    <div className="evaluations-page">
      <h1>Evaluations</h1>
      <div className="evaluation-tables flex-column">
        <label>Quizzes</label>
        {quizzes.length > 0 ? (
          <div className="table flex-column">
            <div className="table-row flex-row">
              <div className="table-col flex-column"></div>
              {quizzes.map((value, index) => {
                return (
                  <div className="table-col flex-column" key={index}>
                    <a href={`${homePath}/quizzes/${value.quiz_id}`}>
                      {value.title}
                    </a>
                  </div>
                );
              })}
            </div>
            {participants.map((value, index) => {
              return (
                <div className="table-row flex-row" key={index}>
                  <div className="table-col flex-column">
                    {value.participant_name}
                  </div>
                  {quizzes.map((val, ind) => {
                    let match = quizEvaluations.find(
                      (evaluation) =>
                        evaluation.participant_id === value.participant_id &&
                        evaluation.quiz_id === val.quiz_id
                    );
                    return (
                      <div className="table-col flex-column" key={ind}>
                        {match ? match.quiz_obtained_points : "?"} /{" "}
                        {val.points}
                      </div>
                    );
                  })}
                </div>
              );
            })}
            <div className="table-legend flex-row">
              <div>
                <span>?</span> <span>= Not taken</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty">No Quizzes</div>
        )}
      </div>
      <div className="evaluation-tables flex-column">
        <label>Assignments</label>
        {assignments.length > 0 ? (
          <div className="table flex-column">
            <div className="table-row flex-row">
              <div className="table-col flex-column"></div>
              {assignments.map((value, index) => {
                return (
                  <div className="table-col flex-column" key={index}>
                    <a href={`${homePath}/assignments/${value.assignment_id}`}>
                      {value.title}
                    </a>
                  </div>
                );
              })}
            </div>
            {participants.map((value, index) => {
              return (
                <div className="table-row flex-row" key={index}>
                  <div className="table-col flex-column">
                    {value.participant_name}
                  </div>
                  {assignments.map((val, ind) => {
                    let match = assgEvaluations.find(
                      (evaluation) =>
                        evaluation.participant_id === value.participant_id &&
                        evaluation.assignment_id === val.assignment_id
                    );
                    return (
                      <div className="table-col flex-column" key={ind}>
                        {match ? match.assignment_obtained_points : "?"} /{" "}
                        {val.points}
                      </div>
                    );
                  })}
                </div>
              );
            })}
            <div className="table-legend flex-row">
              <div>
                <span>?</span> <span>= Not submitted</span>
              </div>
              <div>
                <span>-1</span> <span>= Not evaluated</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty">No Assignments</div>
        )}
      </div>
    </div>
  );
}

export default Evaluations;
