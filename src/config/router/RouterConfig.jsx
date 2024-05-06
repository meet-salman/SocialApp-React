import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import Login from "../../screens/login/Login"
import Home from "../../screens/home/Home"
import Explore from "../../screens/explore/Explore";
import Profile from "../../screens/profile/Profile"
import ProfileSetting from "../../screens/profile-settings/ProfileSettings"
import Sidebar from "../../components/sidebar/Sidebar";
import ErrorPage from "../../screens/error-page/ErrorPage";

const RouterConfig = () => {


    const router = createBrowserRouter([

        { path: "/", element: <> <Sidebar /> <Home /> </>, errorElement: <ErrorPage /> },

        { path: "/explore", element: <> <Sidebar /> <Explore /> </>, errorElement: <ErrorPage /> },

        { path: "/notifications", element: <ErrorPage /> },

        { path: "/messages", element: <ErrorPage /> },

        { path: "/profile/:id", element: <> <Sidebar /> <Profile /> </>, errorElement: <ErrorPage /> },

        { path: "/profile-setting", element: <> <Sidebar /> <ProfileSetting /> </>, errorElement: <ErrorPage /> },

        { path: "/login", element: <Login />, errorElement: <ErrorPage /> },

    ]);


    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}

export default RouterConfig