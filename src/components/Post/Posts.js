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
  const [lastPID, setLastPID] = useState(0);
  const [fetchMore, setFecthMore] = useState(true);
  const limit = 5;
  // const [thereIsMoreFlag, setThereIsMoreFlag] = useState(true);
  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = useState(true);

  // const initialLocation = userInfo?.address?.city
  //   ? userInfo?.address?.city
  //   : '';

  useEffect(() => {
    setLastPID(0);
    refreshPosts();
  }, [locationFilter]);

  // useEffect(() => {
  //   setLastPID(0);
  // }, [lastPID]);

  const refreshPosts = async () => {
    console.log('REFRESH');
    //console.log(lastPID);
    try {
      setRefresh(true);

      if (locationFilter) {
        const params = {
          city: locationFilter,
          limit: limit,
          page: 0,
        };

        const res = await PostService.getPostsLocation(params);

        if (
          res.message ===
          'You have reached the end of the post, no more available posts'
        ) {
          setPosts([]);
          setFecthMore(false);
          setRefresh(false);
          setIsLoading(false);
          return;
        }

        if (res.data && res.data?.length > 0) {
          setPosts(res.data);
        }

        setLastPID(1);
      } else {
        const params = {
          limit: limit,
          page: 0,
        };

        const res = await PostService.getPosts(params);
        if (res.data && res.data.length > 0) {
          setPosts(res.data);
        }

        setLastPID(1);
      }

      setRefresh(false);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const onMomentumScrollBegin = () => setOnEndReachedCalledDuringMomentum(true);

  const getMorePost = async () => {
    console.log('GET MORE');
    try {
      console.log(onEndReachedCalledDuringMomentum);
      if (onEndReachedCalledDuringMomentum) {
        setOnEndReachedCalledDuringMomentum(false);

        if (locationFilter) {
          console.log('with location filter');
          if (lastPID !== 0) {
            const params = {
              city: locationFilter,
              limit: limit,
              page: lastPID,
            };

            const res = await PostService.getPostsLocation(params);
            if (!res.length) {
              setFecthMore(false);
              setIsLoading(false);
              return;
            }

            if (res.data && res.data.length > 0) {
              setPosts((prev) => [...prev, ...res.data]);
            }

            setLastPID(lastPID + 1);
          } else {
            setIsLoading(false);
            setFecthMore(false);
          }
        } else {
          console.log('wala location filter');

          const params = {
            limit: limit,
            page: lastPID,
          };
          const res = await PostService.getPosts(params);
          console.log('------------------');
          //console.log(res);
          if (!res.length || type === 'liked' || type === 'archived') {
            setFecthMore(false);
            setIsLoading(false);

            return;
          }

          if (res.data && res.data.length > 0) {
            setPosts((prev) => [...prev, ...res.data]);
          }

          setLastPID(lastPID + 1);
        }
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // const getMorePost = async () => {
  //   // console.log("Call GET MORE")

  //   if (!onEndReachedCalledDuringMomentum) {
  //     setOnEndReachedCalledDuringMomentum(true);
  //     setFecthMore(true);
  //     // console.log('FLAGGER');
  //     // console.log(thereIsMoreFlag);
  //     if (!thereIsMoreFlag) {
  //       setFecthMore(false);
  //       // console.log('Stopping getting more post');
  //       return;
  //     }

  //     let getPostsParams = {
  //       uid: user.uid || 'JlW54zJC8EVqLhxeLsP7H0dvUuT2',
  //       limit: 5,
  //       last_pid: lastPID,
  //       city: locationFilter ? locationFilter : initialLocation,
  //     };
  //     // console.log('GET MORE POST');
  //     // console.log(lastPID);
  //     // console.log(getPostsParams);

  //     await PostService.getPostsLocation(getPostsParams)
  //       .then((res) => {
  //         console.log('API CALL');
  //         // console.log('Get more posts function response');

  //         // res.data.map((item) => {
  //         //   console.log(item.post_id);
  //         // });

  //         // console.log('res.sucess: ', res.success);
  //         // console.log(res.success);

  //         // console.log(res.data);
  //         // if (res.success) setLastPID(res.last_pid);
  //         if (res.success) {
  //           setLastPID(res.last_pid);
  //           // console.log('INSIDE SUCCESS TRUE');
  //           setPosts(res.data ? [...posts, ...res.data] : [...posts]);
  //           setFecthMore(false);
  //         } else {
  //           setThereIsMoreFlag(false);
  //           setFecthMore(false);
  //         }
  //       })
  //       .catch((err) => {
  //         setFecthMore(false);
  //       });
  //   }
  // };

  if (data.length > 0) {
    return (
      // <FlatList
      //   data={data}
      //   renderItem={renderItem}
      //   keyExtractor={(item) => item.post_id}
      //   onRefresh={refreshPosts}
      //   refreshing={refresh}
      //   onEndReached={() => getMorePost()}
      //   onEndReachedThreshold={0.1}
      //   onMomentumScrollBegin={onMomentumScrollBegin}
      //   ListFooterComponent={
      //     <View style={{alignItems: 'center', marginTop: 8, marginBottom: 24}}>
      //       {fetchMore ? (
      //         <ActivityIndicator />
      //       ) : (
      //         <AppText>{'Oops, you’ve run out of posts.'}</AppText>
      //       )}
      //     </View>
      //   }
      // />
      <></>
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
