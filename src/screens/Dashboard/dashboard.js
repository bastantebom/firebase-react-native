import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    SafeAreaView,
    ScrollView,
    Dimensions
} from 'react-native';

import { Posts, PaddingView, AppInput, AppText } from '@/components';
import { Filter, JarHeart, NavigationPinRed, NavigationArrow } from '@/assets/images/icons';
import { GlobalStyle, Colors } from '@/globals';

import Modal from 'react-native-modal';


function Dashboard({ navigation }) {
    const [modalState, setModalState] = useState(false)

    const toggleModal = () => {
        setModalState(!modalState);
    };

    function WrapperComponent() {
        return (
            <View style={{ backgroundColor: "red", paddingTop: 50, height: Dimensions.get('window').height }}>
                <TouchableOpacity onPress={() => setModalState(false)}>
                    <Text>I am the modal content!</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const DummyData = [
        {
            id: 1,
            userImage: "https://qph.fs.quoracdn.net/main-qimg-a1e8f69ca6140981338015c818fec130",
            name: "Pia Samson",
            username: "Piasamson",
            rating: 3.5,
            createdAt: 8088,
            isVerified: true,

            postType: "need",
            postImage: "https://i.pinimg.com/236x/b3/9d/da/b39dda5fe5fa56de7ca2bdead6d3807c--redneck-airconditioner-homemade-air-conditioner.jpg",
            postName: "Pasabuy Service - SM Light, Mandaluyong",
            postPrice: 500,
            postServiceAddress: "#8 Atis Street",
            postServiceRadius: "500m",
            postDeliveryMethod: "Delivery and Pickup"
        },
        {
            id: 2,
            userImage: "https://reactnative.dev/img/tiny_logo.png",
            name: "Mark Santiago",
            username: "Markee",
            rating: 4.5,
            createdAt: 5575482,
            isVerified: true,

            postType: "Service",
            postImage: "https://i.pinimg.com/originals/45/7c/16/457c165d41e342f1765e95ac46fb1d9b.jpg",
            postName: "Haircut Service every Sat & Sun Haircut Service every",
            postPrice: 20,
            postServiceAddress: "#8 Kaimito Street",
            postServiceRadius: "1000m",
            postDeliveryMethod: "Home Service"
        },
        {
            id: 3,
            userImage: "https://reactnative.dev/img/tiny_logo.png",
            name: "Mark Santiago",
            username: "Markee",
            rating: 4.5,
            createdAt: 53482,
            isVerified: true,

            postType: "Service",
            postImage: "https://i.pinimg.com/originals/45/7c/16/457c165d41e342f1765e95ac46fb1d9b.jpg",
            postName: "🍔 Wayne’s Burgers and Smoothies!",
            postPrice: 20,
            postServiceAddress: "#8 Kaimito Street",
            postServiceRadius: "1000m",
            postDeliveryMethod: "Home Service"
        },
        {
            id: 4,
            userImage: "https://reactnative.dev/img/tiny_logo.png",
            name: "Mark Santiago",
            username: "Markee",
            rating: 4.5,
            createdAt: 777482,
            isVerified: true,

            postType: "Service",
            postImage: "https://i.pinimg.com/originals/45/7c/16/457c165d41e342f1765e95ac46fb1d9b.jpg",
            postName: "Haircut Service every Sat & Sun Haircut Service every Sat",
            postPrice: 20,
            postServiceAddress: "#8 Kaimito Street",
            postServiceRadius: "1000m",
            postDeliveryMethod: "Home Service"
        }

    ]

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <View style={styles.container}>
                <View style={[GlobalStyle.rowCenter, {marginHorizontal: 16, marginTop: 16, paddingBottom: 8}]}>
                    <View style={{ flex: 1 }}>
                        <AppInput
                            label="Start your search"
                        />
                    </View>
                    <TouchableOpacity onPress={toggleModal}>
                        <View style={styles.circleButton}>
                            <Filter />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={styles.circleButton}>
                            <JarHeart />
                        </View>
                    </TouchableOpacity>
                </View>

                <ScrollView>
                    <PaddingView paddingSize={2} style={{ flex: 1 }}>
                        <View style={[GlobalStyle.rowCenter, { flex: 1, marginTop: 16 }]}>
                            <View style={{ flexDirection: "row" }}>
                                <NavigationPinRed width={24} height={24} />
                                <View style={{ marginLeft: 8 }} >
                                    <AppText>Your location</AppText>
                                    <AppText>Pioneer Woodlands</AppText>
                                </View>
                            </View>

                            <ScrollView horizontal={true} style={{ marginLeft: 40 }}>
                                <View style={styles.locationOption}>
                                    <NavigationArrow width={16} height={16} />
                                    <AppText>Nearest</AppText>
                                </View>
                                <View style={styles.locationOption}>
                                    <NavigationArrow width={16} height={16} />
                                    <AppText>Popular</AppText>
                                </View>
                                <View style={styles.locationOption}>
                                    <NavigationArrow width={16} height={16} />
                                    <AppText>NearNear</AppText>
                                </View>
                            </ScrollView>
                        </View>
                    </PaddingView>

                    <View style={{ flex: 5 }}>
                        <Posts data={DummyData} />
                    </View>
                </ScrollView>
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
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1
    },
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    circleButton: {
        width: 52,
        height: 52,
        borderRadius: 52 / 2,
        // backgroundColor: "green", 
        borderWidth: 1,
        borderColor: Colors.neutralGray,
        flexBasis: 52,
        marginLeft: 8,
        justifyContent: "center",
        alignItems: "center"
    },
    locationOption: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: Colors.primarySalomie,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
        flexDirection: "row"
    }

})

export default Dashboard;