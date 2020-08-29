//import liraries
import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';

import {ScrollView} from 'react-native-gesture-handler';
import {Close} from '@/assets/images/icons/';
import {AppButton, AppViewContainer, AppText, WhiteOpacity} from '@/components';
import {Faded} from '@/assets/images';
import {normalize, Colors} from '@/globals';
// create a component
const ModalComponent = ({isModalVisible, onClose, modalContentNumber}) => {
  //const [isModalVisible, setModalVisible] = useState(false);
  const [modalContent] = useState([
    {
      title: 'Terms & Services',
    },
    {
      title: 'Payments Terms of Servbees',
    },
    {
      title: 'Privacy Policy',
    },
  ]);

  return (
    <Modal isVisible={isModalVisible}>
      <View style={styles.modalWrapper}>
        <TouchableOpacity style={styles.closeIconWrapper} onPress={onClose}>
          <Close height={24} width={24} />
        </TouchableOpacity>

        <ScrollView>
          <AppViewContainer>
            <AppText textStyle="display5">Privacy Policy</AppText>
          </AppViewContainer>
          <AppViewContainer customStyle={styles.contentWrapper}>
            <View>
              <AppText
                textStyle="body1medium"
                customStyle={{marginBottom: normalize(8)}}>
                Privacy Policy
              </AppText>
              <AppText textStyle="body2">
                Last updated: [04 August 2020]
              </AppText>
            </View>
            <View style={{marginTop: normalize(24)}}>
              <AppText textStyle="body1">
                Servbees Pte. Ltd. and its affiliates (collectively “Servbees”,
                “we”, or “us”) is a marketplace platform company that provides
                an on-demand service (“Service”) that allows businesses
                (“Customers”) to connect with Servbees’s network of
                geographically distributed independent service providers
                (“Servbees”) for various short-term assignments as well as
                sellers providing different items and merchandise for sale for
                users looking for specific items / service or anything they
                need.
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
                The important thing we want you to know is that we use
                information collected only for the purpose of providing and
                improving the Service to you. This Privacy Policy is
                incorporated into, and considered a part of, the Terms of
                Service or Customer Agreement that you agree to, when you use
                our Service. If you have questions about anything you read here,
                just contact us (https://help.servbees.com/support).
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
                1.1 In this Privacy Policy, unless the context otherwise
                requires: “personal data” has the meaning given to it in the
                Personal Data Protection Act 2012 of Singapore.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                “process” and “processed” has a meaning analogous to processing.{' '}
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                “processing” has the meaning given to it in the Personal Data
                Protection Act 2012 of Singapore.{' '}
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                “Service Providers” means our third-party suppliers, vendors,
                contractors and business partners, whether in Singapore or
                elsewhere and whether former, current or prospective.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                “Services” means our products, services, content, features,
                technologies or functions offered on websites, applications and
                services operated by us or our Service Providers.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                “We”, “we”, “our”, “us”, “Us” means I SERVBEES PTE. LTD.
                (Company Registration No. 202023057N, a company incorporated in
                Singapore, and its related corporations.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
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
                2.1 This Privacy Policy applies to any individual’s personal
                data which is in our possession or under our control, and shall
                govern your use of the Services. This Privacy Policy is in
                addition to the other terms and conditions which may apply in
                respect of your use of such Services.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                2.2 You are deemed to have accepted this Privacy Policy when you
                provide us with personal data or otherwise sign up for, access
                or use any of our Services.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
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
                3.1 Data Collected. We may from time to time collect your
                personal data in order to provide you with the Services and also
                to improve your experience. Such personal data may include:
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
                  personal data such as your health information, racial or
                  ethnic origins, religious or philosophical beliefs, trade
                  union membership or biometric data; and
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
                  3.2.3 from third parties (for example, from social media
                  sites).
                </AppText>
              </View>
            </View>

            <View
              style={{
                marginTop: normalize(24),
              }}>
              <AppText textStyle="body1medium">
                4. PURPOSES FOR COLLECTION, USE AND PROCESSING OF PERSONAL DATA
              </AppText>
            </View>
            <View
              style={{
                marginTop: normalize(24),
                paddingLeft: normalize(8),
              }}>
              <AppText textStyle="body1">
                4.1 Core Business Purpose. We may collect, use or process
                personal data for one or more of the following business
                purposes:
              </AppText>
              <View style={{paddingLeft: normalize(8)}}>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  4.1.1 to provide you with the Services; measure the
                  performance of our Services; monitor the Services provided by
                  or made available through us;
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  4.1.2 process payments made or received by you;
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  4.1.3 determine your geographic location, provide localized or
                  targeted content, provide you with customized or personalized
                  recommendations or content, determine your Internet service
                  provider, respond to any inquiries, requests, queries or
                  feedback; optimize our selection and recommendation algorithms
                  and delivery;
                </AppText>

                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  4.1.4 communicate with you (such as by email, text messaging,
                  online messaging, push notifications) to assist you with
                  operational requests such as password reset requests;
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  4.1.5 verify your identity; conduct due diligence checks;
                </AppText>

                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  4.1.6 prevent, detect and investigate fraud or other
                  potentially prohibited or illegal activities; to detect,
                  prevent and remediate any violations of our policies or terms
                  and conditions;
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  4.1.7 address or investigate any complaints, claims or
                  disputes;
                </AppText>

                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  4.1.8 handle requests for data access or correction;
                </AppText>

                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  4.1.9 analyze and understand our users; improve our services
                  (including our user interface experiences); participate in
                  industry exercises and studies;
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  4.1.10 coach employees and Service Providers; monitor for
                  quality assurance;
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  4.1.11 enforce any obligations owed to us;
                </AppText>

                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  4.1.12 seek professional advice, such as legal advice;
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  4.1.13 prepare and maintain financial reporting, regulatory
                  reporting, management reporting, risk management, audit and
                  record keeping purposes;
                </AppText>

                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  4.1.14 enable any actual or proposed assignee, transferee,
                  participant or sub-participant of our rights, business or
                  obligations to evaluate any proposed transaction; negotiate a
                  business transaction, including (but not limited to) any
                  financing, merger, acquisition or liquidation;
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  4.1.15 manage our infrastructure and business operations
                  (including information technology infrastructure) and
                  complying with internal policies and procedures;
                </AppText>

                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  4.1.16 conduct due diligence enquiries and comply with
                  enforcement of tax, sanctions or prevention or detection of
                  money laundering, terrorism financing or other unlawful
                  activities;
                </AppText>

                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  4.1.17 comply with all applicable laws, regulations, rules,
                  directions, orders, instructions and requests from any
                  authorities (whether local or foreign), including any
                  regulatory, governmental, tax and law enforcement authorities
                  or other authorities; and
                </AppText>

                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  4.1.18 any other purpose specifically provided for in any
                  particulate product or service offered by us or permitted or
                  required by law or the relevant authorities.
                </AppText>
              </View>
              <View
                style={{
                  marginTop: normalize(24),
                  paddingLeft: normalize(8),
                }}>
                <AppText textStyle="body1">
                  4.2 Marketing Purpose. We may also collect, use or process
                  your personal data to:
                </AppText>
                <View style={{paddingLeft: normalize(8)}}>
                  <AppText
                    textStyle="body1"
                    customStyle={{marginTop: normalize(8)}}>
                    4.2.1 offer you our Services (such as special offers,
                    promotions, contests or entitlements that may be of interest
                    to you or for which you may be eligible), via various modes
                    of communication such as email, short message service (SMS)
                    and push notifications; and
                  </AppText>
                  <AppText
                    textStyle="body1"
                    customStyle={{marginTop: normalize(8)}}>
                    4.2.2 improve and personalize the Services, content and
                    advertisements.
                  </AppText>

                  <AppText
                    textStyle="body1"
                    customStyle={{marginTop: normalize(8)}}>
                    If you do not wish to receive marketing communications from
                    us or to participate in our advertisement personalization
                    program, please let us know.
                  </AppText>
                </View>
              </View>
            </View>
            <View
              style={{
                marginTop: normalize(24),
              }}>
              <AppText textStyle="body1medium">
                5. PURPOSES FOR COLLECTION, USE AND PROCESSING OF PERSONAL DATA
              </AppText>
              <View
                style={{
                  marginTop: normalize(24),
                  paddingLeft: normalize(8),
                }}>
                <AppText textStyle="body1">
                  5.1 We may from time to time disclose your personal data to
                  any of our employees, personnel, our Service Providers or to
                  third parties, whether located in Singapore or elsewhere, in
                  order to carry out the purposes set out above. When we
                  disclose your personal data to such persons, we will request
                  that they also comply with this Privacy Policy.
                </AppText>

                <AppText textStyle="body1">
                  5.2 We may transfer, store, process and/or deal with your
                  personal data outside of Singapore, in compliance with
                  applicable data protection or privacy laws.
                </AppText>
              </View>
            </View>
            <View
              style={{
                marginTop: normalize(24),
              }}>
              <AppText textStyle="body1medium">
                6. RETENTION OF PERSONAL DATA
              </AppText>
              <View
                style={{
                  marginTop: normalize(24),
                  paddingLeft: normalize(8),
                }}>
                <AppText textStyle="body1">
                  6.1 Your personal data is retained for so long as the purpose
                  for which it was collected remains and until it is no longer
                  necessary for any other legal or business purposes.
                </AppText>
              </View>
            </View>
            <View
              style={{
                marginTop: normalize(24),
              }}>
              <AppText textStyle="body1medium">
                7. ACCESS, CORRECTION, ERASURE AND RESTRICTION
              </AppText>
              <View
                style={{
                  marginTop: normalize(24),
                  paddingLeft: normalize(8),
                }}>
                <AppText textStyle="body1">
                  7.1 You may request access, receive, port, restrict
                  processing, seek rectification or make corrections to, or
                  request erasure of your personal data held by us, but we may
                  charge a fee for processing such requests. All such requests
                  will be processed in accordance with applicable law.
                </AppText>
                <AppText textStyle="body1">
                  7.2 We will take commercially reasonable steps to verify your
                  identity before granting access to, making any changes to or
                  erasing your personal data at your request.
                </AppText>
                <AppText textStyle="body1">
                  7.3 There may be circumstances whereby we are unable to
                  provide access, such as where the information contains legal
                  privilege. If we determine that access should be restricted in
                  any particular instance, we will explain why that
                  determination was made and you may contact our Data Protection
                  Officer for any further enquiries.
                </AppText>
                <AppText textStyle="body1">
                  7.4 If you believe that any personal data we have of you is
                  inaccurate, out of date, incomplete, irrelevant or misleading,
                  please let us know. We will endeavour to respond within a
                  reasonable time and, where necessary, promptly correct any
                  personal data found to be inaccurate, incomplete or out of
                  date.
                </AppText>
              </View>
            </View>

            <View
              style={{
                marginTop: normalize(24),
              }}>
              <AppText textStyle="body1medium">8. SECURITY</AppText>
              <View
                style={{
                  marginTop: normalize(24),
                  paddingLeft: normalize(8),
                }}>
                <AppText textStyle="body1">
                  8.1 We will take necessary steps to protect your personal
                  data. However, no data transmission or storage of personal
                  data can be guaranteed to be 100% secure. As such, we cannot
                  ensure or warrant the security of any personal data that you
                  transmit to us and you do so at your own risk.
                </AppText>
              </View>
            </View>

            <View
              style={{
                marginTop: normalize(24),
              }}>
              <AppText textStyle="body1medium">
                9. COOKIES AND RELATED TECHNOLOGIES
              </AppText>
              <View
                style={{
                  marginTop: normalize(24),
                  paddingLeft: normalize(8),
                }}>
                <AppText textStyle="body1">
                  9.1 When you access or use our Services, we may store some
                  data on your device using technologies such as a cookie or
                  other local storage provided by your browser or application
                  (collectively, the “Cookies”). Such data is stored on your
                  device to enable us to (i) provide the Services; (ii)
                  recognise, identify or authenticate you; (iii) customise our
                  Services for you; (iv) provide advertising; (v) provide our
                  measurements and reporting; and (vi) fulfil the other purposes
                  set out above.
                </AppText>

                <AppText textStyle="body1">
                  9.2 You are free to decline or block our Cookies (insofar as
                  your browser or application permits), but this may interfere
                  with the provision of our Services and you may not be able to
                  use certain features or functions of our Services. We will not
                  be liable for any failure to provide any Services to you if
                  such failure is due to our Cookies being declined or blocked.
                </AppText>

                <AppText textStyle="body1">
                  9.3 We may also use other technologies (such as a pixel tag or
                  web beacon) for the purposes set out above.
                </AppText>
              </View>
            </View>

            <View
              style={{
                marginTop: normalize(24),
              }}>
              <AppText textStyle="body1medium">
                10. THIRD PARTY SERVICES
              </AppText>
              <View
                style={{
                  marginTop: normalize(24),
                  paddingLeft: normalize(8),
                }}>
                <AppText textStyle="body1">
                  10.1 We use third party services (such as Google Analytics,
                  Google Trends and Google Tag Manager) provided by Google LLC
                  (“Google”) to help us improve our products. Accordingly,
                  traffic and user behaviour data relating to our Services may
                  be shared with Google. You can find out more about how Google
                  collects and processes data here:
                  https://www.google.com/policies/privacy/partners/.
                </AppText>
              </View>
            </View>

            <View
              style={{
                marginTop: normalize(24),
              }}>
              <AppText textStyle="body1medium">11. EXTERNAL LINKS</AppText>
              <View
                style={{
                  marginTop: normalize(24),
                  paddingLeft: normalize(8),
                }}>
                <AppText textStyle="body1">
                  11.1 Our website may contain links or redirects to sites
                  operated by third parties. Such links or redirections are not
                  an endorsement of these third party sites nor of the third
                  parties operating them. These third party sites may also have
                  different data protection practices. We have no control over
                  and do not take responsibility for these third party sites.
                </AppText>
              </View>
            </View>

            <View
              style={{
                marginTop: normalize(24),
              }}>
              <AppText textStyle="body1medium">
                12. CHANGES TO THIS PRIVACY POLICY
              </AppText>
              <View
                style={{
                  marginTop: normalize(24),
                  paddingLeft: normalize(8),
                }}>
                <AppText textStyle="body1">
                  12.1 We may from time to time amend the terms of this Privacy
                  Policy by posting a revised version of this Privacy Policy on
                  our website. The revised version shall take effect from the
                  published effective date and notification will be made through
                  our website or via email. If you continue to use our Services
                  after the notice period, you will be deemed to have consented
                  to the amendments made in such revised version
                </AppText>
              </View>
            </View>
            <View
              style={{
                marginTop: normalize(24),
              }}>
              <AppText textStyle="body1medium">13. CONTACT US</AppText>
              <View
                style={{
                  marginTop: normalize(24),
                  paddingLeft: normalize(8),
                }}>
                <AppText textStyle="body1">
                  13.1 For any questions or comments regarding this Privacy
                  Policy, your personal information, our use and sharing
                  practices, please contact us electronically at
                  [legal@servbees.com]. We will address your concerns and
                  attempt to resolve any privacy or data protection issues in a
                  timely manner.
                </AppText>
              </View>
            </View>
          </AppViewContainer>
        </ScrollView>
        <WhiteOpacity />
        <View style={{marginTop: normalize(16)}}>
          <AppButton
            text="Agree"
            type="secondary"
            height="xl"
            onPress={onClose}
          />
        </View>
      </View>
    </Modal>
  );
};

// define your styles
const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
    margin: -24,
    paddingTop: 40,
    paddingRight: 24,
    paddingBottom: 24,
    paddingLeft: 24,
  },

  closeIconWrapper: {paddingBottom: 16},

  contentWrapper: {
    padding: 5,
    marginTop: 12,
  },
});

//make this component available to the app
export default ModalComponent;
