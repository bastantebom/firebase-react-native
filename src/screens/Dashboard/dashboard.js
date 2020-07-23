import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    SafeAreaView
} from 'react-native';

import AppText from '@/components/AppText/AppText';
import AppButton from '@/components/AppButton';
import Post from '@/components/Post/Post';

import auth from '@react-native-firebase/auth';
import Modal from 'react-native-modal';


function Dashboard({ navigation }) {
    const [modalState, setModalState] = useState(false)

    const toggleModal = () => {
        setModalState(!modalState);
    };

    function WrapperComponent() {
        return (
            <View style={{ flex: 1, backgroundColor: "red", paddingTop: 50 }}>
                <TouchableOpacity onPress={() => setModalState(false)}>
                    <Text>I am the modal content!</Text>
                </TouchableOpacity>
            </View>
        )
    }

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
            postServiceAddress: "#8 Atis Street",
            postServiceRadius: "500m",
            postDeliveryMethod: "Delivery and Pickup"
        },
        {
            name: "Mark Santiago",
            username: "Markee",
            rating: 4.5,
            createdAt: "2 weeks ago",
            isVerified: true,

            postType: "Service",
            postName: "Haircut Service every Sat & Sun",
            postPrice: {
                minimum: 199,
                maximum: 499
            },
            postServiceAddress: "#8 Kaimito Street",
            postServiceRadius: "1000m",
            postDeliveryMethod: "Home Service"
        }
    ]

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleModal}>
                <AppText>Hello</AppText>
            </TouchableOpacity>
            <Post data={DummyData[0]} />

            <Modal
                isVisible={modalState}
                animationIn="slideInRight"
                animationInTiming={1000}
                animationOut="slideOutRight"
                animationOutTiming={1000}
                onSwipeComplete={toggleModal}
                swipeDirection="right"
                customBackdrop={
                    <TouchableWithoutFeedback onPress={toggleModal}>
                        <View style={{ flex: 1, backgroundColor: "black" }} />
                    </TouchableWithoutFeedback>
                }
            >
                <WrapperComponent />
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingTop: 50
    }
})

export default Dashboard;