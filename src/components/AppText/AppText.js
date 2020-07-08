import React from 'react';
import { Text } from 'react-native';
import styles from './AppText.scss'

const AppText = ({ children, textStyle, customStyle }) => {

    let computedTextStyle = styles[textStyle];

    if (customStyle) {
        computedTextStyle = {
            ...computedTextStyle,
            ...customStyle
        }
    }

    return (
        <Text style={computedTextStyle}>{children}</Text>
    )
}

export default AppText

