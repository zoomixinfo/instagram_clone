import React,{ useEffect, useState } from 'react';
import './App.css';
import Post from './Post';
import {db, auth} from './firebase'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUplaod from './ImageUplaod';
import InstagramEmbed from 'react-instagram-embed';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles()
  const [modalStyle] = React.useState(getModalStyle)
  const [posts, setPostes] = useState([])
  const [open, setOpen] = useState(false)
  const [openSignIn,setOpenSignIn] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  useEffect(()=>{
   const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if(authUser) {
        console.log(authUser);
        setUser(authUser)
        } else {
        setUser(null)
      }
    })
    return() =>{
      unsubscribe()
    }
  },[user, username])
  useEffect(()=>{
    //db.collection('postes').orderBy('timestamp','desc').onSnapshot
    db.collection('postes').onSnapshot(snapshot=>{
      setPostes(snapshot.docs.map(doc => ({
        id:doc.id,
        post:doc.data()
      })))
    })

  },[])
  const signUp = (event) =>{
    event.preventDefault()
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser) =>{
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message))
    setOpen(false)
  }
  const signIn = (event) =>{
    event.preventDefault()
    auth.signInWithEmailAndPassword(email,password)
    .catch((error) => alert(error.message))
    setOpenSignIn(false)
  }
  return (
    <div className="app">
    {
      user?.displayName ? (
        <ImageUplaod username={user.displayName}/>
      ):(
        <h1>Sorry need to login to upload</h1>
      )
    }
    
      <Modal open={open}
      onClose={()=>setOpen(false)}
      >
      <div style={modalStyle} className={classes.paper}>
      <center>
      <img className="app__headerImage" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png" alt="" />
      </center>  
      <form className="app__signUp">
      <Input placeholder="username" type="text" value={username} onChange={(e)=>
        setUsername(e.target.value)
      } />
      <Input placeholder="email" type="text" value={email} onChange={(e)=>
        setEmail(e.target.value)
      } />
      <Input placeholder="password" type="password" value={password} onChange={(e)=>
        setPassword(e.target.value)
      } />
      <Button type="submit" onClick={signUp}>Sign Up</Button>
      </form>
    </div> 
      </Modal>
      <Modal open={openSignIn}
      onClose={()=>setOpen(false)}
      >
      <div style={modalStyle} className={classes.paper}>
      <center>
      <img className="app__headerImage" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png" alt="" />
      </center>  
      <form className="app__signUp">
      <Input placeholder="email" type="text" value={email} onChange={(e)=>
        setEmail(e.target.value)
      } />
      <Input placeholder="password" type="password" value={password} onChange={(e)=>
        setPassword(e.target.value)
      } />
      <Button type="submit" onClick={signIn}>Sign In</Button>
      </form>
    </div> 
      </Modal>
      <div className="app__header">
        <img className="app__headerImage" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png" alt="" />
        {user ? (<Button onClick={()=> auth.signOut()}>Logout</Button>)
        :
        (
          <div className="app__loginContainer"> 
          <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>  
          <Button onClick={()=>setOpen(true)}>Sign Up</Button>  
          </div>
        )}
      </div>
      <div className="app__posts">
      <div className="app__postesLeft">
      {
        posts.map(({id,post})=>(
          <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
        ))
      }
      </div>
      <div className="app__postesRight">
      <InstagramEmbed
          url='https://instagr.am/p/Zw9o4/'
          clientAccessToken='123|456'
          maxWidth={320}
          hideCaption={false}
          containerTagName='div'
          protocol=''
          injectScript
          onLoading={() => {}}
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
      />
    </div>
    </div>
    </div>
  );
}

export default App;
