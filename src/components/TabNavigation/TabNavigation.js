import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import {AppText, Posts} from '@/components';
import {Colors} from '@/globals';

const PostsRoute = () => {
  const DummyData = [
    {
      id: 1,
      userImage:
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      name: 'Default User',
      username: 'Piasamson',
      rating: 3.5,
      postedAt: 8088,
      isVerified: false,
      isLiked: false,

      postType: 'need',
      postImage:
        'data:image/png;base64,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',
      postName: 'Pasabuy Service - SM Light, Mandaluyong',
      postPrice: 500,
      postServiceAddress: '#8 Atis Street',
      postServiceRadius: '500m',
      postDeliveryMethod: 'Delivery and Pickup',
    },
    {
      id: 2,
      userImage:
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      name: 'Default User',
      username: 'Markee',
      rating: 4.5,
      postedAt: 5575482,
      isVerified: true,
      isLiked: false,

      postType: 'Service',
      postImage:
        'https://i.pinimg.com/600x315/9c/84/20/9c84201f88ef5c55a7bf723e81fb4e3d.jpg',
      postName: 'Haircut Service every Sat & Sun Haircut Service every',
      postPrice: 20,
      postServiceAddress: '#8 Kaimito Street',
      postServiceRadius: '1000m',
      postDeliveryMethod: 'Home Service',
    },
    {
      id: 3,
      userImage:
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      name: 'Default User',
      username: 'Wayne',
      rating: 4.5,
      postedAt: 53482,
      isVerified: true,
      isLiked: false,

      postType: 'Service',
      postImage:
        'https://www.tarladalal.com/products/images/B_S_Cover_image_300.jpg',
      postName: '🍔 Wayne’s Burgers and Smoothies!',
      postPrice: 20,
      postServiceAddress: '#8 Kaimito Street',
      postServiceRadius: '1000m',
      postDeliveryMethod: 'Home Service',
    },
    {
      id: 4,
      userImage:
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      name: 'Default User',
      username: 'hayley',
      rating: 4.5,
      postedAt: 777482,
      isVerified: true,
      isLiked: false,

      postType: 'Service',
      postImage:
        'https://i.pinimg.com/736x/1c/06/c5/1c06c5e5ed415c5fc60b3ca488f7ead6.jpg',
      postName: 'Haircut Service every Sat & Sun Haircut Service every Sat',
      postPrice: 20,
      postServiceAddress: '#8 Kaimito Street',
      postServiceRadius: '1000m',
      postDeliveryMethod: 'Home Service',
    },
    {
      id: 5,
      userImage:
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      name: 'Default User',
      username: 'pot',
      rating: 4.5,
      postedAt: 53482,
      isVerified: true,
      isLiked: false,

      postType: 'Service',
      postImage:
        'https://www.animetric.net/wp-content/uploads/2020/06/yumini_mart_ramen_kit1.jpg',
      postName: 'Satisfy your ramen cravings with our DIY Ramen Kits! 🍜',
      postPrice: 20,
      postServiceAddress: '#8 Kaimito Street',
      postServiceRadius: '1000m',
      postDeliveryMethod: 'Home Service',
    },
  ];
  return (
    <View style={[styles.scene]}>
      <Posts data={DummyData} />
    </View>
  );
};

const ReviewsRoute = () => (
  <View style={[styles.scene]}>
    <AppText>reviews</AppText>
    <AppText>reviews</AppText>
    <AppText>reviews</AppText>
    <AppText>reviews</AppText>
    <AppText>reviews</AppText>
    <AppText>reviews</AppText>
    <AppText>reviews</AppText>
  </View>
);

const MoreInfoRoute = () => (
  <View style={[styles.scene]}>
    <AppText>More Info</AppText>
    <AppText>More Info</AppText>
    <AppText>More Info</AppText>
    <AppText>More Info</AppText>
    <AppText>More Info</AppText>
  </View>
);

const TabNavigation = ({routesArray}) => {
  // const [routes] = useState([
  //   { key: 'first', title: 'First', renderPage: <FirstRoute /> },
  //   { key: 'second', title: 'Second', renderPage: <SecondRoute /> },
  // ]);

  const [routes] = useState([
    {key: 'first', title: 'Posts', renderPage: <PostsRoute />},
    {key: 'second', title: 'Reviews', renderPage: <ReviewsRoute />},
    {key: 'third', title: 'More Info', renderPage: <MoreInfoRoute />},
  ]);

  const [activeTab, setActiveTab] = useState(routes[0].key);

  const tabChangeHandler = (tabName) => {
    setActiveTab(tabName);
  };

  const RenderContent = () => {
    const page = routes.find((activePage) => {
      if (activePage.key === activeTab) return activePage;
    });

    return page.renderPage;
    // return <View />
  };

  const RenderRoutes = () => {
    return routes.map((route) => {
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => tabChangeHandler(route.key)}>
          <View style={styles.navigationItem}>
            <AppText
              textStyle="tabNavigation"
              color={
                activeTab === route.key
                  ? Colors.contentEbony
                  : Colors.checkboxBorderDefault
              }>
              {route.title}
            </AppText>
            <View
              style={[
                styles.navigationLine,
                activeTab === route.key
                  ? styles.navigationActive
                  : styles.navigationInactive,
              ]}
            />
          </View>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.navigationContainer}>
        <RenderRoutes />
      </View>
      <RenderContent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  navigationContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
  },
  navigationItem: {
    flex: 1,
    position: 'relative',
    padding: 12,
    paddingBottom: 20,
  },
  navigationLine: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'transparent',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navigationActive: {
    borderColor: Colors.secondaryRoyalBlue,
  },
  navigationInactive: {
    borderColor: 'transparent',
  },
});

export default TabNavigation;
