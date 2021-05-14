import React,{useEffect, useState} from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "./firebase";
import firebase from 'firebase'

function Post({postId,user,username, caption, imageUrl}) {
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState('')
  useEffect(() =>{
    let unsubscribe;
    if(postId) {
      unsubscribe = db.collection("postes")
      .doc(postId)
      .collection("comments")
      .orderBy('timestamp','desc')
      .onSnapshot((snapshot) =>{
        setComments(snapshot.docs.map((doc) => doc.data()))
      })
    }
    return()=>{
      unsubscribe()
    }
  },[postId])
  const postComment = (event) => {
    event.preventDefault()
    db.collection("postes").doc(postId).collection("comments")
    .add({
      text:comment,
      username:user.displayName,
      timestamp:firebase.firestore.FieldValue.serverTimestamp()
    })
    setComment('')
  }
  return (
    
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          src="https://yt3.ggpht.com/ytc/AAUvwnirWIg51aWMS1NZHuugFvb4wBmI-bg19TBKaIhypw=s900-c-k-c0x00ffffff-no-rj"
          alt=""
        />
        <h3>{username}</h3>
      </div>
      <img
        className="post__image"
        src={imageUrl} alt={username}
      />
      <h4 className="post__text">
        <strong>{username} :</strong> {caption}
      </h4>
      <div className="post__comments">
        {comments.map((comment)=>(
          <p>
            <strong>{comment.username}</strong> {comment.text}
          </p>
        ))}
      </div>
      {
        user && (
          <form className="post__commentBox">
          <input
          className="post__input"
          type="text"
          placeholder="Add a comment.."
          value={comment}
          onChange={(e) => setComment(e.target.value)} />
          <button 
            disabled={!comment}
            className="post__button"
            type="submit"
            onClick={postComment}>Post</button>
        </form>
      
        )
      }
      </div>  
  );
}

export default Post;
