import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, SafeAreaView} from 'react-native';

import {AppText} from '@/components';
import {Colors, normalize} from '@/globals';

const TabNavigation = ({routesList, bottomTab}) => {
  if (!routesList)
    return <AppText color="red">routeList props is required</AppText>;

  const [routes] = useState(routesList);
  const [activeTab, setActiveTab] = useState(routes[0].key);

  const tabChangeHandler = (tabName) => {
    setActiveTab(tabName);
  };

  const RenderContent = () => {
    const page = routes.find((activePage) => {
      if (activePage.key === activeTab) return activePage;
    });

    return page.renderPage;
  };

  const RenderRoutes = () => {
    return routes.map((route) => {
      return (
        <TouchableOpacity
          key={route.key}
          activeOpacity={0.7}
          style={{flex: 1}}
          onPress={() => tabChangeHandler(route.key)}>
          <View style={styles.navigationItem}>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <AppText
                textStyle="tabNavigation"
                customStyle={{textAlign: 'center'}}
                color={
                  activeTab === route.key
                    ? Colors.contentEbony
                    : Colors.checkboxBorderDefault
                }>
                {route.title}
              </AppText>
              {/* <View
                style={{
                  backgroundColor: Colors.neutralsGainsboro,
                  height: normalize(19),
                  paddingHorizontal: 4,
                  borderRadius: 8,
                  marginLeft: 8,
                }}>
                <AppText>{route.numberBadge}</AppText>
              </View> */}
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

  return (
    <View style={[styles.container, {paddingBottom: bottomTab && 65}]}>
      <View
        style={[
          styles.navigationContainer,
          bottomTab && bottomStyle.bottomTabStyle,
        ]}>
        <RenderRoutes />
      </View>
      <View style={{flex: 1}}>
        <RenderContent />
      </View>
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
