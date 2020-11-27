import React, { useContext, useState, useEffect } from 'react'
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
import Modal from 'react-native-modal'
import { useNavigation } from '@react-navigation/native'

import { Colors, normalize } from '@/globals'
import { AppButton, AppText, SinglePostOthersView } from '@/components'
import { Context } from '@/context'
import { UserContext } from '@/context/UserContext'
import Tags from './Tags'
import Highlight from './Highlight'

const InfiniteHits = ({ value }) => {
  const {
    searchType,
    results,
    handleOnEndReach,
    handleOnUserEndReach,
    page,
  } = useContext(Context)
  const { user } = useContext(UserContext)

  const navigation = useNavigation()

  const [showPost, setShowPost] = useState(false)
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const goToPost = item => {
    setData(item)
    setShowPost(!showPost)
  }

  const openProfile = item => {
    const uid = item.uid
    if (user && user.uid === uid) {
      navigation.navigate('Profile', {
        screen: 'Profile',
      })
    } else {
      navigation.navigate('NBTScreen', {
        screen: 'OthersProfile',
        params: { uid: uid },
      })
    }
  }

  return (
    <View>
      {results.length !== 0 ? (
        <FlatList
          data={results}
          keyExtractor={item => item.objectID}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          onEndReached={() => {
            searchType === 'posts'
              ? handleOnEndReach(value)
              : handleOnUserEndReach(value)
          }}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() =>
                  searchType === 'posts' ? goToPost(item) : openProfile(item)
                }>
                <Highlight hit={item} />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <View style={{ paddingTop: 16 }}>
          <AppText textStyle="subtitle1">
            Your search “{value}” did not match any post.{' '}
          </AppText>
          <AppText textStyle="subtitle1">Try another search?</AppText>
          <View style={{ marginVertical: 15 }}>
            <AppText textStyle="caption">
              - Check if the spelling is correct
            </AppText>
            <AppText textStyle="caption">- Use different keywords</AppText>
          </View>
          <AppButton
            text="Change your location or distance"
            type="primary"
            height="sm"
            customStyle={{ paddingVertical: 5, height: normalize(40) }}
          />
          <Tags />
        </View>
      )}
      <Modal
        isVisible={showPost}
        animationIn="slideInRight"
        animationInTiming={200}
        animationOut="slideOutRight"
        animationOutTiming={200}
        style={{
          margin: 0,
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
          justifyContent: 'flex-start',
        }}>
        <SinglePostOthersView
          data={data}
          closePostModal={() => setShowPost(false)}
        />
      </Modal>
    </View>
  )
}

export default InfiniteHits

const styles = StyleSheet.create({
  separator: {
    borderBottomWidth: 1,
    borderColor: Colors.neutralGray,
  },
  item: {
    flex: 1,
    // flexDirection: 'row',
    paddingVertical: 10,
    flexDirection: 'column',
  },
})
