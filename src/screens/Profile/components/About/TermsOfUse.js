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
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                1. headings, underlines and bold type are for ease of reference
                only and shall not affect the interpretation of this Agreement;
              </AppText>

              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                2. the singular includes the plural and the plural includes the
                singular;
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                3. other parts of speech and grammatical forms of a word or
                phrase defined in this Agreement have a corresponding meaning;
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                4. references to a document include all amendments or
                supplements to, or replacements or novations of that document;
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                5. references to a party to a document includes the successors
                and permitted assigns;
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                6. references to time is a reference to Singapore time;
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                7. no provision of this Agreement shall be construed adversely
                to a party because that party was responsible for the
                preparation of this Agreement or that provision;
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                8. a reference to a clause, attachment, exhibit or schedule is a
                reference to a clause, attachment, exhibit or schedule to this
                Agreement, and a reference to this Agreement includes any
                attachment, exhibit and schedule;
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                9. a reference to any legislation includes all delegated
                legislation made under it and amendments, consolidations,
                replacements or re-enactments of any of them;
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                10. the terms “
                <AppText textStyle="body1medium">personal data</AppText>” and “
                <AppText textStyle="body1medium">processing</AppText>” (when
                used in relation to personal data) shall have the meanings given
                to them in the Personal Data Protection Act 2012 (Act 26 of
                2012) of Singapore;
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                11. the terms “
                <AppText textStyle="body1medium">related corporation</AppText>”
                and “<AppText textStyle="body1medium">corporation</AppText>”
                shall have the meanings given to them in the Companies Act
                (Chapter 50) of Singapore; and
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                12. the expression “<AppText>including</AppText>” or similar
                expression does not limit what else is included.
              </AppText>
            </View>
          </View>
          <View style={{marginTop: normalize(24)}}>
            <AppText textStyle="body1medium">THE PLATFORM</AppText>
          </View>
          <View style={{marginTop: normalize(8), paddingLeft: normalize(8)}}>
            <AppText textStyle="body1" customStyle={{marginTop: normalize(24)}}>
              1. Eligibility. We grant you the limited, worldwide,
              non-exclusive, non-transferable, non-sublicensable, revocable
              licence to use the Platform, subject to you complying with all of
              the following conditions:
            </AppText>
            <View
              style={{
                marginTop: normalize(8),
                paddingLeft: normalize(8),
              }}>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                1. if you are an individual, you must be at least 18 years old;
              </AppText>

              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                2. if you are not an individual:
              </AppText>
              <View
                style={{
                  marginTop: normalize(8),
                  paddingLeft: normalize(8),
                }}>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  1. you must be validly existing under the laws of the
                  jurisdiction of your incorporation or registration; and
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  2. the individual using the Platform on your behalf must have
                  full legal authority to bind you;
                </AppText>
              </View>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                3. you must at all times comply with and satisfy all of our due
                diligence procedures and requirements (including, but not
                limited to, complying with our Identity Checks from time to
                time);
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                4. all provisions of this Agreement, the Acceptable Use Policy
                and the Privacy Policy (each of which you hereby confirm that
                you have read and understood, and which shall be deemed
                incorporated into this Agreement by reference); and
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                5. all such other terms and conditions (including, but not
                limited to, your representations and warranties) as are set out
                or incorporated herein and as we way from time to time amend
                and/or notify you of on the Platform.
              </AppText>
            </View>
            <AppText textStyle="body1" customStyle={{marginTop: normalize(8)}}>
              2. Marketplace Venue. The Platform is a marketplace venue enabling
              connections to be made between Users for the publication of Task
              Postings, communication of Task Offers and the fulfilment of
              Service Contracts. We are not responsible for the performance,
              communications, or any aspect of interaction between the Users and
              we make no representation or warranty as to the truth or accuracy
              of any aspect of any information provided by any User. We do not
              guarantee the fulfilment of any Task Postings, Task Offers and/or
              Service Contracts and you agree to assume all risks of
              non-performance and non-payment. We do not have control over the
              quality, timing, legality, failure to provide, or any aspect
              whatsoever of the Task Postings, the Task Offers, the Service
              Contracts, the Services and/or the Users (including, but not
              limited to, the ability of any User to perform tasks, supply
              items, or pay for the services requested).
            </AppText>

            <AppText textStyle="body1" customStyle={{marginTop: normalize(8)}}>
              3. Restriction of Features and Functionalities. Certain features
              and/or functionalities on the Platform may be restricted from time
              to time in our sole and absolute discretion.
            </AppText>
            <AppText textStyle="body1" customStyle={{marginTop: normalize(8)}}>
              4. Ancillary Items. In order to use the Platform, an Internet
              connection and certain equipment (such as a computer and
              smartphone) may be required. You are responsible at your own cost
              and expense for all connections and/or equipment required to use
              the Platform.
            </AppText>
            <AppText textStyle="body1" customStyle={{marginTop: normalize(8)}}>
              Support. If you require any assistance with the Platform, you may
              contact us at help@servbees.com. We make no representation or
              warranty on the level of support we will provide to you.
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
export default TermsOfUse;
