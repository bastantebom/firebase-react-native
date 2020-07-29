import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import {AppText} from '@/components';
import {Colors} from '@/globals';

const TabNavigation = () => {
  const [activeTab, setActiveTab] = useState('posts');

  const tabChangeHandler = (tabName) => {
    setActiveTab(tabName);
  };

  const RenderContent = () => {
    if (activeTab === 'posts') {
      return (
        <View>
          <AppText>My code page</AppText>
        </View>
      );
    }

    if (activeTab === 'recent') {
      return (
        <View>
          <AppText>Camera</AppText>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => tabChangeHandler('posts')}>
          <View style={styles.navigationItem}>
            <AppText
              textStyle="tabNavigation"
              color={
                activeTab === 'posts'
                  ? Colors.contentEbony
                  : Colors.checkboxBorderDefault
              }>
              My Code
            </AppText>
            <View
              style={[
                styles.navigationLine,
                activeTab === 'posts'
                  ? styles.navigationActive
                  : styles.navigationInactive,
              ]}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => tabChangeHandler('recent')}>
          <View style={styles.navigationItem}>
            <AppText
              textStyle="tabNavigation"
              color={
                activeTab === 'recent'
                  ? Colors.contentEbony
                  : Colors.checkboxBorderDefault
              }>
              Scan Code
            </AppText>
            <View
              style={[
                styles.navigationLine,
                activeTab === 'recent'
                  ? styles.navigationActive
                  : styles.navigationInactive,
              ]}
            />
          </View>
        </TouchableOpacity>
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
