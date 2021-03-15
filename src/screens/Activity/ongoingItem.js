import React, { useState, useEffect } from 'react'
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'

import { normalize, Colors } from '@/globals'
import { AppText, ScreenHeaderTitle } from '@/components'
import { Icons, ChevronDown, ChevronUp, PostClock } from '@/assets/images/icons'

import ActivitiesCard from './components/ActivitiesCard'
import ItemCard from '@/screens/Activity/components/ItemCard'

const OngoingItem = ({ route, navigation }) => {
  const { item } = route.params

  const [accordion, setAccordion] = useState({
    awatingPayments: false,
    requests: false,
    ongoing: false,
  })

  useEffect(() => {
    if (
      item.orders.some(
        order => order.status === 'confirmed' && order.payment_method !== 'cash'
      )
    )
      setAccordion({ ...accordion, awatingPayments: true })
    else if (
      item.orders.some(
        order =>
          order.status === 'pending' ||
          (order.status === 'confirmed' && order.payment_method === 'cash')
      )
    )
      setAccordion({ ...accordion, requests: true })
    else setAccordion({ ...accordion, ongoing: true })
  }, [])

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView>
        <View style={styles.headerWrapper}>
          <ScreenHeaderTitle
            close={() => navigation.goBack()}
            title={item.post.title}
            customTitleStyle={styles.headerText}
            paddingSize={2}
            rightIcon={
              <View>
                <Icons.ChatGray width={normalize(20)} height={normalize(20)} />
              </View>
            }
          />
          <ActivitiesCard item={item} />
        </View>

        {item.orders.some(
          order =>
            order.status === 'confirmed' && order.payment_method !== 'cash'
        ) && (
          <View style={styles.itemCard}>
            <TouchableOpacity
              style={styles.itemCardHeader}
              onPress={() =>
                setAccordion({
                  ...accordion,
                  awatingPayments: !accordion.awatingPayments,
                })
              }>
              <View style={styles.iconText}>
                <Icons.WalletGray
                  width={normalize(18)}
                  height={normalize(18)}
                />
                <AppText
                  textStyle="body1medium"
                  customStyle={{ marginLeft: normalize(10) }}>
                  Awaiting Payment
                </AppText>
                <View
                  style={{
                    ...styles.iconBadge,
                    backgroundColor: Colors.secondaryBrinkPink,
                  }}>
                  <AppText textStyle="metadata" color={Colors.neutralsWhite}>
                    {
                      item.orders.filter(
                        order =>
                          order.status === 'confirmed' &&
                          order.payment_method !== 'cash'
                      ).length
                    }
                  </AppText>
                </View>
              </View>
              {accordion.awatingPayments ? (
                <ChevronUp width={normalize(16)} height={normalize(16)} />
              ) : (
                <ChevronDown width={normalize(16)} height={normalize(16)} />
              )}
            </TouchableOpacity>

            {accordion.awatingPayments && (
              <ItemCard
                items={item.orders.filter(
                  order =>
                    order.status === 'confirmed' &&
                    order.payment_method !== 'cash'
                )}
              />
            )}
          </View>
        )}

        {item.orders.some(
          order =>
            order.status === 'pending' ||
            (order.status === 'confirmed' && order.payment_method === 'cash')
        ) && (
          <View style={styles.itemCard}>
            <TouchableOpacity
              style={styles.itemCardHeader}
              onPress={() =>
                setAccordion({
                  ...accordion,
                  requests: !accordion.requests,
                })
              }>
              <View style={styles.iconText}>
                <Icons.ChatGray />
                <AppText
                  textStyle="body1medium"
                  customStyle={{ marginLeft: normalize(10) }}>
                  Requests
                </AppText>
                <View
                  style={{
                    ...styles.iconBadge,
                    backgroundColor: Colors.secondaryDarkTangerine,
                  }}>
                  <AppText textStyle="metadata" color={Colors.neutralsWhite}>
                    {
                      item.orders.filter(
                        order =>
                          order.status === 'pending' ||
                          (order.status === 'confirmed' &&
                            order.payment_method === 'cash')
                      ).length
                    }
                  </AppText>
                </View>
              </View>
              {accordion.requests ? (
                <ChevronUp width={normalize(16)} height={normalize(16)} />
              ) : (
                <ChevronDown width={normalize(16)} height={normalize(16)} />
              )}
            </TouchableOpacity>

            {accordion.requests && (
              <ItemCard
                items={item.orders.filter(
                  order =>
                    order.status === 'pending' ||
                    (order.status === 'confirmed' &&
                      order.payment_method === 'cash')
                )}
              />
            )}
          </View>
        )}

        {item.orders.includes(
          order =>
            order.status === 'paid' ||
            order.status === 'delivering' ||
            order.status === 'pickup' ||
            order.status === 'payment processing'
        ) && (
          <View style={styles.itemCard}>
            <TouchableOpacity
              style={styles.itemCardHeader}
              onPress={() =>
                setAccordion({
                  ...accordion,
                  ongoing: !accordion.ongoing,
                })
              }>
              <View style={styles.iconText}>
                <PostClock />
                <AppText
                  textStyle="body1medium"
                  customStyle={{ marginLeft: normalize(10) }}>
                  Ongoing
                </AppText>
                <View
                  style={{
                    ...styles.iconBadge,
                    backgroundColor: Colors.secondaryShamrock,
                  }}>
                  <AppText textStyle="metadata" color={Colors.neutralsWhite}>
                    {
                      item.orders.filter(
                        order =>
                          order.status === 'paid' ||
                          order.status === 'delivering' ||
                          order.status === 'pickup' ||
                          order.status === 'payment processing'
                      ).length
                    }
                  </AppText>
                </View>
              </View>
              {accordion.ongoing ? (
                <ChevronUp width={normalize(16)} height={normalize(16)} />
              ) : (
                <ChevronDown width={normalize(16)} height={normalize(16)} />
              )}
            </TouchableOpacity>

            {accordion.ongoing && (
              <ItemCard
                items={item.orders.filter(
                  order =>
                    order.status === 'paid' ||
                    order.status === 'delivering' ||
                    order.status === 'pickup' ||
                    order.status === 'payment processing'
                )}
              />
            )}
          </View>
        )}
      </ScrollView>

      {item.orders.some(
        order =>
          order.status === 'completed' ||
          order.status === 'cancelled' ||
          order.status === 'declined'
      ) && (
        <TouchableOpacity
          style={styles.pastWrapper}
          onPress={() => {
            navigation.navigate('NBTScreen', {
              screen: 'Past',
              params: {
                item: item,
              },
            })
          }}>
          <AppText customStyle={styles.pastText}>Past Orders</AppText>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  headerWrapper: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: normalize(15),
    borderBottomRightRadius: normalize(15),
    paddingBottom: normalize(15),
  },
  headerText: {
    textTransform: 'none',
    maxWidth: '75%',
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: normalize(15),
    marginTop: normalize(10),
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(15),
  },
  itemCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    borderRadius: normalize(100),
    marginLeft: normalize(8),
    justifyContent: 'center',
    alignItems: 'center',
    width: normalize(18),
    height: normalize(18),
  },
  pastWrapper: {
    backgroundColor: '#fff',
    paddingHorizontal: normalize(25),
    paddingVertical: normalize(15),
  },
  pastText: {
    color: Colors.contentOcean,
  },
})

export default OngoingItem
