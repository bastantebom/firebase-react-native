//import liraries
import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {ScreenHeaderTitle, PaddingView, AppText} from '@/components';
import {ScrollView} from 'react-native-gesture-handler';

import {normalize, Colors} from '@/globals';

// create a component
const PrivacyPolicy = ({togglePrivacyPolicy}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <PaddingView paddingSize={3}>
        <ScreenHeaderTitle title="Privacy Policy" close={togglePrivacyPolicy} />

        <ScrollView style={{marginTop: normalize(40)}}>
          <View>
            <AppText
              textStyle="body1medium"
              customStyle={{marginBottom: normalize(8)}}>
              Privacy Policy
            </AppText>
            <AppText textStyle="body2">Last updated: [04 August 2020]</AppText>
          </View>
          <View style={{marginTop: normalize(24)}}>
            <AppText textStyle="body1">
              Servbees Pte. Ltd. and its affiliates (collectively “Servbees”,
              “we”, or “us”) is a marketplace platform company that provides an
              on-demand service (“Service”) that allows businesses (“Customers”)
              to connect with Servbees’s network of geographically distributed
              independent service providers (“Servbees”) for various short-term
              assignments as well as sellers providing different items and
              merchandise for sale for users looking for specific items /
              service or anything they need.
            </AppText>
          </View>

          <View style={{marginTop: normalize(24)}}>
            <AppText textStyle="body1">
              When you use our Service as a Customer or Servbees (collectively
              “user” or “you”), you share your information with us. We respect
              your privacy and want to be upfront about the information we
              collect, how we use it, whom we share it with, and inform you
              about the controls we give you to access, change or deactivate
              your account information.
            </AppText>
          </View>

          <View style={{marginTop: normalize(24)}}>
            <AppText textStyle="body1">
              Our Privacy Policy describes our practices regarding personal
              information (“Personal Data”) that we collect from users through
              our websites, the Servbees mobile application, the Servbees
              platform, and related media or services.
            </AppText>
          </View>

          <View style={{marginTop: normalize(24)}}>
            <AppText textStyle="body1">
              The important thing we want you to know is that we use information
              collected only for the purpose of providing and improving the
              Service to you. This Privacy Policy is incorporated into, and
              considered a part of, the Terms of Service or Customer Agreement
              that you agree to, when you use our Service. If you have questions
              about anything you read here, just contact us
              (https://help.servbees.com/support).
            </AppText>
          </View>

          <View
            style={{
              marginTop: normalize(24),
              borderTopColor: Colors.contentEbony,
              borderTopWidth: 1,
            }}>
            <AppText
              textStyle="body1medium"
              customStyle={{marginTop: normalize(24)}}>
              1. DEFINITIONS
            </AppText>
          </View>

          <View
            style={{
              marginTop: normalize(24),
              paddingLeft: normalize(8),
            }}>
            <AppText textStyle="body1">
              1.1 In this Privacy Policy, unless the context otherwise requires:
              “personal data” has the meaning given to it in the Personal Data
              Protection Act 2012 of Singapore.
            </AppText>
            <AppText textStyle="body1" customStyle={{marginTop: normalize(8)}}>
              “process” and “processed” has a meaning analogous to processing.{' '}
            </AppText>
            <AppText textStyle="body1" customStyle={{marginTop: normalize(8)}}>
              “processing” has the meaning given to it in the Personal Data
              Protection Act 2012 of Singapore.{' '}
            </AppText>
            <AppText textStyle="body1" customStyle={{marginTop: normalize(8)}}>
              “Service Providers” means our third-party suppliers, vendors,
              contractors and business partners, whether in Singapore or
              elsewhere and whether former, current or prospective.
            </AppText>
            <AppText textStyle="body1" customStyle={{marginTop: normalize(8)}}>
              “Services” means our products, services, content, features,
              technologies or functions offered on websites, applications and
              services operated by us or our Service Providers.
            </AppText>
            <AppText textStyle="body1" customStyle={{marginTop: normalize(8)}}>
              “We”, “we”, “our”, “us”, “Us” means I SERVBEES PTE. LTD. (Company
              Registration No. 202023057N, a company incorporated in Singapore,
              and its related corporations.
            </AppText>
            <AppText textStyle="body1" customStyle={{marginTop: normalize(8)}}>
              “You”, “you”, “Your”, “your” means the persons to whom this
              Privacy Policy applies.
            </AppText>
          </View>

          <View
            style={{
              marginTop: normalize(24),
            }}>
            <AppText textStyle="body1medium">2. YOUR CONSENT</AppText>
          </View>

          <View
            style={{
              marginTop: normalize(24),
              paddingLeft: normalize(8),
            }}>
            <AppText textStyle="body1">
              2.1 This Privacy Policy applies to any individual’s personal data
              which is in our possession or under our control, and shall govern
              your use of the Services. This Privacy Policy is in addition to
              the other terms and conditions which may apply in respect of your
              use of such Services.
            </AppText>
            <AppText textStyle="body1" customStyle={{marginTop: normalize(8)}}>
              2.2 You are deemed to have accepted this Privacy Policy when you
              provide us with personal data or otherwise sign up for, access or
              use any of our Services.
            </AppText>
            <AppText textStyle="body1" customStyle={{marginTop: normalize(8)}}>
              2.3 Notwithstanding the foregoing, you may withdraw your consent
              for us to collect, use or disclose your personal data, but this
              may affect our ability to provide you with the Services. We will
              not be liable for any failure to provide any Services if such
              failure is due to your consent hereunder being withdrawn or your
              personal data being erased at your request.
            </AppText>
          </View>

          <View
            style={{
              marginTop: normalize(24),
            }}>
            <AppText textStyle="body1medium">
              3. COLLECTION OF PERSONAL DATA
            </AppText>
          </View>

          <View
            style={{
              marginTop: normalize(24),
              paddingLeft: normalize(8),
            }}>
            <AppText textStyle="body1">
              3.1 Data Collected. We may from time to time collect your personal
              data in order to provide you with the Services and also to improve
              your experience. Such personal data may include:
            </AppText>
            <View style={{paddingLeft: normalize(8)}}>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                3.1.1 general identification and contact information (for
                example, name, address, email address, telephone number, age,
                date of birth, gender, marital status, occupation, username,
                password, etc);
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                3.1.2 financial information and account details (for example,
                wallet addresses, bank account numbers, credit card numbers,
                assets, liabilities, salary, etc);
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                3.1.3 information from cookies, pixel tags, web beacons or
                similar technologies;
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                3.1.4 images, photographs, closed-circuit television (CCTV)
                footage, voice recordings and electronic communications;
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                3.1.5 data about the pages you access, your Internet protocol
                address, your device unique identifier, your device type, your
                geo-location information, your mobile network information,
                referral URL, statistics on page views, other information
                automatically sent to us by your device or your service
                provider;
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                3.1.6 where necessary for our business purpose, sensitive
                personal data such as your health information, racial or ethnic
                origins, religious or philosophical beliefs, trade union
                membership or biometric data; and
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                3.1.7 other information you may provide us with.
              </AppText>
            </View>
          </View>

          <View
            style={{
              marginTop: normalize(24),
              paddingLeft: normalize(8),
            }}>
            <AppText textStyle="body1">
              3.2 Collection Methods. Your personal data may be collected:
            </AppText>
            <View style={{paddingLeft: normalize(8)}}>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                3.2.1 automatically (for example, when your device or service
                provider automatically sends us that data);
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                3.2.2 from you (for example, when you submit a web form to us,
                add or update your account information, participate in
                discussions, chats or dispute resolutions, or correspond with
                us); and
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                3.2.3 from third parties (for example, from social media sites).
              </AppText>
            </View>
          </View>

          <View
            style={{
              marginTop: normalize(24),
            }}>
            <AppText textStyle="body1medium">
              3. COLLECTION OF PERSONAL DATA
            </AppText>
          </View>
        </ScrollView>
      </PaddingView>
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({});

//make this component available to the app
export default PrivacyPolicy;
