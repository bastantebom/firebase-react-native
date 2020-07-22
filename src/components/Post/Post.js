import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

import { PaddingView, AppText } from '@/components'
import { Verified, JarHeart, StarRating } from '@/assets/images/icons';

const Post = ({ data }) => {
    const {
        name,
        username,
        rating,
        createdAt,
        isVerified,
        postType,
        postName,
        postPrice,
        postServiceAddress,
        postServiceRadius,
        postDeliveryMethod
    } = data;

    return (
        <PaddingView paddingSize={2} style={styles.container}>
            <View style={styles.userInfoContainer}>
                <View style={styles.userInfoImageContainer}>
                    <Image style={styles.userInfoImage} source={require('@/assets/images/profile.png')} />
                </View>
                <View style={styles.userInfoDetailsContainer}>
                    <View style={styles.userInfoDetailsNameContainer}>
                        <AppText textStyle="caption" customStyle={styles.userInfoDetailsName} >{name}</AppText>
                        <Verified />
                    </View>
                    <View style={styles.userInfoDetailsUsernameContainer}>
                        <AppText textStyle="eyebrow2">@{username}</AppText>

                        <View style={styles.starRatingContainer}>
                            <StarRating width={12} height={12} />
                            <AppText textStyle="eyebrow2">{rating}</AppText>
                        </View>

                        <AppText textStyle="eyebrow2">• {createdAt}</AppText>
                    </View>
                </View>
                <TouchableOpacity>
                    <JarHeart />
                </TouchableOpacity>
            </View>

            <View style={styles.postContainer}>
                <View style={styles.postImageContainer}>
                    <Image style={{flex: 1, width: undefined, height: undefined}} source={require('@/assets/images/burger.jpg')} />
                </View>
            </View>
        </PaddingView>
    )
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: "red"
    },
    userInfoContainer: {
        // backgroundColor: "blue",
        flexDirection: "row",
    },
    userInfoImageContainer: {
        height: 32,
        width: 32,
        borderRadius: 32 / 2,
        overflow: "hidden"
    },
    userInfoImage: {
        flex: 1,
        width: undefined,
        height: undefined
    },
    userInfoDetailsContainer: {
        flex: 1,
        // backgroundColor: "red",
        paddingLeft: 8
    },
    userInfoDetailsNameContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    userInfoDetailsName: {
        fontFamily: "RoundedMplus1c-Medium",
        paddingRight: 4
    },
    userInfoDetailsUsernameContainer: {
        flexDirection: "row",
    },
    starRatingContainer: {
        flexDirection: "row",
        paddingHorizontal: 4
    },

    postContainer: {
        paddingTop: 8,
        paddingBottom: 16,
    },

    postImageContainer: {
        width: "100%",
        height: 126,
        borderRadius: 8,
        overflow: "hidden"
    }

})

export default Post;