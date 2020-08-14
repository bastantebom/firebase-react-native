//import liraries
import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, StyleSheet, Animated} from 'react-native';
import {Colors, normalize} from '@/globals';
import AppText from '../AppText/AppText';

// create a component
const FloatingAppInput = (props) => {
  const [isActive, setIsActive] = useState(false);
  const [labelPosition] = useState(new Animated.Value(0));
  //const [labelPositionX] = useState(new Animated.Value(0));
  const [labelScale] = useState(new Animated.Value(1));

  const onFocus = () => {
    //alert('Focus');
    setIsActive(true);
    Animated.parallel([
      Animated.timing(labelPosition, {
        toValue: -12,
        duration: 300,
        useNativeDriver: false,
      }),

      Animated.timing(labelScale, {
        toValue: 0.75,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const onBlur = () => {
    //alert('Blur');
    setIsActive(false);
    if (props.value === '') {
      Animated.parallel([
        Animated.timing(labelPosition, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(labelScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  let labelStyle = {
    transform: [
      {
        translateY: labelPosition,
      },
      {
        scale: labelScale,
      },
    ],
  };

  const activeColor = isActive ? Colors.contentOcean : Colors.neutralGray;

  return (
    <View
      style={{
        paddingVertical: 4,
        paddingHorizontal: 16,
        borderColor: activeColor,
        borderWidth: 1,
        borderRadius: 4,
        height: 54,
      }}>
      <Animated.View style={[styles.label, labelStyle]}>
        <AppText textStyle="body1" color={activeColor}>
          {props.label}
        </AppText>
      </Animated.View>
      <TextInput
        {...props}
        style={styles.floatingInput}
        onFocus={onFocus}
        onBlur={onBlur}
        blurOnSubmit
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  floatingInput: {
    backgroundColor: Colors.neutralWhite,
    fontSize: 16,
    height: 54,
    fontFamily: 'RoundedMplus1c-Regular',
    fontSize: normalize(16),
    letterSpacing: 0.5,
  },

  label: {
    position: 'absolute',
    left: 0,
    paddingTop: 14,
    paddingLeft: 12,
  },
});

//make this component available to the app
export default FloatingAppInput;
