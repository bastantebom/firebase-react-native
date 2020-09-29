import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Text,
} from 'react-native';

import { AppText } from '@/components';
import { Colors, normalize } from '@/globals';

const TabNavigation = ({ routesList, bottomTab, activityTab }) => {
  if (!routesList)
    return <AppText color="red">routeList props is required</AppText>;

  const [routes] = useState(routesList);
  const [activeTab, setActiveTab] = useState(routes[0].key);
  const [activeContent, setActiveContent] = useState(0);
  const [withBadge, setWithBadge] = useState(false);

  const tabChangeHandler = (tabName, index) => {
    setActiveTab(tabName);
    setActiveContent(index);
  };

  const RenderRoutes = () => {
    return routes.map((route, index) => {
      return (
        <TouchableOpacity
          key={route.key}
          activeOpacity={0.7}
          style={{ flex: 1 }}
          onPress={() => tabChangeHandler(route.key, index)}>
          <View style={styles.navigationItem}>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <AppText
                textStyle="tabNavigation"
                customStyle={{ textAlign: 'center' }}
                color={
                  activeTab === route.key
                    ? Colors.contentEbony
                    : Colors.checkboxBorderDefault
                }>
                {route.title}
              </AppText>
              {route.numberBadge ? (
                <View
                  style={{
                    backgroundColor: Colors.neutralsGainsboro,
                    height: normalize(19),
                    paddingHorizontal: 4,
                    borderRadius: 8,
                    marginLeft: 8,
                  }}>
                  <AppText>{route.numberBadge}</AppText>
                </View>
              ) : <></>}
            </View>

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

  //const Content = routesList[0].renderPage;
  //let Content = '';

  // useEffect(() => {
  //   console.log('Render content');
  //   const RenderContent = () => {
  //     const page = routes.find((activePage) => {
  //       console.log('Render inside');
  //       if (activePage.key === activeTab) return activePage;
  //     });
  //     console.log('Render content outside');
  //     return page.renderPage;
  //   };

  //   Content = RenderContent;
  // }, []);

  return (
    <View style={[styles.container, { paddingBottom: bottomTab && 65,  borderTopWidth: activityTab && 0}]}>
      <View
        style={[
          styles.navigationContainer,
          bottomTab && bottomStyle.bottomTabStyle,
          activityTab && activityStyle.activityTabStyle
        ]}>
        <RenderRoutes />
      </View>
      <View style={{ flex: 1 }}>{routesList[activeContent].renderPage}</View>
    </View>
  );
};

const bottomStyle = StyleSheet.create({
  bottomTabStyle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});

const activityStyle = StyleSheet.create({
  activityTabStyle: {
    borderBottomWidth: 0,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    borderTopColor: Colors.neutralsZircon,
    borderTopWidth: normalize(4),
  },
  navigationContainer: {
    height: normalize(50),
    flexDirection: 'row',
    width: '100%',
    borderBottomColor: Colors.neutralGray,
    borderBottomWidth: 1,
    backgroundColor: Colors.neutralsWhite,
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
