import React from 'react';
import { FlatList } from 'react-native';

import Post from '@/components/Post/Post';

const Posts = ({data}) => {

    const renderItem = ({ item }) => (
        <Post data={item} />
    );

    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
        />
    )
}

export default Posts;