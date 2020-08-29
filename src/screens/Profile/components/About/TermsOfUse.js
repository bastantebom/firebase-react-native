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
              </View>
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
