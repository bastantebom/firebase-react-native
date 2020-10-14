import React, { useState, useContext } from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import Modal from 'react-native-modal';
import { Verified, ProfileImageDefault } from '@/assets/images/icons';
import { AppText, CacheableImage } from '@/components';
import { normalize, GlobalStyle, Colors } from '@/globals';
import { FollowingEllipsis } from '@/assets/images/icons';

import RemoveFollowerContent from './RemoveFollowerContent';
import UnfollowContent from './UnfollowContent';
import MuteContent from './MuteContent';
import { UserContext } from '@/context/UserContext';


const Profile = ({ data, type }) => {
    const { user, userInfo } = useContext(UserContext);
    const { profile_photo, username, display_name, full_name, follower, uid } = data;

    //const [followingState, setFollowingState] = useState(following);
    const [removeFollower, setRemoveFollower] = useState(false);
    const [unfollow, setUnfollow] = useState(false);
    const [showMute, setShowMute] = useState(false);

    const showMuteToggle = () => {
        setShowMute(!showMute);
    };

    const removeFollowerToggle = () => {
        setRemoveFollower(!removeFollower);
    };

    const unfollowToggle = () => {
        setUnfollow(!unfollow);
    };

    const follow = () => {
        setFollowingState(true);
    };

    const unfollowHandler = () => {
        setFollowingState(false);
        setUnfollow(false);
    };

    const isFollowing = () => {
        return userInfo.following ? userInfo.following.includes(uid) : false;
    };

    const ProfilePhoto = ({ size }) => {
        return profile_photo ? (
            <CacheableImage
                style={GlobalStyle.image}
                source={{
                    uri: profile_photo,
                }}
            />
        ) : (
                <ProfileImageDefault width={normalize(size)} height={normalize(size)} />
            );
    };

    return (
        <View style={styles.container}>
            <View style={styles.userInfoImageContainer}>
                <ProfilePhoto size={42} />
            </View>

            <View style={{ flex: 1, marginLeft: 8 }}>
                <AppText textStyle="body1">{display_name ? display_name : full_name}</AppText>
                <AppText textStyle="metadata">@{username}</AppText>
            </View>

            { userInfo.uid !== uid ?
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {isFollowing() ? <View
                        style={{
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 4,
                            backgroundColor: Colors.buttonDisable,
                        }}>
                        <AppText textStyle="caption2">Following</AppText>
                    </View> : null}
                    <TouchableOpacity style={{ marginLeft: 8 }} onPress={showMuteToggle}>
                        <FollowingEllipsis width={normalize(24)} height={normalize(24)} />
                    </TouchableOpacity>
                </View> : <View
                    style={{
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 4,
                        backgroundColor: Colors.buttonDisable,
                    }}>
                    <AppText textStyle="caption2">You</AppText>
                </View>}


            <Modal
                isVisible={removeFollower}
                animationIn="slideInUp"
                animationInTiming={500}
                animationOut="slideOutDown"
                animationOutTiming={500}
                onSwipeComplete={removeFollowerToggle}
                swipeDirection="down"
                style={{
                    justifyContent: 'flex-end',
                    margin: 0,
                }}
                customBackdrop={
                    <TouchableWithoutFeedback onPress={removeFollowerToggle}>
                        <View style={{ flex: 1, backgroundColor: 'black' }} />
                    </TouchableWithoutFeedback>
                }>
                <View>
                    <RemoveFollowerContent
                        data={data}
                        removeFollowerToggle={removeFollowerToggle}
                    />
                </View>
            </Modal>

            <Modal
                isVisible={unfollow}
                animationIn="slideInUp"
                animationInTiming={500}
                animationOut="slideOutDown"
                animationOutTiming={500}
                onSwipeComplete={unfollowToggle}
                swipeDirection="down"
                style={{
                    justifyContent: 'flex-end',
                    margin: 0,
                }}
                customBackdrop={
                    <TouchableWithoutFeedback onPress={unfollowToggle}>
                        <View style={{ flex: 1, backgroundColor: 'black' }} />
                    </TouchableWithoutFeedback>
                }>
                <View>
                    <UnfollowContent
                        data={data}
                        unfollowToggle={unfollowToggle}
                        unfollowHandler={unfollowHandler}
                    />
                </View>
            </Modal>

            <Modal
                isVisible={showMute}
                animationIn="slideInUp"
                animationInTiming={500}
                animationOut="slideOutDown"
                animationOutTiming={500}
                onSwipeComplete={showMuteToggle}
                swipeDirection="down"
                style={{
                    justifyContent: 'flex-end',
                    margin: 0,
                }}
                customBackdrop={
                    <TouchableWithoutFeedback onPress={showMuteToggle}>
                        <View style={{ flex: 1, backgroundColor: 'black' }} />
                    </TouchableWithoutFeedback>
                }>
                <View>
                    <MuteContent data={data} showMuteToggle={showMuteToggle} />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    userInfoImageContainer: {
        height: normalize(42),
        width: normalize(42),
        borderRadius: normalize(42 / 2),
        overflow: 'hidden',
    },
    dividerStyle: {
        backgroundColor: Colors.neutralsZircon,
        width: '100%',
        marginTop: 8,
        marginBottom: 32,
    },
});

export default Profile;