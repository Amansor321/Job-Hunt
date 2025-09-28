import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
// import { Home } from 'lucide-react'
import Home from "./components/Home";
import Signup from "./components/Signup";
import Jobs from "./components/Jobs";
import Browse from "./components/Browse";
import Profile from "./components/Profile";
import JobDescription from "./components/JobDescription";
import Companies from "./components/company/Companies";
import CompanyCreate from "./components/company/CompanyCreate";
import AdminJobs from "./components/company/AdminJobs";
import CompanySetup from "./components/company/CompanySetup";
import PostJob from "./components/company/PostJob";
import Applicants from "./components/company/Applicants";
import ProtectedRoute from "./components/company/ProtectedRoute";
const appRouter = createBrowserRouter([
  { path: "/", element: <Home /> },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/jobs",
    element: <Jobs />,
  },
  {
    path: "/description/:id",
    element: <JobDescription />,
  },

  {
    path: "/browse",
    element: <Browse />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },


  {
    path:"/admin/companies",
    element: <ProtectedRoute><Companies/></ProtectedRoute> 
  },{
    path:"/admin/companies/create",
    element:<CompanyCreate/>
  },{
    path:"/admin/companies/:id",
    element:<CompanySetup/>
  },

  {
    path:"/admin/jobs",
    element:<AdminJobs/>
  },{
    path:"/admin/jobs/create",
    element:<PostJob/>
  },{
    path:"/admin/jobs/:id/applicants",
    element:<Applicants/>
  }
]);
function App() {
  return (
    <>
      <RouterProvider router={appRouter}></RouterProvider>
    </>
  );
}

export default App;
