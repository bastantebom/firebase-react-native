import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet
} from 'react-native';

import {
  AppText,
  AppCheckbox,
  AppInput,
  ScreenHeaderTitle,
} from '@/components';
import { useNavigation } from '@react-navigation/native';

const PaymentMethodModal = () => {
  const navigation = useNavigation();
  const [cash, setCash] = useState(false);
  const [gcash, setGcash] = useState(false);
  const [paymaya, setPaymaya] = useState(false);
  const [onlineBanking, setOnlineBanking] = useState(false);
  const [others, setOthers] = useState(false);
  const [bank, setBank] = useState('');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} >
      <ScreenHeaderTitle
        close={() => navigation.goBack()}
        title="Payment Methods"
        paddingSize={2}
      />
      <View style={{ padding: 16 }}>
        <AppText textStyle="body2">Something, something</AppText>
        <AppText textStyle="captionDashboard">Something, something</AppText>
        <View
          style={styles.withBorder}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 10
            }}>
            <AppText>Cash</AppText>
            <AppCheckbox
              value={cash}
              valueChangeHandler={() => setCash(!cash)}
            />
          </View>
        </View>
        <View
          style={styles.withBorder}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 10
            }}>
            <AppText>GCash</AppText>
            <AppCheckbox
              value={gcash}
              valueChangeHandler={() => setGcash(!gcash)}
            />
          </View>
        </View>
        <View
          style={styles.withBorder}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 10
            }}>
            <AppText>Paymaya</AppText>
            <AppCheckbox
              value={paymaya}
              valueChangeHandler={() => setPaymaya(!paymaya)}
            />
          </View>
        </View>
        <View style={styles.withBorder}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 10
            }}>
            <AppText>Online Banking</AppText>
            <AppCheckbox
              value={onlineBanking}
              valueChangeHandler={() => setOnlineBanking(!onlineBanking)}
            />
          </View>
          {onlineBanking && (
            <AppInput
              style={{ marginBottom: 16 }}
              label="Banks Preferred"
              placeholder="BDO, BPI"
              // value={bank}
              onChangeText={(text) => setBank(text)}
            />)}
        </View>
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 10
            }}>
            <AppText>Others</AppText>
            <AppCheckbox
              value={others}
              valueChangeHandler={() => setOthers(!others)}
            />
          </View>
          {others && (
            <AppInput
              style={{ marginBottom: 16 }}
              label="Other methods"
              placeholder="PayPal"
              // value={bank}
              onChangeText={(text) => setBank(text)}
            />)}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  withBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  }
})

export default PaymentMethodModal;
