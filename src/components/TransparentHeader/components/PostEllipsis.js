import React from 'react';
import {View, TouchableOpacity} from 'react-native';

import {AppText, BottomSheetHeader, PaddingView} from '@/components';
import {Colors, normalize} from '@/globals';

import {PostPencil, PostRemove} from '@/assets/images/icons';

const PostEllipsis = ({
  toggleEllipsisState,
  editPostFunction,
  deletePostFunction,
}) => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        paddingBottom: 24,
        borderTopEndRadius: 8,
        borderTopStartRadius: 8,
      }}>
      <BottomSheetHeader />
      <PaddingView paddingSize={2}>
        <TouchableOpacity activeOpacity={0.7} onPress={editPostFunction}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}>
            <PostPencil width={normalize(24)} height={normalize(24)} />
            <AppText customStyle={{marginLeft: 8}} textStyle="body2">
              Edit Post
            </AppText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} onPress={deletePostFunction}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}>
            <PostRemove width={normalize(24)} height={normalize(24)} />
            <AppText
              color={Colors.red}
              customStyle={{marginLeft: 8}}
              textStyle="body2">
              Remove Post
            </AppText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} onPress={toggleEllipsisState}>
          <View
            style={{
              backgroundColor: Colors.neutralsZircon,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 8,
            }}>
            <AppText textStyle="button2">Cancel</AppText>
          </View>
        </TouchableOpacity>
      </PaddingView>
    </View>
  );
};

export default PostEllipsis;
