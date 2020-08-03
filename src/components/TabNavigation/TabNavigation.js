import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import {AppText} from '@/components';
import {Colors} from '@/globals';

const TabNavigation = ({routesList}) => {
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
