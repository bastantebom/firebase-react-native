import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { AppText, AppViewContainer, AppRadio, AppCheckbox } from '@/components';
import { normalize, Colors } from '@/globals';

import { PostService } from '@/services';


import {
  CloseDark,
  FilterServices,
  FilterSeller,
  FilterNeeds,
  SortRecent,
  SortPopular,
  SortLowHigh,
  SortHighLow,
  SortNearest, SortCondition
} from '@/assets/images/icons';
import { Context } from '@/context';

const FilterSlider = ({ modalToggler }) => {

  const { searchPosts, filters, setFilters } = useContext(Context)

  const [checkboxServices, setCheckboxServices] = useState(false);
  const [checkboxSeller, setCheckboxSeller] = useState(false);
  const [checkboxNeeds, setCheckboxNeeds] = useState(false);
  const [checkboxBrandNew, setCheckboxBrandNew] = useState(false);
  const [checkboxUsed, setCheckboxUsed] = useState(false);
  const [sortValue, setSortValue] = useState('recent');
  const [filterValue, setFilterValue] = useState([]);

  const [radioButtons, setRadioButtons] = useState({
    Popular: false,
    Recent: true,
    Nearest: false,
    Price_Desc: false,
    Price_Asc: false,
  });

  // useEffect(() => {

  // }, [checkboxServices, checkboxSeller, checkboxNeeds, checkboxBrandNew, checkboxUsed, radioButtons]);

  useEffect(() => {
    console.log('filterValue');
    console.log(filterValue);
  }, [sortValue, filterValue])

  const checkboxServicesHandler = () => {
    setCheckboxServices(!checkboxServices);
    if (!checkboxServices) {
      setFilterValue([...filterValue, 'service'])
    } else {
      const newFilterValue = filterValue.filter((item) => item !== 'service');
      setFilterValue(newFilterValue);
    }
  };

  const checkboxSellerHandler = () => {
    setCheckboxSeller(!checkboxSeller);
    if (!checkboxSeller) {
      setFilterValue([...filterValue, 'sell'])
    } else {
      const newFilterValue = filterValue.filter((item) => item !== 'sell');
      setFilterValue(newFilterValue);
    }
  };

  const checkboxNeedsHandler = () => {
    setCheckboxNeeds(!checkboxNeeds);
    if (!checkboxNeeds) {
      setFilterValue([...filterValue, 'needs'])
    } else {
      const newFilterValue = filterValue.filter((item) => item !== 'needs');
      setFilterValue(newFilterValue);
    }
  };

  const checkboxBrandNewHandler = () => {
    setCheckboxBrandNew(!checkboxBrandNew);
  };

  const checkboxUsedHandler = () => {
    setCheckboxUsed(!checkboxUsed);
  };

  const resetFilters = () => {
    setCheckboxServices(false);
    setCheckboxSeller(false);
    setCheckboxNeeds(false);
    setCheckboxBrandNew(false);
    setCheckboxUsed(false);
    setRadioButtons({
      Popular: false,
      Recent: false,
      Nearest: false,
      Price_Desc: false,
      Price_Asc: false,
    });
  };

  const radioHandler = (label) => {
    setSortValue(label.toLowerCase())

    switch (label) {
      case 'Popular':
        setRadioButtons({
          Popular: true,
          Recent: false,
          Nearest: false,
          Price_Desc: false,
          Price_Asc: false,
        });
        break;
      case 'Recent':
        setRadioButtons({
          Popular: false,
          Recent: true,
          Nearest: false,
          Price_Desc: false,
          Price_Asc: false,
        });
        break;
      case 'Nearest':
        setRadioButtons({
          Popular: false,
          Recent: false,
          Nearest: true,
          Price_Desc: false,
          Price_Asc: false,
        });
        break;
      case 'Price_Desc':
        setRadioButtons({
          Popular: false,
          Recent: false,
          Nearest: false,
          Price_Desc: true,
          Price_Asc: false,
        });
        break;
      case 'Price_Asc':
        setRadioButtons({
          Popular: false,
          Recent: false,
          Nearest: false,
          Price_Desc: false,
          Price_Asc: true,
        });
        break;
      default:
        break;
    }
  };

  const applyFilters = () => {
    setFilters({
      ...filters,
      sort: sortValue,
      type: filterValue
    })
    modalToggler();
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        height: Dimensions.get('window').height,
      }}>
      <ScrollView style={{ paddingTop: 24 }}>
        <AppViewContainer marginSize={3}>
          <View style={{ flexDirection: 'row', marginBottom: 40 }}>
            <View style={{ flex: 1 }}>
              <AppText textStyle="subtitle1">Filter & Sort</AppText>
              <AppText textStyle="caption" color={Colors.contentPlaceholder}>
                Select all that applies
              </AppText>
            </View>

            <TouchableOpacity
              onPress={() => modalToggler()}
              style={{ justifyContent: 'flex-start' }}>
              <CloseDark width={normalize(24)} height={normalize(24)} />
            </TouchableOpacity>
          </View>

          <View style={{ marginBottom: 32 }}>
            <AppText textStyle="subtitle2" customStyle={{ marginBottom: 16 }}>
              Filter by
            </AppText>
            <AppCheckbox
              Icon={() => {
                return <FilterServices />;
              }}
              label="Services"
              value={checkboxServices}
              valueChangeHandler={checkboxServicesHandler}
              style={{ marginBottom: 16 }}
            />
            <AppCheckbox
              Icon={() => {
                return <FilterSeller />;
              }}
              label="Selling"
              value={checkboxSeller}
              valueChangeHandler={checkboxSellerHandler}
              style={{ marginBottom: 16 }}
            />
            <AppCheckbox
              Icon={() => {
                return <FilterNeeds />;
              }}
              label="Needs"
              value={checkboxNeeds}
              valueChangeHandler={checkboxNeedsHandler}
              style={{ marginBottom: 16 }}
            />
          </View>

          <View>
            <AppText textStyle="subtitle2" customStyle={{ marginBottom: 16 }}>
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
              style={{ marginBottom: 16 }}
            />
            <AppRadio
              Icon={() => {
                return <SortRecent />;
              }}
              label="Recent"
              name="Recent"
              value={radioButtons.Recent}
              valueChangeHandler={radioHandler}
              style={{ marginBottom: 16 }}
            />
            <AppRadio
              Icon={() => {
                return <SortNearest />;
              }}
              label="Nearest"
              name="Nearest"
              value={radioButtons.Nearest}
              valueChangeHandler={radioHandler}
              style={{ marginBottom: 16 }}
            />
            <AppText textStyle="subtitle2" customStyle={{ marginBottom: 16 }}>
              Price
            </AppText>
            <AppRadio
              Icon={() => {
                return <SortHighLow />;
              }}
              label="High to Low"
              name="Price_Desc"
              value={radioButtons.Price_Desc}
              valueChangeHandler={radioHandler}
              style={{ marginBottom: 16 }}
            />
            <AppRadio
              Icon={() => {
                return <SortLowHigh />;
              }}
              label="Low to High"
              name="Price_Asc"
              value={radioButtons.Price_Asc}
              valueChangeHandler={radioHandler}
              style={{ marginBottom: 16 }}
            />
            <AppText textStyle="subtitle2" customStyle={{ marginBottom: 16 }}>
              Condition
            </AppText>
            <AppCheckbox
              Icon={() => {
                return <SortCondition />;
              }}
              label="Brand New"
              value={checkboxBrandNew}
              valueChangeHandler={checkboxBrandNewHandler}
              style={{ marginBottom: 16 }}
            />
            <AppCheckbox
              Icon={() => {
                return <SortCondition />;
              }}
              label="Used"
              value={checkboxUsed}
              valueChangeHandler={checkboxUsedHandler}
              style={{ marginBottom: 16 }}
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
