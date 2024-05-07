import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { v4 as uuidv4 } from 'uuid';

import app from "../../config/firebase/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getData, updateDocument, uploadFile } from "../../config/firebase/firebaseMethods";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";

import SmallLoader from "../../components/loader/SmallLoader"

import userImg from "../../assets/user.png"
import Alert from "../../components/alert/Alert";

const ProfileSettings = () => {

    const auth = getAuth(app);
    const navigate = useNavigate();

    const [user, setUser] = useState();

    const [editedProfileImage, setEditedProfileImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");

    const [isAlert, setIsAlert] = useState(false);
    const [alertSuccess, setAlertSuccess] = useState(true);
    const [alertMsg, setAlertMsg] = useState("");


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

            } else {
                navigate("/login")
            }
        });
    }, [])


    // Profile image Handling
    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            setEditedProfileImage({
                image: file,
                url: URL.createObjectURL(file),
                name: file.name
            });
        } else {
            setEditedProfileImage(null);
        }
    };


    // Edit User
    const editUser = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        let editedUser = {
            userName: data.get('userName'),
            email: data.get('email'),
            contact: data.get('contact')
        }

        if (editedUser.userName.trim() === "") {

            setError("Name is Required");
            return;
        }
        if (editedUser.email === "") {

            setError("Email is Required");
            return;
        }

        // Updating Profile data
        if (editedProfileImage) {
            setIsEditing(true);

            // Upload Profile Picture in Storage & Get URL
            uploadFile(`${auth.currentUser.uid} - ${uuidv4()}`, editedProfileImage.image)
                .then((res) => {

                    editedUser.profileImg = res;

                    updateDocument(editedUser, "users", user.docId);

                    let copyUser = user;
                    copyUser.userName = editedUser.userName;
                    copyUser.email = editedUser.email;
                    copyUser.contact = editedUser.contact;
                    copyUser.profileImg = res;

                    setUser(copyUser);
                    setEditedProfileImage(null);
                    setIsEditing(false);

                    setIsAlert(true);
                    setAlertSuccess(true);
                    setAlertMsg("Profile Edit Successfully!");

                    setTimeout(() => {
                        setIsAlert(false);
                    }, 1500);
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        else {
            setIsEditing(true);

            updateDocument(editedUser, "users", user.docId)
                .then((res) => {

                    let copyUser = user;
                    copyUser.userName = editedUser.userName;
                    copyUser.email = editedUser.email;
                    copyUser.contact = editedUser.contact;

                    setUser(copyUser);
                    setIsEditing(false);

                    setIsAlert(true);
                    setAlertSuccess(true);
                    setAlertMsg("Profile Edit Successfully!");

                    setTimeout(() => {
                        setIsAlert(false);
                    }, 1500);
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    };


    return (
        <>
            <div className="main-content">
                <h1 className='main-heading'> Profile Settings </h1>


                {/* Side Content */}
                <div className='my-10 flex items-center gap-8'>

                    {/* Profile Image */}
                    <div>
                        <div className='object-fill'>
                            {user &&

                                <img className="rounded-full h-28 w-28 object-cover" src={!editedProfileImage ? user.profileImg ? user.profileImg : userImg : editedProfileImage.url} alt="user-img" />

                            }
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div>
                        {/* UserName & Email */}
                        <div>
                            <h1 className='heading text-white'> {user?.userName} </h1>
                            <p className='text-sm text-[--text-accent]'> {user?.email} </p>
                        </div>

                        {/* Folowwers & FOllowing */}
                        <div className='mt-2 flex gap-5'>
                            <p className='text-sm text-[--text-accent]'> {user?.followers.length} Followers </p>
                            <p className='text-sm text-[--text-accent]'> {user?.following.length} Following </p>
                        </div>
                    </div>

                </div>


                {/* Profile Settings */}
                <div>

                    <form onSubmit={editUser}>

                        <div className="flex flex-col gap-5">
                            <div>
                                <input className="input-field" name="userName" type="text" placeholder="Full Name" onChange={() => { setError("") }} />
                            </div>
                            <div>
                                <input className="input-field" name="email" type="email" placeholder="Email Address" onChange={() => { setError("") }} />
                            </div>
                            <div>
                                <input className="input-field" name="contact" type="number" placeholder="Contact No" onChange={() => { setError("") }} />
                            </div>

                        </div>

                        {/* Error Message */}
                        <div>
                            {error && <p className="error"> {error} </p>}
                        </div>


                        {/* Image selection */}
                        <div className="select-img-btn my-6">
                            <label>
                                <span className='flex gap-3'>
                                    <FontAwesomeIcon icon={faPaperclip} />
                                    <p className='text-sm'> Upload image </p>
                                </span>
                                <input hidden name="profileImg" type="file" onChange={handleImageChange} />
                            </label>
                        </div>

                        <div>
                            <button className="btn-b" type="submit"> {isEditing ? <SmallLoader /> : "Update"} </button>
                        </div>

                    </form>

                </div>




            </div >

            <Alert isAlert={isAlert} alertSuccess={alertSuccess} alertMsg={alertMsg} />

        </>
    )
}

export default ProfileSettings