import React, {useState, useContext, useEffect} from 'react';
import {FlatList, View, ActivityIndicator} from 'react-native';

import Post from '@/components/Post/Post';
import {UserContext} from '@/context/UserContext';
import {Context} from '@/context';
import {PostService} from '@/services';
import {AppText} from '@/components';
import PostOwnEmpty from '@/screens/Profile/Tabs/Post';
import LoadingScreen from './loading';

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
  const [thereIsMoreFlag, setThereIsMoreFlag] = useState(true);
  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = useState(true);

  const initialLocation = userInfo?.address?.city
    ? userInfo?.address?.city
    : 'San Mateo';

  useEffect(() => {
    // console.log('Useffect posts LOCATION IS CHANGED');
    // console.log(locationFilter);
    // console.log(userInfo);
    refreshPosts().then(() => {
      setIsLoading(false);
    });
  }, [locationFilter]);

  const refreshPosts = async () => {
    // console.log('REFRESH FUNCTION');
    // console.log(type);
    setPosts([]);
    setLastPID('none');

    setRefresh(true);
    let getPostsParams = {
      uid: user?.uid ? user.uid : '',
      limit: 5,
      city: locationFilter ? locationFilter : initialLocation,
      last_pid: null,
    };

    await PostService.getPostsLocation(getPostsParams)
      .then((res) => {
        console.log('API CALL');
        // console.log('Refresh function response');
        // console.log(res);
        // res.data.map((item) => {
        //   console.log(item.post_id);
        // });

        // console.log('LAST ID');
        // console.log(res.last_pid);

        // setLastPID(res.last_pid);
        if (res.data.length > 0) setPosts(res.data);
        else setPosts([]);
        setRefresh(false);
      })
      .catch((err) => {
        setRefresh(false);
      });
  };

  const onMomentumScrollBegin = () =>
    setOnEndReachedCalledDuringMomentum(false);

  const getMorePost = async () => {
    // console.log("Call GET MORE")

    if (!onEndReachedCalledDuringMomentum) {
      setOnEndReachedCalledDuringMomentum(true);
      setFecthMore(true);
      // console.log('FLAGGER');
      // console.log(thereIsMoreFlag);
      if (!thereIsMoreFlag) {
        setFecthMore(false);
        // console.log('Stopping getting more post');
        return;
      }

      let getPostsParams = {
        uid: user.uid || 'JlW54zJC8EVqLhxeLsP7H0dvUuT2',
        limit: 5,
        last_pid: lastPID,
        city: locationFilter ? locationFilter : initialLocation,
      };
      // console.log('GET MORE POST');
      // console.log(lastPID);
      // console.log(getPostsParams);

      await PostService.getPostsLocation(getPostsParams)
        .then((res) => {
          console.log('API CALL');
          // console.log('Get more posts function response');

          // res.data.map((item) => {
          //   console.log(item.post_id);
          // });

          // console.log('res.sucess: ', res.success);
          // console.log(res.success);

          // console.log(res.data);
          // if (res.success) setLastPID(res.last_pid);
          if (res.success) {
            setLastPID(res.last_pid);
            // console.log('INSIDE SUCCESS TRUE');
            setPosts(res.data ? [...posts, ...res.data] : [...posts]);
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

  if (data.length > 0) {
    return (
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.post_id}
        onRefresh={refreshPosts}
        refreshing={refresh}
        onEndReached={() => getMorePost()}
        onEndReachedThreshold={0.1}
        onMomentumScrollBegin={onMomentumScrollBegin}
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

  if (type !== 'own') {
    if (refresh) {
      // I SHOULD SHOW SKELETON
      return (
        <View>
          <LoadingScreen.LoadingPublicPost />
          <LoadingScreen.LoadingPublicPost />
          <LoadingScreen.LoadingPublicPost />
          <LoadingScreen.LoadingPublicPost />
        </View>
      );
    }
    return (
      <View style={{alignItems: 'center', marginTop: 8, marginBottom: 24}}>
        <AppText>No posts in your area.</AppText>
      </View>
    );
  }
};

export default Posts;
