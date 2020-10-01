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
    needsRefresh,
    setNeedsRefresh,
  } = useContext(Context);
  const renderItem = ({item}) => (
    <Post data={item} type={type} isLoading={isLoading} />
  );

  const [refresh, setRefresh] = useState(false);
  const [lastPID, setLastPID] = useState(0);
  const [fetchMore, setFecthMore] = useState(false);
  const [thereIsMoreFlag, setThereIsMoreFlag] = useState(true);
  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      if (needsRefresh) {
        refreshPosts();
      }
    }

    return () => {
      isMounted = false;
    };
  }, [needsRefresh]);

  const refreshPosts = async () => {
    try {
      setUserPosts([]);
      setLastPID(0);
      setRefresh(true);

      const params = {
        uid: userID,
        limit: 5,
        page: lastPID,
      };

      const res = await PostService.getUserPosts(params);
      setLastPID(lastPID + 1);
      setIsLoading(false);

      if (res.data.length > 0) {
        //console.log(res);
        setUserPosts(res.data);
      }

      setNeedsRefresh(false);
      setRefresh(false);
    } catch (err) {
      setRefresh(false);
    }
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
        page: lastPID,
      };
      //console.log('GET MORE POST');
      //console.log(lastPID);
      // console.log(getPostsParams);

      await PostService.getUserPosts(getPostsParams)
        .then((res) => {
          //console.log('API CALL');
          if (res.success) {
            //console.log(res);
            setLastPID(lastPID + 1);
            setUserPosts(
              res.data ? [...userPosts, ...res.data] : [...userPosts],
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
