import React, { useRef, useState } from 'react'
import { View, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import AppText from '../AppText/AppText'
// import Slider from '@react-native-community/slider';
import Slider from "react-native-slider";
import { Colors, normalize } from '@/globals';
import AppButton from '../AppButton/AppButton';

export const RangeSlider = ({ 
  minValue = 0, 
  maxValue = 200,
  step = 5,
  value
}) => {
  
  const sliderRef = useRef(null)
  
  const [rangeValue, setRangeValue] = useState(0)
  const [measurements, setMeasurements] = useState({})
  // const tapSliderHandler = (evt) => { 
  //   // slider.current.measure((fx, fy, width, height, px, py) => { 
  //   //   // this.setState({value: (evt.nativeEvent.locationX - px) / width}); 
  //   //   console.log(evt.nativeEvent.locationX - px)
  //   // }); 
  //   console.log(evt)
  // }

  const measure = () => {
    sliderRef.current.measure((x, y, width, height) => {
      setMeasurements({
        x,
        y,
        width,
        height
      })
    })
    console.log(measurements)
  }

  const tapSliderHandler = (evt) => {
    if (sliderRef) {
      sliderRef.current.measure((x, y, width, height, px) => {
        setMeasurements({x, y, width, height})
        const location = ((evt.nativeEvent.locationX - x) / width) * 100;
        console.log(location)
        setRangeValue(evt.nativeEvent.locationX - x)
      })
    }
  };

  return (
    <>
      <View 
        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <AppText textStyle="caption" color="#999">{minValue}</AppText>
          {/* <TouchableWithoutFeedback onPressIn={tapSliderHandler}> */}
            <View 
              ref={sliderRef} 
              style={{ width: '80%' }} 
              onLayout={({ nativeEvent }) => {
                setMeasurements(nativeEvent.layout)
              }}
            >
              <Slider
                style={{ width: '100%' }}
                trackStyle={{ height: normalize(6) }}
                minimumValue={minValue}
                maximumValue={maxValue}
                step={step}
                value={rangeValue}
                onValueChange={rangeValue => {
                  setRangeValue(rangeValue), 
                  value(rangeValue)
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
                  elevation: 3 
                }}
              />
            </View>
          {/* </TouchableWithoutFeedback> */}
        <AppText textStyle="caption" color="#999">{maxValue}</AppText>
      </View>
      </>
  )
}