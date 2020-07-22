import React, { useRef } from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';

import AppText from '@/components/AppText/AppText';
import AppButton from '@/components/AppButton';
import Post from '@/components/Post/Post';

import auth from '@react-native-firebase/auth';



function Dashboard({ navigation }) {
    const signOut = () => {
        auth()
            .signOut()
            .then(() => console.log('User signed out!'))
            .catch(() => navigation.goBack());
    }

    const currentUser = auth()?.currentUser?.email ? auth().currentUser.email : "guest";

    const DummyData = [
        {
            name: "Pia Samson",
            username: "Piasamson",
            rating: 3.5,
            createdAt: "1 week ago",
            isVerified: true,

            postType: "need",
            postName: "I need someone to do my aircon",
            postPrice: {
                minimum: 199,
                maximum: 499
            },
            postServiceAddress: "#8 Atis Street" ,
            postServiceRadius: "500m",
            postDeliveryMethod: "Delivery and Pickup"
        },
        {
            name: "Mark Santiago",
            username: "Markee",
            rating: 4.5,
            createdAt: "2 weeks ago",

            postType: "Service",
            postName: "Haircut Service every Sat & Sun",
            postPrice: {
                minimum: 199,
                maximum: 499
            },
            postServiceAddress: "#8 Kaimito Street" ,
            postServiceRadius: "1000m",
            postDeliveryMethod: "Home Service"
        }
    ]

    return (
        <View style={styles.container}>
            <AppText>Hello</AppText>
            <Post data={DummyData[0]} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    }
})

export default Dashboard;