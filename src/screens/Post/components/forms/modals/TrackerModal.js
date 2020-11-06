import React, { useContext, useState, useEffect } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from 'react-native'

import Modal from 'react-native-modal'

import {
  AppText,
  PaddingView,
  ScreenHeaderTitle,
  Notification,
  AppButton,
} from '@/components'

import { normalize, GlobalStyle, Colors } from '@/globals'

import {
  Chat,
  ChevronRight,
  TrackerIllustration,
  OrangeDot,
  BlueDot,
  GreenDot,
  ChevronUp,
  ChevronDown,
  LocationContactUs,
  PostBox,
  PostCash,
  PostNote,
  Note,
} from '@/assets/images/icons'
import CancelOrder from './CancelOrder'
import { Context } from '@/context'

const TrackerModal = ({ closeModal, postType }) => {
  const { openNotification, closeNotification } = useContext(Context)

  const [pending, setPending] = useState(true)
  const [confirmed, setConfirmed] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [delivering, setDelivering] = useState(false)
  const [ready, setReady] = useState(false)
  const [completed, setCompleted] = useState(false)

  //services
  const [declined, setDeclined] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [ongoing, setOngoing] = useState(false)

  const [message, showMessage] = useState(false)

  const [cancelOrder, setCancelOrder] = useState(false)

  const orderList = [
    {
      quantity: '1',
      name: 'Beef Burger',
      price: '75',
    },
    {
      quantity: '1',
      name: 'Spicy Beef Burger',
      price: '75',
      note: 'No tomatoes and onions',
    },
  ]

  useEffect(() => {
    openNotification()
    setTimeout(() => {
      closeNotification()
    }, 5000)
  }, [])

  return (
    <>
      <ScreenHeaderTitle
        close={closeModal}
        title="Order Status"
        paddingSize={2}
        iconSize={normalize(16)}
      />
      <Notification
        message={
          <AppText
            textStyle="body2"
            customStyle={{ marginLeft: 14, paddingTop: 2 }}>
            {postType === 'sell'
              ? 'Order Sent!'
              : postType === 'service'
              ? 'Request Sent!'
              : 'Offer Sent!'}
          </AppText>
        }
        type="success"
        position="relative"
      />
      <TouchableOpacity
        style={{ position: 'relative', width: '100%' }}
        activeOpacity={0.7}>
        <View style={styles.button}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={styles.image}
              source={require('@/assets/images/burger.jpg')}
            />
            <View>
              <AppText
                textStyle="body2medium"
                customStyle={{ marginBottom: 5 }}>
                Wayne’s Burgers and Smoothies
              </AppText>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Chat width={normalize(18)} height={normalize(18)} />
                <AppText
                  textStyle="caption"
                  customStyle={{ marginLeft: normalize(5) }}>
                  {postType === 'sell'
                    ? 'Message seller'
                    : postType === 'service'
                    ? 'Message service provider'
                    : 'Message <name>'}
                </AppText>
              </View>
            </View>
          </View>
          <View style={{ position: 'absolute', right: 10 }}>
            <ChevronRight width={normalize(16)} height={normalize(16)} />
          </View>
        </View>
      </TouchableOpacity>
      <ScrollView>
        <PaddingView paddingSize={2}>
          <View
            style={{
              position: 'relative',
              zIndex: -1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TrackerIllustration
              width={normalize(250)}
              height={normalize(200)}
            />
            <View style={styles.status}>
              <AppText
                color={Colors.neutralsWhite}
                textStyle="body2medium"
                customStyle={{ textAlign: 'center' }}>
                {postType === 'sell'
                  ? pending
                    ? 'Awaiting Confirmation'
                    : confirmed
                    ? 'Confirmed'
                    : delivering
                    ? 'Delivering'
                    : processing
                    ? 'Processing'
                    : ready
                    ? 'Ready for Pick up'
                    : 'Completed'
                  : postType === 'service'
                  ? pending
                    ? 'Awaiting Confirmation'
                    : confirmed
                    ? 'Your booking is scheduled'
                    : declined
                    ? 'Service Declined'
                    : cancelled
                    ? 'Service Cancelled'
                    : ongoing
                    ? 'Ongoing'
                    : 'Completed'
                  : pending
                  ? 'Awaiting Confirmation'
                  : confirmed
                  ? 'Offer Accepted'
                  : declined
                  ? 'Offer Declined'
                  : null}
              </AppText>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.section,
              {
                display:
                  postType === 'service' && (confirmed || pending || ongoing)
                    ? 'flex'
                    : postType === 'sell' || postType === 'need'
                    ? 'flex'
                    : 'none',
              },
            ]}
            onPress={() => showMessage(!message)}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {pending ? (
                  <OrangeDot />
                ) : confirmed ||
                  delivering ||
                  processing ||
                  ready ||
                  ongoing ? (
                  <GreenDot />
                ) : (
                  <BlueDot />
                )}
                <AppText
                  textStyle="body2medium"
                  customStyle={{ marginLeft: normalize(10) }}>
                  {postType === 'sell'
                    ? pending
                      ? 'Awaiting Confirmation'
                      : confirmed
                      ? 'Order Confirmed'
                      : delivering
                      ? 'Delivering'
                      : processing
                      ? 'Order Confirmed'
                      : ready
                      ? 'Pick up'
                      : 'Completed!'
                    : postType === 'service'
                    ? pending
                      ? 'Awaiting Confirmation'
                      : confirmed
                      ? 'Scheduled'
                      : ongoing
                      ? 'Ongoing'
                      : null
                    : pending
                    ? 'Awaiting Confirmation'
                    : confirmed
                    ? 'Your offer is accepted'
                    : declined
                    ? 'Your offer is declined'
                    : null}
                </AppText>
              </View>
              {message ? <ChevronUp /> : <ChevronDown />}
            </View>
            {message && (
              <AppText
                textStyle="caption"
                customStyle={{ marginTop: normalize(8) }}>
                {postType === 'sell'
                  ? pending
                    ? '<Awaiting Confirmation copy>'
                    : confirmed
                    ? 'Wayne confirmed your order! Wait for his message about payment before he process your order.'
                    : delivering
                    ? '<Delivering message here>'
                    : processing
                    ? '<Processing message here>'
                    : ready
                    ? '<Ready for pick up message here>'
                    : '<Completed message here>'
                  : postType === 'service'
                  ? pending
                    ? '<Awaiting Confirmation copy>'
                    : confirmed
                    ? '<Schedule confirmed copy>'
                    : ongoing
                    ? '<Ongoing copy>'
                    : null
                  : pending
                  ? '<Awaiting Confirmation copy>'
                  : confirmed
                  ? '<Offer accepted copy>'
                  : declined
                  ? '<Offer declined copy>'
                  : null}
              </AppText>
            )}
          </TouchableOpacity>
          <View
            style={[
              styles.section,
              { display: postType !== 'need' ? 'flex' : 'none' },
            ]}>
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderBottomColor: '#E5E5E5',
                paddingBottom: normalize(10),
                display: postType !== 'sell' ? 'none' : 'flex',
              }}>
              <LocationContactUs width={normalize(20)} height={normalize(20)} />
              <View style={{ marginLeft: normalize(10), maxWidth: '90%' }}>
                <AppText textStyle="body1">
                  From &nbsp;
                  <AppText textStyle="body1medium">
                    Wayne’s Burger and Smoothies
                  </AppText>
                </AppText>
                <AppText
                  textStyle="body2"
                  customStyle={{ marginTop: normalize(7) }}>
                  13 Freddy Krugger St. Kapitolyo, Pasig City
                </AppText>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                paddingTop: postType !== 'sell' ? 0 : normalize(10),
              }}>
              <PostBox width={normalize(20)} height={normalize(20)} />
              <View style={{ marginLeft: normalize(10), maxWidth: '90%' }}>
                <AppText
                  textStyle="body1"
                  customStyle={{ marginRight: normalize(5) }}>
                  {postType === 'sell'
                    ? 'Deliver to'
                    : postType === 'service'
                    ? 'Service at'
                    : null}
                  &nbsp;
                  <AppText textStyle="body1medium">Home</AppText>
                </AppText>
                <AppText
                  textStyle="body2"
                  customStyle={{ marginTop: normalize(7) }}>
                  54-A Mahogany Ave, Kingsville Subdivision
                </AppText>
              </View>
            </View>
          </View>
          <View
            style={[
              styles.section,
              { display: postType === 'service' ? 'flex' : 'none' },
            ]}>
            <View style={{ flexDirection: 'row' }}>
              <PostCash width={normalize(20)} height={normalize(20)} />
              <View style={{ marginLeft: normalize(10), maxWidth: '90%' }}>
                <AppText textStyle="body1medium">
                  Service requested on Sep 29, 2020
                </AppText>
                <AppText
                  textStyle="body2"
                  customStyle={{ marginTop: normalize(7) }}>
                  at 10:00 AM (Local time)
                </AppText>
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <View style={{ flexDirection: 'row' }}>
              <PostCash width={normalize(20)} height={normalize(20)} />
              <View style={{ marginLeft: normalize(10) }}>
                <AppText textStyle="body1medium">
                  {postType !== 'need' ? 'Payment Method' : 'Your offer'}
                </AppText>
                <AppText
                  textStyle="body2"
                  customStyle={{ marginTop: normalize(7) }}>
                  Cash on delivery, change ₱200
                </AppText>
              </View>
            </View>
          </View>
          <View
            style={[
              styles.section,
              { display: postType !== 'need' ? 'flex' : 'none' },
            ]}>
            <View>
              <View style={{ position: 'absolute', top: normalize(3) }}>
                <PostNote width={normalize(20)} height={normalize(20)} />
              </View>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#E5E5E5',
                  paddingBottom: normalize(10),
                }}>
                <AppText
                  textStyle="body1medium"
                  customStyle={{
                    marginLeft: normalize(30),
                    marginBottom: normalize(7),
                  }}>
                  {postType === 'sell'
                    ? 'Order Summary'
                    : postType === 'service'
                    ? 'Service Summary'
                    : null}
                </AppText>
                {orderList.map((item, k) => {
                  return (
                    <View
                      key={k}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingBottom: normalize(10),
                      }}>
                      <View style={{ flexDirection: 'row' }}>
                        <AppText
                          textStyle="body1"
                          color={Colors.secondaryLavenderBlue}>
                          {item.quantity}x
                        </AppText>
                        <View style={{ marginLeft: normalize(10) }}>
                          <AppText textStyle="body1medium">{item.name}</AppText>
                          {item.note && (
                            <AppText textStyle="caption">{item.note}</AppText>
                          )}
                        </View>
                      </View>
                      <AppText
                        textStyle="body1"
                        color={Colors.contentPlaceholder}>
                        ₱{item.price}
                      </AppText>
                    </View>
                  )
                })}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingTop: normalize(10),
                }}>
                <AppText textStyle="body1medium">Total</AppText>
                <AppText textStyle="body1medium">₱75</AppText>
              </View>
            </View>
          </View>
          <View
            style={[
              styles.section,
              {
                display:
                  postType === 'need'
                    ? 'flex'
                    : postType === 'service' && cancelled
                    ? 'flex'
                    : 'none',
              },
            ]}>
            <View style={{ flexDirection: 'row' }}>
              {postType === 'need' ? (
                <Note width={normalize(18)} height={normalize(18)} />
              ) : (
                <PostCash width={normalize(24)} height={normalize(24)} />
              )}
              <View style={{ marginLeft: normalize(10), maxWidth: '90%' }}>
                <AppText textStyle="body1medium">Notes</AppText>
                <AppText
                  textStyle="body2"
                  customStyle={{ marginTop: normalize(7) }}>
                  Hi Alex! I have 5 years experience in carpentry. I can also
                  tag along my colleague if you need more workers.
                </AppText>
              </View>
            </View>
          </View>
        </PaddingView>
      </ScrollView>
      <View style={{ display: pending ? 'flex' : 'none' }}>
        <View
          style={{
            backgroundColor: 'rgba(164, 167, 175, 0.1)',
            height: 5,
            display: pending ? 'flex' : 'none',
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: normalize(25),
            paddingHorizontal: normalize(35),
            justifyContent: postType !== 'need' ? 'space-between' : 'center',
            display: pending ? 'flex' : 'none',
          }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setCancelOrder(true)}>
            <AppText textStyle="button2" color={Colors.secondaryBrinkPink}>
              {postType === 'sell'
                ? 'Cancel Order'
                : postType === 'service'
                ? 'Cancel Request'
                : null}
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} onPress={closeModal}>
            <AppText textStyle="button2" color={Colors.contentOcean}>
              {postType === 'sell'
                ? 'Edit Order'
                : postType === 'service'
                ? 'Edit'
                : 'Edit Offer'}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          display: completed || cancelled ? 'flex' : 'none',
          padding: normalize(16),
        }}>
        <AppButton type="primary" text="Done" />
      </View>
      <Modal
        isVisible={cancelOrder}
        animationIn="slideInUp"
        animationInTiming={450}
        animationOut="slideOutDown"
        animationOutTiming={450}
        style={{ margin: 0, justifyContent: 'flex-end' }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={() => setCancelOrder(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <CancelOrder goBack={() => setCancelOrder(false)} postType={postType} />
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: normalize(15),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F7FF',
  },
  image: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: 4,
    marginRight: normalize(12),
  },
  status: {
    position: 'absolute',
    zIndex: 1,
    width: normalize(220),
    height: normalize(50),
    paddingVertical: normalize(20),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E05454',
  },
  section: {
    padding: normalize(16),
    borderColor: '#DADCE0',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: normalize(10),
  },
})

export default TrackerModal
