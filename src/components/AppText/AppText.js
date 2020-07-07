import React, { Children } from 'react';
import { Text, StyleSheet } from 'react-native';
import styles from './AppText.scss'

const AppText = ({ children, textStyle }) => {

    let computedTextStyle = styles[textStyle];

    return (
        <Text style={computedTextStyle}>{children}</Text>
    )
}

export default AppText

