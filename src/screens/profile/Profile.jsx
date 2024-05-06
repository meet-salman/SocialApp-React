import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import app from "../../config/firebase/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { deleteDocument, getData, getDataInOrder, updateDocument, uploadFile } from '../../config/firebase/firebaseMethods';

import { v4 as uuidv4 } from 'uuid';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faXmark } from "@fortawesome/free-solid-svg-icons";

import Post from '../../components/post/Post';
import SmallLoader from "../../components/loader/SmallLoader"

import "./profile.css"
import userImg from "../../assets/user.png"




const Profile = () => {


  const auth = getAuth(app);
  const params = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState();
  const [userPosts, setUserPosts] = useState([]);
  const [isProfile, setIsProfile] = useState(false);

  const [idx, setIdx] = useState();
  const [status, setStatus] = useState(<SmallLoader />);

  const [isEdit, setIsEdit] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isContentEdit, setIsContentEdit] = useState(false);

  const [editedPostImage, setEditedPostImage] = useState(null);
  const [editedPostContent, setEditedPostContent] = useState("");

  const [showModal, setShowModal] = useState(false);



  // Checking User LoggedIn OR LoggedOut
  useEffect(() => {

    onAuthStateChanged(auth, (user) => {
      if (user) {

        // Get User Data
        getData("users", "userUid", params.id)
          .then((res) => {
            setUser(res);
            auth.currentUser.uid === params.id && setIsProfile(true);
          })
          .catch((err) => {
            console.log(err);
          })


        // Get User Posts
        getDataInOrder("posts", "userUid", params.id, "dateTime", "desc")
          .then((res) => {
            setUserPosts(res);
          })
          .catch((err) => {
            setStatus("No posts to show...")
            console.log("No Posts...");
          })

      } else {
        navigate("/login")
      }
    });
  }, []);


  // Delete Post
  const deletePost = () => {

    setIsDeleting(true);

    // Delete Document From DB
    deleteDocument("posts", userPosts[idx].docId)
      .then((res) => {

        userPosts.splice(idx, 1);

        userPosts.length > 0 && setStatus("No posts to show...")

        setIsDeleting(false);
        setShowModal(false);

      })
  };


  // Set Delete Post Dialog
  const toggleDeletePost = (i) => {

    setIdx(i);
    setShowModal(true);
  };


  // Edit Post in DB
  const editPost = (e) => {
    e.preventDefault();

    setIsEditing(true);

    let editedPost = {
      content: editedPostContent,
    }

    if (editedPostImage?.image) {

      // Upload Post Picture in Storage & Get URL
      uploadFile(`${auth.currentUser.uid} - ${uuidv4()}`, editedPostImage.image)
        .then((res) => {

          editedPost.imageUrl = res;

          updateDocument(editedPost, "posts", userPosts[idx].docId);

          userPosts[idx].content = editedPostContent;
          userPosts[idx].imageUrl = res;

          setEditedPostImage(null);
          setEditedPostContent("");
          setIsEdit(false);
          setIsEditing(false);

        })
        .catch((err) => {
          console.log(err);
        })
    }
    else {
      updateDocument(editedPost, "posts", userPosts[idx].docId);
      userPosts[idx].content = editedPostContent;

      setEditedPostImage(null);
      setEditedPostContent("");
      setIsEdit(false);
      setIsEditing(false);
    }

  };


  // Scroll Window
  const scrollWindow = function () {
    if (window.scrollY != 0) {
      setTimeout(function () {
        window.scrollTo(0, window.scrollY - 50);
        scrollWindow();
      }, 10);
    }
  };


  // Set Edit Post Content in Edit Section
  const toggleEditPost = (isEdit, content, image, i) => {

    setIdx(i);
    setIsEdit(isEdit);
    setEditedPostImage(image);
    setEditedPostContent(content);

    scrollWindow();
  };


  // Post image Handling
  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setEditedPostImage({
        image: file,
        url: URL.createObjectURL(file),
        name: file.name
      });

      setIsContentEdit(true);
    } else {
      setEditedPostImage(null);
    }
  };


  // Remove Post Image
  const handleRemoveImage = () => {
    setEditedPostImage(null);
  };



  return (
    <>

      <div className="main-content">

        <h1 className='main-heading'> {isProfile ? "My Profile" : "Profile"} </h1>


        <div className='flex flex-col xl:flex-row justify-between'>

          {/* Posts Section */}
          <div className='mt-10 xl:w-[60%] order-2 xl:order-1'>


            {/* Post Edit Section */}
            {isEdit &&

              <div className='post-input-section'>

                {/* Post Input */}
                <form onSubmit={editPost}>
                  <textarea onChange={(e) => { setEditedPostContent(e.target.value), setIsContentEdit(true) }} value={editedPostContent} className='post-input' name="" rows={1} placeholder="What's in your mind?"></textarea>

                  {/* Image selection */}
                  <div className="select-img-btn mt-4">
                    <label>
                      <span className='flex gap-3'>
                        <FontAwesomeIcon icon={faPaperclip} />
                        <p className='text-sm'> Upload image </p>
                      </span>
                      <input hidden type="file" onChange={handleImageChange} />
                    </label>
                  </div>

                  {/* Preview image */}
                  <div className="flex">
                    {editedPostImage && (
                      <div className="selected-img-preview">
                        <img src={editedPostImage.url ? editedPostImage.url : editedPostImage} alt={editedPostImage.name} className="selected-img" />
                        <button onClick={handleRemoveImage} className="cancel-img-btn"><span className="mx-auto"> <FontAwesomeIcon icon={faXmark} /> </span> </button>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className={`mt-6 text-end gap-3`}>
                    <button onClick={() => { setIsEdit(false), setIsContentEdit(false) }} type='submit' className='btn'> Cancel </button>
                    <button type='submit' className={`btn-b ml-3 ${!isContentEdit && "hidden"}`}> {isEditing ? <SmallLoader /> : "Edit"} </button>
                  </div>

                </form>

              </div>
            }



            {/* User Posts */}
            <div>
              {
                userPosts.length > 0
                  ?
                  userPosts.map((post, i) => {
                    return <Post key={post.docId} post={post} isProfile={isProfile} toggleEditPost={toggleEditPost} toggleDeletePost={toggleDeletePost} index={i} />
                  })
                  :
                  <div className='mt-20'>
                    <span className='text-2xl text-[--gray]'> {status} </span>
                  </div>

              }
            </div>

          </div>


          {/* Side Content */}
          <div className='mt-10 order-1 xl:order-2'>

            {/* Profile Image */}
            <div className='object-fill'>
              {user
                ?
                <img className="rounded-full h-60 w-60 object-cover" src={user.profileImg ? user.profileImg : userImg} alt="user-img" />
                :
                <img className="rounded-full" src={userImg} alt="" width={40} />
              }
            </div>

            {/* UserName & Email */}
            <div className='mt-8'>
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


        {/* Post Delete Modal */}
        {showModal &&
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50" >

              <div className="w-[500px] mx-auto p-5 rounded-lg bg-[--bg-accent]">

                {/* Heading */}
                <div>
                  <h3 className="heading"> Delete Post </h3>
                </div>

                {/* Message */}
                <div>
                  <p className="mt-4 text-[--text-accent]"> Are you sure to delete the post? </p>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-5 mt-8">

                  <button onClick={() => setShowModal(false)} className='text-[--primary-color]'> Close </button>
                  <button onClick={deletePost} className='btn-b'> {isDeleting ? <SmallLoader /> : "Delete"} </button>

                </div>

              </div>

            </div>

            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        }




      </div >

    </>
  )
}

export default Profile