import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { AppText } from '@/components'
import { PostService } from '@/services'

const SinglePostViewExternal = props => {
  const [isDataLoading, setIsDataLoading] = useState(false)
  const [postInfo, setPostInfo] = useState({})
  const navigation = useNavigation()

  const { pid } = props.route?.params

  useEffect(() => {
    let mounted = true

    PostService.getPost(pid)
      .then(res => {
        if (mounted) {
          navigation.navigate('NBTScreen', {
            screen: 'OthersPost',
            params: { ...res, othersView: true },
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        if (mounted) {
          setIsDataLoading(false)
        }
      })
  }, [])

  return (
    <View>
      <AppText>EXTERNAL VIEW</AppText>
    </View>
  )
}

export default SinglePostViewExternal
