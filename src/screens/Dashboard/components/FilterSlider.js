import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';

import {AppText, AppViewContainer, AppRadio, AppCheckbox} from '@/components';
import {normalize, Colors} from '@/globals';

import {
  CloseDark,
  FilterServices,
  FilterSeller,
  FilterNeeds,
} from '@/assets/images/icons';

const FilterSlider = () => {
  const [checkboxServices, setCheckboxServices] = useState(false);
  const [checkboxSeller, setCheckboxSeller] = useState(false);
  const [checkboxNeeds, setCheckboxNeeds] = useState(false);

  const checkboxServicesHandler = () => {
    setCheckboxServices(!checkboxServices)
  }

  const checkboxSellerHandler = () => {
    setCheckboxSeller(!checkboxSeller)
  }

  const checkboxNeedsHandler = () => {
    setCheckboxNeeds(!checkboxNeeds)
  }


  return (
    <View
      style={{
        backgroundColor: 'white',
        height: Dimensions.get('window').height,
      }}>
      <AppViewContainer paddingSize={3}>
        <View style={{flexDirection: 'row', marginBottom: 40}}>
          <View style={{flex: 1}}>
            <AppText textStyle="subtitle1">Filter & Sort</AppText>
            <AppText textStyle="caption" color={Colors.contentPlaceholder}>
              Select all that applies
            </AppText>
          </View>

          <TouchableOpacity
            onPress={() => setModalState(false)}
            style={{justifyContent: 'flex-start'}}>
            <CloseDark width={normalize(24)} height={normalize(24)} />
          </TouchableOpacity>
        </View>

        <View style={{marginBottom: 32}}>
          <AppText textStyle="subtitle2" customStyle={{marginBottom: 16}}>
            Filter by
          </AppText>
          <AppCheckbox
            Icon={() => {
              return <FilterServices />;
            }}
            label="Services"
            value={checkboxServices}
            valueChangeHandler={checkboxServicesHandler}
            style={{marginBottom: 16}}
          />
          <AppCheckbox
            Icon={() => {
              return <FilterSeller />;
            }}
            label="Seller"
            value={checkboxSeller}
            valueChangeHandler={checkboxSellerHandler}
            style={{marginBottom: 16}}
          />
          <AppCheckbox
            Icon={() => {
              return <FilterNeeds />;
            }}
            label="Needs"
            value={checkboxNeeds}
            valueChangeHandler={checkboxNeedsHandler}
            style={{marginBottom: 16}}
          />
        </View>

        <AppRadio></AppRadio>
      </AppViewContainer>
    </View>
  );
};

export default FilterSlider;
