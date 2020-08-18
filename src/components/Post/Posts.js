import React, {useState, useContext, useEffect} from 'react';
import {FlatList, View, ActivityIndicator} from 'react-native';

import Post from '@/components/Post/Post';
import {UserContext} from '@/context/UserContext';
import {Context} from '@/context';
import {PostService} from '@/services';
import {AppText} from '@/components';

const Posts = ({data, type, isLoading, setIsLoading}) => {
  const {user} = useContext(UserContext);
  const {setPosts, posts} = useContext(Context);
  const renderItem = ({item}) => (
    <Post data={item} type={type} isLoading={isLoading} />
  );

  const [refresh, setRefresh] = useState(false);
  const [lastPID, setLastPID] = useState('');
  const [fetchMore, setFecthMore] = useState(false);

  // useEffect(async () => {
  //   let getPostsParams = {
  //     uid: user.uid,
  //     limit: 5,
  //   };
  //   await PostService.getPosts(getPostsParams)
  //     .then((res) => {
  //       setLastPID(res.last_id);
  //       setPosts(res.data);
  //       setIsLoading(false);
  //     })
  //     .catch((err) => {
  //       setRefresh(false);
  //     });
  // }, []);

  useEffect(() => {
    refreshPosts().then(() => {
      setIsLoading(false);
    });
  }, []);

  const refreshPosts = async () => {
    setRefresh(true);

    let getPostsParams = {
      uid: user.uid,
      limit: 5,
    };

    await PostService.getPosts(getPostsParams)
      .then((res) => {
        setLastPID(res.last_id);
        if (res.data.length > 0) setPosts(res.data);
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
        const setLast = new Promise((resolve, reject) => {
          if (res.last_id === '') reject('No last ID');
          else resolve(res.last_id);
        });

        setLastPID(setLast);

        setFecthMore(false);
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
      ListFooterComponent={
        <View>
          {fetchMore ? <ActivityIndicator /> : <AppText>Fetch more </AppText>}
        </View>
      }
    />
  );
};

export default Posts;
