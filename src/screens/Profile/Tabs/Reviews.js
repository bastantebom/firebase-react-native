//import liraries
import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import {NoReview} from '@/assets/images';
import {Colors, normalize} from '@/globals';

import {AppText, Reviews} from '@/components';

// create a component
const Review = () => {
  const [hasReview, setHasReview] = useState(true);

  const DummyData = [
    {
      id: 1,
      userImage:
        'https://a57.foxnews.com/static.foxnews.com/foxnews.com/content/uploads/2019/07/931/524/Gigi-Hadid-Getty.jpg?ve=1&tl=1',
      name: 'Pia Samson',

      rating: 3.5,
      postedAt: 8088,
      isVerified: false,
      isLiked: false,
      postType: 'service',
      review:
        'It was a bit problematic to communicate with them at first but I guess that’s ayt.. got my order in the end anyway.',
      availed: 'Availed Pasabuy',
    },
    {
      id: 2,
      userImage:
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      name: 'Mark Santiago',
      username: 'Markee',
      rating: 4.5,
      postedAt: 5575482,
      isVerified: true,
      isLiked: false,
      postType: 'Service',
      review:
        'Mabilis sya bumili, pag ka message ko wala pang 1 hour nakuha ko na yung items! Will definitely avail again!',
      availed: 'Availed Pasabuy',
    },
    {
      id: 3,
      userImage:
        'https://media.glamour.com/photos/56958105085ae0a85037019e/master/pass/entertainment-2015-03-zayn-malik-one-direction-main.jpg',
      name: 'Wayne Santiago',
      username: 'Wayne',
      rating: 4.5,
      postedAt: 53482,
      isVerified: true,
      isLiked: false,
      postType: 'Service',
      review: 'Sarap ng burger!',
      availed: 'Availed Pasabuy',
    },
    {
      id: 4,
      userImage:
        'https://i.pinimg.com/originals/f9/0c/9e/f90c9e170d4b553a9d0a79735113365b.jpg',
      name: 'Hayley Williams',
      username: 'hayley',
      rating: 4.5,
      postedAt: 777482,
      isVerified: true,
      isLiked: false,
      postType: 'Service',
      review: 'Wow, different experience each time I order. Next time ulit :-)',
      availed: 'Availed Pasabuy',
    },
    {
      id: 5,
      userImage:
        'https://www.cheatsheet.com/wp-content/uploads/2020/03/ursula-corbero.png',
      name: 'Pot Bernabe',
      username: 'pot',
      rating: 4.5,
      postedAt: 53482,
      isVerified: true,
      isLiked: false,
      postType: 'Service',
      review:
        'The friends have been bugging me to try this new burger joint. Affordable and worth the hype!',
      availed: 'Availed Pasabuy',
    },
  ];

  const WithReview = () => {
    return <Reviews data={DummyData} type="own" />;
  };
  return (
    <>
      {hasReview ? (
        <WithReview />
      ) : (
        <View style={styles.container}>
          <View style={styles.imageWrapper}>
            <NoReview width={normalize(140)} height={normalize(140)} />
          </View>
          <View style={styles.copyWrapper}>
            <AppText textStyle="display6" customStyle={styles.centerCopy}>
              No reviews yet...
            </AppText>
            <AppText
              textStyle="body3"
              color={Colors.profileLink}
              customStyle={styles.centerCopy}>
              Chorva Ipsum Echelity Bongga ang Kiber
            </AppText>
          </View>
        </View>
      )}
    </>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.emptyStateBackground,
    padding: normalize(16),
  },
  imageWrapper: {
    marginBottom: normalize(16),
  },
  copyWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  centerCopy: {
    textAlign: 'center',
    marginBottom: normalize(8),
  },

  linksWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(16),
  },

  copySpacing: {
    marginLeft: normalize(8),
    marginRight: normalize(8),
  },
});
//make this component available to the app
export default Review;
