import React, {useContext} from 'react';
import {StyleSheet, Dimensions, TouchableOpacity} from 'react-native';

import PaddingView from '@/components/AppViewContainer/PaddingView';

// import CloseDark from '@/assets/images/icons/close-dark.svg';
// import CircleTick from '@/assets/images/icons/circle-tick.svg';

import {
  CloseDark,
  CloseLight,
  CircleTick,
  Warning,
  Verified,
} from '@/assets/images/icons';
import Colors from '@/globals/Colors';

import {Context} from '@/context';
import {normalize} from '@/globals';

/**
 *
 * @param {
 *     message: <Text> string </Text>
 *     type: "error" | "success"
 * }
 */

const Notification = ({message, type, position = 'absolute'}) => {
  const {notificationState, closeNotification} = useContext(Context);

  const width = Dimensions.get('window').width;

  const styles = StyleSheet.create({
    container: {
      width: width,
      position: position,
      top: 0,
      left: 0,
      flexDirection: 'row',
      zIndex: 1,
      backgroundColor:
        type === 'success'
          ? Colors.yellow2
          : type === 'verified'
          ? Colors.secondarySolitude
          : Colors.secondaryBrinkPink,
    },
  });

  if (notificationState === 'open') {
    return (
      <PaddingView paddingSize={2} style={styles.container}>
        {type === 'success' ? (
          <CircleTick />
        ) : type === 'verified' ? (
          <Verified width={normalize(24)} height={normalize(24)} />
        ) : (
          <Warning />
        )}
        {message}
        <TouchableOpacity onPress={() => closeNotification()}>
          {type === 'success' ? (
            <CloseDark />
          ) : type === 'verified' ? (
            <CloseDark />
          ) : (
            <CloseLight />
          )}
        </TouchableOpacity>
      </PaddingView>
    );
  }

  return <></>;
};

export default Notification;
