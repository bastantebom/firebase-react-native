import React, { useState, useContext } from 'react'
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  SafeAreaView,
  Dimensions,
} from 'react-native'

import { Posts, WhiteOpacity, Notification } from '@/components'
import FilterSlider from './components/FilterSlider'
import { GlobalStyle, Colors, normalize } from '@/globals'

import Modal from 'react-native-modal'
import { Context } from '@/context'
import { UserContext } from '@/context/UserContext'
import { VerificationScreen } from '@/screens/Dashboard/Verification'

import SearchBarWithFilter from './components/SearchBarWithFilter'

function Dashboard(props) {
  const { user } = useContext(UserContext)

  const [modalState, setModalState] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const { posts } = useContext(Context)

  const toggleModal = () => {
    setModalState(!modalState)
  }

  const [menu, setMenu] = useState(false)

  const toggleMenu = () => {
    setMenu(!menu)
  }

  return (
    <>
      <SafeAreaView style={styles.safeAreaContainer}>
        {user && (
          <Notification
            message={
              <VerificationScreen
                onPress={() => toggleMenu()}
                menu={menu}
                toggleMenu={() => toggleMenu()}
                modalBack={() => setMenu(false)}
              />
            }
            type={'verified'}
            position="relative"
            verification
          />
        )}

        <View style={styles.container}>
          <SearchBarWithFilter toggleFilter={toggleModal} />
          <Posts
            type="dashboard"
            data={posts}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </View>
        <WhiteOpacity />
      </SafeAreaView>
      <Modal
        isVisible={modalState}
        animationIn="slideInRight"
        animationInTiming={1000}
        animationOut="slideOutRight"
        animationOutTiming={1000}
        onSwipeComplete={toggleModal}
        swipeDirection="right"
        style={{
          justifyContent: 'flex-end',
          margin: 0,
          marginLeft: normalize(32),
        }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={toggleModal}>
            <View style={{ flex: 1, backgroundColor: 'black' }} />
          </TouchableWithoutFeedback>
        }>
        <FilterSlider modalToggler={toggleModal} />
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  container: {
    backgroundColor: 'white',
  },
})

export default Dashboard
