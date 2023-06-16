const fs = require("fs");
const database = require("../oradb");

const createdCourses = async (req, res) => {
  const { u_id } = req.query;
  const stmt =
    'select c_id as "c_id", \
            title as "title", \
            description as "description", \
            course_code as "course_code", \
            enrollment_code as "enrollment_code", \
            create_date as "create_date" \
            from course \
            where created_by = :u_id';
  const binds = { u_id: Number(u_id) };
  try {
    let result = await database.execute(stmt, binds);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Course:createdCourse: " + err);
    res.status(401).json("Could not get any created courses");
  }
};

const createCourse = async (req, res) => {
  const { u_id, courseTitle, courseDesc, courseCode, enrollmentCode } =
    req.body;
  const stmt =
    "insert into course (created_by, title, description, course_code, enrollment_code) \
                 values (:created_by, :title, :des, :ccode, :ecode)";
  const binds = {
    created_by: Number(u_id),
    title: courseTitle,
    des: courseDesc,
    ccode: courseCode,
    ecode: enrollmentCode,
  };
  try {
    await database.execute(stmt, binds);
    res.status(200).json("Course creationg successful");
  } catch (err) {
    console.error("Course:create_course: " + err);
    res.status(401).json("Could not create course");
  }
};

const enrolledCourses = async (req, res) => {
  const { u_id } = req.query;
  let stmt =
    'select u.name as "creatorName", \
            t.c_id as "c_id", \
            t.created_by as "created_by", \
            t.title as "title", \
            t.description as "description", \
            t.course_code as "course_code", \
            t.enrollment_code as "enrollment_code", \
            t.create_date as "create_date" \
            from users u join (select c.* \
                               from course c join participates p \
                                             on c.c_id = p.course_taken \
                                where p.participant_id = :u_id) t \
                         on u.u_id = t.created_by';
  let binds = { u_id };
  try {
    let result = await database.execute(stmt, binds);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Courses:enrolled_courses: " + err);
    res.status(401).json("Could not get enrolled courses");
  }
};

const enrollCourse = async (req, res) => {
  const { u_id, enrollmentCode } = req.body;
  let stmt = "select * from course where enrollment_code = :ecode";
  let binds = { ecode: enrollmentCode };
  try {
    let result = await database.execute(stmt, binds);
    if (result.rows.length === 0) {
      res.status(401).json("No course found");
      return;
    }

    if (u_id === result.rows[0].CREATED_BY) {
      res.status(401).json("Cannot enroll to course created by yourself");
      return;
    }

    let c_id = result.rows[0].C_ID;
    stmt =
      "select * from participates where participant_id = :u_id and course_taken = :c_id";
    binds = { u_id, c_id };
    result = await database.execute(stmt, binds);
    if (result.rows.length !== 0) {
      res.status(401).status("Already enrolled");
      return;
    }

    stmt = "insert into participates values (:u_id, :c_id)";
    binds = { u_id, c_id };
    result = await database.execute(stmt, binds);
    res.status(200).json("Enrollment successful");
  } catch (err) {
    console.error("Course:enroll_course: " + err);
    res.status(401).json("Could not find course");
  }
};

const deleteCreated = async (req, res) => {
  const { c_id } = req.query;
  let stmt =
    "delete course\
              where c_id=:c_id";
  let binds = { c_id };
  try {
    await database.execute(stmt, binds);
    res.status(200).json("Deletion Successful");
  } catch (err) {
    console.error("DeleteCourse: " + err);
    res.status(200).json("DeleteCourse: " + err);
  }
};

const deleteEnrolled = async (req, res) => {
  const { u_id, c_id } = req.query;
  let stmt =
    "delete participates\
              where course_taken=:c_id AND\
                    participant_id=:u_id";
  let binds = { c_id, u_id };
  try {
    await database.execute(stmt, binds);
    res.status(200).json("Deletion Successful");
  } catch (err) {
    console.error("DeleteCourse: " + err);
    res.status(200).json("DeleteCourse: " + err);
  }
};

