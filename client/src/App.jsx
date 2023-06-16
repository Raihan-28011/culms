import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./App.css";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import UserHome from "./pages/UserHome";
import Dashboard from "./pages/Dashboard";
import CoursePage from "./pages/CoursePage";
import ContentPage from "./pages/ContentPage";
import CourseAboutPage from "./pages/CourseAboutPage";
import QuizPage from "./pages/QuizPage";
import CreateQuizPage from "./pages/CreateQuizPage";
import AssignmentPage from "./pages/AssignmentPage";
import CreateAssignmentPage from "./pages/CreateAssignmentPage";
import AssignmentSubmissions from "./pages/AssignmentSubmissions";
import Evaluations from "./pages/Evaluations";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Signup />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/users/:id",
    element: <UserHome />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "courses/:c_id",
        element: <CoursePage />,
        children: [
          {
            path: "",
            element: <CourseAboutPage />,
          },
          {
            path: "contents/:content_id",
            element: <ContentPage />,
          },
          {
            path: "quizzes/:quiz_id",
            element: <QuizPage />,
          },
          {
            path: "quizzes/create",
            element: <CreateQuizPage />,
          },
          {
            path: "assignments/:assignment_id",
            element: <AssignmentPage />,
          },
          {
            path: "assignments/create",
            element: <CreateAssignmentPage />,
          },
          {
            path: "assignments/:assignment_id/submissions/",
            element: <AssignmentSubmissions />,
          },
          {
            path: "evaluations",
            element: <Evaluations />,
          },
        ],
      },
      // {
      //   path: "courses/:c_id/contents/:content_id",
      //   element: <ContentPage />,
      // },
    ],
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
