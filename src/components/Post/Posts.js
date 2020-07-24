import React from 'react';
import {FlatList} from 'react-native';

import Post from '@/components/Post/Post';

const Posts = ({data, beginScrollFunction, endScrollFunction}) => {
  const renderItem = ({item}) => <Post data={item} />;

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      onScrollEndDrag={endScrollFunction}
      onScrollBeginDrag={beginScrollFunction}
    />
  );
};

export default Posts;
