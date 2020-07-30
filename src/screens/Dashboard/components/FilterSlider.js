import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ScrollView,
} from 'react-native';

import {AppText, AppViewContainer, AppRadio, AppCheckbox} from '@/components';
import {normalize, Colors} from '@/globals';

import {
  CloseDark,
  FilterServices,
  FilterSeller,
  FilterNeeds,
  SortRecent,
  SortPopular,
  SortLowHigh,
  SortHighLow,
  SortNearest
} from '@/assets/images/icons';

const FilterSlider = ({modalToggler}) => {
  const [checkboxServices, setCheckboxServices] = useState(false);
  const [checkboxSeller, setCheckboxSeller] = useState(false);
  const [checkboxNeeds, setCheckboxNeeds] = useState(false);

  const [radioButtons, setRadioButtons] = useState({
    Popular: false,
    Recent: false,
    Nearest: false,
    HighLow: false,
    LowHigh: false,
  });

  useEffect(() => {
    // console.log('Filter options: ', [
    //   checkboxServices,
    //   checkboxSeller,
    //   checkboxNeeds,
    // ]);
  }, [checkboxServices, checkboxSeller, checkboxNeeds, radioButtons]);

  const checkboxServicesHandler = () => {
    setCheckboxServices(!checkboxServices);
  };

  const checkboxSellerHandler = () => {
    setCheckboxSeller(!checkboxSeller);
  };

  const checkboxNeedsHandler = () => {
    setCheckboxNeeds(!checkboxNeeds);
  };

  const resetFilters = () => {
    setCheckboxServices(false);
    setCheckboxSeller(false);
    setCheckboxNeeds(false);
    setRadioButtons({
      Popular: false,
      Recent: false,
      Nearest: false,
      HighLow: false,
      LowHigh: false,
    });
  };

  const applyFilters = () => {
    // Api call
    modalToggler();
  };

  const radioHandler = (label) => {
    console.log(radioButtons);
    console.log('label return: ', label);

    switch (label) {
      case 'Popular':
        setRadioButtons({
          Popular: true,
          Recent: false,
          Nearest: false,
          HighLow: false,
          LowHigh: false,
        });
        break;
      case 'Recent':
        setRadioButtons({
          Popular: false,
          Recent: true,
          Nearest: false,
          HighLow: false,
          LowHigh: false,
        });
        break;
      case 'Nearest':
        setRadioButtons({
          Popular: false,
          Recent: false,
          Nearest: true,
          HighLow: false,
          LowHigh: false,
        });
        break;
      case 'HighLow':
        setRadioButtons({
          Popular: false,
          Recent: false,
          Nearest: false,
          HighLow: true,
          LowHigh: false,
        });
        break;
      case 'LowHigh':
        setRadioButtons({
          Popular: false,
          Recent: false,
          Nearest: false,
          HighLow: false,
          LowHigh: true,
        });
        break;
      default:
        break;
    }
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        height: Dimensions.get('window').height,
      }}>
      <ScrollView style={{paddingTop: 24}}>
        <AppViewContainer marginSize={3}>
          <View style={{flexDirection: 'row', marginBottom: 40}}>
            <View style={{flex: 1}}>
              <AppText textStyle="subtitle1">Filter & Sort</AppText>
              <AppText textStyle="caption" color={Colors.contentPlaceholder}>
                Select all that applies
              </AppText>
            </View>

            <TouchableOpacity
              onPress={() => modalToggler()}
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
              label="Selling"
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

          <View>
            <AppText textStyle="subtitle2" customStyle={{marginBottom: 16}}>
              Sort by
            </AppText>
            <AppRadio
              Icon={() => {
                return <SortPopular />;
              }}
              label="Popular"
              name="Popular"
              value={radioButtons.Popular}
              valueChangeHandler={radioHandler}
              style={{marginBottom: 16}}
            />
            <AppRadio
              Icon={() => {
                return <SortRecent />;
              }}
              label="Recent"
              name="Recent"
              value={radioButtons.Recent}
              valueChangeHandler={radioHandler}
              style={{marginBottom: 16}}
            />
            <AppRadio
              Icon={() => {
                return <SortNearest />;
              }}
              label="Nearest"
              name="Nearest"
              value={radioButtons.Nearest}
              valueChangeHandler={radioHandler}
              style={{marginBottom: 16}}
            />
            <AppText textStyle="subtitle2" customStyle={{marginBottom: 16}}>
              Price
            </AppText>
            <AppRadio
              Icon={() => {
                return <SortHighLow />;
              }}
              label="High to Low"
              name="HighLow"
              value={radioButtons.HighLow}
              valueChangeHandler={radioHandler}
              style={{marginBottom: 16}}
            />
            <AppRadio
              Icon={() => {
                return <SortLowHigh />;
              }}
              label="Low to High"
              name="LowHigh"
              value={radioButtons.LowHigh}
              valueChangeHandler={radioHandler}
              style={{marginBottom: 16}}
            />
          </View>
        </AppViewContainer>

        <View
          style={{
            marginBottom: 40,
            borderTopWidth: 1,
            borderTopColor: Colors.neutralsZircon,
            paddingTop: 24,
            paddingHorizontal: 24,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}>
          <TouchableOpacity onPress={resetFilters}>
            <View style={styles.buttonWhite}>
              <AppText textStyle="button2">Reset</AppText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={applyFilters}>
            <View style={styles.buttonYellow}>
              <AppText textStyle="button2">Apply</AppText>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonWhite: {
    paddingHorizontal: 40,
    paddingVertical: 8,
    borderColor: Colors.contentEbony,
    borderWidth: 1.5,
    borderRadius: 4,
  },
  buttonYellow: {
    paddingHorizontal: 40,
    paddingVertical: 8,
    borderColor: Colors.primaryYellow,
    backgroundColor: Colors.primaryYellow,
    borderWidth: 1.5,
    borderRadius: 4,
  },
});

export default FilterSlider;
