import React, { useRef, useState, useEffect } from 'react'
import { View, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import AppText from '../AppText/AppText'
// import Slider from '@react-native-community/slider';
import Slider from 'react-native-slider'
import { Colors, normalize } from '@/globals'

export const RangeSlider = ({
  minValue = 0,
  maxValue = 200,
  step = 5,
  value,
  onValueChange,
  showRange,
}) => {
  const sliderRef = useRef(null)

  const [rangeValue, setRangeValue] = useState(value || 0)

  const tapSliderHandler = evt => {
    if (sliderRef.current) {
      sliderRef.current.measure((fx, fy, width, height, px) => {
        const distanceRange =
          ((evt.nativeEvent.locationX - px) / width) * normalize(95)
        if (distanceRange < 0) {
          setRangeValue(Math.round(-(distanceRange * 0)))
          onValueChange(Math.round(-(distanceRange * 0)))
          console.log('negative value')
        } else {
          setRangeValue(Math.round((distanceRange * 100) / 100))
          onValueChange(Math.round((distanceRange * 100) / 100))
        }
      })
    }
  }

  useEffect(() => {
    setRangeValue(value)
  }, [value])

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <AppText
          textStyle="caption"
          color="#999"
          customStyle={{ display: showRange ? 'flex' : 'none' }}>
          {minValue}
        </AppText>
        <View
          ref={sliderRef}
          style={{ width: !showRange ? '100%' : '85%' }}
          onLayout={e => e.nativeEvent}>
          <TouchableWithoutFeedback onPressIn={tapSliderHandler}>
            <Slider
              style={{ width: '100%' }}
              trackStyle={{ height: normalize(6) }}
              minimumValue={minValue}
              maximumValue={maxValue}
              step={step}
              value={rangeValue}
              onValueChange={rangeValue => {
                setRangeValue(rangeValue)
                onValueChange(rangeValue)
              }}
              minimumTrackTintColor={Colors.primaryYellow}
              maximumTrackTintColor={Colors.neutralGray}
              thumbStyle={{
                borderWidth: 4,
                borderColor: Colors.neutralsWhite,
                width: 25,
                height: 25,
                borderRadius: 50,
                backgroundColor: Colors.primaryYellow,
                elevation: 3,
              }}
            />
          </TouchableWithoutFeedback>
        </View>
        <AppText
          textStyle="caption"
          color="#999"
          customStyle={{ display: showRange ? 'flex' : 'none' }}>
          {maxValue}
        </AppText>
      </View>
    </>
  )
}
