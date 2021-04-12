import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db } from './firebase'


function MatchList({user}) {
  const [posts, setPosts] = useState([]);

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

  return (
    <div>

      <div className="app_posts">
        <div className="app_postsLeft">
          {
            posts.map( ({id, post}) => (
              <Post key={id} postId={id} user={user} postusername={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
            ))
          }
        </div>
        
      </div>
    </div>
  );
}

export default MatchList;
