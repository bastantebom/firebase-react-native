import React, { useContext } from 'react'

import { View, TouchableOpacity } from 'react-native'
import { AppText } from '@/components'
import { Colors } from '@/globals'
import { Context } from '@/context'

const NewBasketPrompt = ({ close, currentItem, postID }) => {
  const { setUserCart, setCurrentPost } = useContext(Context)
  const handleCancel = () => {
    close()
  }

  const handleContinue = async () => {
    const isNewPost = await setCurrentPost(postID)
    if (isNewPost) {
      setUserCart([])
    }
    close()
  }

  return (
    <TouchableOpacity onPress={close}>
      <View
        style={{
          backgroundColor: 'white',
          padding: 16,
          borderRadius: 8,
          justifyContent: 'center',
        }}>
        <AppText textStyle="body2medium" customStyle={{ textAlign: 'center' }}>
          Start a new basket?
        </AppText>
        <AppText textStyle="body2" customStyle={{ textAlign: 'center' }}>
          Adding this item will clear your current basket.
        </AppText>

        <View style={{ flexDirection: 'row', marginTop: 16 }}>
          <TouchableOpacity
            onPress={handleCancel}
            style={{
              flex: 1,
              alignItems: 'center',
              backgroundColor: Colors.neutralGray,

              marginRight: 4,
              paddingVertical: 8,
              borderRadius: 4,
            }}>
            <AppText textStyle="button1">Cancel</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleContinue}
            style={{
              flex: 1,
              alignItems: 'center',
              backgroundColor: Colors.primaryYellow,
              marginLeft: 4,
              paddingVertical: 8,
              borderRadius: 4,
            }}>
            <AppText textStyle="button1">Continue</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default NewBasketPrompt
