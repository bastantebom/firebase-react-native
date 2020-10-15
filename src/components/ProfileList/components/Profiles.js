import React from 'react';
import { FlatList } from 'react-native';

import Profile from './Profile';

const Profiles = ({ data, type, viewType, toggleProfileList }) => {
  const renderItem = ({ item }) => <Profile data={item} type={type} viewType={viewType} toggleProfileList={toggleProfileList} />;

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.uid}
    />
  );
};

export default Profiles;
