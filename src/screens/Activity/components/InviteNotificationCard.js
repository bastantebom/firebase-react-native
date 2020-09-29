import React, {useState} from 'react'
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  StyleSheet,
  Text
} from 'react-native';

import { AppText } from '@/components';
import {GlobalStyle, normalize} from '@/globals';

import { RedBadge, YellowBadge, ProfileImageDefault, PostClock } from '@/assets/images/icons';

const InviteNotificationCard = ({ name, groupName, position, props }) => {
  const [newNotif, setNewNotif] = useState(true)
  const [yellowBadge, setYellowBadge] = useState(true)

  return (
    <SafeAreaView>
      <View style={[styles.notification, {backgroundColor: newNotif ? '#F2F7FF' : '#FBFBFB'}]}>
        <View style={styles.holder}>
          <View style={styles.avatarHolder}>
            <ProfileImageDefault width={normalize(30)} height={normalize(30)} style={GlobalStyle.image}/>
            <View style={styles.badgeHolder}>
              {yellowBadge ?
                <YellowBadge width={normalize(18)} height={normalize(18)}/> : <RedBadge width={normalize(18)} height={normalize(18)}/>
              }
            </View>
          </View>
          <View style={{flexDirection: 'row', flex: 1, flexWrap: 'wrap'}}>
            <Text>
              <AppText textStyle="caption2">{props.name}{" "}</AppText>
              <AppText textStyle="caption">invited you to join{" "}</AppText>
              <AppText textStyle="caption2">{props.groupName}{" "}</AppText>
              <AppText textStyle="caption">as a{" "}</AppText>
              <AppText textStyle="caption2">{props.position}</AppText>
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
                <AppText textStyle="button3">View Profile</AppText>
            </TouchableOpacity>
              <TouchableOpacity
                style={{ paddingVertical: 6, width: 130, alignItems: 'center', backgroundColor: 'transparent', borderRadius: 5, borderColor: '#1F1A54', borderWidth: 1.5 }}>
                <AppText textStyle="button3">Decline</AppText>
              </TouchableOpacity>
          </View>
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
});

export default InviteNotificationCard
