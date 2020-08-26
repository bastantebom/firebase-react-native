import React, {useState, useContext, useEffect} from 'react';
import {FlatList, View, ActivityIndicator} from 'react-native';

import Post from '@/components/Post/Post';
import {UserContext} from '@/context/UserContext';
import {Context} from '@/context';
import {PostService} from '@/services';
import {AppText} from '@/components';
import PostOwnEmpty from '@/screens/Profile/Tabs/Post';
import LoadingScreen from './loading';

const UserPosts = ({data, type, isLoading, setIsLoading, userID}) => {
  const {user, userInfo} = useContext(UserContext);
  const {setUserPosts, userPosts} = useContext(Context);
  const renderItem = ({item}) => (
    <Post data={item} type={type} isLoading={isLoading} />
  );

  const [refresh, setRefresh] = useState(false);
  const [lastPID, setLastPID] = useState('');
  const [fetchMore, setFecthMore] = useState(false);

  useEffect(() => {
    refreshPosts().then(() => {
      setIsLoading(false);
    });
  }, []);

  const refreshPosts = async () => {
    setUserPosts([]);
    setLastPID('none');
    setRefresh(true);

    let getPostsParams = {
      uid: userID,
      limit: 5,
    };

    await PostService.getUserPosts(getPostsParams)
      .then((res) => {
        // console.log('Refresh function response');
        // console.log(res);
        setLastPID(res.last_pid);
        if (res.data.length > 0) setUserPosts(res.data);
        else setUserPosts([]);
        setRefresh(false);
      })
      .catch((err) => {
        setRefresh(false);
      });
  };

  const getMorePost = async () => {
    setFecthMore(true);
    if (lastPID === 'none') {
      setFecthMore(false);
      console.log('Stopping getting more post');
      return;
    }

    let getPostsParams = {
      uid: user.uid,
      limit: 5,
      last_pid: lastPID,
    };
    // console.log('GET MORE POST');
    // console.log(lastPID);
    // console.log(getPostsParams);

    await PostService.getUserPosts(getPostsParams)
      .then((res) => {
        console.log('Get more userPosts function response');
        console.log(res);
        // if (res.success) setLastPID(res.last_pid);
        setLastPID(res.last_pid ? res.last_pid : 'none');
        setFecthMore(false);

        setUserPosts(res.data ? [...userPosts, ...res.data] : [...userPosts]);
      })
      .catch((err) => {});
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
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          <View style={{alignItems: 'center', marginTop: 8, marginBottom: 24}}>
            {fetchMore ? (
              <ActivityIndicator />
            ) : (
              <AppText>
                {lastPID === 'none' ? 'No more userPosts available' : ''}
              </AppText>
            )}
          </View>
        }
      />
    );
  }

  if (type === 'own' && data.length == 0) {
    return <PostOwnEmpty isLoading={isLoading} />;
  }

  if (type !== 'own') {
    return (
      <View style={{alignItems: 'center', marginTop: 8, marginBottom: 24}}>
        <AppText>No user posts</AppText>
      </View>
    );
  }
};

export default UserPosts;
