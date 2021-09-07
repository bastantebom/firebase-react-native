import { Icons } from '@/assets/images/icons'
import Button from '@/components/Button'
import Checkbox from '@/components/checkbox'
import RadioButton from '@/components/radio-button'
import TextInput from '@/components/textinput'
import PriceInput from '@/components/textinput/price-input'
import { UserContext } from '@/context/UserContext'
import { Colors, normalize } from '@/globals'
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  StyleSheet,
  Text,
  View,
  Animated,
  LayoutAnimation,
  UIManager,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import Modal from 'react-native-modal'
import MoreOptionsModal from './modals/more-options'
import ImageUpload from './components/image-upload'
import typography from '@/globals/typography'
import pluralize from 'pluralize'
import { capitalize, cloneDeep, initial, isEqual } from 'lodash'
import { CommonActions, useFocusEffect } from '@react-navigation/native'
import { iconSize, isUrl } from '@/globals/Utils'
import ConfirmExitModal from './modals/confirm-exit'
import ImageApi from '@/services/image-api'
import Api from '@/services/Api'
import Loader from '@/components/loader'
import { Context } from '@/context'
import { getStatusBarHeight } from 'react-native-status-bar-height'

const { width } = Dimensions.get('window')

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

/**
 * @typedef {object} CreatePostScreenProps
 * @property {'sell' | 'service' | 'need'} type post type
 * @property {object} data existing data
 */

/**
 * @typedef {object} RootProps
 * @property {CreatePostScreenProps} CreatePostScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'CreatePostScreen'>} param0 */
