import React, { useState, useEffect } from 'react'
import {
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
} from 'react-native'
import { Divider } from 'react-native-paper'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Modal from 'react-native-modal'
import CategoryFormModal from './CategoryFormModal'

import { GlobalStyle, Colors, normalize } from '@/globals'
import {
  AppText,
  BottomSheetHeader,
  AppRadio,
  FloatingAppInput,
} from '@/components'

import { CategoryService } from '@/services'

const AddCategoryModal = ({ categoryName, setCategoryName, close }) => {
  const [newCategoryName, setNewCategoryName] = useState(categoryName)
  const [newCategoryModal, setNewCategoryModal] = useState(false)
  const [catChoices, setCatChoices] = useState([])

  const onFocusHandler = () => {
    setPaddingBottom(320)
  }

  const onEndEditHandler = () => {
    setPaddingBottom(40)
  }

  const [paddingBottom, setPaddingBottom] = useState(40)

  const submitHandler = () => {
    close()
  }

  const [newActiveHeight] = useState(new Animated.Value(0))
  const [newActiveOpacity] = useState(new Animated.Value(0))

  let newActiveStyle = {
    height: newActiveHeight,
    opacity: newActiveOpacity,
    marginBottom: 16,
  }

  useEffect(() => {
    let mounted = true

    if (mounted) getCategories()
    else return (mounted = false)
  }, [])

  const getCategories = async () => {
    let categories = await CategoryService.getCategories().then(res => {
      return res
    })

    const found = categories.some(el => el.category === 'items')
    if (!found) {
      CategoryService.createCategory('items')
      categories = await CategoryService.getCategories().then(res => {
        return res
      })
    }

    let categoryChoices = categories.map(category => {
      if (categoryName === category.category) {
        return {
          ...category,
          selected: true,
        }
      } else if (
        categoryName === 'uncategorized' &&
        category.category === 'items'
      ) {
        return {
          ...category,
          selected: true,
        }
      } else
        return {
          ...category,
          selected: false,
        }
    })
    setCatChoices(categoryChoices)
  }

  const showNewCategory = async () => {
    Animated.sequence([
      Animated.timing(newActiveHeight, {
        toValue: 54,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(newActiveOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start()
  }

  const hideNewCategory = async () => {
    Animated.sequence([
      Animated.timing(newActiveOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(newActiveHeight, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start()
  }

  const radioGroupHandler = selected => {
    setCatChoices(choice => {
      return choice.map(choice => {
        return {
          ...choice,
          selected: selected.id === choice.id ? true : false,
        }
      })
    })

    if (selected.category === 'items') {
      setCategoryName('uncategorized')
    } else setCategoryName(selected.category)

    close()
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: 'white',
        borderTopEndRadius: 8,
        borderTopStartRadius: 8,
        flex: catChoices.length >= 5 ? 1 : 0,
      }}>
      <View style={{ paddingHorizontal: 24 }}>
        {catChoices.length >= 5 ? <></> : <BottomSheetHeader />}
        <AppText
          textStyle="body2"
          customStyle={{ marginVertical: 16, fontWeight: 'bold' }}>
          Your Categories
        </AppText>

        {catChoices.length <= 1 &&
          catChoices.map((choice, index) => {
            if (choice.category === 'items') {
              return (
                <>
                  <AppRadio
                    key={choice.id}
                    label={'Uncategorized'}
                    value={choice.selected}
                    style={{ paddingLeft: 0, marginBottom: 8 }}
                    valueChangeHandler={() => {
                      radioGroupHandler(choice)
                    }}
                  />
                  <AppText
                    textStyle="caption"
                    color={Colors.contentPlaceholder}>
                    If you don't have categories, items will be displayed under
                    "items".
                  </AppText>

                  <Divider
                    style={[GlobalStyle.dividerStyle, { marginVertical: 16 }]}
                  />
                </>
              )
            }

            return <></>
          })}

        {catChoices.map((choice, index) => {
          if (choice.category === 'items') {
            return <></>
          }

          return (
            <AppRadio
              key={choice.id}
              label={choice.category}
              value={choice.selected}
              style={{ paddingLeft: 0, marginBottom: 8 }}
              valueChangeHandler={() => {
                radioGroupHandler(choice)
              }}
            />
          )
        })}

        {catChoices.length > 1 && (
          <Divider style={[GlobalStyle.dividerStyle, { marginVertical: 16 }]} />
        )}

        {catChoices.length > 1 &&
          catChoices.map(choice => {
            if (choice.category === 'items') {
              return (
                <>
                  <AppRadio
                    key={choice.id}
                    label={'Uncategorized'}
                    value={choice.selected}
                    style={{ paddingLeft: 0, marginBottom: 8 }}
                    valueChangeHandler={() => {
                      radioGroupHandler(choice)
                    }}
                  />
                  <AppText
                    textStyle="caption"
                    color={Colors.contentPlaceholder}>
                    If you don't have categories, items will be displayed under
                    "items".
                  </AppText>

                  <Divider
                    style={[GlobalStyle.dividerStyle, { marginVertical: 16 }]}
                  />
                </>
              )
            }

            return <></>
          })}

        <TouchableOpacity
          onPress={() => setNewCategoryModal(true)}
          activeOpacity={0.7}>
          <AppText
            textStyle="body2"
            customStyle={{ fontWeight: 'bold' }}
            color={Colors.contentOcean}>
            or Create a New Category
          </AppText>
          <AppText textStyle="body2">
            e.g. Burgers, Drinks, Desserts, Snacks
          </AppText>
        </TouchableOpacity>

        <Animated.View style={newActiveStyle}>
          <FloatingAppInput
            label="Category"
            value={newCategoryName}
            onInputFocus={onFocusHandler}
            onEndEditing={onEndEditHandler}
            onChangeText={value => setNewCategoryName(value)}
            customStyle={{ marginBottom: normalize(16) }}
          />
        </Animated.View>
        <TouchableOpacity
          onPress={submitHandler}
          activeOpacity={0.7}
          // disabled={buttonEnabled || loadingSubmit}
          style={{
            backgroundColor: Colors.primaryYellow,
            paddingVertical: 12,
            alignItems: 'center',
            height: 48,
            justifyContent: 'center',
          }}>
          <AppText textStyle="button2">Select Category</AppText>
        </TouchableOpacity>

        <Modal
          isVisible={newCategoryModal}
          animationIn="slideInRight"
          animationInTiming={750}
          animationOut="slideOutRight"
          animationOutTiming={750}
          style={{
            margin: 0,
            backgroundColor: 'white',
            justifyContent: 'flex-start',
            height: Dimensions.get('window').height,
          }}>
          <CategoryFormModal
            close={() => {
              setNewCategoryModal(false)
              close()
            }}
          />
        </Modal>
      </View>
    </SafeAreaView>
  )
}

export default AddCategoryModal
