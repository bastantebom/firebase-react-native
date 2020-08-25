import React, {useState, useContext, useEffect} from 'react';
import {FlatList, View, ActivityIndicator} from 'react-native';

import Post from '@/components/Post/Post';
import {UserContext} from '@/context/UserContext';
import {Context} from '@/context';
import {PostService} from '@/services';
import {AppText} from '@/components';
import PostOwnEmpty from '@/screens/Profile/Tabs/Post';

const Posts = ({data, type, isLoading, setIsLoading}) => {
  const {user, userInfo} = useContext(UserContext);
  const {setPosts, posts, locationFilter, setLocationFilter} = useContext(
    Context,
  );
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

  const initialLocation = userInfo?.address?.city
    ? userInfo?.address?.city
    : 'Manila';

  useEffect(() => {
    console.log('Useffect posts LOCATION IS CHANGED');
    console.log(locationFilter);
    console.log(userInfo);
    refreshPosts().then(() => {
      setIsLoading(false);
    });
  }, [locationFilter]);

  const refreshPosts = async () => {
    console.log('REFRESH FUNCTION');
    console.log(type);
    setPosts([]);
    setLastPID('none');

    setRefresh(true);
    let getPostsParams = {
      uid: user.uid,
      limit: 5,
      city: locationFilter ? locationFilter : initialLocation,
    };

    await PostService.getPostsLocation(getPostsParams)
      .then((res) => {
        setLastPID(res.last_pid);
        if (res.data.length > 0) setPosts(res.data);
        else setPosts([]);
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
      city: locationFilter ? locationFilter : initialLocation,
    };
    // console.log('GET MORE POST');
    // console.log(lastPID);
    // console.log(getPostsParams);

    await PostService.getPostsLocation(getPostsParams)
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

  if (data.length > 0) {
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
            {fetchMore ? (
              <ActivityIndicator />
            ) : (
              <AppText>
                {lastPID === 'none' ? 'No more posts available' : ''}
              </AppText>
            )}
          </View>
        }
      />
    );
  }

  if (type === 'own' && data.length == 0) {
    return <PostOwnEmpty />;
  }

  if (type !== 'own') {
    return (
      <View style={{alignItems: 'center', marginTop: 8, marginBottom: 24}}>
        <AppText>No posts in your area.</AppText>
      </View>
    );
  }
};

export default Posts;
