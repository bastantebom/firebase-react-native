import React, {useState, useContext} from 'react';
import {FlatList} from 'react-native';

import Post from '@/components/Post/Post';
import {UserContext} from '@/context/UserContext';
import {Context} from '@/context';
import {PostService} from '@/services';

const Posts = ({
  data,
  scrollState,
  setScrollState,
  type,
  isLoading,
}) => {
  const {user} = useContext(UserContext);
  const {setPosts, posts} = useContext(Context);
  const renderItem = ({item}) => (
    <Post data={item} type={type} isLoading={isLoading} />
  );

  const [refresh, setRefresh] = useState(false);

  const refreshPosts = async () => {
    setRefresh(true);

    let getPostsParams = {
      uid: user.uid,
      limit: 5,
    };

    console.log("Before Await")

    await PostService.getPosts(getPostsParams)
      .then((res) => {
        console.log("Refreshed")
        setPosts(res.data);
        setRefresh(false);
      })
      .catch((err) => {
        console.log("Error Refreshing")
        console.log(err);
        setRefresh(false);
      });

      console.log("After Await")
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.post_id}
      onRefresh={refreshPosts}
      refreshing={refresh}
    />
  );
};

export default Posts;