const getCourseInfo = async (req, res) => {
  const { c_id } = req.query;
  let stmt =
    'select u.name as "creatorName", \
            u.u_id as "creatorId", \
            t.c_id as "c_id", \
            t.created_by as "created_by", \
            t.title as "title", \
            t.description as "description", \
            t.course_code as "course_code", \
            t.enrollment_code as "enrollment_code", \
            t.create_date as "create_date" \
            from users u join (select c.* \
                               from course c\
                               where c.c_id = :c_id) t \
                         on u.u_id = t.created_by';
  let binds = { c_id };
  try {
    let result = await database.execute(stmt, binds);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("GetCourseInfo: " + err);
    res.status(200).json("GetCourseInfo: " + err);
  }
};

const getContents = async (req, res) => {
  let { c_id } = req.query;
  let stmt =
    'select c.content_id as "content_id",\
            c.content_for as "content_for",\
            c.title as "title",\
            c.summary as "summary",\
            c.lesson as "lesson",\
            c.create_date as "create_date" \
    from course cc JOIN contents c \
                   ON cc.c_id = c.content_for \
    where cc.c_id = :c_id';

  let binds = { c_id };
  try {
    let result = await database.execute(stmt, binds);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("GetContents: " + err);
    res.status(200).json("GetContents: " + err);
  }
};

const createContent = async (req, res) => {
  let lesson = { ...req.body };
  let stmt =
    "insert into contents (content_id, content_for, title, summary, lesson)\
            values (:content_id, :content_for, :title, :summary, :lesson)";
  let binds = { ...lesson };
  try {
    await database.execute(stmt, binds);
    res.status(200).json("Lesson Creation Successful");
  } catch (err) {
    console.error("CreateContent: " + err);
    res.status(200).json("CreateContent: " + err);
  }
};

const createQuiz = async (req, res) => {
  let quiz = { ...req.body };
  let stmt =
    "insert into quiz \
            values (:quiz_id, :quiz_for, :title, :points)";
  let binds = { ...quiz };
  try {
    await database.execute(stmt, {
      quiz_id: binds.quiz_id,
      quiz_for: binds.quiz_for,
      title: binds.title,
      points: binds.points,
    });
    // stmt = "select ";
    stmt =
      "insert into \
            quiz_questions values (:question_id, \
                            :question_for, \
                            :question, \
                            :option1, \
                            :option2, \
                            :option3, \
                            :option4, \
                            :option5, \
                            :answer, \
                            :explanation, \
                            :points)";
    quiz.questions.map(async (value, index) => {
      await database.execute(stmt, {
        question_id: index + 1,
        question_for: quiz.quiz_id,
        question: value.question,
        option1: value.option1,
        option2: value.option2,
        option3: value.option3,
        option4: value.option4,
        option5: value.option5,
        answer: value.answer,
        explanation: value.explanation,
        points: value.points,
      });
    });
    res.status(200).json("Quiz Creation Successful");
  } catch (err) {
    console.error("CreateContent: " + err);
    res.status(200).json("CreateContent: " + err);
  }
};

const getQuizzes = async (req, res) => {
  let { c_id } = req.query;
  let stmt =
    'select quiz_id as "quiz_id", \
            title as "title", \
            total_points as "points" \
    from quiz \
    where quiz_for = :c_id';
  let binds = { c_id };
  try {
    let result = await database.execute(stmt, binds);
    let r;
    for (let i = 0; i < result.rows.length; ++i) {
      let value = result.rows[i];
      r = await getQuizQuestions(
        { ...req, query: { quiz_id: value.quiz_id } },
        r
      );
      value.questions = r;
      result.rows[i] = value;
    }
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("GetQuizzes: " + err);
    res.status(200).json("GetQuizzes: " + err);
  }
};

