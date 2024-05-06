import { useEffect, useState } from "react"
import { Link, NavLink, useParams } from "react-router-dom"

import app from "../../config/firebase/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { getData, signOutUser } from "../../config/firebase/firebaseMethods"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faBell, faEnvelope, faUser, faMagnifyingGlassPlus, faRightFromBracket } from "@fortawesome/free-solid-svg-icons"

import "./sidebar.css"
import Logo from "../../assets/logo.png"
import userImg from "../../assets/user.png"


const Sidebar = () => {

    const auth = getAuth(app);
    const [user, setUser] = useState();


    // Checking User LoggedIn OR LoggedOut
    useEffect(() => {

        onAuthStateChanged(auth, (user) => {
            if (user) {

                // Get User Data
                getData("users", "userUid", user.uid)
                    .then((res) => {
                        setUser(res);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        });
    }, []);


    // User LogOut Function
    const logout = () => {

        signOutUser()
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
    };

    return (
        <>

            <div className="sidebar flex flex-col justify-between">

                {/* Navigation */}
                <div>

                    {/* Logo */}
                    <div className="logo_box">
                        <Link to="/">
                            <img src={Logo} alt="logo" width={150} />
                            {/* <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold"> <span className="gr"> LOGO </span> </h1> */}
                        </Link>
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-col items-center lg:items-stretch gap-3">
                        <NavLink to="/" className={(e) => e.isActive ? "text-[--primary-color]" : "text-[--text-white]"}>
                            <li className="link"> <FontAwesomeIcon icon={faHouse} />  <span> Home </span></li>
                        </NavLink>
                        <NavLink to="/explore" className={(e) => e.isActive ? "text-[--primary-color]" : "text-[--text-white]"}>
                            <li className="link"> <FontAwesomeIcon icon={faMagnifyingGlassPlus} />  <span> Explore </span> </li>
                        </NavLink>
                        {/* <NavLink to="/notifications" className={(e) => e.isActive ? "text-[--primary-color]" : "text-[--text-white]"}>
                            <li className="link"> <FontAwesomeIcon icon={faBell} />  <span> Notifications </span> </li>
                        </NavLink> */}
                        {/* <NavLink to="/messages" className={(e) => e.isActive ? "text-[--primary-color]" : "text-[--text-white]"}>
                            <li className="link"> <FontAwesomeIcon icon={faEnvelope} />  <span> Messages </span> </li>
                        </NavLink> */}
                        <NavLink to={`/profile/${auth.currentUser?.uid}`} className={(e) => e.isActive ? "text-[--primary-color]" : "text-[--text-white]"}>
                            <li className="link"> <FontAwesomeIcon icon={faUser} />  <span> Profile </span> </li>
                        </NavLink>

                        {/* <Link onClick={logout}> */}
                        <Link onClick={logout}>
                            <li className="link text-[--text-white]"> <FontAwesomeIcon icon={faRightFromBracket} />  <span> Logout </span> </li>
                        </Link>
                        {/* </Link> */}
                    </div>

                </div>


                {/* Profile Short */}
                <div>
                    <Link to="/profile-setting">
                        <div className="image_box flex w-full gap-3">

                            {/* Profile Picture */}
                            <div className="w-[100%] flex justify-center lg:w-[20%]">
                                {user
                                    ?
                                    <img className="rounded-full h-10 w-10 object-cover" src={user.profileImg ? user.profileImg : userImg} alt="user-img" width={40} />
                                    :
                                    <img className="rounded-full" src={userImg} alt="" width={40} />
                                }
                            </div>

                            {/* UserName */}
                            <div className="lg:w-[80%]">
                                <p className="text-[--text-white]"> {user?.userName} </p>
                                <p className="text-[12px] text-[--text-accent]"> {user?.email} </p>
                            </div>
                        </div>
                    </Link>
                </div>

            </div>

        </>
    )
}

export default Sidebar