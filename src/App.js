import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { auth, db } from './firebase'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle(){
  const top = 50;
  const left = 50;

  return{
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%`,
  }
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
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        // user has logged in...
        console.log(authUser);
        setUser(authUser);
      }else{
        // user has logged out...
        setUser(null);
      }
    })

    return () => {
      // perform some cleanup actions
      unsubscribe();
    }
  }, [user, username]);

  // useEffect > Runs a piece of code based on specific condition
  useEffect(() => {
    // Google firebase 에 posts로 저장되어 있기에 posts collection 을 가져온다.
    db.collection('posts').onSnapshot(snapshot => {
      // onSnapshot은 Google firebase의 데이터가 변경될 때마다 실시간으로 데이터를 받아올 수 있게 한다.
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);
      // [] 가 비어 있는 것은 처음 한번 수행한다는 의미. 
      // 안에 [posts] 로 되어 있다면 posts 데이터가 변경될 때마다 실시간으로 계속 수행 된다.

  const signUp = (event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
    .signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message));

    setOpenSignIn(false);
  }

  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                className="app_headerImage"
                src="https://www.themuseatdreyfoos.com/wp-content/uploads/2016/03/Zootopia-logo-900x450.jpg"
                alt=""
              />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <Button type="submit" onClick={signUp}>SignUp</Button>
            
          </form>
        </div> 
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                className="app_headerImage"
                src="https://www.themuseatdreyfoos.com/wp-content/uploads/2016/03/Zootopia-logo-900x450.jpg"
                alt=""
              />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <Button type="submit" onClick={signIn}>SignIn</Button>
            
          </form>
        </div> 
      </Modal>
      
      <div className="app_header">
        <img
          className="app_headerImage"
          src="https://www.themuseatdreyfoos.com/wp-content/uploads/2016/03/Zootopia-logo-900x450.jpg"
          alt=""
        />
        {user ? (
          <Button onClick={() => auth.signOut()} >Logout</Button>        
        ): (
          <div className="app_loginContainer">
            <Button onClick={() => setOpenSignIn(true)} >Sign In</Button>
            <Button onClick={() => setOpen(true)} >Sign Up</Button>
          </div>        
        )}   
      </div>

      <div className="app_posts">
        <div className="app_postsLeft">
          {
            posts.map( ({id, post}) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
            ))
          }
        </div>
        <div className="app_postsRight">
          <InstagramEmbed
            url='https://www.instagram.com/p/B_uf9dmAGPw/'
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
      
      

      {user?.displayName ? (
        <ImageUpload username={user.displayName}/>
      ): (
        <h3>로그인이 필요한 서비스입니다. 로그인을 해주세요</h3>
      )}

      {/* Posts */}
      {/* Posts */}
    </div>
  );
}

export default App;
