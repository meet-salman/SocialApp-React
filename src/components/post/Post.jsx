import { useEffect, useState } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as liked } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp as like } from "@fortawesome/free-regular-svg-icons";

import app from "../../config/firebase/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getData, updateDocument } from "../../config/firebase/firebaseMethods";

import "./post.css"
import userImg from "../../assets/user.png"
import { useNavigate } from "react-router-dom";

const Post = ({ post, isProfile, index, toggleEditPost, toggleDeletePost }) => {

    const auth = getAuth(app);
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState();
    const [postUser, setPostUser] = useState();

    const [isLike, setIsLike] = useState(false);
    const [isFollow, setIsFollow] = useState(false);

    const [isShowMore, setIsShowMore] = useState(false);


    // Check Is Post Liked Or Not
    useEffect(() => {

        onAuthStateChanged(auth, (user) => {
            if (user) {

                // Get Current User Data
                getData("users", "userUid", user.uid)
                    .then((res) => {

                        setCurrentUser(res);

                        // Check Current User => Post Liked OR Not 
                        if (post.likes.includes(res.userUid)) {
                            setIsLike(true);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })


                // Get Post User Data
                getData("users", "userUid", post.userUid)
                    .then((res) => {
                        setPostUser(res);

                        // Check Current User => Follow PostUser OR Not
                        if (res.followers.includes(user.uid)) {
                            setIsFollow(true);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        });

    }, []);

    // See More & Less Post Content
    const toggleShowMore = () => {
        setIsShowMore(!isShowMore);
    };


    // Edit Post Toggle
    const setEditPost = () => {
        toggleEditPost(true, post.content, post.imageUrl, index);
    };


    // Follow & Unfollow User
    const followUser = () => {

        if (!isFollow) {

            let followers = postUser.followers;
            followers.push(currentUser.userUid);

            let following = currentUser.following;
            following.push(postUser.userUid);


            // Add Follower Post User In DB
            updateDocument({ followers: followers }, "users", postUser.docId)
                .then((res) => {

                    postUser.followers = followers;
                    setIsFollow(true);

                    // Add Following in CurrentUser DB
                    updateDocument({ following: following }, "users", currentUser.docId)

                })
                .catch((err) => {
                    console.log(err);
                })
        }
        else {

            let followers = postUser.followers;
            let idx = followers.indexOf(currentUser.userUid);
            followers.splice(idx, 1);

            let following = currentUser.following;
            let i = following.indexOf(currentUser.userUid)
            following.splice(i, 1);


            // Remove Follower Post User From DB
            updateDocument({ followers: followers }, "users", postUser.docId)
                .then((res) => {

                    postUser.followers = followers;
                    setIsFollow(false);

                    // Remove Following in CurrentUser DB
                    updateDocument({ following: following }, "users", currentUser.docId)
                })
                .catch((err) => {
                    console.log(err);
                })
        }

    };


    // Like Post
    const likePost = () => {

        let likes = post.likes;

        likes.push(auth.currentUser.uid);

        updateDocument({ likes: likes }, "posts", post.docId)
            .then((res) => {

                post.likes = likes;
                setIsLike(true);
            })
            .catch((err) => {
                console.log(err);
            })

    };


    // Unlike Post
    const unLikePost = () => {

        let likes = post.likes;
        let idx = likes.indexOf(auth.currentUser.uid);
        likes.splice(idx, 1);

        updateDocument({ likes: likes }, "posts", post.docId)
            .then((res) => {

                post.likes = likes;
                setIsLike(false);
            })
            .catch((err) => {
                console.log(err);
            })

    }

    const navigateToProfile = () => {
        navigate(`/profile/${post.userUid}`)
    }


    return (
        <>
            <div className="box">

                {/* User Details & Edit-Delete */}
                <div className="flex justify-between items-center">

                    {/* User Details */}
                    <div onClick={navigateToProfile} className="flex gap-3 cursor-pointer">

                        {/* Image */}
                        <div className=" object-cover">
                            {postUser?.profileImg
                                ?
                                <img className="rounded-full h-10 w-10 object-cover" src={postUser.profileImg} alt="user-img" />
                                :
                                <img className="rounded-full" src={userImg} alt="" width={40} />
                            }
                        </div>

                        {/* UserName & Post Date-Time */}
                        <div>
                            <p className="text-[--text-white]"> {postUser?.userName} </p>
                            <p className="text-[12px] text-[--text-accent]"> {post.dateTime} </p>
                        </div>

                    </div>

                    {/* Edit & Delete Buttons */}
                    {isProfile
                        ?
                        <div className="flex gap-3">
                            <button onClick={setEditPost} className="edit-btn"> Edit </button>
                            <button onClick={() => { toggleDeletePost(index) }} className="dlt-btn"> Delete </button>
                        </div>
                        :
                        currentUser?.userUid !== postUser?.userUid &&
                        <div>
                            <button onClick={followUser} className="text-[--secondary-color]"> {isFollow ? "Following" : "Follow"} </button>
                        </div>
                    }

                </div>


                {/* Post */}
                <div className="mt-6">

                    {/* Post Content */}
                    <div>
                        {
                            post.content.length > 100
                                ?
                                <p className="post-content">
                                    {isShowMore ? post.content : `${post.content.slice(0, 100)} ...`}
                                    &nbsp; &nbsp;
                                    <button onClick={toggleShowMore} className="seemore-btn"> {isShowMore ? "see less" : "see more"} </button>

                                </p>
                                :
                                <p className="post-content"> {post.content} </p>
                        }
                    </div>


                    {/* Post Image */}
                    <div className="mt-6">
                        {post?.imageUrl &&

                            < img className="rounded-lg" src={post.imageUrl} alt="image" />
                        }
                    </div>


                    {/* Like Post Button */}
                    <div className="flex items-center gap-3 mt-6 ps-3 text-xl text-[--text-white] border-t border-[--bg-accent]">
                        {isLike ?

                            <button onClick={unLikePost} className="mt-4"> <FontAwesomeIcon icon={liked} /> </button>
                            :
                            <button onClick={likePost} className="mt-4"> <FontAwesomeIcon icon={like} /> </button>
                        }

                        <p className="mt-4 text-[15px] text-[--text-accent]"> {post.likes.length} </p>
                    </div>


                </div>



            </div >
        </>
    )
}

export default Post