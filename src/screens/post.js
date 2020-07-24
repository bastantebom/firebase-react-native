import React, {useRef, createRef, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {normalize} from '@/globals';

const Post = () => {
  const [color, setColor] = useState('red');
  const [page, setPage] = useState('sell');
  const colorArray = ['red', 'blue', 'green'];
  const pageArray = ['sell', 'post', 'need'];

  const renderItem = ({item, index}) => {
    return (
      <View style={styles[item.title]}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    );
  };

  let ref = createRef();
  return (
    <>
      <View
        style={{marginTop: 70, backgroundColor: 'gray', position: 'relative'}}>
        <Carousel
          layout={'stack'}
          layoutCardOffset={`18`}
          ref={ref}
          loop
          onSnapToItem={(x) => {
            setColor(colorArray[x]);
            setPage(pageArray[x]);
          }}
          containerCustomStyle={{
            transform: [{ scaleX: -1 }]
          }}
          onScroll={(e)=> console.log(e.contentOffset)}
          data={[
            {
              title: 'hello',
            },
            {
              title: 'world',
            },
            {
              title: 'boom',
            },
          ]}
          renderItem={renderItem}
          sliderWidth={normalize(375)}
          sliderHeight={100}
          itemWidth={normalize(375)}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: 20,
            backgroundColor: color,
          }}
        />
      </View>
      <View>
        <Text> {page} page </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
  },
  hello: {
    width: normalize(340),
    height: 100,
    backgroundColor: 'red',
  },
  world: {
    width: normalize(340),
    height: 100,
    backgroundColor: 'blue',
  },
  boom: {
    width: normalize(340),
    height: 100,
    backgroundColor: 'green',
  },
});

export default Post;
