//import liraries
import React, { useState } from 'react'
import {
  StyleSheet,
  SafeAreaView,
  View,
  SectionList,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native'
import {
  ScreenHeaderTitle,
  AppText,
  AppButton,
  BottomSheetHeader,
} from '@/components'
import { normalize, Colors } from '@/globals'
import { Images, NoReview } from '@/assets/images'
import { format, isThisMonth } from 'date-fns/esm'
import { Icons } from '@/assets/images/icons'
import Modal from 'react-native-modal'

const ListSeparator = () => {
  return <View style={styles.separator}></View>
}

const TempHistory = ({ toggleHistory, profileData }) => {
  const [infoModalVisible, setInfoModalVisible] = useState(false)

  const { temperature_history } = profileData
  const data = (temperature_history || [])
    .reduce((list, item) => {
      const date = new Date(item.date._seconds * 1000)
      const year = date.getFullYear()
      const month = format(date, 'MMMM')
      const title = isThisMonth(date) ? 'This month' : `${month} ${year}`

      let group = list.find(group => group.title === title)
      if (!group) {
        group = {
          title,
          data: [],
        }
        list.push(group)
      }

      group.data.push(item)
      return list
    }, [])
    .sort((a, b) =>
      new Date(a.title).getTime() < new Date(b.title).getTime() ? -1 : 1
    )

  const renderItem = ({ item }) => {
    const high = item.value > 37.5
    const color = high ? Colors.errColor : Colors.contentEbony
    const timestamp = format(
      new Date(item.date._seconds * 1000),
      'MMM dd, hh:mma'
    )

    const renderInfoIcon = () => {
      return high ? (
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => setInfoModalVisible(true)}>
          <Icons.Info />
        </TouchableOpacity>
      ) : null
    }

    return (
      <View style={styles.listItem}>
        <View style={styles.listItemTemperatureWrapper}>
          <Text style={[styles.temperature, { color }]}>{item.value}°C</Text>
          {renderInfoIcon()}
        </View>

        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: normalize(24) }}>
        <ScreenHeaderTitle
          iconSize={16}
          title="Body Temperature History"
          close={toggleHistory}
        />
        {data.length ? (
          <View style={styles.listWrapper}>
            <SectionList
              sections={data}
              ItemSeparatorComponent={ListSeparator}
              keyExtractor={(item, index) => item.date._nanoseconds + index}
              renderItem={renderItem}
              renderSectionHeader={({ section: { title } }) => {
                return <Text style={styles.sectionHeader}>{title}</Text>
              }}
            />
          </View>
        ) : (
          <View style={{ justifyContent: 'space-between', height: '95%' }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}>
              <NoReview />
              <AppText
                textStyle="body1medium"
                customStyle={{
                  marginTop: normalize(30),
                  marginBottom: normalize(8),
                }}>
                Temperature Tracker{' '}
              </AppText>
              <AppText textStyle="body2" customStyle={{ textAlign: 'center' }}>
                Safety first, always! Keep track of your temperature and body
                condition before hustling.
              </AppText>
            </View>
            <AppButton
              text="Log Temperature"
              type="primary"
              onPress={toggleHistory}
            />
          </View>
        )}
      </View>
      <Modal
        isVisible={infoModalVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={250}
        animationOutTiming={200}
        style={styles.modal}
        swipeDirection="down"
        onSwipeComplete={() => setInfoModalVisible(false)}
        customBackdrop={
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => setInfoModalVisible(false)}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <BottomSheetHeader />
        <HighTemperatureInfoModal close={() => setInfoModalVisible(false)} />
      </Modal>
    </SafeAreaView>
  )
}

const HighTemperatureInfoModal = ({ close }) => {
  return (
    <View style={styles.modalContent}>
      <Images.Doctor style={styles.modalImage} />
      <Text style={styles.modalContentTitle}>Uh-oh. You need to rest. </Text>
      <Text style={styles.modalContentDescription}>
        Please prioritize getting proper care and resume Servbees transactions
        once you're feeling better and fever-free.
      </Text>
      <TouchableOpacity style={styles.modalButton} onPress={close}>
        <Text style={styles.buttonText}>Okay</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  listWrapper: {
    flex: 1,
    paddingTop: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: normalize(16),
  },
  listItemTemperatureWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoButton: {
    marginLeft: normalize(12),
    height: 24,
    width: 24,
  },
  timestamp: {
    fontFamily: 'RoundedMplus1c-regular',
    fontSize: normalize(12),
    lineHeight: normalize(18),
    letterSpacing: 0.4,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.neutralsGainsboro,
  },
  sectionHeader: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(12),
    lineHeight: normalize(18),
    letterSpacing: 0.4,
    color: Colors.contentPlaceholder,
    marginTop: normalize(16),
  },
  temperature: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(14),
    lineHeight: normalize(21),
    letterSpacing: 0.25,
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: normalize(32),
    alignItems: 'center',
  },
  modalContentTitle: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(16),
    color: Colors.promoCopy,
    lineHeight: normalize(24),
    marginTop: normalize(8),
  },
  modalContentDescription: {
    fontFamily: 'RoundedMplus1c-regular',
    fontSize: normalize(12),
    lineHeight: normalize(18),
    letterSpacing: 0.4,
    color: Colors.contentPlaceholder,
    textAlign: 'center',
    marginBottom: normalize(32),
  },
  modalButton: {
    backgroundColor: Colors.primaryYellow,
    paddingVertical: 12,
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    borderRadius: 3,
    width: '100%',
  },
  buttonText: {
    fontFamily: 'RoundedMplus1c-Medium',
    fontSize: normalize(16),
    lineHeight: normalize(24),
    color: Colors.contentEbony,
  },
})

export default TempHistory
