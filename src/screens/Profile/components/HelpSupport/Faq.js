//import liraries
import React, { useState, useContext } from 'react'
import { View, StyleSheet, SafeAreaView } from 'react-native'

import {
  ScreenHeaderTitle,
  PaddingView,
  AppText,
  ProfileInfo,
  AppButton,
} from '@/components'

import { ContactUsImg } from '@/assets/images'
import {
  EmailContactUs,
  CallContactUs,
  LocationContactUs,
  ArrowDown,
} from '@/assets/images/icons'
import { normalize, Colors } from '@/globals'
import Modal from 'react-native-modal'
import { UserContext } from '@/context/UserContext'
import AdminFunctionService from '@/services/Admin/AdminFunctions'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'

// create a component
const Faq = ({ toggleFaq }) => {
  const [currentSelected, setCurrentSelected] = useState(null)

  let dummyData = [
    {
      topic: 'Topic or question here',
      suggestion:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      topic: 'Topic or question here 2',
      suggestion:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      topic: 'Topic or question here 3',
      suggestion:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      topic: 'Topic or question here 4',
      suggestion:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      topic: 'Topic or question here 5',
      suggestion:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      topic: 'Topic or question here 6',
      suggestion:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      topic: 'Topic or question here 7',
      suggestion:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et ',
    },
    {
      topic: 'Topic or question here 8',
      suggestion: 'Lorem ipsum dolor sit amet, ',
    },
  ]

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PaddingView paddingSize={3}>
        <ScreenHeaderTitle
          title="Frequently Asked Question"
          close={toggleFaq}
        />
      </PaddingView>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.contentWrapper}>
          {dummyData.map((faq, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  //setCurrentSelected(index);
                  currentSelected === index
                    ? setCurrentSelected(null)
                    : setCurrentSelected(index)
                }}
                style={styles.faq}
                activeOpacity={0.5}>
                <View style={styles.topicContainer}>
                  <View style={{ flexDirection: 'row' }}>
                    <AppText textStyle="body1medium">{faq.topic}</AppText>
                    <View style={styles.iconContainer}>
                      <ArrowDown height={24} width={24} />
                    </View>
                  </View>
                  {currentSelected === index ? (
                    <View>
                      <View style={styles.suggestionContainer}>
                        <AppText textStyle="body2">{faq.suggestion}</AppText>
                      </View>
                    </View>
                  ) : null}
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

// define your styles
const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: Colors.neutralsWhite,
    padding: 24,
  },
  topicContainer: {
    paddingVertical: 16,
    borderBottomColor: Colors.neutralGray,
    borderBottomWidth: 1,
  },
  suggestionContainer: {
    paddingVertical: 4,
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
})
// define your styles

//make this component available to the app
export default Faq
