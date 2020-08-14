import React from 'react';
import {View} from 'react-native';
import {Divider} from 'react-native-paper';

import {AppText} from '@/components';
import {normalize, Colors, joinedDate, GlobalStyle} from '@/globals';
import {
  Verified,
  Temperature,
  StarRating,
  BeeJoinedTime,
  NavigationPinRed,
} from '@/assets/images/icons';
import {TouchableOpacity} from 'react-native-gesture-handler';
//import {joinedDate} from '@/globals/Utils';

const ProfileInfo = ({profileData}) => {
  const {
    display_name,
    is_verified,
    full_name,
    username,
    temperature_history,
    ratings_count,
    ratings_average,
    date_joined,
    address,
  } = profileData;

  return (
    <View style={{paddingHorizontal: 16, backgroundColor: 'white'}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <AppText
          textStyle="subtitle1"
          color={Colors.primaryMidnightBlue}
          customStyle={{marginRight: 8}}>
          {display_name ? display_name : full_name}
        </AppText>

        {/* <Verified width={normalize(11)} height={normalize(12.4)} /> */}
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
        <AppText textStyle="body3" customStyle={{marginRight: 16}}>
          {full_name}
        </AppText>
        {username ? (
          <AppText textStyle="body2" customStyle={{marginRight: 16}}>
            @{username}
          </AppText>
        ) : (
          <TouchableOpacity>
            <AppText textStyle="body2" customStyle={{marginRight: 16}}>
              @ADDUSERID
            </AppText>
          </TouchableOpacity>
        )}
      </View>

      {/* <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 16,
        }}> */}
      {/* <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 8,
            paddingVertical: 4,
            backgroundColor: Colors.secondarySolitude,
            // backgroundColor: 'black',
            borderRadius: 16,
          }}> */}
      {/* <Temperature width={normalize(16)} height={normalize(16)} />
          <AppText textStyle="caption" customStyle={{marginLeft: 4}}>{temperature_history[0].temp}°C 1h ago </AppText> */}
      {/* </View> */}
      {/* </View> */}

      {/* <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 16}}>
        <StarRating width={normalize(16)} height={normalize(16)} />
        <AppText textStyle="body3" customStyle={{marginRight: 8}}>
          {' '}
          {ratings_average} out of 5
        </AppText>
        <AppText textStyle="body2" customStyle={{marginRight: 8}}>
          ({ratings_count} Ratings)
        </AppText>
      </View> */}

      <Divider
        style={[
          GlobalStyle.dividerStyle,
          {marginVertical: 16, backgroundColor: 'rgba(164, 176, 190, 0.6)'},
        ]}
      />

      <View
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 16}}>
        <BeeJoinedTime width={normalize(16)} height={normalize(16)} />
        <AppText
          textStyle="button3"
          customStyle={{marginLeft: 4, marginRight: 16}}>
          Joined {joinedDate(date_joined)}
        </AppText>
        <NavigationPinRed width={normalize(16)} height={normalize(16)} />
        <AppText
          textStyle="button3"
          customStyle={{marginLeft: 4, marginRight: 16}}>
          {address ? address.city : 'Manila City'}
        </AppText>
      </View>
    </View>
  );
};

export default ProfileInfo;
