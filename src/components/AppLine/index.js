import React from 'react';
import { View, StyleSheet } from 'react-native';
import styles from './AppText.scss';

/**
 * 
 * @param {listed on Apptext.scss} textStyle
 */

const AppText = ({ children, textStyle, style }) => {

    let computedTextStyle = StyleSheet.create({
    });

    if (style) {
        computedTextStyle = {
            ...computedTextStyle,
            ...style,
        };
    }

    return <View style={computedTextStyle} />;
};

export default AppText;
