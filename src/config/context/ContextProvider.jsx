import { useEffect, useState } from 'react'

import app from "../firebase/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getAllData, getData } from '../firebase/firebaseMethods';

import Context from './context'


const ContextProvider = ({ children }) => {

    const [user, setUser] = useState();
    const [allPosts, setAllPosts] = useState([]);



    // Checking User LoggedIn OR LoggedOut
    // useEffect(() => {

    //     if (user) {

    //         // Get Posts Data
    //         getAllData("posts")
    //             .then((res) => {

    //                 console.log(res);
    //                 setAllPosts(res);
    //             })
    //             .catch((err) => {
    //                 setStatus("No posts to show...")
    //                 console.log("No Posts...");
    //             })
    //     }

    // }, [user])


    return (
        <>
            <Context.Provider value={{ user, setUser, allPosts, setAllPosts }}>
                {children}
            </Context.Provider>
        </>
    )
}

export default ContextProvider;