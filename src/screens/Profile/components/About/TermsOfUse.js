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
import {normalize} from '@/globals';
import {ScrollView} from 'react-native-gesture-handler';

// create a component
const TermsOfUse = ({toggleTermsOfUse}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <PaddingView paddingSize={3}>
        <ScreenHeaderTitle title="Terms of Use" close={toggleTermsOfUse} />
        <ScrollView style={{marginTop: normalize(40)}}>
          <View>
            <AppText
              textStyle="body1medium"
              customStyle={{marginBottom: normalize(8)}}>
              Terms of Use
            </AppText>
            <AppText textStyle="body2">Last updated:[11 August 2020]</AppText>
          </View>
          <View style={{marginTop: normalize(24)}}>
            <AppText textStyle="body1">
              The Servbees Mobile Application is an internet application
              (“Servbees Mobile Application” or the “Application”) owned and
              operated by Servbees Pte. Ltd. (“Servbees,” “we,” “us,” or the
              “Company”). Servbees provides a service (the “Service”) that
              allows its customers (“Customers”) to access Servbees’s network of
              contractors (“Servbees” or “you” or “Contractor”) to identify and
              transact with local providers to meet intermittent needs for
              services. Servbees also provides a selling Service, where
              Customers can both post items for sale and purchase items posted
              by other Customers. Lastly, Servbees also has a posting Service
              where Customers can put up listings for what they need, such as
              items and specific assistance for tasks.
            </AppText>
          </View>

          <View style={{marginTop: normalize(24)}}>
            <AppText textStyle="body1">
              This is an Agreement between you and SERVBEES PTE. LTD., a company
              incorporated in Singapore (
              <AppText textStyle="body1medium">“Servbees“</AppText>). References
              to <AppText textStyle="body1medium">“Servbees“</AppText>,{' '}
              <AppText textStyle="body1medium">“we“</AppText>,{' '}
              <AppText textStyle="body1medium">“our“</AppText>, or{' '}
              <AppText textStyle="body1medium">“us”</AppText> are to Servbees
              and references to <AppText textStyle="body1medium">“you“</AppText>
              , <AppText textStyle="body1medium">“your”</AppText> or{' '}
              <AppText textStyle="body1medium">“yourself”</AppText> are to the
              Users (as defined below) with whom Servbees enters into this
              Agreement.
            </AppText>
          </View>

          <View style={{marginTop: normalize(24)}}>
            <AppText textStyle="body1">
              If you are accepting this Agreement on behalf of your employer or
              another entity, you represent and warrant that (a) you have full
              legal authority to bind your employer or the applicable entity to
              this Agreement; (b) you have read and understood the contents of
              this Agreement; and (c) you agree, on behalf of your employer or
              the entity you represent, to this Agreement. If you do not have
              the legal authority to bind your employer or the applicable entity
              to this Agreement, you must not on behalf of your employer or the
              applicable entity sign up for an Account (as defined below), use
              any Account (as defined below), use the Platform (as defined
              below) or otherwise communicate any acceptance of this Agreement
              to Servbees.
            </AppText>
          </View>

          <View style={{marginTop: normalize(24)}}>
            <AppText textStyle="body1">
              By signing up for an Account (as defined below), by using an
              Account (as defined below), by using the Platform (as defined
              below) or otherwise by communicating your acceptance of this
              Agreement to Servbees, you agree that you have read, understood
              and accept all of the terms and conditions contained in this
              Agreement and all other documents herein referred to.
            </AppText>
          </View>

          <View style={{marginTop: normalize(24)}}>
            <AppText textStyle="body1medium">
              IF YOU DO NOT AGREE TO BE BOUND BY THIS AGREEMENT AND ABIDE BY ITS
              TERMS, YOU MAY NOT USE OR ACCESS THE SERVBEES PLATFORM.
            </AppText>
          </View>

          <View style={{marginTop: normalize(24)}}>
            <AppText textStyle="body1medium">
              DEFINITIONS AND INTERPRETATION
            </AppText>
          </View>
          <View style={{marginTop: normalize(24), paddingLeft: normalize(8)}}>
            <AppText textStyle="body1">
              1. Definitions. In this Agreement, unless the context otherwise
              requires:
            </AppText>
            <View
              style={{
                marginTop: normalize(24),
                paddingLeft: normalize(8),
              }}>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                <AppText textStyle="body1medium">
                  “Acceptable Use Policy”
                </AppText>{' '}
                means the acceptable use policy set out on this webpage
                ([link]), as varied or amended by us from time to time in our
                sole discretion.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                <AppText textStyle="body1medium">“Account”</AppText> means an
                account registered with us enabling you to use the Platform.
              </AppText>

              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                <AppText textStyle="body1medium">“Content”</AppText> means any
                images, photographs, designs, graphics, logos, marks, audio
                files, video, software, technology, communications, text, links,
                artwork, animations, illustrations, data, material, information
                and other content.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                <AppText textStyle="body1medium">“Fee Schedule”</AppText> means
                the fee schedule set out on this webpage ([link]), as varied or
                amended by us from time to time in our sole discretion.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                <AppText textStyle="body1medium">“Identity Checks”</AppText>{' '}
                means any checks done by us to verify the identity,
                qualification or skills of any User (including, but not limited
                to, verification of mobile phone number, verification of payment
                information, references or integration with third party social
                media accounts).
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                <AppText textStyle="body1medium">“Platform”</AppText> means
                collectively the Site and Services.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                <AppText textStyle="body1medium">“Privacy Policy”</AppText>{' '}
                means the privacy policy set out on this webpage ([link]), as
                varied or amended by us from time to time in our sole
                discretion.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                <AppText textStyle="body1medium">“Services”</AppText> means the
                services made available online by Servbees through the Site.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                <AppText textStyle="body1medium">“Site”</AppText> means the
                website located at https://www.servbees.com and any of our
                associated websites, application programming interfaces (API)
                and applications
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                <AppText textStyle="body1medium">“Service Completion”</AppText>{' '}
                means, with respect to a Service Contract, the completion of the
                Services thereunder, as determined in accordance with clause
                4.6.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                <AppText textStyle="body1medium">“Service Contract”</AppText>{' '}
                means the separate contract which is formed between a Service
                Recipient and a Service Provider for Services to be rendered.
                The Service Contract is supplemental to the Service Offer and
                shall substantially be in the form set out on this webpage
                ([link]), as varied or amended by us from time to time in our
                sole discretion.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                <AppText textStyle="body1medium">“Service Fees”</AppText> means
                the agreed price for a Service Contract, but does not include
                any costs incurred by the Service Provider when completing
                additional work which the Service Recipient agrees to reimburse.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                <AppText textStyle="body1medium">“Service Offer”</AppText> means
                an offer made by a User in response to a Service Posting.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                <AppText textStyle="body1medium">“Needs Posting”</AppText> means
                the listing or post created by Users on the Platform inviting
                offers for the supplying or receiving of Services.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                <AppText textStyle="body1medium">“Service Providers”</AppText>{' '}
                means the Users providing or seeking to provide Services to
                Service Recipients on the Platform.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                <AppText textStyle="body1medium">“Service Recipients”</AppText>{' '}
                means the Users receiving or seeking to receive Services from
                Service Providers on the Platform.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                <AppText textStyle="body1medium">“Services”</AppText> means the
                services described in a Service Posting, Service Offer or under
                a Service Contract (as the case may be).
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                <AppText textStyle="body1medium">“User Content”</AppText> means
                Content uploaded, transmitted, posted or submitted to us through
                the Platform by a User.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                <AppText textStyle="body1medium">“User”</AppText> means any
                visitor or user of the Platform, and shall include you.
              </AppText>
            </View>
          </View>
          <View style={{marginTop: normalize(24), paddingLeft: normalize(8)}}>
            <AppText textStyle="body1">
              2. Interpretation. In this Agreement, unless the context otherwise
              requires:
            </AppText>
            <View
              style={{
                marginTop: normalize(24),
                paddingLeft: normalize(8),
              }}>
              <AppText textStyle="body1">
                1. headings, underlines and bold type are for ease of reference
                only and shall not affect the interpretation of this Agreement;
              </AppText>
            </View>
          </View>
        </ScrollView>
      </PaddingView>
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({});

//make this component available to the app
export default TermsOfUse;
