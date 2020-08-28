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
  const {
    setUserPosts,
    userPosts,
    setOtherUserPosts,
    otherUserPosts,
  } = useContext(Context);
  const renderItem = ({item}) => (
    <Post data={item} type={type} isLoading={isLoading} />
  );

  const [refresh, setRefresh] = useState(false);
  const [lastPID, setLastPID] = useState('');
  const [fetchMore, setFecthMore] = useState(false);
  const [thereIsMoreFlag, setThereIsMoreFlag] = useState(true);
  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = useState(true);

  useEffect(() => {
    refreshPosts().then(() => {
      setIsLoading(false);
    });
  }, []);

  const refreshPosts = async () => {
    setOtherUserPosts([]);
    setLastPID('none');
    setRefresh(true);

    let getPostsParams = {
      uid: userID,
      limit: 5,
    };

    console.log('REFRESH USER POSTS');
    console.log(getPostsParams);

    await PostService.getUserPosts(getPostsParams)
      .then((res) => {
        setLastPID(res.last_pid);
        if (res.data.length > 0) {
          setOtherUserPosts(res.data);
        } else {
          setOtherUserPosts([]);
        }
        setRefresh(false);
      })
      .catch((err) => {
        setRefresh(false);
      });
  };

  const getMorePost = async () => {
    if (!onEndReachedCalledDuringMomentum) {
      setOnEndReachedCalledDuringMomentum(true);
      setFecthMore(true);

      if (!thereIsMoreFlag) {
        setFecthMore(false);
        // console.log('Stopping getting more post');
        return;
      }

      let getPostsParams = {
        uid: userID,
        limit: 5,
        last_pid: lastPID,
      };
      console.log('GET MORE POST');
      console.log(lastPID);
      // console.log(getPostsParams);

      await PostService.getUserPosts(getPostsParams)
        .then((res) => {
          if (res.success) {
            setLastPID(res.last_pid);
            setOtherUserPosts(
              res.data ? [...otherUserPosts, ...res.data] : [...otherUserPosts],
            );
            setFecthMore(false);
          } else {
            setThereIsMoreFlag(false);
            setFecthMore(false);
          }
        })
        .catch((err) => {
          setFecthMore(false);
        });
    }
  };

  const onMomentumScrollBegin = () =>
    setOnEndReachedCalledDuringMomentum(false);

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
        onMomentumScrollBegin={onMomentumScrollBegin}
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
    if (refresh) {
      return (
        <View>
          <LoadingScreen.LoadingOwnPost />
          <LoadingScreen.LoadingOwnPost />
          <LoadingScreen.LoadingOwnPost />
          <LoadingScreen.LoadingOwnPost />
        </View>
      );
    }
    return <PostOwnEmpty isLoading={isLoading} />;
  }

  if (type !== 'own') {
    if (refresh) {
      return <ActivityIndicator />;
    }
    return (
      <View style={{alignItems: 'center', marginTop: 8, marginBottom: 24}}>
        <AppText>No user posts</AppText>
      </View>
    );
  }
};

export default UserPosts;
