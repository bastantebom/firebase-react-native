import React, { useState, useContext, useEffect } from 'react'
import { AppInput, PaddingView, AppText } from '@/components';
import { Colors } from '@/globals';

const AddAnAddress = () => {
  return (
    <PaddingView paddingSize={3}>
      <AppInput
        label="Name"
        placeholder="ex. Home, Office"
      />
      <AppInput
        placeholder="Address"
      />
      <AppInput
        label="Address Details"
        placeholder="ex. House, Floor, Unit Number"
      />
      <AppInput
        label="Notes"
        placeholder="ex. Yellow gate"
      />
      <AppText textStyle="body1" color={Colors.errColor}>Remove</AppText>
    </PaddingView>
  )
}

export default AddAnAddress;