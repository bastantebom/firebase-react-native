import React, {useState, useContext} from 'react';
import {FlatList} from 'react-native';

import Post from '@/components/Post/Post';
import {UserContext} from '@/context/UserContext';
import {Context} from '@/context';
import {PostService} from '@/services';

const Posts = ({data, scrollState, setScrollState, type, isLoading}) => {
  const {user} = useContext(UserContext);
  const {setPosts, posts} = useContext(Context);
  const renderItem = ({item}) => (
    <Post data={item} type={type} isLoading={isLoading} />
  );

  const [refresh, setRefresh] = useState(false);
  const [lastPID, setLastPID] = useState('');

  const refreshPosts = async () => {
    setRefresh(true);

    let getPostsParams = {
      uid: user.uid,
      limit: 5,
    };

    await PostService.getPosts(getPostsParams)
      .then((res) => {
        setLastPID(res.last_id);
        setPosts(res.data);
        setRefresh(false);
      })
      .catch((err) => {
        setRefresh(false);
      });
  };

  const getMorePost = async () => {
    let getPostsParams = {
      uid: user.uid,
      limit: 5,
      last_pid: lastPID,
    };

    await PostService.getPosts(getPostsParams)
      .then((res) => {
        setLastPID(res.last_id);
        setPosts([...posts, ...res.data]);
        setRefresh(false);
      })
      .catch((err) => {
        setRefresh(false);
      });
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.post_id}
      onRefresh={refreshPosts}
      refreshing={refresh}
      onEndReached={getMorePost}
      onEndReachedThreshold={0.1}
    />
  );
};

export default Posts;