const CreatePostScreen = ({ navigation, route }) => {
  const { user, userInfo } = useContext(UserContext)
  const {
    setDashboardNeedsRefresh,
    setProfileUserPostsNeedsRefresh,
  } = useContext(Context)
  const [postType, setPostType] = useState(route.params.type || 'sell')
  const existingData = route.params.data

  const [formData, setFormData] = useState({
    title: existingData?.title || '',
    description: existingData?.description || '',
    price: existingData?.items?.[0]?.price || 0,
    displayContact: !!existingData?.display_contact,
    coverPhotos: existingData?.cover_photos || [],
    items: existingData?.is_multiple ? existingData?.items : [],
    notes: existingData?.notes || '',
    isMultiple: !!existingData?.is_multiple,
    budget: existingData?.budget || {
      minimum: 0,
      maximum: 0,
    },
  })
  const formDataRef = useRef()
  const [storeLocation, setStoreLocation] = useState(
    existingData?.location || null
  )
  const [storeSchedule, setStoreSchedule] = useState(
    existingData?.schedule || []
  )
  const [shippingMethods, setShippingMethods] = useState(
    existingData?.shipping_methods
      ? {
          delivery: {
            ownDelivery: !!existingData.shipping_methods.delivery?.own_delivery,
            ownDeliveryNotes:
              existingData.shipping_methods.delivery?.own_delivery?.notes || '',
            courier: !!existingData.shipping_methods.delivery?.courier,
            courierNotes:
              existingData.shipping_methods.delivery?.courier?.notes || '',
          },
          pickup: existingData.shipping_methods.pickup,
        }
      : {}
  )
  const [bookingMethods, setBookingMethods] = useState(
    existingData?.booking_methods || {}
  )
  const [paymentMethods, setPaymentMethods] = useState(
    existingData?.payment_methods || []
  )
  const [moreOptionsVisible, setMoreOptionsVisible] = useState(false)
  const [categories, setCategories] = useState([
    ...new Set(
      (
        existingData?.items?.reduce?.(
          (list, item) => [...list, item.category],
          []
        ) || []
      ).filter(category => category !== 'Others')
    ),
  ])
  const categoriesRef = useRef()
  const [selectedCategory, setSelectedCategory] = useState('Others')
  const selectedCategoryRef = useRef(selectedCategory)
  const [confirmExitModalVisible, setConfirmExitModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const initialData = useRef(cloneDeep(formData)).current

  const renderBasicDetailsSection = () => {
    const handleOnAddMobileNumberPress = () => {
      navigation.navigate('Verification', {
        screen: 'phone-verification',
      })
    }

    const titlePlaceholder = (() => {
      if (postType === 'sell') return 'e.g. Plants for Sale!'
      else if (postType === 'service') return 'e.g. Online Tutor, Maintenance'
      else if (postType === 'need') return 'e.g. 45pcs Party Balloons'
    })()

    const descriptionPlaceholder = (() => {
      if (postType === 'sell')
        return 'Get more customers with detailed product information.'
      else if (postType === 'service')
        return 'Attract more bookings by specifying your qualifications.'
      else if (postType === 'need')
        return 'Get more offers by adding details and specifications.'
    })()

    return (
      <View
        style={[
          styles.section,
          {
            borderTopRightRadius: 0,
            borderTopLeftRadius: 0,
            paddingTop: normalize(16),
          },
        ]}>
        <ImageUpload
          images={formData.coverPhotos}
          multiple={true}
          maximum={10}
          onChange={coverPhotos =>
            setFormData(data => ({ ...data, coverPhotos }))
          }
        />
        <View style={[styles.formGroup, { marginBottom: normalize(24) }]}>
          <TextInput
            value={formData.title}
            label="Post Title"
            onChangeText={title => setFormData(data => ({ ...data, title }))}
            placeholder={titlePlaceholder}
            placeholderTextColor="#A8AAB7"
            maxLength={150}
            displayLength={true}
          />
        </View>
        <View style={styles.formGroup}>
          <TextInput
            value={formData.description}
            label="Description"
            onChangeText={description =>
              setFormData(data => ({ ...data, description }))
            }
            placeholder={descriptionPlaceholder}
            multiline={true}
            numberOfLines={5}
            placeholderTextColor="#A8AAB7"
          />
        </View>
        {userInfo.phone_number ? (
          <View style={[styles.formGroup, { marginBottom: 0 }]}>
            <Checkbox
              onPress={() =>
                setFormData(data => ({
                  ...data,
                  displayContact: !formData.displayContact,
                }))
              }
              containerStyle={{ flexDirection: 'row-reverse' }}
              checked={formData.displayContact}>
              <Text style={[typography.body2, styles.checkboxLabel]}>
                Display my mobile number and allow customers to contact me via
                call or text.
              </Text>
            </Checkbox>
          </View>
        ) : (
          <View style={styles.noNumber}>
            <Text
              style={[
                typography.body2,
                typography.medium,
                styles.noNumberTitle,
              ]}>
              Pzzt. Let your customers contact you easily
            </Text>
            {/* <Text style={typography.caption}>
              Add your mobile number to ensure customer service.
            </Text> */}
            <TouchableOpacity onPress={handleOnAddMobileNumberPress}>
              <Text style={[styles.noNumberAction, typography.medium]}>
                Add and verify mobile number
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    )
  }

  const handleOnOptionPress = option => {
    switch (option) {
      case 'additional-notes':
        showAdditionalNotesScreen()
        break
      case 'store-schedule':
        showStoreScheduleScreen()
        break
    }
    setMoreOptionsVisible(false)
  }

  const showAdditionalNotesScreen = () => {
    navigation.navigate('additional-notes', {
      notes: formData.notes,
      onSubmit: notes => {
        setFormData(data => ({ ...data, notes }))
      },
    })
  }

  const showStoreScheduleScreen = () => {
    navigation.navigate('store-schedule', {
      onSubmit: schedule => {
        setStoreSchedule(schedule)
        navigation.goBack()
      },
      scheduleData: storeSchedule,
      postType,
    })
  }

  const showPaymentMethodsScreen = () => {
    const disabledMethods = []
    if (
      (postType === 'need' && formData.budget.maximum < 100) ||
      (postType !== 'need' && !formData.isMultiple && formData.price < 100)
    )
      disabledMethods.push('gcash', 'grabpay', 'card')
    else if (
      formData.isMultiple &&
      formData.items.some(item => item.price < 100)
    )
      disabledMethods.push('cash', 'paypal')

    navigation.navigate('payment-methods', {
      data: paymentMethods,
      onSubmit: methods => {
        const order = ['cash', 'paypal', 'gcash', 'card', 'grabpay']
        setPaymentMethods(
          methods.sort((a, b) => (order.indexOf(a) < order.indexOf(b) ? -1 : 1))
        )
        navigation.goBack()
      },
      disabledMethods,
    })
  }

  const showShippingMethodsScreen = () => {
    navigation.navigate('shipping-methods', {
      data: shippingMethods,
      onSubmit: methods => {
        setShippingMethods({ ...methods })
        navigation.goBack()
      },
    })
  }

  const showBookingMethodsScreen = () => {
    navigation.navigate('booking-methods', {
      data: bookingMethods,
      onSubmit: methods => {
        setBookingMethods({ ...methods })
        navigation.goBack()
      },
    })
  }

  const getPostData = () => {
    const {
      title,
      description,
      price,
      budget,
      isMultiple,
      items,
      notes,
      displayContact,
      coverPhotos: cover_photos,
    } = formData

    const data = {
      title,
      description,
      cover_photos,
      type: postType,
      payment_methods: paymentMethods,
      notes,
      display_contact: displayContact,
      location: storeLocation,
    }

    if (postType === 'sell') {
      data.is_multiple = isMultiple
      data.shipping_methods = {}

      if (shippingMethods.pickup)
        data.shipping_methods.pickup = shippingMethods.pickup

      if (
        shippingMethods.delivery?.courier ||
        shippingMethods.delivery?.ownDelivery
      )
        data.shipping_methods.delivery = {}

      if (shippingMethods.delivery?.courier) {
        data.shipping_methods.delivery.courier = {
          notes: shippingMethods.delivery.courierNotes,
        }
      }
      if (shippingMethods.delivery?.ownDelivery) {
        data.shipping_methods.delivery.own_delivery = {
          notes: shippingMethods.delivery.ownDeliveryNotes,
        }
      }

      data.schedule = storeSchedule

      data.items = isMultiple
        ? [...items]
        : [
            {
              price,
              name: title,
              description,
            },
          ]
    } else if (postType === 'service') {
      data.is_multiple = isMultiple
      data.booking_methods = bookingMethods
      data.schedule = storeSchedule

      data.items = isMultiple
        ? [...items]
        : [
            {
              price,
              name: title,
              description,
            },
          ]
    } else if (postType === 'need') {
      data.budget = budget
    }

    return data
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    if (!canSubmit()) return

    const data = getPostData()
    try {
      const cover_photos = await Promise.all(
        data.cover_photos.map(async uri => {
          if (!isUrl(uri)) return uri

          const ref = await ImageApi.upload({
            type: 'post',
            uid: user.uid,
            uri,
          })
          return ref.fullPath || ref.path
        })
      )

      const postData = { ...data, cover_photos }
      if (data.type !== 'need') {
        postData.items = await Promise.all(
          data.items.map(async item => {
            if (!isUrl(item.image)) return item

            const ref = await ImageApi.upload({
              type: 'post',
              uid: user.uid,
              uri: item.image,
            })
            item.custom_requests = item.customRequests
            item.image = ref.fullPath || ref.path
            delete item.customRequests

            return item
          })
        )
      }

      const response = existingData
        ? await Api.updatePost({ pid: existingData.id, body: postData })
        : await Api.createPost({ body: postData })

      if (!response.success) throw new Error(response.message)
      setDashboardNeedsRefresh(true)
      setProfileUserPostsNeedsRefresh(true)

      navigation.removeListener('beforeRemove', backPressHandler)
      const state = navigation.dangerouslyGetState()

      if (existingData) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              ...state.routes.slice(0, -2),
              {
                name: 'published-post',
                params: {
                  post: response.data,
                  user: userInfo,
                },
              },
            ],
          })
        )
      } else {
        const createPostRouteIndex = state.routes.findIndex(
          route => route.name === 'create-post'
        )

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              ...state.routes.slice(0, createPostRouteIndex),
              {
                name: 'published-post',
                params: {
                  post: response.data,
                  user: userInfo,
                },
              },
            ],
          })
        )
      }

      // Set value back to false
      setProfileUserPostsNeedsRefresh(false)
    } catch (error) {
      console.log(error.message)
    }
    setIsLoading(false)
  }

  const canSubmit = () => {
    const { title, description, price, budget, isMultiple, items } = formData

    if (postType === 'need') {
      return (
        title.length &&
        paymentMethods.length &&
        description.length &&
        !isNaN(budget.minimum) &&
        !isNaN(budget.maximum) &&
        budget.minimum <= budget.maximum
      )
    } else if (postType === 'service') {
      return (
        title.length &&
        description.length &&
        paymentMethods.length &&
        Object.keys(bookingMethods).length &&
        ((isMultiple && items.length) || (!isMultiple && !isNaN(price)))
      )
    } else if (postType === 'sell') {
      return (
        title.length &&
        description.length &&
        paymentMethods.length &&
        Object.keys(shippingMethods).length &&
        ((isMultiple && items.length) || (!isMultiple && !isNaN(price)))
      )
    }
  }

  const handleOnEditItemPress = useCallback(
    item => {
      navigation.navigate('add-item', {
        item,
        postType,
        categories: categoriesRef.current.map(category => ({
          name: category,
          count:
            formDataRef.current.items.filter(item => item.category === category)
              ?.length || 0,
        })),
        selectedCategory: item.category,
        onCategorySelect: category => {
          setSelectedCategory(category)
        },
        onCategoriesChange: categories => {
          setCategories([...categories])
        },
        onSubmit: newItem => {
          const items = [...formDataRef.current.items]
          const index = items.indexOf(item)
          items[index] = newItem
          setFormData(data => ({ ...data, items }))

          const state = navigation.dangerouslyGetState()
          const categoryItemsRoute = state.routes.slice(0, -1).pop()

          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                ...state.routes.slice(0, -2),
                {
                  ...categoryItemsRoute,
                  params: {
                    ...categoryItemsRoute.params,
                    items: items.filter(
                      _item => _item.category === item.category
                    ),
                  },
                },
              ],
            })
          )
        },
      })
    },
    [formData]
  )

  const handleOnPreviewPress = () => {
    const post = getPostData()

    navigation.removeListener('beforeRemove', backPressHandler)

    navigation.push('published-post', {
      preview: true,
      post,
      user: userInfo,
      onPublishPress: () => {
        navigation.goBack()
        handleSubmit()
      },
    })
  }

  const renderLocationSection = () => {
    const address =
      storeLocation ||
      (userInfo.addresses || []).find(address => address.default)

    const handleSelectLocationPress = () => {
      navigation.navigate('post-location', {
        addresses: userInfo.addresses || [],
        onPress: setStoreLocation,
      })
    }

    return (
      <View style={[styles.section, { paddingTop: normalize(8) }]}>
        <TouchableOpacity
          style={{ paddingTop: normalize(16) }}
          activeOpacity={0.7}
          onPress={handleSelectLocationPress}>
          <View style={styleUtils.row}>
            <Text
              style={[
                [typography.body1, typography.medium, styles.sectionTitle],
                { marginBottom: normalize(4) },
              ]}>
              Location
            </Text>
            <Icons.ChevronRight style={{ color: Colors.icon }} />
          </View>
          <View style={{ marginTop: normalize(12) }}>
            <Text
              style={[typography.body2, typography.medium, styles.addressName]}>
              {address.name || 'Home'} {address.default && '(Default)'}
            </Text>
            <Text style={[typography.body2, styles.fullAddress]}>
              {address.full_address}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  const renderStoreScheduleSection = () => {
    if (postType === 'need') return null

    return storeSchedule?.length ? (
      <View style={[styles.section, { paddingVertical: 0 }]}>
        <TouchableOpacity
          style={{ paddingVertical: normalize(24) }}
          activeOpacity={0.7}
          onPress={showStoreScheduleScreen}>
          <View style={[styleUtils.row, styleUtils.alignCenter]}>
            <Text
              style={[
                typography.body1,
                typography.medium,
                styles.sectionTitle,
              ]}>
              Store Schedule
              <Text style={{ color: Colors.secondaryBrinkPink }}> *</Text>
            </Text>
            <Icons.ChevronRight style={{ color: Colors.icon }} />
          </View>
          <View style={styles.storeSchedule}>
            <Text
              style={[
                typography.body2,
                typography.medium,
                styles.scheduleTypeLabel,
              ]}>
              Regular Schedule
            </Text>
            {storeSchedule.map((schedule, index) => {
              return (
                <View key={index} style={styles.scheduleDataItem}>
                  <Text style={[typography.body2, styles.scheduleDay]}>
                    {capitalize(schedule.day)}
                  </Text>
                  <Text style={[typography.body2, styles.scheduleTime]}>
                    {schedule.is24Hour
                      ? '24 hours'
                      : `${schedule.opens} - ${schedule.closes}`}
                  </Text>
                </View>
              )
            })}
          </View>
        </TouchableOpacity>
      </View>
    ) : null
  }

  const handleOnRemoveCategoryPress = useCallback(
    category => {
      const newCategories = [...categoriesRef.current]
      newCategories.splice(
        newCategories.splice(newCategories.indexOf(category), 1)
      )
      setCategories(newCategories)

      const newItems = [...formDataRef.current.items].map(item => {
        if (item.category === category) item.category = 'Others'
        return item
      })
      setFormData(data => ({ ...data, items: newItems }))
      setSelectedCategory('Others')

      navigation.goBack()
    },
    [categories, formData.items]
  )

  const handleOnEditCategoryPress = useCallback(
    category => {
      navigation.navigate('create-category', {
        onSubmit: (category, newName) => {
          const newCategories = [...categoriesRef.current]
          if (category === 'Others') newCategories.push(newName)
          else newCategories[newCategories.indexOf(category)] = newName

          setCategories(newCategories)
          const newItems = [...formDataRef.current.items].map(item => {
            if (item.category === category) item.category = newName
            return item
          })
          setFormData(data => ({ ...data, items: newItems }))
          setSelectedCategory(newName)

          const state = navigation.dangerouslyGetState()
          const categoryItemsRoute = state.routes.slice(0, -1).pop()
          categoryItemsRoute.params = {
            ...categoryItemsRoute.params,
            items: newItems.filter(item => item.category === newName),
            category: newName,
          }
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [...state.routes.slice(0, -2), categoryItemsRoute],
            })
          )
        },
        category,
        categories: categoriesRef.current.map(name => ({ name })),
      })
    },
    [categories, formData.items]
  )

  const renderItemTypeSection = () => {
    if (postType === 'need') return null
    const configureAnimation = () => {
      LayoutAnimation.configureNext({
        duration: 120,
        create: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.opacity,
        },
        update: { type: LayoutAnimation.Types.easeInEaseOut },
      })
    }

    const showAddItemScreen = () => {
      navigation.navigate('add-item', {
        postType,
        categories: categoriesRef.current.map(category => ({
          name: category,
          count:
            formData.items.filter(item => item.category === category)?.length ||
            0,
        })),
        selectedCategory: selectedCategoryRef.current,
        onCategorySelect: category => {
          setSelectedCategory(category)
        },
        onCategoriesChange: categories => {
          setCategories([...categories])
        },
        onSubmit: item => {
          const items = [...formDataRef.current.items, item]
          setFormData(data => ({ ...data, items }))
          setSelectedCategory(item.category)

          const state = navigation.dangerouslyGetState()
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                ...state.routes.slice(0, -1),
                {
                  name: 'category-items',
                  params: {
                    items: items.filter(
                      _item => _item.category === item.category
                    ),
                    category: item.category,
                    onEditItemPress: handleOnEditItemPress,
                    onEditCategoryPress: handleOnEditCategoryPress,
                    onRemoveCategoryPress: handleOnRemoveCategoryPress,
                    postType,
                    onAddItemPress: () => {
                      navigation.goBack()
                      showAddItemScreen()
                    },
                  },
                },
              ],
            })
          )
        },
      })
    }

    const handleOnCategoryItemPress = item => {
      const items = formData.items.filter(
        _item => _item.category === item.category
      )

      navigation.navigate('category-items', {
        items,
        category: item.category,
        onEditItemPress: handleOnEditItemPress,
        onEditCategoryPress: handleOnEditCategoryPress,
        onRemoveCategoryPress: handleOnRemoveCategoryPress,
        postType,
        onAddItemPress: () => {
          navigation.goBack()
          showAddItemScreen()
        },
      })
    }

    const categorizedItems = formData.items.reduce((list, item) => {
      let category = list.find(listItem => listItem.category === item.category)
      if (!category)
        category = list.push({
          category: item.category,
          items: [item],
        })
      else category.items.push(item)

      return list
    }, [])

    const setIsMultiple = isMultiple => {
      setFormData(data => ({
        ...data,
        isMultiple,
      }))

      if (!isMultiple && formData.price < 100) {
        setPaymentMethods(
          paymentMethods.filter(
            method => !['gcash', 'card', 'grabpay'].includes(method)
          )
        )
      }
    }

    const setPrice = price => {
      setFormData(data => ({ ...data, price }))
      if (price < 100) {
        setPaymentMethods(
          paymentMethods.filter(
            method => !['gcash', 'card', 'grabpay'].includes(method)
          )
        )
      }
    }

    return (
      <View style={[styles.section, { paddingTop: normalize(8) }]}>
        <View style={[styles.postItemTypeWrapper]}>
          <RadioButton
            containerStyle={styles.postItemType}
            value={!formData.isMultiple}
            onPress={() => {
              configureAnimation()
              setIsMultiple(false)
            }}>
            <Text
              style={[
                typography.body1narrow,
                typography.medium,
                styles.itemTypeLabel,
              ]}>
              {postType === 'sell' && 'List as Single Item'}
              {postType === 'service' && 'List as Single Service'}
            </Text>
          </RadioButton>
          {!formData.isMultiple && (
            <PriceInput
              value={formData.price}
              onChangeText={setPrice}
              placeholder="0.00"
            />
          )}
        </View>
        <View style={[styles.postItemTypeWrapper, { borderBottomWidth: 0 }]}>
          <RadioButton
            containerStyle={[
              styles.postItemType,
              { paddingBottom: normalize(8) },
            ]}
            value={formData.isMultiple}
            onPress={() => {
              configureAnimation()
              setIsMultiple(true)
            }}>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  typography.body1narrow,
                  typography.medium,
                  styles.itemTypeLabel,
                ]}>
                {postType === 'sell' && 'List as Multiple Items'}
                {postType === 'service' && 'List as Multiple Service'}
              </Text>
              <Text style={[typography.body2, styles.itemTypeDescription]}>
                You can add more products and categories.
              </Text>
            </View>
          </RadioButton>
          {formData.isMultiple && (
            <View>
              {!!categorizedItems?.length && (
                <View style={styles.categoryItems}>
                  {categorizedItems.map((categorizedItem, index) => {
                    return (
                      <TouchableOpacity
                        key={categorizedItem.category}
                        activeOpacity={0.7}
                        style={[
                          styles.categoryItem,
                          index === categorizedItems.length - 1
                            ? { marginBottom: 0 }
                            : {},
                        ]}
                        onPress={() =>
                          handleOnCategoryItemPress(categorizedItem)
                        }>
                        <View style={styles.categoryItemLabel}>
                          <Text style={[typography.body2, typography.medium]}>
                            {categorizedItem.category}
                          </Text>
                          <Text style={[typography.caption]}>
                            {pluralize(
                              'item',
                              categorizedItem.items.length,
                              true
                            )}
                          </Text>
                        </View>
                        <Icons.ChevronRight style={{ color: Colors.icon }} />
                      </TouchableOpacity>
                    )
                  })}
                </View>
              )}
              <TouchableOpacity
                style={[
                  styles.linkWrapper,
                  { marginTop: normalize(categorizedItems?.length ? 8 : 0) },
                ]}
                activeOpacity={0.7}
                onPress={showAddItemScreen}>
                <Icons.CircleAdd style={styles.linkIcon} />
                <Text
                  style={[
                    typography.body2,
                    typography.link,
                    typography.medium,
                  ]}>
                  Add {postType === 'service' ? 'a Service' : 'an Item'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    )
  }

  const renderBudgetSection = () => {
    if (postType !== 'need') return null

    return (
      <View style={styles.section}>
        <Text
          style={[typography.body1, typography.medium, styles.sectionTitle]}>
          What is your budget?
        </Text>
        <Text
          style={[
            typography.body2,
            { color: Colors.contentPlaceholder, marginTop: normalize(4) },
          ]}>
          Get offers within your price range.
        </Text>
        <View style={[styles.formGroup, { marginTop: normalize(16) }]}>
          <PriceInput
            value={formData.budget.minimum}
            priceLabel="Minimum"
            onChangeText={minimum =>
              setFormData(data => ({
                ...data,
                budget: { ...formData.budget, minimum },
              }))
            }
            placeholder="0.00"
          />
        </View>
        <View style={[styles.formGroup, { marginBottom: normalize(0) }]}>
          <PriceInput
            value={formData.budget.maximum}
            priceLabel="Maximum"
            onChangeText={maximum => {
              if (maximum < 100) {
                setPaymentMethods(
                  paymentMethods.filter(
                    method => !['gcash', 'card', 'grabpay'].includes(method)
                  )
                )
              }
              setFormData(data => ({
                ...data,
                budget: { ...formData.budget, maximum },
              }))
            }}
            placeholder="0.00"
          />
        </View>
      </View>
    )
  }

  const renderPaymentMethodsSection = () => {
    const methodLabels = {
      cash: 'Cash',
      card: 'Credit/Debit',
      gcash: 'GCash',
      grabpay: 'GrabPay',
      paypal: 'PayPal',
    }

    return (
      <View style={[styles.section, { paddingVertical: 0 }]}>
        <TouchableOpacity
          style={{ paddingVertical: normalize(24) }}
          activeOpacity={0.7}
          onPress={showPaymentMethodsScreen}>
          <View style={[styleUtils.row, styleUtils.alignCenter]}>
            <Text
              style={[
                typography.body1,
                typography.medium,
                styles.sectionTitle,
              ]}>
              Payment Methods
              <Text style={{ color: Colors.secondaryBrinkPink }}> *</Text>
            </Text>
            <Icons.ChevronRight style={{ color: Colors.icon }} />
          </View>
          {!!paymentMethods.length && (
            <Text
              style={[
                typography.body2,
                { color: Colors.contentPlaceholder, marginTop: normalize(8) },
              ]}>
              {paymentMethods.map(method => methodLabels[method]).join(', ')}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    )
  }

  const renderBookingMethodsSection = () => {
    if (postType !== 'service') return null

    return (
      <View style={[styles.section, { paddingVertical: normalize(8) }]}>
        <TouchableOpacity
          style={{ paddingVertical: normalize(16) }}
          activeOpacity={0.7}
          onPress={showBookingMethodsScreen}>
          <View style={[styleUtils.row, styleUtils.alignCenter]}>
            <Text
              style={[
                typography.body1,
                typography.medium,
                styles.sectionTitle,
              ]}>
              Booking Methods
              <Text style={{ color: Colors.secondaryBrinkPink }}> *</Text>
            </Text>
            <Icons.ChevronRight style={{ color: Colors.icon }} />
          </View>
        </TouchableOpacity>
        <View
          style={{
            marginBottom: normalize(
              !!bookingMethods.appointment || !!bookingMethods.walkin ? 16 : 0
            ),
          }}>
          {!!bookingMethods.appointment && (
            <View>
              <Text
                style={[
                  typography.body2,
                  typography.medium,
                  styles.shippingMethodLabel,
                  { marginTop: 0 },
                ]}>
                By Appointment
              </Text>
              {!!bookingMethods.appointment?.notes?.length && (
                <View style={styles.shippingMethodNotes}>
                  <Icons.Page
                    style={styles.shippingMethodNoteIcon}
                    {...iconSize(16)}
                  />
                  <Text style={typography.caption}>
                    {bookingMethods.appointment.notes}
                  </Text>
                </View>
              )}
            </View>
          )}
          {!!bookingMethods.walkin && (
            <View>
              <Text
                style={[
                  typography.body2,
                  typography.medium,
                  styles.shippingMethodLabel,
                ]}>
                Walk-ins
              </Text>
              {!!bookingMethods.walkin?.notes?.length && (
                <View style={styles.shippingMethodNotes}>
                  <Icons.Page
                    style={styles.shippingMethodNoteIcon}
                    {...iconSize(16)}
                  />
                  <Text style={typography.caption}>
                    {bookingMethods.walkin.notes}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    )
  }

  const renderShippingMethodsSection = () => {
    if (postType !== 'sell') return null

    return (
      <View style={[styles.section, { paddingVertical: normalize(8) }]}>
        <TouchableOpacity
          style={{ paddingVertical: normalize(16) }}
          activeOpacity={0.7}
          onPress={showShippingMethodsScreen}>
          <View style={[styleUtils.row, styleUtils.alignCenter]}>
            <Text
              style={[
                typography.body1,
                typography.medium,
                styles.sectionTitle,
              ]}>
              Shipping Methods
              <Text style={{ color: Colors.secondaryBrinkPink }}> *</Text>
            </Text>
            <Icons.ChevronRight style={{ color: Colors.icon }} />
          </View>
        </TouchableOpacity>
        <View
          style={{
            marginBottom: normalize(
              !!shippingMethods.pickup || !!shippingMethods.delivery ? 16 : 0
            ),
          }}>
          {!!shippingMethods.pickup && (
            <View>
              <Text
                style={[
                  typography.body2,
                  typography.medium,
                  styles.shippingMethodLabel,
                  { marginTop: 0 },
                ]}>
                Pick-up
              </Text>
              {!!shippingMethods.pickup?.notes?.length && (
                <View style={styles.shippingMethodNotes}>
                  <Icons.Page
                    style={styles.shippingMethodNoteIcon}
                    {...iconSize(16)}
                  />
                  <Text style={typography.caption}>
                    {shippingMethods.pickup.notes}
                  </Text>
                </View>
              )}
            </View>
          )}
          {!!shippingMethods.delivery?.courier && (
            <View>
              <Text
                style={[
                  typography.body2,
                  typography.medium,
                  styles.shippingMethodLabel,
                ]}>
                Delivery - Ship products via local courier or third party
                couriers
              </Text>
              {!!shippingMethods.delivery?.courierNotes?.length && (
                <View style={styles.shippingMethodNotes}>
                  <Icons.Page
                    style={styles.shippingMethodNoteIcon}
                    {...iconSize(16)}
                  />
                  <Text style={typography.caption}>
                    {shippingMethods.delivery.courierNotes}
                  </Text>
                </View>
              )}
            </View>
          )}

          {!!shippingMethods.delivery?.ownDelivery && (
            <View>
              <Text
                style={[
                  typography.body2,
                  typography.medium,
                  styles.shippingMethodLabel,
                ]}>
                Delivery - Deliver products in person via your own vehicle or
                your delivery employees
              </Text>
              {!!shippingMethods.delivery?.ownDeliveryNotes?.length && (
                <View style={styles.shippingMethodNotes}>
                  <Icons.Page
                    style={styles.shippingMethodNoteIcon}
                    {...iconSize(16)}
                  />
                  <Text style={typography.caption}>
                    {shippingMethods.delivery.ownDeliveryNotes}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    )
  }

  const renderBottomSection = () => {
    return (
      <View
        style={[
          styles.section,
          styles.bottomSection,
          formData.notes?.length
            ? { paddingTop: 0 }
            : { paddingTop: normalize(12) },
        ]}>
        {formData.notes?.length ? (
          <TouchableOpacity
            style={{
              padding: normalize(8),
              paddingTop: normalize(24),
            }}
            activeOpacity={0.7}
            onPress={showAdditionalNotesScreen}>
            <View style={[styleUtils.row, styleUtils.alignCenter]}>
              <Text
                style={[
                  typography.body1,
                  typography.medium,
                  styles.sectionTitle,
                ]}>
                Additional Notes
              </Text>
              <Icons.ChevronRight style={{ color: Colors.icon }} />
            </View>
            <Text style={[typography.body2, { marginTop: normalize(4) }]}>
              {formData.notes}
            </Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          style={[styles.linkWrapper, { paddingHorizontal: normalize(8) }]}
          activeOpacity={0.7}
          onPress={() => setMoreOptionsVisible(true)}>
          <Icons.More style={styles.linkIcon} />
          <Text style={[typography.body2, typography.link, typography.medium]}>
            More Options
          </Text>
        </TouchableOpacity>
        <View style={[styleUtils.row, styles.buttonsWrapper]}>
          <Button
            style={[styles.button, { marginRight: normalize(16) }]}
            label="Preview"
            onPress={handleOnPreviewPress}
            disabled={!canSubmit()}
            disabledStyle={{ backgroundColor: 'transparent', opacity: 0.5 }}
          />
          <Button
            style={styles.button}
            disabled={!canSubmit()}
            label={existingData ? 'Save' : 'Publish'}
            type={!canSubmit() ? 'disabled' : 'primary'}
            onPress={handleSubmit}
          />
        </View>
      </View>
    )
  }

  const renderMoreOptionsModal = () => {
    const moreOptionsMenuItems = [
      {
        key: 'store-schedule',
        renderIcon: () => (
          <Icons.Calendar style={styles.menuItemIcon} {...iconSize(24)} />
        ),
        label: 'Add Store Schedule',
      },
      {
        key: 'additional-notes',
        renderIcon: () => (
          <Icons.Page style={styles.menuItemIcon} {...iconSize(24)} />
        ),
        label: `${
          formData.notes?.length ? 'Edit' : 'Add'
        } Notes for your Customer`,
      },
    ]

    if (postType === 'need') moreOptionsMenuItems.splice(0, 1)

    return (
      <Modal
        isVisible={moreOptionsVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={200}
        animationOutTiming={180}
        style={styles.drawer}
        swipeDirection="down"
        onSwipeComplete={() => setMoreOptionsVisible(false)}
        statusBarTranslucent={true}
        customBackdrop={
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => setMoreOptionsVisible(false)}>
            <View style={{ flex: 1, backgroundColor: '#000a' }} />
          </TouchableWithoutFeedback>
        }>
        <MoreOptionsModal
          onPress={handleOnOptionPress}
          menuItems={moreOptionsMenuItems}
        />
      </Modal>
    )
  }

  const renderConfimExitModal = () => {
    const handleOnConfirmExit = () => {
      setConfirmExitModalVisible(false)
      navigation.removeListener('beforeRemove', backPressHandler)
      navigation.goBack()
    }

    return (
      <Modal
        isVisible={confirmExitModalVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={200}
        animationOutTiming={180}
        style={styles.modal}
        swipeDirection="down"
        onSwipeComplete={() => setConfirmExitModalVisible(false)}
        statusBarTranslucent={true}
        customBackdrop={
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => setConfirmExitModalVisible(false)}>
            <View style={{ flex: 1, backgroundColor: '#000a' }} />
          </TouchableWithoutFeedback>
        }>
        <ConfirmExitModal
          close={() => setConfirmExitModalVisible(false)}
          editing={!!existingData}
          onConfirm={handleOnConfirmExit}
        />
      </Modal>
    )
  }

  useEffect(() => {
    categoriesRef.current = categories
  }, [categories])

  useEffect(() => {
    formDataRef.current = formData
  }, [formData])

  useEffect(() => {
    if (formData.isMultiple && formData.items.some(item => item.price < 100))
      setPaymentMethods([...new Set([...paymentMethods, 'cash', 'paypal'])])
  }, [formData.items, formData.isMultiple])

  useEffect(() => {
    selectedCategoryRef.current = selectedCategory
  }, [selectedCategory])

  useEffect(() => {
    setStoreLocation(userInfo.addresses.find(address => address.default))
  }, [])

  const backPressHandler = event => {
    if (navigation.isFocused()) {
      event.preventDefault()
      if (isEqual(formData, initialData)) {
        navigation.removeListener('beforeRemove', backPressHandler)
        navigation.goBack()
        return
      }
      setConfirmExitModalVisible(true)
    }
  }

  useFocusEffect(
    useCallback(() => {
      navigation.removeListener('beforeRemove', backPressHandler)
      navigation.addListener('beforeRemove', backPressHandler)

      return () => navigation.removeListener('beforeRemove', backPressHandler)
    }, [navigation, formData])
  )

  return (
    <>
      <Loader visible={isLoading} />
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor={Colors.neutralsZirconLight}
      />
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={navigation.goBack}>
            <Icons.Close style={styles.backArrowIcon} {...iconSize(24)} />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>
              {!existingData ? 'Create' : 'Edit'} Post
            </Text>
          </View>
        </View>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.select({ ios: 'padding', android: null })}>
          <ScrollView>
            <PostTypeCards onCardPress={setPostType} postType={postType} />
            {renderBasicDetailsSection()}
            {renderLocationSection()}
            {renderStoreScheduleSection()}
            {renderItemTypeSection()}
            {renderBudgetSection()}
            {renderPaymentMethodsSection()}
            {renderShippingMethodsSection()}
            {renderBookingMethodsSection()}
            {renderBottomSection()}
          </ScrollView>
        </KeyboardAvoidingView>
        {renderMoreOptionsModal()}
        {renderConfimExitModal()}
      </View>
    </>
  )
}

const PostTypeCards = ({ onCardPress, postType }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const cardPositions = [
    normalize(8),
    (width / 3) * 2 + normalize(4.5),
    width / 3 + normalize(6),
    width - ((width - normalize(36)) * 0.65) / 3,
    width - ((width - normalize(36)) * 0.65) / 3 + normalize(36),
  ]

  const needCardPosition = useRef(new Animated.Value(cardPositions[0])).current
  const sellCardPosition = useRef(new Animated.Value(cardPositions[1])).current
  const serviceCardPosition = useRef(new Animated.Value(cardPositions[2]))
    .current

  const cardsData = [
    {
      type: 'need',
      title: 'Find What You Need',
      description: 'Order items & hire services nearby',
      renderIcon: () => <Icons.PostNeed {...iconSize(isExpanded ? 24 : 16)} />,
      position: needCardPosition,
      color: Colors.secondaryMountainMeadow,
    },
    {
      type: 'sell',
      title: 'Sell Your Products',
      description: 'Market new or pre-loved goods',
      renderIcon: () => <Icons.PostSell {...iconSize(isExpanded ? 24 : 16)} />,
      position: sellCardPosition,
      color: Colors.secondaryRoyalBlue,
    },
    {
      type: 'service',
      title: 'Offer Your Services',
      description: 'Earn more with your skills',
      renderIcon: () => (
        <Icons.PostService {...iconSize(isExpanded ? 24 : 16)} />
      ),
      position: serviceCardPosition,
      color: Colors.secondaryBrinkPink,
    },
  ]

  const handlePostTypeSelect = type => {
    setIsExpanded(!isExpanded)
    onCardPress(type)

    LayoutAnimation.configureNext({
      duration: 180,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: { type: LayoutAnimation.Types.easeInEaseOut },
    })
    const animations = []

    if (isExpanded) {
      animations.push(
        Animated.timing(serviceCardPosition, {
          toValue: cardPositions[2],
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(needCardPosition, {
          toValue: cardPositions[0],
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(sellCardPosition, {
          toValue: cardPositions[1],
          duration: 180,
          useNativeDriver: true,
        })
      )
    } else {
      if (type === 'service') {
        animations.push(
          Animated.timing(serviceCardPosition, {
            toValue: cardPositions[0],
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.timing(sellCardPosition, {
            toValue: cardPositions[4],
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.timing(needCardPosition, {
            toValue: cardPositions[3],
            duration: 180,
            useNativeDriver: true,
          })
        )
      } else if (type === 'need') {
        animations.push(
          Animated.timing(needCardPosition, {
            toValue: cardPositions[0],
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.timing(serviceCardPosition, {
            toValue: cardPositions[4],
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.timing(sellCardPosition, {
            toValue: cardPositions[3],
            duration: 180,
            useNativeDriver: true,
          })
        )
      } else if (type === 'sell') {
        animations.push(
          Animated.timing(sellCardPosition, {
            toValue: cardPositions[0],
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.timing(serviceCardPosition, {
            toValue: cardPositions[4],
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.timing(needCardPosition, {
            toValue: cardPositions[3],
            duration: 180,
            useNativeDriver: true,
          })
        )
      }
    }

    Animated.parallel(animations).start()
  }

  const ActiveCardIndicator = ({ type, color }) => {
    return (
      postType === type &&
      !isExpanded && (
        <Svg
          style={{
            zIndex: 2,
            position: 'absolute',
            bottom: normalize(-12),
          }}
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none">
          <Circle cx="4" cy="4" r="4" fill={color} />
        </Svg>
      )
    )
  }

  useEffect(() => {
    handlePostTypeSelect(postType)
  }, [])

  return (
    <View style={styles.postTypeCards}>
      {cardsData.map(card => {
        return (
          <TouchableOpacity
            key={card.type}
            activeOpacity={0.85}
            style={[
              styles.postTypeCard,
              isExpanded && postType === card.type
                ? styles.expandedPostTypeCard
                : {},
              isExpanded && postType !== card.type
                ? styles.collapsedPostTypeCard
                : {},
              {
                paddingVertical: normalize(isExpanded ? 12 : 9),
                transform: [{ translateX: card.position }],
                backgroundColor: card.color,
              },
            ]}
            onPress={() => handlePostTypeSelect(card.type)}>
            <View
              style={[
                styles.postTypeCardContent,
                isExpanded && postType === card.type
                  ? styles.expandedPostTypeCardContent
                  : {},
                isExpanded && postType !== card.type
                  ? styles.collapsedPostTypeCardContent
                  : {},
              ]}>
              {!(isExpanded && postType !== card.type) && (
                <View style={styles.postTypeCardInfo}>
                  <View
                    style={{
                      flex: !isExpanded ? 1 : 0,
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={[
                        typography.subtitle2,
                        typography.medium,
                        styles.postTypeCardTitle,
                      ]}>
                      {card.title}
                    </Text>
                  </View>
                  {isExpanded && postType === card.type && (
                    <Text
                      style={[
                        typography.caption,
                        styles.postTypeCardDescription,
                      ]}>
                      {card.description}
                    </Text>
                  )}
                </View>
              )}
              {card.renderIcon()}
            </View>
            <ActiveCardIndicator type={card.type} color={card.color} />
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.neutralsZirconLight,
    marginTop: getStatusBarHeight(),
  },
  header: {
    flexDirection: 'row',
  },
  backButton: {
    padding: normalize(16),
    zIndex: 2,
  },
  backArrowIcon: {
    color: Colors.primaryMidnightBlue,
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
    paddingVertical: normalize(16),
  },
  title: {
    ...typography.body2,
    ...typography.medium,
  },
  postTypeCards: {
    height: normalize(96),
  },
  postTypeCard: {
    position: 'absolute',
    left: 0,
    width: (width - normalize(36)) / 3,
    height: normalize(Platform.select({ ios: 75, android: 70 })),
    borderRadius: normalize(8),
    paddingHorizontal: normalize(16),
    alignItems: 'center',
  },
  postTypeCardContent: {
    flexDirection: 'column-reverse',
    height: '100%',
    width: '100%',
  },
  expandedPostTypeCard: {
    width: '75%',
  },
  collapsedPostTypeCard: {
    width: '25%',
    paddingLeft: normalize(8),
    alignItems: 'flex-start',
  },
  expandedPostTypeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  collapsedPostTypeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postTypeCardInfo: {
    flex: 1,
  },
  postTypeCardTitle: {
    color: '#fff',
    flexWrap: 'wrap',
  },
  postTypeCardDescription: {
    color: '#fff',
  },
  section: {
    padding: normalize(24),
    backgroundColor: '#fff',
    borderRadius: normalize(10),
    marginBottom: normalize(8),
  },
  formGroup: {
    marginBottom: normalize(16),
  },
  checkboxLabel: {
    flex: 1,
    marginRight: normalize(4),
  },
  sectionTitle: {
    flex: 1,
  },
  addressName: {
    flex: 1,
    marginRight: normalize(4),
  },
  fullAddress: {
    flex: 1,
    marginRight: normalize(4),
    marginTop: normalize(4),
    color: Colors.contentPlaceholder,
  },
  linkWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(8),
  },
  itemTypeLabel: {
    flex: 1,
  },
  itemTypeDescription: {
    flex: 1,
    color: Colors.contentPlaceholder,
    marginTop: normalize(4),
  },
  postItemType: {
    paddingVertical: normalize(16),
  },
  postItemTypeWrapper: {
    borderBottomColor: Colors.secondarySolitude,
    borderBottomWidth: normalize(1),
  },
  bottomSection: {
    borderBottomEndRadius: 0,
    borderBottomStartRadius: 0,
    marginBottom: 0,
    paddingHorizontal: normalize(16),
    paddingBottom: normalize(16),
  },
  linkIcon: {
    marginRight: normalize(8),
    color: Colors.link,
  },
  buttonsWrapper: {
    marginTop: normalize(24),
  },
  noNumber: {
    borderRadius: normalize(8),
    backgroundColor: Colors.secondarySolitude,
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(16),
    paddingBottom: normalize(4),
  },
  noNumberTitle: {
    color: Colors.primaryMidnightBlue,
    fontSize: 14,
  },
  noNumberAction: {
    paddingVertical: normalize(6),
    fontSize: normalize(14),
    lineHeight: normalize(21),
    letterSpacing: normalize(0.25),
    color: Colors.link,
  },
  button: {
    flex: 1,
  },
  drawer: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  categoryItems: {
    marginTop: normalize(8),
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(16),
    borderRadius: normalize(4),
    borderColor: Colors.neutralGray,
    borderWidth: normalize(1),
    marginBottom: normalize(16),
  },
  categoryItemLabel: {
    flex: 1,
  },
  menuItemIcon: {
    marginRight: normalize(8),
    color: Colors.icon,
  },
  scheduleDataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(8),
  },
  scheduleDay: {
    flex: 1,
    color: Colors.contentPlaceholder,
  },
  scheduleTime: {
    flex: 1,
    textAlign: 'right',
    color: Colors.contentPlaceholder,
  },
  scheduleTypeLabel: {
    marginVertical: normalize(8),
  },
  shippingMethodNotes: {
    flexDirection: 'row',
    padding: normalize(16),
    backgroundColor: Colors.secondarySolitude,
    borderRadius: normalize(4),
  },
  shippingMethodLabel: {
    marginBottom: normalize(4),
    marginTop: normalize(16),
  },
  shippingMethodNoteIcon: {
    color: Colors.link,
    marginRight: normalize(8),
  },
})

const styleUtils = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  alignCenter: {
    alignItems: 'center',
  },
})

export default CreatePostScreen
