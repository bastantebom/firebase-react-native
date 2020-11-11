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

import { normalize, Colors } from '@/globals'

import {
  Chat,
  ChevronRight,
  TrackerIllustration,
  OrangeDot,
  BlueDot,
  GreenDot,
  RedDot,
  ChevronUp,
  ChevronDown,
  LocationContactUs,
  PostBox,
  PostCash,
  PostNote,
  Note,
} from '@/assets/images/icons'
import CancelOrder from './CancelOrder'
import DeclineOrder from './DeclineOrder'
import MoreActions from './MoreActions'
import DeclineRequest from './DeclineRequest'
import { Context } from '@/context'

const TrackerModal = ({ closeModal, postType }) => {
  const { openNotification, closeNotification } = useContext(Context)

  const [buyer, setBuyer] = useState(false)
  const [seller, setSeller] = useState(true)
  const [pickup, setPickup] = useState(true)
  const [delivery, setDelivery] = useState(false)

  const [message, showMessage] = useState(false)

  const [cancelOrder, setCancelOrder] = useState(false)
  const [declineOrder, setDeclineOrder] = useState(false)
  const [moreActions, setMoreActions] = useState(false)
  const [declineRequest, setDeclineRequest] = useState(false)

  const [status, setStatus] = useState('pending')
  const [statusHeader, setStatusHeader] = useState('')
  const [messageHeader, setMessageHeader] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

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

  const orderStatus = (status, postType) => {
    if (buyer) {
      switch (postType) {
        case 'sell':
          switch (status) {
            case 'pending':
              setStatusHeader('Awaiting Confirmation')
              setMessageHeader('Awaiting Confirmation')
              setStatusMessage('<Awaiting Confirmation copy>')
              break
            case 'confirmed':
              setStatusHeader('Confirmed')
              setMessageHeader('Order Confirmed')
              setStatusMessage('<Confirmed copy>')
              break
            case 'delivering':
              setStatusHeader('Delivering')
              setMessageHeader('Delivering')
              setStatusMessage('<Delivering message here>')
              break
            case 'processing':
              setStatusHeader('Processing')
              setMessageHeader('Order Confirmed')
              setStatusMessage('<Processing message here>')
              break
            case 'ready':
              setStatusHeader('Ready for Pick up')
              setMessageHeader('Pick up')
              setStatusMessage('<Ready for pick up message here>')
              break
            case 'completed':
              setStatusHeader('Completed!')
              setMessageHeader('Completed!')
              setStatusMessage('<Completed message here>')
              break
            case 'cancelled':
              setStatusHeader('Awaiting Confirmation')
              setMessageHeader('Awaiting Confirmation')
              setStatusMessage('<Awaiting Confirmation copy>')
              break
            default:
              null
          }
          break
        case 'service':
          switch (status) {
            case 'pending':
              setStatusHeader('Awaiting Confirmation')
              setMessageHeader('Awaiting Confirmation')
              setStatusMessage('<Awaiting Confirmation copy>')
              break
            case 'confirmed':
              setStatusHeader('Your booking is scheduled')
              setMessageHeader('Scheduled')
              setStatusMessage('<Schedule confirmed copy>')
              break
            case 'declined':
              setStatusHeader('Service Declined')
              setMessageHeader(null)
              setStatusMessage(null)
              break
            case 'cancelled':
              setStatusHeader('Service Cancelled')
              setMessageHeader(null)
              setStatusMessage(null)
              break
            case 'ongoing':
              setStatusHeader('Ongoing')
              setMessageHeader('Ongoing')
              setStatusMessage('<Ongoing copy>')
              break
            case 'completed':
              setStatusHeader('Completed')
              setMessageHeader(null)
              setStatusMessage(null)
              break
            default:
              null
          }
          break
        case 'need':
          switch (status) {
            case 'ongoing':
              setStatusHeader('In Progress')
              setMessageHeader('Ongoing')
              setStatusMessage('<Ongoing Confirmation copy>')
              break
            case 'pending':
              setStatusHeader('Awaiting Confirmation')
              setMessageHeader('Awaiting Confirmation')
              setStatusMessage('<Awaiting Confirmation copy>')
              break
            case 'confirmed':
              setStatusHeader('Offer Accepted')
              setMessageHeader('Your offer is accepted')
              setStatusMessage('<Offer accepted copy>')
              break
            case 'declined':
              setStatusHeader('Offer declined')
              setMessageHeader('Your offer is declined')
              setStatusMessage('<Offer declined copy>')
              break
            case 'completed':
              setStatusHeader('Completed!')
              setMessageHeader('Completed!')
              setStatusMessage('<Completed message here>')
              break
            default:
              null
          }
          break
        default:
          null
      }
    } else {
      switch (postType) {
        case 'sell':
          switch (status) {
            case 'pending':
              setStatusHeader('Awaiting Confirmation')
              setMessageHeader('Awaiting Confirmation')
              setStatusMessage('<Cancelled message here>')
              break
            case 'processing':
              setStatusHeader('Processing')
              setMessageHeader('Processing')
              setStatusMessage('<Processing message here>')
              break
            case 'delivering':
              setStatusHeader('Processing')
              setMessageHeader('Delivering')
              setStatusMessage('<Delivering message here>')
              break
            case 'completed':
              setStatusHeader('Order Completed')
              setMessageHeader('Completed!')
              setStatusMessage('<Completed message here>')
              break
            case 'cancelled':
              setStatusHeader('Cancelled')
              setMessageHeader('Cancelled by Customer')
              setStatusMessage('<Cancelled message here>')
              break
            case 'declined':
              setStatusHeader('Order Declined')
              setMessageHeader('Declined by Customer')
              setStatusMessage('<Declined message here>')
              break
            default:
              null
          }
          break
        case 'service':
          switch (status) {
            case 'pending':
              setStatusHeader('Awaiting Confirmation')
              setMessageHeader('Awaiting Confirmation')
              setStatusMessage('<Awaiting Confirmation copy>')
              break
            case 'confirmed':
              setStatusHeader('Your booking is scheduled')
              setMessageHeader('Scheduled')
              setStatusMessage('<Schedule confirmed copy>')
              break
            case 'ongoing':
              setStatusHeader('Ongoing')
              setMessageHeader('Ongoing')
              setStatusMessage('<Ongoing copy>')
              break
            case 'declined':
              setStatusHeader('Declined')
              setMessageHeader('Declined')
              setStatusMessage('<Declined copy>')
              break
            case 'completed':
              setStatusHeader('Completed')
              setMessageHeader('Declined')
              setStatusMessage('<Declined copy>')
              break
            default:
              null
          }
          break
      }
    }
  }

  useEffect(() => {
    orderStatus(status, postType)
  }, [postType, status])

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
        title={
          postType === 'sell' && status === 'completed'
            ? 'Order Completed'
            : (buyer && postType === 'sell' && status === 'pending') ||
              (buyer && postType === 'sell' && status === 'processing')
            ? 'Order Request'
            : buyer && postType === 'sell' && status === 'declined'
            ? 'Order Declined'
            : buyer && postType === 'sell' && status === 'cancelled'
            ? 'Order Cancelled'
            : (buyer && postType === 'service' && status === 'pending') ||
              (buyer && postType === 'service' && status === 'ongoing') ||
              (buyer && postType === 'service' && status === 'confirmed')
            ? 'Status'
            : buyer && postType === 'service' && status === 'cancelled'
            ? 'Service Declined'
            : buyer && postType === 'service' && status === 'completed'
            ? 'Completed'
            : seller && postType === 'service' && status === 'completed'
            ? 'Order Completed'
            : seller && postType === 'service' && status === 'pending'
            ? 'Service Request'
            : 'Order Status'
        }
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
                {statusHeader}
              </AppText>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.section,
              {
                display:
                  (postType === 'service' && status === 'completed') ||
                  status === 'declined'
                    ? 'none'
                    : 'flex',
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
                {status === 'pending' ||
                (buyer && status === 'cancelled') ||
                (status === 'ongoing' && postType === 'need') ? (
                  <OrangeDot />
                ) : status === 'confirmed' ||
                  status === 'delivering' ||
                  status === 'processing' ||
                  status === 'ready' ||
                  status === 'ongoing' ? (
                  <GreenDot />
                ) : status === 'cancelled' ? (
                  <RedDot />
                ) : (
                  <BlueDot />
                )}
                <AppText
                  textStyle="body2medium"
                  customStyle={{ marginLeft: normalize(10) }}>
                  {messageHeader}
                </AppText>
              </View>
              {message ? <ChevronUp /> : <ChevronDown />}
            </View>
            {message && (
              <AppText
                textStyle="caption"
                customStyle={{ marginTop: normalize(8) }}>
                {statusMessage}
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
                paddingBottom: normalize(10),
                display: postType !== 'sell' ? 'none' : 'flex',
              }}>
              <LocationContactUs width={normalize(20)} height={normalize(20)} />
              <View style={{ marginLeft: normalize(10), maxWidth: '90%' }}>
                {pickup && (
                  <>
                    {status === 'completed' ? (
                      <AppText textStyle="body1">
                        Picked up from &nbsp;
                        <AppText textStyle="body1medium">
                          Wayne’s Burger and Smoothies
                        </AppText>
                      </AppText>
                    ) : (
                      <AppText textStyle="body1">
                        Pick up from &nbsp;
                        <AppText textStyle="body1medium">
                          Wayne’s Burger and Smoothies
                        </AppText>
                      </AppText>
                    )}
                  </>
                )}
                {delivery && (
                  <AppText textStyle="body1">
                    From &nbsp;
                    <AppText textStyle="body1medium">
                      Wayne’s Burger and Smoothies
                    </AppText>
                  </AppText>
                )}
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
                display: pickup && postType === 'sell' ? 'none' : 'flex',
                borderTopWidth: postType === 'service' ? 0 : 1,
                borderTopColor: '#E5E5E5',
              }}>
              <PostBox width={normalize(20)} height={normalize(20)} />
              <View style={{ marginLeft: normalize(10), maxWidth: '90%' }}>
                <AppText
                  textStyle="body1medium"
                  customStyle={{ marginRight: normalize(5) }}>
                  {postType === 'sell'
                    ? 'Deliver to'
                    : (postType === 'service' && status === 'confirmed') ||
                      (postType === 'service' && status === 'completed') ||
                      (postType === 'service' && status === 'cancelled') ||
                      (postType === 'service' && status === 'pending')
                    ? 'Service at'
                    : postType === 'service' && status === 'ongoing'
                    ? 'Servicing at'
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
                {postType === 'need' ||
                  (postType === 'sell' && (
                    <AppText
                      textStyle="body2"
                      customStyle={{ marginTop: normalize(7) }}>
                      Cash on delivery, change ₱200
                    </AppText>
                  ))}
                {postType === 'need' && (
                  <AppText
                    textStyle="body2"
                    customStyle={{ marginTop: normalize(7) }}>
                    ₱200
                  </AppText>
                )}
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
                    : postType === 'service' && status === 'cancelled'
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

      {buyer && (
        <>
          <View
            style={{
              display:
                status === 'pending' ||
                status === 'ongoing' ||
                status === 'confirmed'
                  ? 'flex'
                  : 'none',
            }}>
            <View
              style={{
                backgroundColor: 'rgba(164, 167, 175, 0.1)',
                height: 5,
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                paddingVertical: normalize(25),
                paddingHorizontal: normalize(35),
                justifyContent:
                  postType !== 'need' ? 'space-between' : 'center',
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
              display:
                status === 'cancelled' || status === 'completed'
                  ? 'flex'
                  : 'none',
              padding: normalize(16),
            }}>
            <AppButton type="primary" text="Done" />
          </View>
        </>
      )}

      {seller && (
        <>
          <View
            style={{
              display:
                status === 'pending' ||
                (postType === 'service' && status === 'ongoing')
                  ? 'flex'
                  : 'none',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: normalize(15),
              }}>
              <View style={{ width: '40%' }}>
                {postType === 'sell' && (
                  <AppButton
                    type="secondary"
                    text="Decline"
                    onPress={() => setDeclineOrder(true)}
                  />
                )}
                {postType === 'service' && (
                  <AppButton
                    type="secondary"
                    text="Decline"
                    onPress={() => setDeclineRequest(true)}
                  />
                )}
              </View>
              <View style={{ width: '55%' }}>
                <AppButton type="primary" text="Confirm Order" />
              </View>
            </View>
          </View>
          <View
            style={{
              display: status === 'processing' ? 'flex' : 'none',
            }}>
            <View
              style={{
                padding: normalize(15),
              }}>
              {delivery && (
                <AppButton type="primary" text="Confirm for Delivery" />
              )}
              {pickup && (
                <AppButton type="primary" text="Confirm for Pick Up" />
              )}
            </View>
          </View>
          <View
            style={{
              display: status === 'delivering' ? 'flex' : 'none',
            }}>
            <View
              style={{
                padding: normalize(15),
              }}>
              <AppButton type="primary" text="Order Completed" />
            </View>
          </View>
          <View
            style={{
              display:
                status === 'completed' ||
                status === 'cancelled' ||
                status === 'declined'
                  ? 'flex'
                  : 'none',
            }}>
            <View
              style={{
                padding: normalize(15),
              }}>
              <AppButton type="primary" text="Done" />
            </View>
          </View>
          <View
            style={{
              display:
                (buyer && status === 'ongoing') || status === 'confirmed'
                  ? 'flex'
                  : 'none',
            }}>
            <View
              style={{
                flexDirection: 'row',
                paddingVertical: normalize(25),
                paddingHorizontal: normalize(35),
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={{ width: '50%' }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setMoreActions(true)}>
                  <AppText textStyle="button2" color={Colors.contentOcean}>
                    More Actions
                  </AppText>
                </TouchableOpacity>
              </View>
              <View style={{ width: '50%' }}>
                <AppButton
                  type="primary"
                  text="Complete"
                  disabled
                  customStyle={{
                    backgroundColor: '#E9EDF1',
                    borderColor: '#E9EDF1',
                  }}
                />
              </View>
            </View>
          </View>
        </>
      )}

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
      <Modal
        isVisible={declineOrder}
        animationIn="slideInUp"
        animationInTiming={450}
        animationOut="slideOutDown"
        animationOutTiming={450}
        style={{ margin: 0, justifyContent: 'flex-end' }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={() => setDeclineOrder(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <DeclineOrder
          goBack={() => setDeclineOrder(false)}
          postType={postType}
        />
      </Modal>
      <Modal
        isVisible={moreActions}
        animationIn="slideInUp"
        animationInTiming={450}
        animationOut="slideOutDown"
        animationOutTiming={450}
        style={{ margin: 0, justifyContent: 'flex-end' }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={() => setMoreActions(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <MoreActions goBack={() => setMoreActions(false)} postType={postType} />
      </Modal>
      <Modal
        isVisible={declineRequest}
        animationIn="slideInUp"
        animationInTiming={450}
        animationOut="slideOutDown"
        animationOutTiming={450}
        style={{ margin: 0, justifyContent: 'flex-end' }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={() => setDeclineRequest(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <DeclineRequest
          goBack={() => setDeclineRequest(false)}
          postType={postType}
        />
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
