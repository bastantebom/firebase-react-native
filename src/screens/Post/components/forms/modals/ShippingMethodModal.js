import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet
} from 'react-native';

import {
  AppText,
  Switch,
  ScreenHeaderTitle,
} from '@/components';

import {Colors} from '@/globals';

const ShippingMethodModal = ({closeModal}) => { 
  const [pickUp, setPickUp] = useState(false)
  const [delivery, setDelivery] =useState(false)
  
  return (
    <SafeAreaView style={{flex: 1}} >
      <ScreenHeaderTitle
        close={closeModal}
        title="Shipping Methods"
        paddingSize={2}
      />
      <View style={{paddingHorizontal: 16}}>
        <View style={styles.withBorder}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <AppText textStyle="body2">Pick up</AppText>
            <Switch
              value={pickUp}
              onValueChange={() => setPickUp(!pickUp)}
            />
          </View>
          <AppText textStyle="captionDashboard" color={Colors.contentPlaceholder}>
            Orders can be picked up at your specified address.
          </AppText>
        </View>
        <View style={{paddingVertical: 20}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}>
            <AppText textStyle="body2">Delivery</AppText>
            <Switch
              value={delivery}
              onValueChange={() => setDelivery(!delivery)}
            />
          </View>
          <AppText textStyle="captionDashboard" color={Colors.contentPlaceholder}>
            Orders can be shipped nationwide or within your specifid area.
          </AppText>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  withBorder: {
    borderBottomWidth: 1, 
    borderBottomColor: '#e8e8e8',
    paddingVertical: 20
  }
})

export default ShippingMethodModal;