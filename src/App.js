import React, { useState, useEffect } from 'react';
import './App.css';
import { auth } from './firebase'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import MatchList from './MatchList';
import Intro from './Intro';

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

  const signUp = (event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
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
            
            <Button type="submit" onClick={signIn}>Sign In</Button>
            
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
            <Button onClick={() => setOpenSignIn(true)} >LogIn</Button>
            <Button onClick={() => setOpen(true)} >Sign Up</Button>
          </div>        
        )}   
      </div>
      {user ? (
        <MatchList user={user} displayName={user.displayName}/>
      ) : (
        <Intro />
      )
      }
      
      {user?.displayName ? (
            <ImageUpload username={user.displayName} method="posts"/>
        ): (
            <div></div>
        )
      }
    </div>
  );
}

export default App;
