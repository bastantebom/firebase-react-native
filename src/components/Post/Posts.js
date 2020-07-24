import React from 'react';
import {FlatList} from 'react-native';

import Post from '@/components/Post/Post';

const Posts = ({data, showLocationComponent, hideLocationComponent, scrollState, setScrollState}) => {
  const renderItem = ({item}) => <Post data={item} />;

  const handleOnScroll = (event) => {   
    console.log(event.nativeEvent.contentOffset.y);
    if(event.nativeEvent.contentOffset.y <= scrollState || event.nativeEvent.contentOffset.y <= 0) {
        showLocationComponent();
    }

    setScrollState(event.nativeEvent.contentOffset.y)
  } 

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      onMomentumScrollEnd={showLocationComponent}
      onScrollBeginDrag={hideLocationComponent}
    //   onScroll={handleOnScroll}
    />
  );
};

export default Posts;
