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
    console.log('REFRESH FUNCTION');
    console.log(type)

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
    setFecthMore(true);
    if (lastPID === 'none') setFecthMore(false);

    let getPostsParams = {
      uid: user.uid,
      limit: 5,
      last_pid: lastPID,
    };
    // console.log('GET MORE POST');
    // console.log(lastPID);
    // console.log(getPostsParams);

    await PostService.getPosts(getPostsParams)
      .then((res) => {
        setLastPID(res.last_pid ? res.last_pid : 'none');
        setPosts(res.data ? [...posts, ...res.data] : [...posts]);
        setFecthMore(false);
      })
      .catch((err) => {
        // console.log('GET POST SERVICE ERROR');
        // console.log(err);
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
        <View style={{alignItems: 'center', marginTop: 8, marginBottom: 24}}>
          {fetchMore ? <ActivityIndicator /> : <AppText>{lastPID === 'none' ? 'No more posts available': ''}</AppText>}
        </View>
      }
    />
  );
};

export default Posts;
