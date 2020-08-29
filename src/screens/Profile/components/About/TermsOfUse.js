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
              5. Support. If you require any assistance with the Platform, you
              may contact us at help@servbees.com. We make no representation or
              warranty on the level of support we will provide to you.
            </AppText>
          </View>
          <View style={{marginTop: normalize(24)}}>
            <AppText textStyle="body1medium">ACCOUNTS</AppText>
          </View>
          <View style={{marginTop: normalize(8), paddingLeft: normalize(8)}}>
            <AppText textStyle="body1" customStyle={{marginTop: normalize(24)}}>
              1. Opening. In order to use certain features of the Platform, you
              must open an Account by providing us with your name, email
              address, mobile number, password and/or such other information and
              documents as we may from time to time require. We may in our sole
              discretion refuse to open an Account for you or limit the number
              of Accounts that you may hold.
            </AppText>
            <AppText textStyle="body1" customStyle={{marginTop: normalize(24)}}>
              2. Access. Your Account will be secured through the use of such
              login credentials and other forms of authentication as we may from
              time to time require. In connection with the security of your
              Account, we may from time to time prohibit access to your Account
              from or by any device which we in our sole discretion deem to be a
              risk to the security of your Account. You are solely responsible
              for the security of your Account login credentials and other forms
              of authentication and must keep all login credentials and other
              forms of authentication strictly secret and confidential. You are
              responsible for all activities that occurs in or through your
              Account, and you shall have no claim against us in connection with
              us acting in reliance of the instructions given or sent from your
              Account.
            </AppText>
            <AppText textStyle="body1" customStyle={{marginTop: normalize(24)}}>
              3. Suspension. We may at any time in our sole discretion suspend
              any Account for reasons such as (a) any breach or suspected breach
              of this Agreement; (b) your Account becoming subject to any
              investigation or court order; (c) any suspicious or illegal
              activity being detected on your Account; or (d) any other reason.
              If your Account is suspended, then for the duration of such
              suspension you may not be able to use the Platform and
              notwithstanding any provision to the contrary, all withdrawals of
              Task Fees due to your Account (where applicable) shall not be
              allowed. Any waiver or exception to the aforesaid shall be in our
              sole and absolute discretion on a case-by-case basis,
            </AppText>
            <AppText textStyle="body1" customStyle={{marginTop: normalize(24)}}>
              4. Closure. We may at any time in our sole discretion close any
              Account for reasons such as (a) any breach or suspected breach of
              this Agreement; (b) your Account becoming subject to any
              investigation or court order; (c) any suspicious or illegal
              activity being detected on your Account; or (d) any other reason.
              You may also submit a request for us to close your Account.
            </AppText>

            <AppText textStyle="body1" customStyle={{marginTop: normalize(24)}}>
              5. Identity Verification. We may from time to time conduct
              Identity Checks on our Users.
            </AppText>

            <AppText textStyle="body1" customStyle={{marginTop: normalize(24)}}>
              6. Limitations of Identity Checks. You agree that our Identity
              Checks may not be fully accurate as we are dependent on
              User-supplied information and/or information or verification
              services provided by third parties. We do not assume any
              responsibility for the accuracy or reliability of Identity Checks
              information or any information provided through the Platform.
            </AppText>
          </View>
          <View style={{marginTop: normalize(24)}}>
            <AppText textStyle="body1medium">SERVICES</AppText>
          </View>
          <View style={{marginTop: normalize(8), paddingLeft: normalize(8)}}>
            <AppText textStyle="body1" customStyle={{marginTop: normalize(24)}}>
              1. Use of the Platform. When you use the Platform to create,
              publish or edit a Service Posting, make or accept a Service Offer
              and/or enter into a Service Contract, you agree that:
            </AppText>
            <View
              style={{
                marginTop: normalize(8),
                paddingLeft: normalize(8),
              }}>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                1. any Content supplied must not be false, inaccurate or
                misleading or deceptive;
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                2. any Content supplied must not infringe any third party’s
                copyright, patent, trademark, trade secret or other proprietary
                rights or intellectual property rights, rights of publicity,
                confidentiality or privacy;
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                3. any Content posted on the Platform must not, in any way
                whatsoever, be potentially or actually harmful to us or any
                other person. Harm includes, but is not limited to, economic
                loss that will or may be suffered by us; and
              </AppText>

              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                4. you are granting us the unrestricted, worldwide, royalty-free
                and irrevocable licence to use, reproduce, modify and adapt any
                content and information posted or communicated on or through the
                Platform for the purpose of publishing materials on the Platform
                and as otherwise may be required to provide the Platform, for
                the general promotion of the Platform, and as permitted by this
                Agreement.
              </AppText>
            </View>
          </View>
          <View style={{marginTop: normalize(8), paddingLeft: normalize(8)}}>
            <AppText textStyle="body1" customStyle={{marginTop: normalize(24)}}>
              2. Providing Services. When providing any Services, you agree
              that:
            </AppText>
            <View
              style={{
                marginTop: normalize(8),
                paddingLeft: normalize(8),
              }}>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                1. you will provide timely and high-quality services to the
                Service Recipient with due care, skill and diligence;
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                2. you will only offer and provide Services for which you have
                the necessary skills and expertise, and you will provide the
                Services safely and in accordance with all applicable laws;
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                3. you must not, when providing the Services, charge the Service
                Recipient any fees on top of the Task Fee. However, the parties
                to a Service Contract may agree to amend the Task Fee through
                the Platform;
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                4. you must fulfil the Services in accordance with the Service
                Contract, unless prohibited by law, this Agreement, an agreement
                between the User and a third party or by any of our policies;
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                5. you must not request for payments outside of the Platform
                from the Service Recipient except to the extent permitted by
                clause 4.2.4; and
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                6. if you agree to pay some costs of completing the Services
                (such as providing additional equipment), you are solely
                responsible for obtaining any reimbursement from the Service
                Recipient. We advise Service Providers not to agree to incur any
                costs in advance of receiving payment from the Service
                Recipient. We advise Service Providers to retain all supporting
                documents of the cost incurred.
              </AppText>
            </View>
          </View>
          <View style={{marginTop: normalize(8), paddingLeft: normalize(8)}}>
            <AppText textStyle="body1" customStyle={{marginTop: normalize(24)}}>
              3. Pricing of Services. You are solely responsible for the pricing
              of the Services, although we reserve the absolute and sole
              discretion to impose restrictions, floors and/or ceilings on such
              pricing.
            </AppText>
          </View>
          <View style={{marginTop: normalize(8), paddingLeft: normalize(8)}}>
            <AppText textStyle="body1" customStyle={{marginTop: normalize(24)}}>
              4. Separate Agreement. When a Task Offer is made or accepted by
              you:
            </AppText>
            <View
              style={{
                marginTop: normalize(8),
                paddingLeft: normalize(8),
              }}>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                1. (where you are the offeror) you acknowledge that you are
                offering to enter into a separate legal and binding agreement
                with the offeree of that Task Offer; or (where you are the
                offeree) you acknowledge that you are entering into a separate
                legal and binding agreement with the offeror of the Task Offer;
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                2. the terms of the Service Contract shall be supplemental to
                that Task Offer, and you agree to comply with the Service
                Contract and this Agreement during the engagement, performance
                and completion of the Services;
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                3. where you are the Service Recipient, you shall determine
                whether you will be present when the Services are performed
                and/or completed, and if you choose not to be present when the
                Services are performed and/or completed, you agree that the
                person present when the Services are performed and/or completed
                (for example, your spouse or friend) shall be deemed your agent
                and the Service Provider may take and follow such agent’s
                direction as if given by yourself;
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                4. where the Service Contract is not or will not be settled in
                cash, you agree to appoint us as limited collection agent for
                you, to facilitate payment of the Task Fee by the Service
                Recipient to the Service Provider through the Platform;
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                5. where you are the Service Recipient, you agree to pay to us
                all fees chargeable by us hereunder; and
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                6. you agree to notify us of any disputes prior to negotiation
                of or filing of any claims and to negotiate any dispute
                informally via us.
              </AppText>
            </View>
          </View>
          <View style={{marginTop: normalize(8), paddingLeft: normalize(8)}}>
            <AppText textStyle="body1" customStyle={{marginTop: normalize(24)}}>
              5. Cancellation. We may from time to time consent to the
              cancellation or withdrawal of your Task Postings, Task Offers
              and/or Service Contract. However, we may charge cancellation fees
              and you are solely responsible for any third party consents
              required for such cancellation or withdrawal.
            </AppText>
          </View>
          <View style={{marginTop: normalize(8), paddingLeft: normalize(8)}}>
            <AppText textStyle="body1" customStyle={{marginTop: normalize(24)}}>
              6. Completion. With respect to a Service Contract:
            </AppText>
            <View
              style={{
                marginTop: normalize(8),
                paddingLeft: normalize(8),
              }}>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                1. you may inform us of the completion of the Services through
                the Platform; and
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                2. Task Completion shall be deemed achieved:
              </AppText>
              <View
                style={{
                  marginTop: normalize(8),
                  paddingLeft: normalize(8),
                }}>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  1. when both you and the other User confirm completion of the
                  Services through the Platform; or
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  2. upon the effluxion of one (1) week following the other
                  User’s confirmation that the Services are completed, should
                  you fail to confirm completion of the Services or fail to
                  notify us of a dispute with the other User on the completion
                  of the Services within such one (1) week period.
                </AppText>
              </View>
            </View>
          </View>
          <View style={{marginTop: normalize(8), paddingLeft: normalize(8)}}>
            <AppText textStyle="body1" customStyle={{marginTop: normalize(24)}}>
              7. Dispute with other Users. If you have any complaints or dispute
              with another User, such complaints or dispute must be taken up
              with that User directly. If, at your or that User’s request, we at
              our absolute discretion agree to assist in a dispute between you
              and that User:
            </AppText>
            <View
              style={{
                marginTop: normalize(8),
                paddingLeft: normalize(8),
              }}>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                {' '}
                1. you acknowledge and agree that we are acting as experts (and
                not as arbitrators), and you may at any time proceed with legal
                proceedings against that User in an applicable court of law;
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                {' '}
                2. you acknowledge and agree that we are acting as experts (and
                not as arbitrators), and you may at any time proceed with legal
                proceedings against that User in an applicable court of law;
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                {' '}
                3. you must co-operate with all investigation conducted by us
                and provide us with all such information and documents as we may
                from time to time reasonably request;
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                {' '}
                4. until such time the dispute is resolved, we shall (where
                payment for the Services is by credit or debit card) have the
                right to (a) extend the authorization on your credit or debit
                card for the Task Fee; or (b) charge your credit or debit card
                for the Task Fee and hold such amounts in escrow;
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                {' '}
                5. you consent to us disclosing your personal data to that User
                for purposes in connection with this dispute;
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                {' '}
                6. you agree to abide and be bound by the final determination
                made by us (acting reasonably) on this dispute and to the
                payment, return and/or release of the Task Fees accordingly; and
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                {' '}
                7. notwithstanding the above, we will not be a party to disputes
                and/or negotiations of any disputes between Users and you
                acknowledge and agree that under no circumstances shall we have
                any liability nor obligation to offer any refunds.
              </AppText>
            </View>
            <AppText textStyle="body1" customStyle={{marginTop: normalize(8)}}>
              {' '}
              8. Removal. Notwithstanding any provision to the contrary, we
              reserve the right at any time without notice to you and for
              whatsoever reason to remove any Content, Task Posting and/or Task
              Offer that you have submitted to the Platform or to cancel or
              suspend your Account, any Task Posting, any Task Offer and/or any
              Service Contract.
            </AppText>
            <AppText textStyle="body1" customStyle={{marginTop: normalize(8)}}>
              {' '}
              9. Tax, Legal and Regulatory Compliance. You must have the right
              to provide or receive services under a Service Contract (as the
              case may be) and work or receive services in the jurisdictions in
              which the Services are performed (as the case may be). You are
              solely responsible for complying with all tax, legal regulatory
              obligations in relation to any Services rendered or received, or
              payment made or received, pursuant to a Service Contract.
            </AppText>
          </View>
          <View style={{marginTop: normalize(24)}}>
            <AppText textStyle="body1medium">FEES</AppText>
          </View>
          <View style={{marginTop: normalize(8), paddingLeft: normalize(8)}}>
            <View
              style={{
                marginTop: normalize(8),
                paddingLeft: normalize(8),
              }}>
              <AppText textStyle="body1">
                1. Payment. You agree to pay to us:
              </AppText>
              <View
                style={{
                  marginTop: normalize(8),
                  paddingLeft: normalize(8),
                }}>
                <AppText textStyle="body1">
                  1. all of our fees set out in the Subscription Fees, as we may
                  from time to time revise in our sole discretion; and
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  2. all Service Fees due to the Service Provider.
                </AppText>
              </View>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                2. Payment Method.
              </AppText>
              <View
                style={{
                  marginTop: normalize(8),
                  paddingLeft: normalize(8),
                }}>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  1. Payment of all fees and the Services, Seller and Needs Fees
                  hereunder shall be through cash, credit or debit card, or such
                  other payment methods as we may from time to time permit on
                  the Platform.
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  2. You may be required to provide your payment method details
                  to us and any third party we may use to process payments. For
                  all credit or debit card details you provide us with, you
                  represent and warrant that you have all necessary consents and
                  approvals to use such credit or debit card and that we are
                  authorized to disclose such credit or debit card details to
                  our third party payment processors.
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  3. If the Service Fee is or will be paid in cash (as agreed
                  between the Service Provider and the Service Recipient under a
                  Service Contract and permitted by Servbees), the Service
                  Provider and the Service Recipient shall be responsible to
                  each other for such cash payment, and Servbees shall have no
                  duties nor liability whatsoever in respect of such cash
                  payment.
                </AppText>
              </View>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                3. Charging your Card.
              </AppText>
              <View
                style={{
                  marginTop: normalize(8),
                  paddingLeft: normalize(8),
                }}>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  1. This clause 5.3 applies only if the Task Posting or Task
                  Offer indicates that payment will be made by credit or debit
                  card.
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  2. When a Service Recipient creates, the Service Recipient is
                  authorising us to confirm with the issuing bank of his, her or
                  its credit or debit card that it is a valid account, through
                  an authorisation or such other reasonable procedures.
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  3. When a Task Offer is accepted, the Service Recipient is
                  authorising us to request for a card authorisation hold on
                  his/her/its credit or debit card for the full Task Fee and any
                  other applicable fees chargeable hereunder in respect of the
                  Task Offer. Such authorisation shall include any extension or
                  renewal of such card authorisation hold for so long as Task
                  Completion is not achieved or (if applicable) until such time
                  any dispute between the relevant Users is resolved.
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  4. Upon Task Completion, the Service Recipient is deemed to
                  have authorised us to charge his/her/its credit or debit card
                  for the full Task Fee and all fees chargeable by us hereunder.
                </AppText>
              </View>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                4. Release of Task Fees.
              </AppText>
              <View
                style={{
                  marginTop: normalize(8),
                  paddingLeft: normalize(8),
                }}>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  1. This clause 5.4 applies only if the Task Fees are paid to
                  us pending Task Completion.
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  2. Following Task Completion, the Task Fees (less all fees
                  chargeable by us hereunder) shall be released to the Service
                  Provider in such manner as prescribed by us from time to time.
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  3. Notwithstanding any provision to the contrary, we shall be
                  entitled:
                </AppText>
                <View
                  style={{
                    marginTop: normalize(8),
                    paddingLeft: normalize(8),
                  }}>
                  <AppText
                    textStyle="body1"
                    customStyle={{marginTop: normalize(8)}}>
                    1. to return the Task Fee to the Service Recipient at any
                    time if the Task Posting, Task Offer, Services and/or
                    Service Contract is suspended, cancelled, withdrawn,
                    rescinded, removed or termination, or for whatsoever reason
                    in our absolute discretion; or
                  </AppText>
                  <AppText
                    textStyle="body1"
                    customStyle={{marginTop: normalize(8)}}>
                    2. to release and/or return the Task Fee to the Service
                    Provider and/or the Service Recipient in such proportions as
                    determined by us in accordance with clause 4.7.6.
                  </AppText>
                </View>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  4. You irrevocably agree that you shall have no claim against
                  us for the release of the Task Fee to the Service Provider or
                  the return of the Task Fee to the Service Recipient pursuant
                  to the provisions of this Agreement.
                </AppText>
              </View>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                5. Reimbursement to Service Provider. If a Task Posting, Task
                Offer and/or Service Contract requires a Service Provider to
                incur additional costs outside of the Platform, the cost
                incurred will not be included in the calculation of the Task
                Fee. The Service Provider will be solely responsible for
                obtaining reimbursement from the Service Recipient directly or,
                if permitted by us, through the Platform (in which event
                additional fees as set out in the Fee Schedule may apply).
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                6. No Refund. Unless otherwise stated expressly in this
                Agreement, all fees and charges payable to us are
                non-cancellable and are non-refundable.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                7. Dispute with Card Company. In the event of any dispute with
                your credit or debit card company or financial institution, you
                shall be solely responsible for resolving them.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                8. Restriction on Account. We reserve the right to restrict your
                Account or to suspend the processing of any transaction or to
                disable or limit the use of your credit or debit card if (a)
                there are at any time any fees owed to us; (b) there is any
                transaction error resulting in decline or chargeback from a
                financial institution; (c) we believe that your credit or debit
                card has been used fraudulently, illegally or involves criminal
                activity; or (d) we believe that you are in breach of this
                Agreement.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                9. Set Off. All payments made to us shall be without set off,
                counterclaim, taxes, duties, withholding (except to the extent
                required by law) and deduction. However, we shall be entitled
                to, at any time without notice to you and from time to time
                without prejudice to any other remedies available to us, set off
                any amounts due to you against any obligation owed by you to us,
                whether present or future, actual or contingent, liquidated or
                unliquidated, primary or collateral, several or joint.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                10. Payment Services Provider. Payment processing services
                hereunder are provided by Stripe and are subject to the Stripe
                Connected Account Agreement
                (https://stripe.com/connect-account/legal), which includes the
                Stripe Terms of Service (collectively, the “Stripe Services
                Agreement“). By agreeing to this Agreement or by continuing to
                operate your Account or use the Platform, you agree to be bound
                by the Stripe Services Agreement, as the same may be modified by
                Stripe from time to time. As a condition of us enabling payment
                processing services through Stripe, you agree to provide us with
                accurate and complete information about you and your business,
                and you authorise us to share it with Stripe along with any
                transaction information related to your use of the payment
                processing services provided by Stripe.
              </AppText>
            </View>
          </View>
          <View style={{marginTop: normalize(24)}}>
            <AppText textStyle="body1medium">TERMINATION</AppText>
          </View>
          <View style={{marginTop: normalize(8), paddingLeft: normalize(8)}}>
            <AppText textStyle="body1" customStyle={{marginTop: normalize(8)}}>
              1. Termination by Us. We may in our absolute and sole discretion
              close your Account and terminate this Agreement at any time for
              any reason.
            </AppText>
            <AppText textStyle="body1" customStyle={{marginTop: normalize(8)}}>
              2. Termination by You. You may terminate this Agreement at any
              time by informing us of your intention to terminate this Agreement
              and requesting us to close your Account. Upon the closure of your
              Account, all Services and uncompleted transactions associated with
              your Account shall be terminated immediately and all fees, costs
              and expenses accruing to us under this Agreement shall be
              immediately become due and payable, and you must immediately
              settle all such fees, costs and expenses due and payable.
            </AppText>
            <AppText textStyle="body1" customStyle={{marginTop: normalize(8)}}>
              3. Survival. All parts of this Agreement which by their nature
              should survive the expiration or termination of this Agreement
              shall continue in full force and effect subsequent to and
              notwithstanding the expiration or termination of this Agreement.
            </AppText>
          </View>
          <View style={{marginTop: normalize(24)}}>
            <AppText textStyle="body1medium">
              REPRESENTATIONS, WARRANTIES, UNDERTAKINGS AND ACKNOWLEDGEMENTS
            </AppText>
            <View
              style={{
                marginTop: normalize(8),
                paddingLeft: normalize(8),
              }}>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                1. Warranties and Undertakings. You represent, warrant and
                undertake to us as follows:
              </AppText>
              <View
                style={{
                  marginTop: normalize(8),
                  paddingLeft: normalize(8),
                }}>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  1. if you are an individual, you are 18 years of age or older
                  and have full power and authority to enter into this Agreement
                  and to perform all your obligations hereunder;
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
                    2. the individual using the Platform on your behalf must
                    have full legal authority to bind you;
                  </AppText>
                </View>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  3. your entry into this Agreement have been duly and
                  effectively authorized by all necessary actions on your part
                  and this Agreement constitutes binding and enforceable
                  obligations upon you;
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  4. the entry into and performance by you of your obligations
                  hereunder do not and will not conflict with or result in a
                  breach of any law, regulation, order, judgment or decree of
                  any court, governmental authority or regulatory body
                  applicable to you;
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  5. you will comply with our Acceptable Use Policy;
                </AppText>

                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  6. you will comply in all respects with all laws and
                  regulations applicable to you in relation to your use of the
                  Platform (including, but not limited to making a Task Posting
                  and/or a Task Offer) and the performance and receipt of the
                  Services;
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  7. you will not knowingly infringe or violate any third party
                  right, or breach any agreements or legal obligations that you
                  may have toward any third party;
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  8. you will not submit or post any Content on the Platform
                  which you know to be false, misleading, inaccurate, deceptive
                  or fraudulent;
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  9. you will fulfil the commitments you make to other Users;
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  10. you will not use the Platform for any immoral or illegal
                  purposes;
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  11. you will respect the privacy (including, but not limited
                  to, the private, family and home life), property and data
                  protection rights of Users;
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  12. you will not record (whether video, audio or otherwise)
                  your provision or receipt of the Services or your any
                  interaction with any User;
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  13. you will not threaten, abuse, harass, defame, or engage in
                  behaviour that is libellous, tortious, obscene, profane, or
                  invasive of another person’s privacy;
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  14. you will not distribute unsolicited or unauthorized
                  advertising or promotional material, or any junk mail, spam,
                  or chain letters, and will not run any mailing lists,
                  listservs, or any kind of auto-responder or spam on or through
                  the Platform;
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  15. you will not distribute software viruses, or anything else
                  designed to interfere with (a) the proper functioning of any
                  software, hardware, or equipment on or relating to the
                  Platform; (b) the use of the Platform by any other User; or
                  (c) measures put in place to prohibit or prevent you from
                  accessing or using all or part of the Platform;
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  16. you will not bypass any measures that we have put in place
                  to secure the Platform, take actions to gain unauthorized
                  access to any system, data, passwords, or other Content,
                  reverse engineer or take apart any aspect of the Platform to
                  access any underlying information, or use any kind of software
                  to crawl, spider or index any part of the Platform;
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  17. all Content as you may from time to time submit to us are
                  true, accurate, authentic and not misleading in any manner;
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  18. your Account must only be used by yourself and you must
                  not allow any other person to use your Account or to use the
                  Platform through your Account; and
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  19. you are fully responsible for all applicable tax with
                  respect to your use of the Platform.
                </AppText>
              </View>
            </View>
          </View>
          <View style={{marginTop: normalize(24)}}>
            <AppText textStyle="body1medium">INTELLECTUAL PROPERTY</AppText>
            <View
              style={{
                marginTop: normalize(8),
                paddingLeft: normalize(8),
              }}>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                1. Our Intellectual Property. We shall retain all rights, title
                and interests in and to all of our intellectual property rights.
                Except as expressly provided in this Agreement, no rights or
                obligations in respect of our intellectual property rights and
                our Content are granted to you or are to be implied from this
                Agreement.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                2. Your User Content. We reserve the right at any time to reject
                or remove any User Content from the Platform. You will retain
                all rights, title and interests in and to your User Content,
                except that whenever you submit User Content to us (whether
                using the Platform or otherwise):
              </AppText>
              <View
                style={{
                  marginTop: normalize(8),
                  paddingLeft: normalize(8),
                }}>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  1. you are granting us a perpetual, worldwide, non-exclusive,
                  irrevocable, royalty-free, fully paid-up, sub-licensable
                  (without limit as to the number of tiers), transferable
                  licence to use, display, exploit, change, edit, modify, create
                  derivatives of and translate the User Content for any purpose;
                  and
                </AppText>

                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  2.you are representing and warranting to us that (a) you have
                  all necessary rights, licences, consents and permissions to
                  grant the rights and licences to us in the manner set forth in
                  this Agreement; (b) your User Content does not and will not
                  infringe upon the intellectual property rights, proprietary
                  rights, privacy rights, confidentiality, moral rights, rights
                  of publicity of any third party or otherwise violate the
                  provisions of this Agreement or any applicable law; and (c) we
                  will not need to obtain any rights, licences, consents or
                  permissions from (or make any payments to) any third party for
                  any use of your User Content or have any liability to any
                  person or third party as a result of any use or exploitation
                  of your User Content.
                </AppText>
              </View>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                3. Removal of Content. We shall have the sole and absolute
                discretion to remove any Content, Task Postings and/or Task
                Offers (whether submitted by you or otherwise) from the Platform
                without notice to you.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                4. Other Content. We grant to you a limited, worldwide,
                non-exclusive, non-sublicensable, non-transferable, revocable
                licence to access and use the User Content and our Content
                solely in connection with your use of the Platform in accordance
                with this Agreement. You undertake not to reproduce,
                redistribute, transmit, assign, sell, broadcast, rent, share,
                lend modify, adapt, edit, create derivative works out of,
                licence or otherwise transfer or use any User Content or our
                Content without our prior written consent. We shall be entitled
                to revoke this licence to access and use the User Content and
                our Content at any time.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                5. No Infringement. You must not in connection with your use of
                the Services infringe upon any intellectual property rights of
                us or of any third party.
              </AppText>
            </View>
          </View>
          <View style={{marginTop: normalize(24)}}>
            <AppText textStyle="body1medium">DATA PROTECTION</AppText>
            <View
              style={{
                marginTop: normalize(8),
                paddingLeft: normalize(8),
              }}>
              <AppText
                textStyle="body1"
                customStyle={{
                  marginTop: normalize(8),
                  paddingLeft: normalize(8),
                }}>
                1. Your Consent. You hereby consent to our collection, use,
                disclosure, storage, retention, processing and transmission of
                all personal data (as disclosed to us by you) in accordance with
                our Privacy Policy.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{
                  marginTop: normalize(8),
                  paddingLeft: normalize(8),
                }}>
                2. Disclosure to Us. Each time you disclose any personal data to
                us, you are representing and warranting to us that:
              </AppText>
              <View
                style={{
                  marginTop: normalize(8),
                  paddingLeft: normalize(8),
                }}>
                <AppText
                  textStyle="body1"
                  customStyle={{
                    marginTop: normalize(8),
                    paddingLeft: normalize(8),
                  }}>
                  1. the relevant individuals have consented to the collection,
                  use, disclosure, storage, retention, processing and
                  transmission of their personal data by us in accordance with
                  our Privacy Policy; and
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{
                    marginTop: normalize(8),
                    paddingLeft: normalize(8),
                  }}>
                  2. all necessary consents and approvals of the relevant
                  individuals as required under applicable laws (including, but
                  not limited to, the Personal Data Protection Act of Singapore)
                  have been obtained, such that we may collect, use, disclose,
                  store, retain, process and transmit the personal data of such
                  individuals in accordance with our Privacy Policy.
                </AppText>
              </View>
              <AppText
                textStyle="body1"
                customStyle={{
                  marginTop: normalize(8),
                  paddingLeft: normalize(8),
                }}>
                3. Other User’s Personal Data. When you use the Platform, create
                a Task Posting, make a Task Offer, enter into the Service
                Contract, receive the Services, or provide the Services, you may
                receive information about other Users including their personal
                data. You acknowledge and agree that such information is
                provided purely for the purpose of fulfilling the Services for
                the applicable Task Posting, Task Offer and/or Service Contract
                and may not be used for other purposes (including, but not
                limited to, marketing) without separate verifiable consent from
                the User. You will maintain records of all such verifiable
                consent.
              </AppText>
            </View>
          </View>
          <View style={{marginTop: normalize(24)}}>
            <AppText textStyle="body1medium">LIABILITIES</AppText>
            <View
              style={{
                marginTop: normalize(8),
                paddingLeft: normalize(8),
              }}>
              <AppText
                textStyle="body1"
                customStyle={{
                  marginTop: normalize(8),
                }}>
                1. No Warranties. To the fullest extent permissible under
                applicable laws, the Platform, our Content, User Content and any
                other materials made available on the Platform are provided on
                an “as is”, “where is” and “as available” basis without
                representations and warranties of any kind whatsoever. No
                opinion, advice or statement of us or of our affiliates,
                licensors, suppliers, advertisers, sponsors, agents, members or
                visitors, whether made through the Platform, or on third party
                platforms or otherwise, shall create any representation or
                warranty. Your access or use of the Platform and the Services is
                entirely at your own risk and you shall have no recourse
                whatsoever to us. To the fullest extent permissible under
                applicable laws, we expressly disclaim any and all
                representations and warranties (whether express or implied)
                including, but not limited to, the implied warranties of
                security, merchantability, satisfactory quality, functionality,
                fitness for a particular purpose, availability, title, freedom
                from malicious code and non-infringement.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{
                  marginTop: normalize(8),
                }}>
                2. Disclaimer of Liabilities. To the fullest extent permissible
                under applicable laws, we expressly disclaim (and you expressly
                release us from) all liabilities for (a) the truth, accuracy,
                adequacy, completeness or reasonableness of any Content
                contained in or accessed through the Platform; (b) the Platform
                being interrupted or suffering from errors, loss, corruption,
                attack, virus, interference, hacking or other security
                intrusions; (c) your inability to open, use or view any Content;
                (d) the reliability, validity, accuracy or truthfulness of any
                Content; (e) any damages or losses relating to your use or
                attempted use of the Platform; (f) any act or omission of any
                User; (g) the Services (including but not limited to the
                reliability, safety, timeliness, quality, suitability or
                availability thereof) and/or the Service Contract; (h) any act,
                omission, damages or loss suffered by you following a period of
                any unavailability of the Platform; (i) any act, omission,
                damages or loss arising from any instructions given from your
                Account which we have relied and/or acted upon; (j) damages or
                losses arising from your failure to fulfil any of your
                obligations hereunder; (k) loss of profits, loss of anticipated
                savings, loss of business, loss of opportunity, loss of revenue,
                loss of time, loss of goodwill or injury to reputation, and loss
                of or harm to data, whether direct or indirect, nor for any
                punitive, indirect, consequential or special losses, howsoever
                caused and whether foreseeable or not; (l) losses caused by or
                in connection with death or personal injury due to your
                negligence, fraud or wilful misconduct; (m) losses arising from
                any breach of applicable data protection laws due to your
                failure to obtain and maintain the relevant consents in order
                for us to provide the Services pursuant to the provisions
                hereunder; (n) loss of data, information and records (howsoever
                caused) and computer malfunction; (o) loss arising from any
                cause whatsoever through no fault of us (including, but not
                limited to, any computer or system virus interference, sabotage
                or any other causes whatsoever which may interfere with your
                computer systems, and any loss of, destruction to or error in
                your data, information and records, howsoever caused); (p)
                damages or losses arising from the provision of any Services
                which are prohibited by law (including but not limited to the
                carriage of dangerous or hazardous materials, radioactive
                materials, explosives, illegal narcotics, or any other items
                which are prohibited by law); and (q) any claims, demands or
                damages (whether actual, consequential or otherwise) of any kind
                or nature arising out of or in any way connected with any
                dispute you may have with one or more Users.
              </AppText>

              <AppText
                textStyle="body1"
                customStyle={{
                  marginTop: normalize(8),
                }}>
                3. Not Employment Agency. We are not an employment agency and
                Users may only use the Platform through the Internet.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{
                  marginTop: normalize(8),
                }}>
                4. Not Employer. We are not responsible for any Central
                Provident Fund contributions, work injury compensation or other
                employment-related payments or benefits of any User.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{
                  marginTop: normalize(8),
                }}>
                5. No Endorsement. Although the Platform may display or suggest
                certain Users, Task Postings, Task Offers, Content and/or other
                aspects of the Platform from time to time or may indicate
                certain Users, Task Postings, Task Offers, Content and/or other
                aspects of the Platform with special characteristics (such as,
                being a verified User or having certain ratings), it is not an
                endorsement of such Users, Task Postings, Task Offers, Content
                and/or aspects of the Platform and you are solely responsible
                for conducting your own due diligence and other checks. If you
                proceed to enter into a legal contract with any Users, you are
                doing so at your own risk and you shall have no recourse to us.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{
                  marginTop: normalize(8),
                }}>
                6. No Involvement in Legal Disputes Between Users. The Service
                Contract is a separate contract between Users. Notwithstanding
                that we may at our sole discretion facilitate discussions
                between Users, we take no responsibility and shall have no
                liability for any disputes or violations of agreements between
                any Users.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{
                  marginTop: normalize(8),
                }}>
                7. Limitations of Liability. Notwithstanding any provision of
                this Agreement, our maximum aggregate liability to you arising
                out of or in connection with this Agreement whenever made shall
                be limited to SGD100.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{
                  marginTop: normalize(8),
                }}>
                8. Time Bar. To the extent permissible under applicable laws,
                any claim arising out of or relating to the Services or this
                Agreement must be commenced within one (1) year after the cause
                of action accrues, failing which such cause of action shall be
                permanently barred.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{
                  marginTop: normalize(8),
                }}>
                9. Indemnity. You agree to indemnify us, our related
                corporations, our (and our related corporations’) officers,
                directors, employees, and agents (together, the “
                <AppText textStyle="body1medium">Indemnified Parties</AppText>“)
                against any and all claims, damages, losses, obligations,
                deficiencies, judgments, awards, demands, penalties, taxes,
                expenses, disbursements, costs, fines and other liabilities
                (including, but not limited to, any expenses of investigation
                and all legal fees and expenses on a solicitor and client basis
                in connection with any action, suit or proceeding) suffered or
                incurred by any of the Indemnified Parties arising out of or in
                connection with:
              </AppText>
              <View
                style={{
                  marginTop: normalize(8),
                  paddingLeft: normalize(8),
                }}>
                <AppText
                  textStyle="body1"
                  customStyle={{
                    marginTop: normalize(8),
                  }}>
                  1. any misrepresentation or breach of any representation,
                  warranty, undertaking or agreement made by you hereunder;
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{
                    marginTop: normalize(8),
                  }}>
                  2. any infringement of any intellectual property rights as a
                  result of any of your acts or omissions;
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{
                    marginTop: normalize(8),
                  }}>
                  3. any other person’s breach of any provision of this
                  Agreement, where such person was able to use the Platform
                  through your Account; and
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{
                    marginTop: normalize(8),
                  }}>
                  4. any breach of applicable data protection laws as a result
                  of any of your acts or omissions.
                </AppText>
              </View>
              <AppText
                textStyle="body1"
                customStyle={{
                  marginTop: normalize(8),
                }}>
                10. Independent Limitations. Each qualification and limitation
                in this clause 10 shall be construed independently of the others
                and shall not be limited by any other qualification or
                limitation.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{
                  marginTop: normalize(8),
                }}>
                11. Survival. The provisions of this clause 10 shall survive and
                continue in full force and effect notwithstanding the
                termination or expiration of this Agreement.
              </AppText>
            </View>
          </View>
          <View style={{marginTop: normalize(24)}}>
            <AppText textStyle="body1medium">CHANGES AND MODIFICATIONS</AppText>
            <View
              style={{
                marginTop: normalize(8),
                paddingLeft: normalize(8),
              }}>
              <AppText
                textStyle="body1"
                customStyle={{
                  marginTop: normalize(8),
                }}>
                1. Changes to the Platform. You acknowledge and agree that we
                may from time to time modify or change any part of the Platform
                without any reference or notice to you.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{
                  marginTop: normalize(8),
                }}>
                2. Changes to this Agreement. You acknowledge and agree that we
                may from time to time change the terms of this Agreement by
                notification to you or by posting a revised version on the
                Platform. The revised version shall take effect from the
                published effective date and notification will be made to you
                through the Platform or via email. If you continue to use the
                Platform after the notice period, then you will be deemed to
                have consented to the amendments made in such revised version.
              </AppText>
            </View>
          </View>
          <View style={{marginTop: normalize(24)}}>
            <AppText textStyle="body1medium">GENERAL</AppText>
            <View
              style={{
                marginTop: normalize(8),
                paddingLeft: normalize(8),
              }}>
              <AppText
                textStyle="body1"
                customStyle={{
                  marginTop: normalize(8),
                }}>
                1. Notice.
              </AppText>
              <View
                style={{
                  marginTop: normalize(8),
                  paddingLeft: normalize(8),
                }}>
                <AppText
                  textStyle="body1"
                  customStyle={{
                    marginTop: normalize(8),
                  }}>
                  1. All notices and other communications given by us under this
                  Agreement (including any changes to this Agreement) may be
                  given by:
                </AppText>
                <View
                  style={{
                    marginTop: normalize(8),
                    paddingLeft: normalize(8),
                  }}>
                  <AppText
                    textStyle="body1"
                    customStyle={{
                      marginTop: normalize(8),
                    }}>
                    1. email, regular mail or SMS to your address or contact
                    number as ordinarily known to us;
                  </AppText>
                  <AppText
                    textStyle="body1"
                    customStyle={{
                      marginTop: normalize(8),
                    }}>
                    2. through the Platform; or
                  </AppText>
                  <AppText
                    textStyle="body1"
                    customStyle={{
                      marginTop: normalize(8),
                    }}>
                    3 . such other means as we deem necessary.
                  </AppText>
                </View>
              </View>
              <AppText
                textStyle="body1"
                customStyle={{
                  marginTop: normalize(8),
                }}>
                2. Such notices and communications shall be deemed received when
                sent by us.
              </AppText>
              <View
                style={{
                  marginTop: normalize(8),
                  paddingLeft: normalize(8),
                }}>
                <AppText
                  textStyle="body1"
                  customStyle={{
                    marginTop: normalize(8),
                  }}>
                  1. All notices and other communications given by you under
                  this Agreement must be given to us either:
                </AppText>
                <View
                  style={{
                    marginTop: normalize(8),
                    paddingLeft: normalize(8),
                  }}>
                  <AppText
                    textStyle="body1"
                    customStyle={{
                      marginTop: normalize(8),
                    }}>
                    1. where permitted by the Platform, through the Platform;
                  </AppText>
                  <AppText
                    textStyle="body1"
                    customStyle={{
                      marginTop: normalize(8),
                    }}>
                    2. by email to help@servbees.com, which shall be deemed
                    received at the time it was sent unless you receive an
                    automated response indicating that the recipient was
                    unavailable or that the email was undelivered or
                    undeliverable;
                  </AppText>
                  <AppText
                    textStyle="body1"
                    customStyle={{
                      marginTop: normalize(8),
                    }}>
                    3. by national prepaid registered post to our registered
                    office address, which shall be deemed received one (1) week
                    following the day it was posted, together with a copy sent
                    by email to help@servbees.com (which shall not constitute
                    notice); or
                  </AppText>
                  <AppText
                    textStyle="body1"
                    customStyle={{
                      marginTop: normalize(8),
                    }}>
                    3. by international prepaid registered post to our
                    registered office address, which shall be deemed received
                    one (1) month following the day it was posted, together with
                    a copy sent by email to help@servbees.com (which shall not
                    constitute notice).
                  </AppText>
                </View>
                <AppText
                  textStyle="body1"
                  customStyle={{
                    marginTop: normalize(8),
                  }}>
                  2. Force Majeure. We shall not be liable for inadequate
                  performance under this Agreement to the extent caused by any
                  of the following:
                </AppText>
                <View
                  style={{
                    marginTop: normalize(8),
                    paddingLeft: normalize(8),
                  }}>
                  <AppText
                    textStyle="body1"
                    customStyle={{
                      marginTop: normalize(8),
                    }}>
                    1. a condition such as natural disaster, act of war or
                    terrorism, riot, labour condition, governmental action, and
                    disruption or disturbance of the Internet or energy sources
                    that was beyond our reasonable control; or
                  </AppText>
                  <AppText
                    textStyle="body1"
                    customStyle={{
                      marginTop: normalize(8),
                    }}>
                    2. any failure or unavailability of the Platform.
                  </AppText>
                </View>
                <AppText
                  textStyle="body1"
                  customStyle={{
                    marginTop: normalize(8),
                  }}>
                  3. Third Party Sites. Links to other third party sites may be
                  provided on the Platform. You acknowledge and agree that (a)
                  such links do not constitute an endorsement; (b) we have no
                  control over such websites or their Content; and (c) we shall
                  have no liability arising out of or related to such websites
                  or their Content.
                </AppText>

                <AppText
                  textStyle="body1"
                  customStyle={{
                    marginTop: normalize(8),
                  }}>
                  4. Entire Agreement. This Agreement (together with all
                  documents referenced herein) embodies all the terms and
                  conditions agreed upon between you and us as to the subject
                  matter of this Agreement and supersedes and cancels in all
                  respects all previous agreements and undertakings (if any)
                  between you and us with respect to the subject matter hereof,
                  whether such be written or oral.
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{
                    marginTop: normalize(8),
                  }}>
                  5. Relationship of Parties. Nothing herein this Agreement
                  shall be construed as creating the relationship of employer
                  and employee, principal and agent, partnership or joint
                  venture or any other fiduciary relationship.
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{
                    marginTop: normalize(8),
                  }}>
                  6. No Third Party Rights. Except for the Indemnified Parties,
                  a person who is not a party to this Agreement shall have no
                  right under the Contracts (Rights of Third Parties) Act
                  (Chapter 53B) of Singapore to enforce any provision of this
                  Agreement.
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{
                    marginTop: normalize(8),
                  }}>
                  7. Variation. Any variation to any provision of this Agreement
                  must be in writing and executed by us.
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{
                    marginTop: normalize(8),
                  }}>
                  8. Severability. If any provision of this Agreement is held to
                  be illegal, invalid or unenforceable in whole or in part in
                  any jurisdiction, then this Agreement shall, as to such
                  jurisdiction, continue to be valid as to its other provisions
                  and the remainder of the affected provision, and the legality,
                  validity and enforceability of such provision in any other
                  jurisdiction shall not be affected.
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{
                    marginTop: normalize(8),
                  }}>
                  9. No Waiver. No delay or failure by us to exercise or enforce
                  any right, power or remedy under this Agreement shall
                  constitute or operate as a waiver of that right, power or
                  remedy or any other right, power or remedy under this
                  Agreement or operate so as to prevent the subsequent exercise
                  or enforcement of any such right, power or remedy. Any waiver
                  by us must be expressly made in writing and signed by us to be
                  effective.
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{
                    marginTop: normalize(8),
                  }}>
                  10. Assignment. You may not assign or transfer any of your
                  rights, interests, licences and/or obligation hereunder to
                  anyone else. We may assign or transfer any of our rights,
                  licences, interests and/or obligations at any time to anyone,
                  including as part of a merger, acquisition or other corporate
                  reorganization.
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{
                    marginTop: normalize(8),
                  }}>
                  11. Dispute Resolution. Any dispute arising out of or in
                  connection with this Agreement (including any question
                  regarding its existence, validity or termination) shall be
                  referred to and finally resolved by arbitration administered
                  by the Singapore International Arbitration Centre (“SIAC“) in
                  accordance with the Arbitration Rules of the Singapore
                  International Arbitration Centre (“SIAC Rules“) for the time
                  being in force, which rules are deemed to be incorporated by
                  reference in this clause. The seat of the arbitration shall be
                  Singapore. The Tribunal shall consist of one (1) arbitrator.
                  The language of the arbitration shall be English.
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{
                    marginTop: normalize(8),
                  }}>
                  12. Governing Law. This Agreement shall be governed by and
                  construed in accordance with Singapore law.
                </AppText>
              </View>
            </View>
          </View>
          <View style={{marginTop: normalize(24)}}>
            <AppText textStyle="body1medium">APPENDIX A</AppText>
            <AppText
              textStyle="body1medium"
              customStyle={{marginTop: normalize(8)}}>
              MODEL SERVICE CONTRACT
            </AppText>
            <AppText textStyle="body1" customStyle={{marginTop: normalize(8)}}>
              The terms used in this Service Contract have the meaning set out
              in the Servbees Glossary. A Service Contract is created in
              accordance with the Servbees Agreement. Unless otherwise agreed,
              the Poster and the Service Provider enter into a Service Contract
              on the following terms:
            </AppText>
            <View
              style={{
                marginTop: normalize(8),
                paddingLeft: normalize(8),
              }}>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                1. COMMENCEMENT DATE AND TERM
              </AppText>
              <View
                style={{
                  marginTop: normalize(8),
                  paddingLeft: normalize(8),
                }}>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  1.1 The Service Contract is created when the Poster accepts
                  the Service's Offer on a Posted Task to provide Services. When
                  using Search Assist, the Service Contract is created when the
                  Tasker makes an Instant Claim.
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  1.2 The Contract will continue until terminated in accordance
                  with clause 7.
                </AppText>
              </View>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                2. SERVICES
              </AppText>
              <View
                style={{
                  marginTop: normalize(8),
                  paddingLeft: normalize(8),
                }}>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  2.1 The Tasker will perform Services in a proper and
                  workmanlike manner.
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  2.2 The Tasker must perform the Services at the time and
                  location agreed.
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  2.3 The parties must perform their obligations in accordance
                  with any other terms or conditions agreed by the parties
                  during or subsequent to the creation of the Service Contract.
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  2.4 The parties acknowledge that the Service Contract is one
                  of personal service where the Poster selected the Tasker to
                  perform the Services. Therefore the Tasker must not
                  subcontract any part of the Services to any third party
                  without the Poster's consent.
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  2.5 The Tasker remains responsible and liable at all times to
                  the Poster for any acts or omissions of a subcontractor as if
                  those acts or omissions had been made by the Tasker.
                </AppText>
              </View>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                3. WARRANTIES
              </AppText>
              <View
                style={{
                  marginTop: normalize(8),
                  paddingLeft: normalize(8),
                }}>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  3.1 Each party warrants that the information provided in the
                  creation of the Service Contract is true and accurate.
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  3.2 The Tasker warrants that they have (and any subcontractor
                  has) the right to work and provide Services and hold all
                  relevant licences in the jurisdiction where the Services are
                  performed.
                </AppText>
              </View>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                4. PAYMENT OR CANCELLATION
              </AppText>
              <View
                style={{
                  marginTop: normalize(8),
                  paddingLeft: normalize(8),
                }}>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  4.1 Upon the creation of the Service Contract, the Poster must
                  pay the Agreed Price into the Payment Account.
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  4.2 Upon the Services being completed, the Tasker will provide
                  notice on the Servbees Platform.
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  4.3 The Poster will be prompted to confirm the Services are
                  complete. If the Tasker has completed the Services in
                  accordance with clause 2, the Poster must use the Servbees
                  Platform to release the Tasker Funds from the Payment Account.
                  For Recurring Services the Tasker Funds for an Occurrence will
                  automatically be released by Servbees from the Payment Account
                  to the Tasker unless paused by the Poster in accordance with
                  the User's Servbees Agreement.
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  4.4 If the parties agree to cancel the Service Contract, or
                  the Poster is unable to contact the Tasker to perform the
                  Service Contract, the Tasker Funds will be dealt with in
                  accordance with the User's Servbees Agreement.
                </AppText>
              </View>

              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                5. LIMITATION OF LIABILITY
              </AppText>
              <View
                style={{
                  marginTop: normalize(8),
                  paddingLeft: normalize(8),
                }}>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  5.1 Except for liability in relation to a breach of a
                  Non-excludable Condition, the parties exclude all
                  Consequential Loss arising out of or in connection to the
                  Services, and any claims by any third person, or the Service
                  Contract, even if the party causing the breach knew the loss
                  was possible or the loss was otherwise foreseeable.
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  5.2 Subject to any insurance or agreement to the contrary, the
                  liability of each party to the other except for a breach of
                  any Non-Excludable Condition is capped at the Agreed Price.
                </AppText>
              </View>

              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                6. DISPUTES
              </AppText>
              <View
                style={{
                  marginTop: normalize(8),
                  paddingLeft: normalize(8),
                }}>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  6.1 If a dispute arises between the parties, the parties will
                  attempt to resolve the dispute within 14 days by informal
                  negotiation (by phone, email or otherwise).
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  6.2 If the parties are unable to resolve the dispute in
                  accordance with clause 6.1, either party may refer the dispute
                  to Servbees and act in accordance with clause 18 of the
                  Servbees Agreement.
                </AppText>
              </View>

              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                7. TERMINATION OF CONTRACT
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                The Service Contract will terminate when:
              </AppText>

              <View
                style={{
                  marginTop: normalize(8),
                  paddingLeft: normalize(8),
                }}>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  (a) the Services are completed and the Agreed Price is
                  released from the Payment Account;
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  (b) a party is terminated or suspended from the Servbees
                  Platform, at the election of the other party;
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  (c) otherwise agreed by the parties or the Third Party Dispute
                  Service; or
                </AppText>
                <AppText
                  textStyle="body1"
                  customStyle={{marginTop: normalize(8)}}>
                  (d) notified by Servbees in accordance with the party's
                  Servbees Agreement.
                </AppText>
              </View>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                8. APPLICATION OF POLICIES
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                The parties incorporate by reference the applicable Policies.
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                9. GOVERNING LAW
              </AppText>
              <AppText
                textStyle="body1"
                customStyle={{marginTop: normalize(8)}}>
                The Service Contract is governed by the laws of the jurisdiction
                where the Posted Task was posted on the Servbees Platform.
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
