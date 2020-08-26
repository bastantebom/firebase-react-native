//import liraries
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import {ScreenHeaderTitle, PaddingView, AppText} from '@/components';
import {ArrowRight} from '@/assets/images/icons';
import {normalize} from '@/globals';
import AboutServbees from '@/screens/Profile/components/About/AboutServbees';
import PrivacyPolicy from '@/screens/Profile/components/About/PrivacyPolicy';
import PaymentTerms from '@/screens/Profile/components/About/PaymentTerms';
import TermsOfUse from '@/screens/Profile/components/About/TermsOfUse';
import Modal from 'react-native-modal';

// create a component
const About = ({toggleAbout}) => {
  const [servbees, setServbees] = useState(false);
  const [privacyPolicy, setPrivacyPolicy] = useState(false);
  const [paymentTerms, setPaymentTerms] = useState(false);
  const [termsOfUse, setTermsOfUse] = useState(false);

  const toggleServbees = () => {
    setServbees(!servbees);
  };
  const togglePrivacyPolicy = () => {
    setPrivacyPolicy(!privacyPolicy);
  };

  const togglePaymentTerms = () => {
    setPaymentTerms(!paymentTerms);
  };

  const toggleTermsOfUse = () => {
    setTermsOfUse(!termsOfUse);
  };

  const copyScreens = [
    {
      id: 0,
      title: 'Servbees',
    },
    {
      id: 1,
      title: 'Privacy Policy',
    },
    {
      id: 2,
      title: 'Payment Terms of Service',
    },
    {
      id: 3,
      title: 'Terms of Use',
    },
  ];

  return (
    <SafeAreaView style={{flex: 1}}>
      <PaddingView paddingSize={3}>
        <ScreenHeaderTitle title="About" close={toggleAbout} />
        <View style={{marginTop: normalize(40)}}>
          {copyScreens.map((item) => {
            return (
              <View key={item.id}>
                <TouchableOpacity
                  style={[styles.list, {marginBottom: 28}]}
                  onPress={
                    item.id === 0
                      ? toggleServbees
                      : item.id === 1
                      ? togglePrivacyPolicy
                      : item.id === 2
                      ? togglePaymentTerms
                      : toggleTermsOfUse
                  }
                  // onPress={onPress}
                >
                  <View style={styles.list}>
                    <AppText textStyle="body1">{item.title}</AppText>
                  </View>
                  <ArrowRight />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </PaddingView>
      {/* About Servbees Modal */}
      <Modal
        isVisible={servbees}
        animationIn="slideInRight"
        animationInTiming={450}
        animationOut="slideOutLeft"
        animationOutTiming={450}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        {/* <FilterSlider modalToggler={toggleModal} /> */}
        <AboutServbees toggleServbees={toggleServbees} />
      </Modal>
      {/* Privacy Policy Modal */}
      <Modal
        isVisible={privacyPolicy}
        animationIn="slideInRight"
        animationInTiming={450}
        animationOut="slideOutRight"
        animationOutTiming={450}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        {/* <FilterSlider modalToggler={toggleModal} /> */}
        <PrivacyPolicy togglePrivacyPolicy={togglePrivacyPolicy} />
      </Modal>

      {/* Payment Terms Modal */}
      <Modal
        isVisible={paymentTerms}
        animationIn="slideInRight"
        animationInTiming={450}
        animationOut="slideOutRight"
        animationOutTiming={450}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        {/* <FilterSlider modalToggler={toggleModal} /> */}
        <PaymentTerms togglePaymentTerms={togglePaymentTerms} />
      </Modal>

      {/* Payment Terms Modal */}
      <Modal
        isVisible={termsOfUse}
        animationIn="slideInRight"
        animationInTiming={450}
        animationOut="slideOutRight"
        animationOutTiming={450}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        {/* <FilterSlider modalToggler={toggleModal} /> */}
        <TermsOfUse toggleTermsOfUse={toggleTermsOfUse} />
      </Modal>
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    // marginBottom: 28,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

//make this component available to the app
export default About;
