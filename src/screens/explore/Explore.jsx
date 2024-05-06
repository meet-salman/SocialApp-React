import { useEffect, useState } from 'react';

import app from "../../config/firebase/firebaseConfig";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getAllData } from '../../config/firebase/firebaseMethods';

import SmallLoader from '../../components/loader/SmallLoader';
import userImg from "../../assets/user.png"



// Posts List Render
const UsersList = ({ usersData }) => {

    return (
        <div>
            {
                usersData.length > 0
                    ?
                    usersData.map((user) => {
                        return <div key={user.userUid}>

                            <div className="flex gap-3 mb-8 pb-8 border-b border-[--bg-accent]">

                                {/* User Image */}
                                <div className="object-cover">
                                    {user.profileImg
                                        ?
                                        <img className="rounded-full h-10 w-10 object-cover" src={user.profileImg} alt="user-img" />
                                        :
                                        <img className="rounded-full" src={userImg} alt="" width={40} />
                                    }
                                </div>

                                {/* UserName */}
                                <div>
                                    <p className="text-[--text-white]"> {user.userName} </p>
                                    <p className="text-sm text-[--text-accent]"> {user.email} </p>
                                </div>

                            </div>

                        </div>
                    })
                    :
                    <div>
                        <span className="text-2xl text-[--gray]"> No users found... </span>
                    </div>
            }
        </div>
    );
};


const Explore = () => {

    const auth = getAuth(app);

    const [allUsers, setAllUsers] = useState([]);
    const [status, setStatus] = useState(<SmallLoader />);

    const [searchText, setSearchText] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);


    // Checking User LoggedIn OR LoggedOut
    useEffect(() => {

        onAuthStateChanged(auth, (user) => {
            if (user) {

                // Get All Users Data
                getAllData("users")
                    .then((res) => {
                        setAllUsers(res);
                    })
                    .catch((err) => {
                        setStatus("No users to show...");
                    })

            } else {
                navigate("/login")
            }

        });
    }, [])


    // Filter Search Users
    const searchUsers = (val) => {

        const searchResults = allUsers.filter(result =>

            result.userName.toLowerCase().includes(val.trim().toLowerCase())
        );

        val !== "" ? setFilteredUsers(searchResults) : setFilteredUsers([]);
    };

    // Handle Search Text
    const handleSearchChange = (e) => {

        setSearchText(e.target.value);
        searchUsers(e.target.value);
    };


    return (
        <>
            <div className="main-content">
                <h1 className='main-heading'> Search Users </h1>

                <div className='my-10'>
                    <input onChange={handleSearchChange} className='input-field' type="text" placeholder='search here...' />
                </div>

                <div >

                    {/* All Users Section */}
                    {allUsers.length > 0
                        ?
                        <div className='box flex flex-col'>

                            {searchText
                                ?
                                <UsersList usersData={filteredUsers} />
                                :
                                <UsersList usersData={allUsers} />
                            }

                        </div>
                        :
                        <div className="mt-20">
                            <span className="text-2xl text-[--gray]"> {status} </span>
                        </div>
                    }

                </div>


            </div>
        </>
    )
}

export default Explore