const getQuizQuestions = async (req, res) => {
  let { quiz_id } = req.query;
  let stmt =
    'select q.quiz_id as "quiz_id", \
  q.quiz_for as "quiz_for", \
  qq.question_id as "question_id", \
  qq.question as "question", \
  qq.option1 as "option1", \
  qq.option2 as "option2", \
  qq.option3 as "option3", \
  qq.option4 as "option4", \
  qq.option5 as "option5", \
  qq.answer as "answer", \
  qq.explanation as "explanation", \
  qq.points as "points" \
  from quiz q JOIN quiz_questions qq \
              ON q.quiz_id = qq.question_for \
  where q.quiz_id = :quiz_id';
  let binds = { quiz_id };
  try {
    let result = await database.execute(stmt, binds);
    result.rows.map((value, index) => {
      result.rows[index].options = [
        value.option1,
        value.option2,
        value.option3,
        value.option4,
        value.option5,
      ];
    });
    return result.rows;
  } catch (err) {
    console.error("GetQuizQuestions: " + err);
  }
};

const createAssignment = async (req, res) => {
  let assgn = { ...req.body };
  let stmt =
    "insert into assignments \
          values (:assignment_id, :assignment_for, :title, :description, :attachments, :points)";

  let binds = {
    assignment_id: assgn.assignment_id,
    assignment_for: assgn.assignment_for,
    title: assgn.title,
    description: assgn.description,
    attachments: assgn.attachments,
    points: assgn.points,
  };
  try {
    await database.execute(stmt, binds);
    res.status(200).json("Assignment creation successful");
  } catch (err) {
    console.error("CreateAssignment: " + err);
    res.status(200).json("CreateAssignment: " + err);
  }
};

const getAssignments = async (req, res) => {
  let { c_id } = req.query;
  let stmt =
    'select assignment_id as "assignment_id", \
            title as "title", \
            description as "description", \
            attachments as "attachments", \
            points as "points" \
    from assignments \
    where assignment_for = :c_id';
  let binds = { c_id };
  try {
    let result = await database.execute(stmt, binds);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("GetAssignments: " + err);
    res.status(200).json("GetAssignments: " + err);
  }
};

const submitQuiz = async (req, res) => {
  let stmt =
    "insert into answers values (:question_id, :quiz_id, :participant_id, :chosen_option, :obtained_points)";
  let binds = { ...req.body };
  try {
    await database.execute(stmt, binds);
    res.status(200).json("Successfully submitted quiz");
  } catch (err) {
    console.error("SubmitQuiz: " + err);
    res.status(200).json("SubmitQuiz: " + err);
  }
};

const getQuizSubmission = async (req, res) => {
  let stmt =
    'select chosen_option as "chosen_option", \
            question_id as "question_id", \
            obtained_points as "obtained_points" \
  from answers \
  where quiz_id = :quiz_id AND participant_id = :participant_id \
  order by question_id';
  let binds = { ...req.query };
  try {
    let result = await database.execute(stmt, binds);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("GetQuizSubmission: " + err);
    res.status(200).json("GetQuizSubmission: " + err);
  }
};

const submitAssignment = async (req, res) => {
  let stmt =
    "insert into submits values (:participant_id, :assignment_id, :submitted_attachments, :obtained_points)";
  let binds = { ...req.body };
  try {
    await database.execute(stmt, binds);
    res.status(200).json("Assignment submission successful");
  } catch (err) {
    console.error("SubmitAssignment: " + err);
    res.status(200).json("SubmitAssignment: " + err);
  }
};

const getAssignmentSubmissions = async (req, res) => {
  let stmt =
    'select u.name as "name", \
          s.participant_id as "participant_id", \
          s.assignment_id as "assignment_id", \
          s.submitted_attachments as "submitted_attachments", \
          s.obtained_points as "obtained_points" \
  from submits s JOIN users u ON s.participant_id = u.u_id \
  where s.assignment_id = :assignment_id \
  order by s.participant_id';
  let binds = { ...req.query };
  try {
    let result = await database.execute(stmt, binds);
    stmt =
      'select assignment_id as "assignment_id", \
          title as "title", \
          description as "description", \
          attachments as "attachments", \
          points as "points" \
    from assignments \
    where assignment_id = :assignment_id';
    let result2 = await database.execute(stmt, binds);
    res.status(200).json({ rows: result.rows, assg: result2.rows[0] });
  } catch (err) {
    console.error("GetAssignmentSubmittions: " + err);
    res.status(200).json("GetAssignmentsubmissions: " + err);
  }
};

