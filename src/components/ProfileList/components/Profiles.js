import React from 'react';
import { FlatList } from 'react-native';

import Profile from './Profile';

const Profiles = ({ data, type }) => {
  const renderItem = ({ item }) => <Profile data={item} type={type} />;

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

export default Profiles;
