import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack'
import React from 'react'
import AddItemScreen from './add-item-screen'
import AdditionalNotesScreen from './additional-notes-screen'
import CategoriesScreen from './categories-screen'
import CoverPhotoGuidelinesScreen from './cover-photo-guidelines-screen'
import CreateCategoryScreen from './create-category-screen'
import CreatePostScreen from './create-post-screen'
import PaymentFeesScreen from './payment-fees-screen'
import PaymentMethodsScreen from './payment-methods-screen'
import CategoryItemsScreen from './category-items-screen'
import PostLocationScreen from './post-location-screen'
import ShippingMethodsScreen from './shipping-methods-screen'
import StoreScheduleScreen from './store-schedule-screen'
import BookingMethodsScreen from './booking-methods-screen'
import PublishedPostScreen from './published-post-screen'
import CoverPhotoCameraScreen from './cover-photo-camera-screen'
import ImagePickerScreen from './image-picker-screen'
import AvailPostScreen from './avail-post'
import SelectPostScreen from './select-post'
import WebviewScreen from './webview-screen'
import ReportPostScreen from './report-post-screen'
import GuestPostScreen from './guest-post-screen'
import HiddenPostsScreen from './hidden-posts-screen'
import ArchivedPostsScreen from './archived-posts-screen'
import MapDirectionScreen from './map-direction-screen'

const PostStack = () => {
  const Stack = createStackNavigator()
  const defaultScreenOptions = {
    cardStyle: {
      backgroundColor: '#fff',
    },
  }

  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Screen
        name="create-post"
        component={CreatePostScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="cover-photo-guidelines"
        component={CoverPhotoGuidelinesScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="post-location"
        component={PostLocationScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="category-items"
        component={CategoryItemsScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="add-item"
        component={AddItemScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="create-category"
        component={CreateCategoryScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="categories"
        component={CategoriesScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="additional-notes"
        component={AdditionalNotesScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="store-schedule"
        component={StoreScheduleScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="payment-methods"
        component={PaymentMethodsScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="payment-fees"
        component={PaymentFeesScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="shipping-methods"
        component={ShippingMethodsScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="booking-methods"
        component={BookingMethodsScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="published-post"
        component={PublishedPostScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="cover-photo-camera"
        component={CoverPhotoCameraScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="image-picker"
        component={ImagePickerScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="select-post"
        component={SelectPostScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="avail-post"
        component={AvailPostScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="webview"
        component={WebviewScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="report-post"
        component={ReportPostScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="guest-post"
        component={GuestPostScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="hidden-posts"
        component={HiddenPostsScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="archived-posts"
        component={ArchivedPostsScreen}
        options={defaultScreenOptions}
      />
      <Stack.Screen
        name="map-direction"
        component={MapDirectionScreen}
        options={defaultScreenOptions}
      />
    </Stack.Navigator>
  )
}

export default PostStack
