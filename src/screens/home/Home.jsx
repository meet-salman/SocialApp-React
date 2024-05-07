import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";

import app from "../../config/firebase/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { addData, getAllData, getData, updateDocument, uploadFile } from "../../config/firebase/firebaseMethods";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faL, faMagnifyingGlass, faPaperclip, faXmark } from "@fortawesome/free-solid-svg-icons";

import "./home.css"
import userImg from "../../assets/user.png"

import Post from "../../components/post/Post";
import SmallLoader from "../../components/loader/SmallLoader"
import Alert from "../../components/alert/Alert";


// Posts List Render
const PostsList = ({ postsData }) => {

  return (
    <div>
      {postsData.length
        ?
        postsData.map((post) => {
          return <Post key={post.docId} post={post} />
        })
        :
        <div>
          <span className="text-2xl text-[--gray]"> No posts found... </span>
        </div>
      }
    </div>
  );
};


const Home = () => {

  const auth = getAuth(app);
  const navigate = useNavigate();

  const [user, setUser] = useState();
  const [allPosts, setAllPosts] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  const [postIimage, setPostImage] = useState(null);
  const [postContent, setPostContent] = useState("");

  const [isPosting, setIsPosting] = useState(false);
  const [status, setStatus] = useState(<SmallLoader />);

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


        // Get Posts Data
        getAllData("posts")
          .then((res) => {
            setAllPosts(res);
          })
          .catch((err) => {
            setStatus("No posts to show...")
          })

      } else {
        navigate("/login")
      }

    });
  }, [])


  // Time & Date Function
  let formattedDateTime = getCurrentDateTime();
  function getCurrentDateTime() {

    let now = new Date();

    let hour = now.getHours();
    let minute = now.getMinutes();
    let period = (hour >= 12) ? "PM" : "AM";
    hour = (hour % 12) || 12;

    minute = (minute < 10 ? "0" : "") + minute;

    let day = now.getDate();
    let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let month = monthNames[now.getMonth()];
    let year = now.getFullYear();

    let dateTimeString = `${hour}:${minute} ${period} - ${day}, ${month}, ${year}`;

    return dateTimeString;
  }


  // Upload Post in DB
  const createPost = (e) => {
    e.preventDefault();

    setIsPosting(true);

    let post = {
      content: postContent,
      dateTime: formattedDateTime,
      likes: [],
      userUid: user.userUid
    }

    if (postIimage) {

      // Upload Post Picture in Storage & Get URL
      uploadFile(`${auth.currentUser.uid} - ${uuidv4()}`, postIimage?.image)
        .then((res) => {

          post.imageUrl = res;

          // Add Post in DB With Image URL
          addData(post, "posts")
            .then((res) => {
              console.log(res);

              let copyAllPosts = allPosts;
              copyAllPosts.unshift(post);
              setAllPosts(copyAllPosts);

              setPostImage(null);
              setPostContent("");
              setIsPosting(false);

              setIsAlert(true);
              setAlertSuccess(true);
              setAlertMsg("Post Publish Successfully!");

              setTimeout(() => {
                setIsAlert(false);
              }, 1500);
            })
            .catch((err) => {
              console.log(err);
            })
        })
        .catch((err) => {
          console.log(err);
        })
    }
    else {
      // Add Post in DB WithOut Image 
      addData(post, "posts")
        .then((res) => {
          console.log(res);

          let copyAllPosts = allPosts;
          copyAllPosts.unshift(post);
          setAllPosts(copyAllPosts);

          setPostImage(null);
          setPostContent("");
          setIsPosting(false);

          setIsAlert(true);
          setAlertSuccess(true);
          setAlertMsg("Post Publish Successfully!");

          setTimeout(() => {
            setIsAlert(false);
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
        })
    }

  };


  // Post image Handling
  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setPostImage({
        image: file,
        url: URL.createObjectURL(file),
        name: file.name
      });
    } else {
      setPostImage(null);
    }
  };


  // Remove Post Image
  const handleRemoveImage = () => {
    setPostImage(null);
  };


  // Filter Search Posts
  const searchPosts = (val) => {

    const searchResults = allPosts.filter(result =>

      result.content.toLowerCase().includes(val.trim().toLowerCase())
    );

    val !== "" ? setFilteredPosts(searchResults) : setFilteredPosts([]);
  };

  // Handle Search Text
  const handleSearchChange = (e) => {

    setSearchText(e.target.value);
    searchPosts(e.target.value);
  };



  return (
    <>
      <div className="main-content" >

        <div className="lg:flex lg:justify-between">
          <h1 className="main-heading mb-8 lg:mb-0"> News Feed </h1>


          {/* Search Posts */}
          <div>
            <div className="relative">

              {/* Search Input */}
              <div>
                <input onChange={handleSearchChange} className="input-field" type="text" placeholder="search here" />
              </div>

              {/* Search Icon */}
              <div className="search-icon">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </div>
            </div>
          </div>

        </div>


        {/* Post Upload Section */}
        < div className="post-input-section">

          {/* Post Input */}
          <form onSubmit={createPost}>
            <textarea onChange={(e) => { setPostContent(e.target.value) }} value={postContent} className="post-input mb-4" name="" rows={1} placeholder="What's in your mind?"></textarea>

            {/* Image selection */}
            <div className="select-img-btn">
              <label>
                <span className="flex gap-3">
                  <FontAwesomeIcon icon={faPaperclip} />
                  <p className="text-sm"> Upload image </p>
                </span>
                <input hidden type="file" onChange={handleImageChange} />
              </label>
            </div>

            {/* Preview image */}
            <div className="flex">
              {postIimage && (
                <div className="selected-img-preview">
                  <img src={postIimage.url} alt={postIimage.name} className="selected-img" />
                  <button onClick={handleRemoveImage} className="cancel-img-btn"><span className="mx-auto"> <FontAwesomeIcon icon={faXmark} /> </span> </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className={`mt-6 text-end ${!postContent && "hidden"}`}>
              <button type="submit" className="btn"> {isPosting ? <SmallLoader /> : "Post"} </button>
            </div>


          </form>

        </div>



        {/* All Posts Section */}
        {allPosts.length > 0
          ?

          searchText
            ?
            < PostsList postsData={filteredPosts} />
            :
            <PostsList postsData={allPosts} />

          :
          <div className="mt-20">
            <span className="text-2xl text-[--gray]"> {status} </span>
          </div>
        }


      </div >

      <Alert isAlert={isAlert} alertSuccess={alertSuccess} alertMsg={alertMsg} />
    </>

  )
}

export default Home