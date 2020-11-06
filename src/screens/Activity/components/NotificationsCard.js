import React from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { AppText } from '@/components';
import { GlobalStyle, normalize } from '@/globals';

import { 
  RedBadge, 
  YellowBadge, 
  ProfileImageDefault, 
  PostClock, 
  Bee, 
  Verified, 
  NotVerified 
} from '@/assets/images/icons';

const NotificationsCard = ({ info }) => {
  const navigation = useNavigation();

  return (
    <View>
      <View style={[styles.notification, { backgroundColor: info.new ? '#F2F7FF' : '#FBFBFB' }]}>
        <View style={styles.holder}>
          <View style={styles.avatarHolder}>
            {info.category == 'Default' ?
              <Bee width={normalize(30)} height={normalize(30)} />
              : (
                <View style={styles.userInfoImageContainer}>
                  <ProfileImageDefault width={normalize(35)} height={normalize(35)} style={GlobalStyle.image} />
                </View>
              )}
            {info.category == 'Default' ? <></>
              :
              (<View style={styles.badgeHolder}>
                {info.badge == 'Yellow' && (
                  <YellowBadge width={normalize(18)} height={normalize(18)} />
                )}
                {info.badge == 'Red' && (
                  <RedBadge width={normalize(18)} height={normalize(18)} />
                )}
                {info.badge == 'Verified' && (
                  <Verified width={normalize(18)} height={normalize(18)} />
                )}
                {info.badge == 'Not Verified' && (
                  <NotVerified width={normalize(18)} height={normalize(18)} />
                )}
              </View>
              )}
          </View>
          {info.category == 'Verified' && (
            <View style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap' }}>
              <Text>
                <AppText textStyle="caption">Congratulations,</AppText>
                <AppText textStyle="caption">{" "}{info.name}!</AppText>
                <AppText textStyle="caption">{" "}Your account has been successfully verified! You may now enjoy the full features of Servbees!</AppText>
              </Text>
            </View>
          )}
          {info.category == 'Not Verified' && (
            <View style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap' }}>
              <Text>
                <AppText textStyle="caption">Your account verification has been unsuccessful. You may opt to try again.</AppText>
              </Text>
            </View>
          )}
          {info.category == 'Invite' && (
            <View style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap' }}>
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
            <View style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap' }}>
              <Text>
                <AppText textStyle="caption2">{info.name}{" "}</AppText>
                <AppText textStyle="caption">followed you</AppText>
              </Text>
            </View>
          )}
          {info.category == 'Approve' && (
            <View style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap' }}>
              <Text>
                <AppText textStyle="caption">Your request to join{" "}</AppText>
                <AppText textStyle="caption2">{info.hiveName}{" "}</AppText>
                <AppText textStyle="caption">has been approved. You can now shop items or avail services</AppText>
              </Text>
            </View>
          )}
          {info.category == 'Default' && (
            <AppText
              textStyle="caption"
              customStyle={{ marginLeft: 8, flex: 1, flexWrap: 'wrap' }}>
              {info.message}
            </AppText>
          )}
          {info.category == 'Order Approved' && (
            <View style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap' }}>
            <Text>
              <AppText textStyle="caption">Your order from{" "}</AppText>
              <AppText textStyle="caption2">{info.seller}{" "}</AppText>
              <AppText textStyle="caption">is being prepared.</AppText>
            </Text>
          </View>
          )}
          {info.category == 'Order Declined' && (
            <View style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap' }}>
            <Text>
              <AppText textStyle="caption">Your order from{" "}</AppText>
              <AppText textStyle="caption2">{info.seller}{" "}</AppText>
              <AppText textStyle="caption">has been declined.</AppText>
            </Text>
          </View>
          )}
        </View>
        <View style={[styles.holder, styles.cta]}>
          <View style={styles.holder}>
            <PostClock width={normalize(16)} height={normalize(16)} />
            <AppText customStyle={{ marginLeft: 3, color: '#8C8B98', width: normalize(33) }}>{info.time}</AppText>
          </View>
          {info.category == 'Default' ?
            (
              <View style={styles.btnHolder}>
                {info.withButton == true && (
                  <TouchableOpacity
                    style={{ paddingVertical: 6, marginRight: 10, width: 130, alignItems: 'center', backgroundColor: '#FFD400', borderRadius: 5 }}
                    onPress={() => {
                      navigation.navigate('NBTScreen', {
                        screen: 'Badge',
                        params: {
                          screen: 'BadgeScreen'
                        },
                      });
                    }}>
                    <AppText textStyle="button3">View</AppText>
                  </TouchableOpacity>
                )}
              </View>
            )
            : (
              <View style={styles.btnHolder}>
                {info.category == 'Invite' && (
                  <>
                    <TouchableOpacity
                      style={{ paddingVertical: 6, marginRight: 10, width: 130, alignItems: 'center', backgroundColor: '#FFD400', borderRadius: 5 }}>
                      <AppText textStyle="button3">View Profile</AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ paddingVertical: 6, width: 130, alignItems: 'center', backgroundColor: 'transparent', borderRadius: 5, borderColor: '#1F1A54', borderWidth: 1.5 }}>
                      <AppText textStyle="button3">Decline</AppText>
                    </TouchableOpacity>
                  </>
                )}
                {info.category == 'Follow' && (
                  <>
                    <TouchableOpacity
                      style={{ paddingVertical: 6, marginRight: 10, width: 130, alignItems: 'center', backgroundColor: '#FFD400', borderRadius: 5 }}>
                      <AppText textStyle="button3">View Profile</AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ paddingVertical: 6, width: 130, alignItems: 'center', backgroundColor: 'transparent', borderRadius: 5, borderColor: '#1F1A54', borderWidth: 1.5 }}>
                      <AppText textStyle="button3">Follow Back</AppText>
                    </TouchableOpacity>
                  </>
                )}
                {info.category == 'Approve' && (
                  <>
                    <TouchableOpacity
                      style={{ paddingVertical: 6, marginRight: 10, width: 130, alignItems: 'center', backgroundColor: '#FFD400', borderRadius: 5 }}>
                      <AppText textStyle="button3">View</AppText>
                    </TouchableOpacity>
                  </>
                )}
                {info.category == 'Verified' && (
                  <>
                    <TouchableOpacity
                      style={{ paddingVertical: 6, marginRight: 10, width: 130, alignItems: 'center', backgroundColor: '#FFD400', borderRadius: 5 }}
                      onPress={() => {
                        navigation.navigate('NBTScreen', {
                          screen: 'Verified',
                          params: {
                            screen: 'VerifiedScreen'
                          },
                        });
                      }}>
                      <AppText textStyle="button3">View</AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{ paddingVertical: 6, width: 130, alignItems: 'center', backgroundColor: 'transparent', borderRadius: 5, borderColor: '#1F1A54', borderWidth: 1.5 }}>
                      <AppText textStyle="button3">Okay</AppText>
                    </TouchableOpacity>
                  </>
                )}
                {info.category == 'Not Verified' && (
                  <>
                    <TouchableOpacity
                      style={{ paddingVertical: 6, marginRight: 10, width: 130, alignItems: 'center', backgroundColor: '#FFD400', borderRadius: 5 }}>
                      <AppText textStyle="button3">Verify Again</AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ paddingVertical: 6, width: 130, alignItems: 'center', backgroundColor: 'transparent', borderRadius: 5, borderColor: '#1F1A54', borderWidth: 1.5 }}>
                      <AppText textStyle="button3">Okay</AppText>
                    </TouchableOpacity>
                  </>
                )}
                {info.category == 'Order Approved' && (
                  <>
                    <TouchableOpacity
                      style={{ paddingVertical: 6, marginRight: 10, width: 130, alignItems: 'center', backgroundColor: '#FFD400', borderRadius: 5 }}>
                      <AppText textStyle="button3">Track Order</AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ paddingVertical: 6, width: 130, alignItems: 'center', backgroundColor: 'transparent', borderRadius: 5, borderColor: '#1F1A54', borderWidth: 1.5 }}>
                      <AppText textStyle="button3">Contact</AppText>
                    </TouchableOpacity>
                  </>
                )}
                 {info.category == 'Order Declined' && (
                  <>
                    <TouchableOpacity
                      style={{ paddingVertical: 6, marginRight: 10, width: 130, alignItems: 'center', backgroundColor: '#FFD400', borderRadius: 5 }}>
                      <AppText textStyle="button3">Re-order</AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ paddingVertical: 6, width: 130, alignItems: 'center', backgroundColor: 'transparent', borderRadius: 5, borderColor: '#1F1A54', borderWidth: 1.5 }}>
                      <AppText textStyle="button3">Contact</AppText>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  notification: {
    padding: 14,
    marginTop: normalize(10),
    borderRadius: 4
  },
  notificationOld: {
    padding: normalize(14),
    marginTop: normalize(10),
    borderRadius: 4
  },
  holder: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarHolder: {
    position: 'relative',
    marginRight: normalize(15)
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
  },
  userInfoImageContainer: {
    height: normalize(35),
    width: normalize(35),
    borderRadius: normalize(35 / 2),
    overflow: 'hidden',
  }
});

export default NotificationsCard;