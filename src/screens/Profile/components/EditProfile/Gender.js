import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import {BottomSheetHeader, PaddingView, AppRadio} from '@/components';
import {normalize, Colors} from '@/globals';

const Gender = ({setGenderValue, toggleGender}) => {
  const [radioButtons, setRadioButtons] = useState({
    male: false,
    female: false,
    notsay: false,
  });

  const radioHandler = (label) => {
    console.log(radioButtons);
    console.log('label return: ', label);

    switch (label) {
      case 'male':
        setRadioButtons({
          male: true,
          female: false,
          notsay: false,
        });
        break;
      case 'female':
        setRadioButtons({
          female: true,
          male: false,
          notsay: false,
        });
        break;
      case 'notsay':
        setRadioButtons({
          notsay: true,
          female: false,
          male: false,
        });
        break;

      default:
        break;
    }
    setGenderValue(label);
    toggleGender();
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        paddingBottom: 24,
        borderTopEndRadius: 8,
        borderTopStartRadius: 8,
      }}>
      <BottomSheetHeader />
      <PaddingView paddingSize={2}>
        <View style={{justifyContent: 'space-between'}}>
          <AppRadio
            label="Male"
            name="male"
            value={radioButtons.male}
            valueChangeHandler={radioHandler}
            style={{marginBottom: 16}}
          />
          <AppRadio
            label="Female"
            name="female"
            value={radioButtons.female}
            valueChangeHandler={radioHandler}
            style={{marginBottom: 16}}
          />
          <AppRadio
            label="Rather not say"
            name="notsay"
            value={radioButtons.notsay}
            valueChangeHandler={radioHandler}
            style={{marginBottom: 16}}
          />
        </View>
      </PaddingView>
    </View>
  );
};

const styles = StyleSheet.create({
  userInfoImageContainer: {
    height: normalize(44),
    width: normalize(44),
    borderRadius: normalize(44 / 2),
    overflow: 'hidden',
  },
  dividerStyle: {
    backgroundColor: Colors.neutralsZircon,
    width: '100%',
    marginTop: 8,
    marginBottom: 32,
  },
});

export default Gender;
