import React, { useContext } from 'react'
import { useState,useEffect } from 'react'
import {MoreVert} from '@mui/icons-material';
import './post.css'
import axios from "axios";
import {format} from "timeago.js";
import { Link } from 'react-router-dom';
import {AuthContext} from '../../context/AuthContext';


export default function Post({post}) {
    const [like,setlike]=useState(post.likes.length);
    const [isliked,setisliked]=useState(false);
    const [user,setuser] = useState({});
    const {user:curuser} = useContext(AuthContext);

    useEffect(()=>{
        setisliked(post.likes.includes(curuser._id));
    },[curuser._id,post.likes]);

    useEffect(()=>{
        try{
            const fetchUsers = async()=>{
                const res=await axios.get(`/users?userId=${post.userId}`);
                setuser(res.data);
            }
            fetchUsers();
        }
        catch(err){
            console.log(err);
        }
    },[post.userId]);
    // console.log(user);
    const PF=process.env.REACT_APP_PUBLIC_FOLDER;
    const likeHandler=()=>{
        try{
            axios.put("/posts/"+post._id+"/like",{userId:curuser._id});
        }
        catch(err){
            console.log(err);
        }
        setlike(isliked?like-1:like+1);
        setisliked(!isliked);
    }
    return(
        <div className="post">
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <Link to={`/profile/${user.username}`}>
                            <img src={`${PF}${user.profilePicture||"person/noavatar.webp"}`} alt="" className="postProfileImg" />
                        </Link>
                        <span className="postUsername">{user.username}</span>
                        <span className="postDate">{format(post.createdAt)}</span>
                    </div>
                    <div className="postTopRight">
                        <MoreVert/>
                    </div>
                </div>
                <div className="postCenter">
                    <span className="postText">{post?.desc}</span>
                    <img src={PF+post.img} alt="" className="postImg" />
                </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                        <img src={`${PF}like.png`} alt="" className="likeIcon"  onClick={likeHandler}/>
                        <img src={`${PF}heart.png`} alt="" className="likeIcon" onClick={likeHandler} />
                        <span className="postLikeCounter">{like} people liked this post</span>
                    </div>
                    <div className="postBottomRight">
                        <span className="postCommentText">{post.comment} comments</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
