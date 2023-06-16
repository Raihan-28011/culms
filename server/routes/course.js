const express = require("express");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../client/public/upload");
  },
  filename: (req, file, cb) => {
    cb(null, `${req.query.prefix}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

const {
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
} = require("../controller/course");

const router = express.Router();
router.get("/created", createdCourses);
router.post("/create", createCourse);
router.get("/enrolled", enrolledCourses);
router.post("/enroll", enrollCourse);
router.delete("/created", deleteCreated);
router.delete("/enrolled", deleteEnrolled);
router.get("/info", getCourseInfo);
router.get("/contents", getContents);
router.post("/contents/create", createContent);
router.post("/quizzes/create", createQuiz);
router.get("/quizzes", getQuizzes);
router.get("/quizzes/questions", getQuizQuestions);
router.post("/assignments/create", createAssignment);
router.post(
  "/assignments/create/upload",
  upload.array("assg-attachments"),
  (req, res) => {
    console.log("Upload successful ");
  }
);
router.post("/assignments/submit", submitAssignment);
router.post(
  "/assignments/submit/upload",
  upload.array("assg-submits"),
  (req, res) => {
    console.log("Upload successful ");
  }
);
router.post("/assignments/submissions/evaluate", evaluateAssignment);
router.get("/assignments/submissions/all", getAssignmentSubmissions);
router.get("/assignments/submissions", getSubmission);
router.get("/assignments", getAssignments);
router.post("/quizzes/submit", submitQuiz);
router.get("/quizzes/submission", getQuizSubmission);
router.delete("/contents", deleteContent);
router.get("/evaluations", getEvaluations);
router.get("/participants", getParticipants);

module.exports = router;
