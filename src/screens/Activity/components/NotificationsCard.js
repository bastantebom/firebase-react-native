import React from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native';

import { AppText } from '@/components';
import {GlobalStyle, normalize} from '@/globals';

import { RedBadge, YellowBadge, ProfileImageDefault, PostClock, Bee } from '@/assets/images/icons';

const NotificationsCard = ({info}) => {
  return (
    <SafeAreaView>
      <View style={[styles.notification, {backgroundColor: info.new ? '#F2F7FF' : '#FBFBFB'}]}>
        <View style={styles.holder}>
          <View style={styles.avatarHolder}>
            {info.category == 'Reminder' ? 
              <Bee width={normalize(30)} height={normalize(30)}/>
            :
              <View style={styles.userInfoImageContainer}>
                <ProfileImageDefault width={normalize(35)} height={normalize(35)} style={GlobalStyle.image}/>
              </View>
            }
             {info.category == 'Reminder' ? <></> 
             :      
              (<View style={styles.badgeHolder}>
                {info.badge == 'Yellow' && (
                  <YellowBadge width={normalize(18)} height={normalize(18)}/> 
                )}
                {info.badge == 'Red' && (
                  <RedBadge width={normalize(18)} height={normalize(18)}/>
                )}
              </View>
              )}
          </View>
          {info.category == 'Invite' && (
            <View style={{flexDirection: 'row', flex: 1, flexWrap: 'wrap'}}>
              <Text>
                <AppText textStyle="caption2">{info.name}{" "}</AppText>
                <AppText textStyle="caption">invited you to join{" "}</AppText>
                <AppText textStyle="caption2">{info.groupName}{" "}</AppText>
                <AppText textStyle="caption">as a{" "}</AppText>
                <AppText textStyle="caption2">{info.position}</AppText>
              </Text>
            </View>
          )}
          {info.category == 'Follow' && (
            <View style={{flexDirection: 'row', flex: 1, flexWrap: 'wrap'}}>
              <Text>
                <AppText textStyle="caption2">{info.name}{" "}</AppText>
                <AppText textStyle="caption">followed you</AppText>
              </Text>
            </View>
          )}
          {info.category == 'Approve' && (
              <View style={{flexDirection: 'row', flex: 1, flexWrap: 'wrap'}}>
              <Text>
                <AppText textStyle="caption">Your request to join{" "}</AppText>
                <AppText textStyle="caption2">{info.hiveName}{" "}</AppText>
                <AppText textStyle="caption">has been approved. You can now shop items or avail services</AppText>
              </Text>
            </View>
          )}
          {info.category == 'Reminder' && (
            <AppText 
              textStyle="caption" 
              customStyle={{marginLeft: 15, flex: 1, flexWrap: 'wrap'}}>
                Hey {info.name}! {info.reminder}
            </AppText>
          )}
        </View>
        <View style={[styles.holder, styles.cta]}>
          <View style={styles.holder}>
            <PostClock width={normalize(16)} height={normalize(16)} />
            <AppText customStyle={{marginLeft: 3, color: '#8C8B98'}}>{info.time}</AppText>
          </View>
          {info.category == 'Reminder' ? <></> 
          
          : (<View style={styles.btnHolder}>
            <TouchableOpacity
              style={{ paddingVertical: 6, marginRight: 10, width: 130, alignItems: 'center', backgroundColor: '#FFD400', borderRadius: 5 }}>
              {info.category == 'Approve' ?  
                <AppText textStyle="button3">View</AppText> :
                <AppText textStyle="button3">View Profile</AppText>
              }
            </TouchableOpacity>
            {info.category == 'Approve' ? 
              <></> : 
              (<TouchableOpacity
                  style={{ paddingVertical: 6, width: 130, alignItems: 'center', backgroundColor: 'transparent', borderRadius: 5, borderColor: '#1F1A54', borderWidth: 1.5 }}>
                  {info.category == 'Invite' ?
                    <AppText textStyle="button3">Decline</AppText> : 
                    <AppText textStyle="button3">Follow Back</AppText>
                  }
                </TouchableOpacity>
              )}
          </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  notification: {
    padding: 14,
    marginTop: 10,
    borderRadius: 4
  },
  notificationOld: {
    padding: 14,
    marginTop: 10,
    borderRadius: 4
  },
  holder: {
    flexDirection: 'row', 
    alignItems: 'center'
  },
  avatarHolder: {
    position: 'relative', 
    marginRight: 15
  },
  badgeHolder: {
    position: 'absolute', 
    bottom: -5,
    right: -5
  },
  cta: {
    paddingTop: 20
  },
  btnHolder: {
    flexDirection: 'row',
    marginLeft: 20
  },
  userInfoImageContainer: {
    height: normalize(35),
    width: normalize(35),
    borderRadius: normalize(35 / 2),
    overflow: 'hidden',
  }
});

export default NotificationsCard;