const getSubmission = async (req, res) => {
  let stmt =
    'select participant_id as "participant_id", \
          assignment_id as "assignment_id", \
          submitted_attachments as "submitted_attachments", \
          obtained_points as "obtained_points" \
  from submits \
  where assignment_id = :assignment_id AND \
        participant_id = :participant_id';
  let binds = { ...req.query };
  try {
    let result = await database.execute(stmt, binds);
    res.status(200).json(result.rows ? result.rows[0] : null);
  } catch (err) {
    console.error("GetAssignment: " + err);
    res.status(200).json("GetAssignment: " + err);
  }
};

const evaluateAssignment = async (req, res) => {
  let stmt =
    "update submits \
  set obtained_points = :points \
  where participant_id = :participant_id";
  let binds = { ...req.body };
  try {
    await database.execute(stmt, binds);
    res.status(200).json("Successfully evaluated");
  } catch (err) {
    console.error("EvaluateAssignment: " + err);
    res.status(200).json("EvaluateAssignment: " + err);
  }
};

const deleteContent = async (req, res) => {
  let stmt =
    "delete from contents \
  where content_id = :content_id and content_for = :content_for";
  let binds = { ...req.query };
  try {
    await database.execute(stmt, binds);
    res.status(200).json("Deletion successful");
  } catch (err) {
    console.error("DeleteContent: " + err);
    res.status(200).json("DeleteContent: " + err);
  }
};

const getEvaluations = async (req, res) => {
  let stmt =
    'select distinct assignment_id as "assignment_id", \
          title as "assignment_title", \
          points as "total_points", \
          participant_id as "participant_id", \
          name as "participant_name", \
          assignment_obtained_points as "assignment_obtained_points" \
  from assignments natural join (select participant_id, \
                                        assignment_id, \
                                        sum(obtained_points) as assignment_obtained_points\
                                from assignments natural join submits\
                                group by participant_id, assignment_id) a JOIN users ON users.u_id = a.participant_id\
      natural join participates\
  where course_taken = :c_id';
  let binds = { ...req.query };
  try {
    let result = await database.execute(stmt, binds);
    let rows = [...result.rows];
    stmt =
      'select distinct quiz_id as "quiz_id", \
          title as "quiz_title", \
          total_points as "total_points", \
          participant_id as "participant_id", \
          name as "participant_name", \
          quiz_obtained_points as "quiz_obtained_points" \
  from quiz natural join (select participant_id, \
                                        quiz_id, \
                                        sum(obtained_points) as quiz_obtained_points\
                                from quiz natural join answers\
                                group by participant_id, quiz_id) a JOIN users ON users.u_id = a.participant_id\
      natural join participates\
  where course_taken = :c_id';
    result = await database.execute(stmt, binds);
    res.status(200).json({ assignments: rows, quiz: result.rows });
  } catch (err) {
    console.error("GetEvaluations: " + err);
    res.status(200).json("GetEvaluations: " + err);
  }
};

const getParticipants = async (req, res) => {
  let stmt =
    'select name as "participant_name",\
          u_id as "participant_id"\
   from participates join users on users.u_id = participates.participant_id\
   where course_taken = :c_id';
  let binds = { ...req.query };
  try {
    let result = await database.execute(stmt, binds);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("GetParticipants: " + err);
    res.status(200).json("GetParticipants: " + err);
  }
};

module.exports = {
  createdCourses,
  createCourse,
  enrolledCourses,
  enrollCourse,
  deleteCreated,
  deleteEnrolled,
  getCourseInfo,
  getContents,
  createContent,
  createQuiz,
  getQuizzes,
  getQuizQuestions,
  createAssignment,
  getAssignments,
  submitQuiz,
  getQuizSubmission,
  submitAssignment,
  getAssignmentSubmissions,
  getSubmission,
  evaluateAssignment,
  deleteContent,
  getEvaluations,
  getParticipants,
};
