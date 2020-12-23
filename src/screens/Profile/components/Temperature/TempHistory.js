//import liraries
import React from 'react'
import { StyleSheet, SafeAreaView, View } from 'react-native'
import {
  ScreenHeaderTitle,
  PaddingView,
  AppText,
  AppButton,
} from '@/components'
import { normalize, Colors, tempHistory, joinedDate } from '@/globals'
import { ScrollView } from 'react-native-gesture-handler'
import { NoReview } from '@/assets/images'

// create a component
const TempHistory = ({ toggleHistory, profileData }) => {
  const { temperature_history } = profileData
  const history = temperature_history?.map(item => item).reverse()

  const ALLOWED_TEMP = 37.2

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <PaddingView paddingSize={3}>
          <ScreenHeaderTitle
            iconSize={16}
            title="Body Temperature History"
            close={toggleHistory}
          />
          <ScrollView contentContainerStyle={{ flexGrow: 1, height: '100%' }}>
            {history ? (
              history.map((temp, index) => {
                const tempColor =
                  temp.value > ALLOWED_TEMP
                    ? Colors.errColor
                    : Colors.contentEbony
                const customBorder = !index
                  ? {}
                  : {
                      borderTopWidth: 1,
                      borderTopColor: Colors.neutralsGainsboro,
                    }
                const monthLabel =
                  joinedDate(Date.now()) ===
                  joinedDate(temp.date._seconds * 1000)
                    ? 'This month'
                    : joinedDate(temp.date._seconds * 1000)
                const fLabel =
                  monthLabel === 'This month' ||
                  monthLabel === joinedDate(temp.date._seconds * 1000)
                    ? null
                    : joinedDate(temp.date._seconds * 1000)
                const label = !index ? monthLabel : fLabel

                return (
                  <>
                    {label ? (
                      <View key={index + 1000} style={{ marginTop: 32 }}>
                        <AppText
                          key={index + 6000}
                          textStyle="captionConstant"
                          color={Colors.contentPlaceholder}
                          customStyle={{ flex: 1 }}>
                          {label}
                        </AppText>
                      </View>
                    ) : null}
                    <View
                      key={index + 2000}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 16,
                        ...customBorder,
                      }}>
                      <AppText
                        key={index + 3000}
                        textStyle="body1"
                        color={tempColor}
                        customStyle={{ flex: 4 }}>
                        {temp.value} °C
                      </AppText>
                      <AppText
                        key={index + 4000}
                        customStyle={{
                          flex: 2,
                          justifyContent: 'flex-end',
                          textAlign: 'right',
                        }}
                        textStyle="captionConstant"
                        color={Colors.contentPlaceholder}>
                        {tempHistory(temp.date._seconds * 1000)}
                      </AppText>
                    </View>
                  </>
                )
              })
            ) : (
              <View
                style={{
                  justifyContent: 'space-between',
                  height: '95%',
                }}>
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
                  <AppText
                    textStyle="body2"
                    customStyle={{ textAlign: 'center' }}>
                    Safety first, always! Keep track of your temperature and
                    body condition before hustling.{' '}
                  </AppText>
                </View>
                <AppButton
                  text="Log Temperature"
                  type="primary"
                  onPress={toggleHistory}
                />
              </View>
            )}
          </ScrollView>
        </PaddingView>
      </SafeAreaView>
    </>
  )
}

//make this component available to the app
export default TempHistory
