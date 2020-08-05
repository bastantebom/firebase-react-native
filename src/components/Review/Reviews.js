//import liraries
import React from 'react';
import {FlatList} from 'react-native';

import Review from '@/components/Review/Review';

const Reviews = ({data, type}) => {
  const renderItem = ({item}) => <Review data={item} type={type} />;

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

export default Reviews;
