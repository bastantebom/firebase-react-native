import React, {useState, useContext, useEffect} from 'react';
import {FlatList, View, ActivityIndicator} from 'react-native';

import Post from '@/components/Post/Post';
import {UserContext} from '@/context/UserContext';
import {Context} from '@/context';
import {PostService} from '@/services';
import {AppText} from '@/components';
import {set} from 'react-native-reanimated';

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
        setLastPID(res.last_pid);
        if (res.data.length > 0) setPosts(res.data);
        setRefresh(false);
      })
      .catch((err) => {
        setRefresh(false);
      });
  };

  const getMorePost = async () => {
    console.log('GET MORE POST');
    console.log(lastPID);

    let getPostsParams = {
      uid: user.uid,
      limit: 5,
      last_pid: lastPID,
    };

    await PostService.getPosts(getPostsParams)
      .then((res) => {
        if (res.lastPID === lastPID) {
          console.log("rejecting ")
          return Promise.reject('End of posts');
        }

        const setLast = new Promise((resolve, reject) => {
          if (res.last_pid === '') {
            reject('No last ID');
          } else resolve(res.last_pid);
        });

        setLastPID(setLast());
        setPosts([...posts, ...res.data]);
        setFecthMore(false);
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
      onEndReachedThreshold={0}
      ListFooterComponent={
        <View style={{alignItems: 'center', marginTop: 8}}>
          {fetchMore ? <ActivityIndicator /> : <AppText>{lastPID}</AppText>}
        </View>
      }
    />
  );
};

export default Posts;
