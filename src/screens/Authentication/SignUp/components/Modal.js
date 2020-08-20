//import liraries
import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';

import {ScrollView} from 'react-native-gesture-handler';
import {Close} from '@/assets/images/icons/';
import {AppButton, AppViewContainer, AppText, WhiteOpacity} from '@/components';
import {Faded} from '@/assets/images';
import {normalize} from '@/globals';
// create a component
const ModalComponent = ({isModalVisible, onClose, modalContentNumber}) => {
  //const [isModalVisible, setModalVisible] = useState(false);
  const [modalContent] = useState([
    {
      title: 'Terms & Services',
      description:
        'TERMS AND CONDITIONS OF USE\n Last Updated: July 2020 \n\nHello and Welcome to our Terms and Conditions of Use. This is important because it affects your legal rights. Thus, We encourage you to read them, together with our Privacy Policy and other terms referenced in this document, carefully.\n\n AGREEMENT AND ACCEPTANCE Welcome to the Servbees ("Application")! The following Terms and Conditions ("T&C" or "Terms) serve as a binding legal agreement between you ("You/Your", "Member") and the Program Operator—Servbees Inc. ("Program Operator", "We" "Us" or "Our"). These Terms, which include the (i) Privacy Policy (ii) Mechanics and/or (iii) Communication Materials, Notification or any guidelines TERMS AND CONDITIONS OF USE Last Updated: July 2020 Hello and Welcome to our Terms and Conditions of Use. This is important because it affects your legal rights. Thus, We encourage you to read them, together with our Privacy Policy and other terms referenced in this document, carefully.\n\n AGREEMENT AND ACCEPTANCE Welcome to the Servbees ("Application")! The following Terms and Conditions ("T&C" or "Terms) serve as a binding legal agreement between you ("You/Your", "Member") and the Program Operator—Servbees Inc. ("Program Operator", "We" "Us" or "Our"). These Terms, which include the (i) Privacy Policy (ii) Mechanics and/or (iii) Communication Materials, Notification or any guidelines TERMS AND CONDITIONS OF USE Last Updated: July 2020 Hello and Welcome to our Terms and Conditions of Use. This is important because it affects your legal rights. Thus, We encourage you to read them, together with our Privacy Policy and other terms referenced in this document, carefully.\n\n AGREEMENT AND ACCEPTANCE Welcome to the Servbees ("Application")! The following Terms and Conditions ("T&C" or "Terms) serve as a binding legal agreement between you ("You/Your", "Member") and the Program Operator—Servbees Inc. ("Program Operator", "We" "Us" or "Our"). These Terms, which include the (i) Privacy Policy (ii) Mechanics and/or (iii) Communication Materials, Notification or any guidelines TERMS AND CONDITIONS OF USE Last Updated: July 2020 Hello and Welcome to our Terms and Conditions of Use. This is important because it affects your legal rights. Thus, We encourage you to read them, together with our Privacy Policy and other terms referenced in this document, carefully.\n\n AGREEMENT AND ACCEPTANCE Welcome to the Servbees ("Application")! The following Terms and Conditions ("T&C" or "Terms) serve as a binding legal agreement between you ("You/Your", "Member") and the Program Operator—Servbees Inc. ("Program Operator", "We" "Us" or "Our"). These Terms, which include the (i) Privacy Policy (ii) Mechanics and/or (iii) Communication Materials, Notification or any guidelines TERMS AND CONDITIONS OF USE Last Updated: July 2020 Hello and Welcome to our Terms and Conditions of Use. This is important because it affects your legal rights. Thus, We encourage you to read them, together with our Privacy Policy and other terms referenced in this document, carefully.\n\n AGREEMENT AND ACCEPTANCE Welcome to the Servbees ("Application")! The following Terms and Conditions ("T&C" or "Terms) serve as a binding legal agreement between you ("You/Your", "Member") and the Program Operator—Servbees Inc. ("Program Operator", "We" "Us" or "Our"). These Terms, which include the (i) Privacy Policy (ii) Mechanics and/or (iii) Communication Materials, Notification or any guidelines TERMS AND CONDITIONS OF USE Last Updated: July 2020 Hello and Welcome to our Terms and Conditions of Use. This is important because it affects your legal rights. Thus, We encourage you to read them, together with our Privacy Policy and other terms referenced in this document, carefully.\n\n AGREEMENT AND ACCEPTANCE Welcome to the Servbees ("Application")! The following Terms and Conditions ("T&C" or "Terms) serve as a binding legal agreement between you ("You/Your", "Member") and the Program Operator—Servbees Inc. ("Program Operator", "We" "Us" or "Our"). These Terms, which include the (i) Privacy Policy (ii) Mechanics and/or (iii) Communication Materials, Notification or any guidelines',
    },
    {
      title: 'Payments Terms of Servbees',
      description:
        'TERMS AND CONDITIONS OF USE\n Last Updated: July 2020 \n\nHello and Welcome to our Terms and Conditions of Use. This is important because it affects your legal rights. Thus, We encourage you to read them, together with our Privacy Policy and other terms referenced in this document, carefully.\n\n AGREEMENT AND ACCEPTANCE Welcome to the Servbees ("Application")! The following Terms and Conditions ("T&C" or "Terms) serve as a binding legal agreement between you ("You/Your", "Member") and the Program Operator—Servbees Inc. ("Program Operator", "We" "Us" or "Our"). These Terms, which include the (i) Privacy Policy (ii) Mechanics and/or (iii) Communication Materials, Notification or any guidelines TERMS AND CONDITIONS OF USE Last Updated: July 2020 Hello and Welcome to our Terms and Conditions of Use. This is important because it affects your legal rights. Thus, We encourage you to read them, together with our Privacy Policy and other terms referenced in this document, carefully.\n\n AGREEMENT AND ACCEPTANCE Welcome to the Servbees ("Application")! The following Terms and Conditions ("T&C" or "Terms) serve as a binding legal agreement between you ("You/Your", "Member") and the Program Operator—Servbees Inc. ("Program Operator", "We" "Us" or "Our"). These Terms, which include the (i) Privacy Policy (ii) Mechanics and/or (iii) Communication Materials, Notification or any guidelines TERMS AND CONDITIONS OF USE Last Updated: July 2020 Hello and Welcome to our Terms and Conditions of Use. This is important because it affects your legal rights. Thus, We encourage you to read them, together with our Privacy Policy and other terms referenced in this document, carefully.\n\n AGREEMENT AND ACCEPTANCE Welcome to the Servbees ("Application")! The following Terms and Conditions ("T&C" or "Terms) serve as a binding legal agreement between you ("You/Your", "Member") and the Program Operator—Servbees Inc. ("Program Operator", "We" "Us" or "Our"). These Terms, which include the (i) Privacy Policy (ii) Mechanics and/or (iii) Communication Materials, Notification or any guidelines TERMS AND CONDITIONS OF USE Last Updated: July 2020 Hello and Welcome to our Terms and Conditions of Use. This is important because it affects your legal rights. Thus, We encourage you to read them, together with our Privacy Policy and other terms referenced in this document, carefully.\n\n AGREEMENT AND ACCEPTANCE Welcome to the Servbees ("Application")! The following Terms and Conditions ("T&C" or "Terms) serve as a binding legal agreement between you ("You/Your", "Member") and the Program Operator—Servbees Inc. ("Program Operator", "We" "Us" or "Our"). These Terms, which include the (i) Privacy Policy (ii) Mechanics and/or (iii) Communication Materials, Notification or any guidelines TERMS AND CONDITIONS OF USE Last Updated: July 2020 Hello and Welcome to our Terms and Conditions of Use. This is important because it affects your legal rights. Thus, We encourage you to read them, together with our Privacy Policy and other terms referenced in this document, carefully.\n\n AGREEMENT AND ACCEPTANCE Welcome to the Servbees ("Application")! The following Terms and Conditions ("T&C" or "Terms) serve as a binding legal agreement between you ("You/Your", "Member") and the Program Operator—Servbees Inc. ("Program Operator", "We" "Us" or "Our"). These Terms, which include the (i) Privacy Policy (ii) Mechanics and/or (iii) Communication Materials, Notification or any guidelines TERMS AND CONDITIONS OF USE Last Updated: July 2020 Hello and Welcome to our Terms and Conditions of Use. This is important because it affects your legal rights. Thus, We encourage you to read them, together with our Privacy Policy and other terms referenced in this document, carefully.\n\n AGREEMENT AND ACCEPTANCE Welcome to the Servbees ("Application")! The following Terms and Conditions ("T&C" or "Terms) serve as a binding legal agreement between you ("You/Your", "Member") and the Program Operator—Servbees Inc. ("Program Operator", "We" "Us" or "Our"). These Terms, which include the (i) Privacy Policy (ii) Mechanics and/or (iii) Communication Materials, Notification or any guidelines',
    },
    {
      title: 'Privacy Policy',
      description:
        'TERMS AND CONDITIONS OF USE\n Last Updated: July 2020 \n\nHello and Welcome to our Terms and Conditions of Use. This is important because it affects your legal rights. Thus, We encourage you to read them, together with our Privacy Policy and other terms referenced in this document, carefully.\n\n AGREEMENT AND ACCEPTANCE Welcome to the Servbees ("Application")! The following Terms and Conditions ("T&C" or "Terms) serve as a binding legal agreement between you ("You/Your", "Member") and the Program Operator—Servbees Inc. ("Program Operator", "We" "Us" or "Our"). These Terms, which include the (i) Privacy Policy (ii) Mechanics and/or (iii) Communication Materials, Notification or any guidelines TERMS AND CONDITIONS OF USE Last Updated: July 2020 Hello and Welcome to our Terms and Conditions of Use. This is important because it affects your legal rights. Thus, We encourage you to read them, together with our Privacy Policy and other terms referenced in this document, carefully.\n\n AGREEMENT AND ACCEPTANCE Welcome to the Servbees ("Application")! The following Terms and Conditions ("T&C" or "Terms) serve as a binding legal agreement between you ("You/Your", "Member") and the Program Operator—Servbees Inc. ("Program Operator", "We" "Us" or "Our"). These Terms, which include the (i) Privacy Policy (ii) Mechanics and/or (iii) Communication Materials, Notification or any guidelines TERMS AND CONDITIONS OF USE Last Updated: July 2020 Hello and Welcome to our Terms and Conditions of Use. This is important because it affects your legal rights. Thus, We encourage you to read them, together with our Privacy Policy and other terms referenced in this document, carefully.\n\n AGREEMENT AND ACCEPTANCE Welcome to the Servbees ("Application")! The following Terms and Conditions ("T&C" or "Terms) serve as a binding legal agreement between you ("You/Your", "Member") and the Program Operator—Servbees Inc. ("Program Operator", "We" "Us" or "Our"). These Terms, which include the (i) Privacy Policy (ii) Mechanics and/or (iii) Communication Materials, Notification or any guidelines TERMS AND CONDITIONS OF USE Last Updated: July 2020 Hello and Welcome to our Terms and Conditions of Use. This is important because it affects your legal rights. Thus, We encourage you to read them, together with our Privacy Policy and other terms referenced in this document, carefully.\n\n AGREEMENT AND ACCEPTANCE Welcome to the Servbees ("Application")! The following Terms and Conditions ("T&C" or "Terms) serve as a binding legal agreement between you ("You/Your", "Member") and the Program Operator—Servbees Inc. ("Program Operator", "We" "Us" or "Our"). These Terms, which include the (i) Privacy Policy (ii) Mechanics and/or (iii) Communication Materials, Notification or any guidelines TERMS AND CONDITIONS OF USE Last Updated: July 2020 Hello and Welcome to our Terms and Conditions of Use. This is important because it affects your legal rights. Thus, We encourage you to read them, together with our Privacy Policy and other terms referenced in this document, carefully.\n\n AGREEMENT AND ACCEPTANCE Welcome to the Servbees ("Application")! The following Terms and Conditions ("T&C" or "Terms) serve as a binding legal agreement between you ("You/Your", "Member") and the Program Operator—Servbees Inc. ("Program Operator", "We" "Us" or "Our"). These Terms, which include the (i) Privacy Policy (ii) Mechanics and/or (iii) Communication Materials, Notification or any guidelines TERMS AND CONDITIONS OF USE Last Updated: July 2020 Hello and Welcome to our Terms and Conditions of Use. This is important because it affects your legal rights. Thus, We encourage you to read them, together with our Privacy Policy and other terms referenced in this document, carefully.\n\n AGREEMENT AND ACCEPTANCE Welcome to the Servbees ("Application")! The following Terms and Conditions ("T&C" or "Terms) serve as a binding legal agreement between you ("You/Your", "Member") and the Program Operator—Servbees Inc. ("Program Operator", "We" "Us" or "Our"). These Terms, which include the (i) Privacy Policy (ii) Mechanics and/or (iii) Communication Materials, Notification or any guidelines',
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
            <AppText textStyle="display5">
              {modalContent[modalContentNumber].title}
            </AppText>
          </AppViewContainer>
          <AppViewContainer customStyle={styles.contentWrapper}>
            <AppText textStyle="body2">
              {modalContent[modalContentNumber].description}
            </AppText>
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
