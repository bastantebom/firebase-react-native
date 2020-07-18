import React from 'react'
import { View, Text, StyleSheet, Dimensions, StatusBar } from 'react-native'

/**
 * 
 * @param {
 *     message: string 
 *     type: "error" | "success"
 *     state: "show" | "hide"
 *     autohide: boolean
 * } 
 */

const Notification = ({message, type, state, autohide}) => {

    console.log(StatusBar.currentHeight)

    return (
        <View style={styles.container}>
            <Text>Hello</Text>
            <Text>Hello</Text>
        </View>
    )
}

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "red",
        width: width,
        position: "absolute",
        top: 0,
        left: 0,
    }
})

export default Notification;