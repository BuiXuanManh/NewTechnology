import LoginForm from "../pages/Login/LoginForm";
import Main from "../pages/Home/MainHome";
import Contact from "../pages/Contact/Contact";
import Todo from "../pages/Todo/Todo";
import Message from "../pages/Message/Message";
import OtherMessage from "../pages/Message/OtherMessage";
import Sidebar from "../layouts/dashboard/Sidebar/Sidebar";

import { Suspense, lazy, useEffect, useState } from "react";
import { Navigate, useLocation, useRoutes } from "react-router-dom";
// layouts
import DashboardLayout from "../layouts/dashboard/DashboardLayout";
import AuthLayout from "../layouts/auth";
// config
import { DEFAULT_PATH } from "../config";
import LoadingScreen from "../components/LoadingScreen";
import SearchBox from "../components/SearchBox";
import Conversation from "../components/Conversation";
import DetailContact from "../components/DetailContact";
<<<<<<< HEAD
import FriendRequest from "../components/FriendRequest";
import Cookies from "js-cookie";
import FriendList from "../components/FriendList";
import LoginService from "../services/LoginService";

import PasswordForm from "../pages/Login/PasswordForm";
import ChangePasswordForm from "../pages/Login/ChangePasswordForm ";
import RegisterForm from "../pages/Login/RegisterForm";
import useLoginData from "../hook/useLoginData";
import ChatService from "../services/ChatService";
import useTabs from "../hook/useTabs";
<<<<<<< HEAD
import CallVideo from "../components/callVideo/CallVideo";
import ResultSearchMessage from "../pages/Message/ResultSearchMessage";
=======
=======
import PasswordForm from "../pages/Login/PasswordForm";
const Loadable = (Component) => (props) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};


>>>>>>> 5a67067dd7065df99ba946bb860f23a807820286
>>>>>>> eed874b4e83a34235056f301b976f89550dda49c

export default function Router() {
  function handleComp() {
    setComp(<DetailContact />)
  }
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState({});
  useLoginData({ token, setToken, setProfile, setPhone });
  const [comp, setComp] = useState(<Conversation />)
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/app") {
      setComp(<Conversation />);
    }
    else if (location.pathname === "/contact") {
      setComp(<FriendList />);
    }
  }, [location.pathname]);

  return useRoutes([
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        { path: "login", element: <LoginForm /> },
<<<<<<< HEAD
        { path: "register/:phoneP", element: <RegisterForm /> },
        { path: "forgot-password/:phoneP", element: <PasswordForm /> }, // Thêm PasswordForm vào routing
<<<<<<< HEAD
        { path: "change-password/:phoneP", element: <ChangePasswordForm /> },
        { path: "callVideo", element: <CallVideo /> },
=======
        { path: "change-password/:phoneP", element: <ChangePasswordForm /> }
=======
        { path: "forgot-password", element: <PasswordForm /> } // Thêm PasswordForm vào routing
>>>>>>> 5a67067dd7065df99ba946bb860f23a807820286
>>>>>>> eed874b4e83a34235056f301b976f89550dda49c
      ],
    },
    {
      path: "/",
      element: <DashboardLayout component={comp}></DashboardLayout>,
      children: [
        { element: <Navigate to={DEFAULT_PATH} replace />, index: true },
        {
          path: "/app",
          element: <SearchBox />,
          children: [
            { path: "", element: <Message /> },
            { path: "other-message", element: <OtherMessage /> },
          ],
        },
        {
          path: "/app",
          element: <Conversation />,
          children: [
            { path: "", element: <ResultSearchMessage />},
          ],
        },
        { path: "/contact", element: [<SearchBox />, <Contact setComp={setComp} />], },
        { path: "todo", element: <Todo /> },

      ],
    }
  ]);
}

