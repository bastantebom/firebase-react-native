import React, {useState} from 'react'
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  StyleSheet,
  Text
} from 'react-native';

import { AppText, AppButton } from '@/components';
import {normalize} from '@/globals';

import { RedBadge, ProfileImageDefault, PostClock, Bee } from '@/assets/images/icons';

const NotificationCard = ({ name, groupName, position, props }) => {
  const [newNotif, setNewNotif] = useState()
  const [inviteNotif, setInviteNotif] = useState()
  const [followNotif, setFollowNotif] = useState()
  const [approvedNotif, setApprovedNotif] = useState()
  const [reminder, setReminder] = useState(true)

  return (
    <SafeAreaView>
      <View style={[styles.notification, {backgroundColor: newNotif ? '#F2F7FF' : '#FBFBFB'}]}>
        <View style={styles.holder}>
          <View style={styles.avatarHolder}>
          <ProfileImageDefault width={normalize(30)} height={normalize(30)}/>
          <View style={styles.badgeHolder}>
            <RedBadge width={normalize(18)} height={normalize(18)}/>
          </View>
          </View>
          <View style={{flexDirection: 'row', flex: 1, flexWrap: 'wrap'}}>
            <Text>
              <AppText>{props.name}{" "}</AppText>
              {inviteNotif ? (
                <>
                  <AppText>invited you to join{" "}</AppText>
                  <AppText>{props.groupName}{" "}</AppText>
                  <AppText>as a{" "}</AppText>
                  <AppText>{props.position}</AppText>
                </>
              ) : <></>}
              {followNotif ? (
                <>
                  <AppText>followed you</AppText>
                </>
              ) : <></>}
              {approvedNotif ? (
                <>
                  <Text>
                    <AppText>Your request to join{" "}</AppText>
                    <AppText>{groupName}</AppText>
                    <AppText>has been approved. You can now shop items or avail services{" "}</AppText>
                  </Text>
                </>
              ) : <></>}
            </Text>
          </View>
        </View>
        <View style={[styles.holder, styles.cta]}>
          <View style={styles.holder}>
            <PostClock width={normalize(16)} height={normalize(16)} />
            <AppText customStyle={{marginLeft: 3, color: '#8C8B98'}}>3s</AppText>
          </View>
          <View style={styles.btnHolder}>
            <TouchableOpacity
              style={{ paddingVertical: 6, marginRight: 10, width: 130, alignItems: 'center', backgroundColor: '#FFD400', borderRadius: 5 }}>
              <AppText textStyle="button3">
                {followNotif ? 'View' : 'View Profile'}
              </AppText>
            </TouchableOpacity>
            {approvedNotif ? <></> : (
              <TouchableOpacity
                style={{ paddingVertical: 6, width: 130, alignItems: 'center', backgroundColor: 'transparent', borderRadius: 5, borderColor: '#1F1A54', borderWidth: 1.5 }}>
                <AppText textStyle="button3">
                  {followNotif ? 'Follow Back' : 'Decline'}
                </AppText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      {reminder && (
        <View style={styles.notification}>
          <View style={styles.holder}>
            <Bee width={normalize(30)} height={normalize(30)}/>
            <AppText customStyle={{marginLeft: 15, flex: 1, flexWrap: 'wrap'}}>Hey Wayne! Don't forget, June 21st is Father's Day. Check out and shop our collection of brands that dads love.</AppText>
          </View>
        </View>
        )
      }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  notification: {
    padding: 14,
    marginTop: 10,
    // backgroundColor: '#F2F7FF',
    // backgroundColor: newNotif ? '#F2F7FF' : '#FBFBFB',
    borderRadius: 4
  },
  notificationOld: {
    padding: 14,
    marginTop: 10,
    // backgroundColor: '#FBFBFB',
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
});

export default NotificationCard
