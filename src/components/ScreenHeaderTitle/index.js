import React from 'react';
import {View, TouchableOpacity} from 'react-native';

import {AppText, PaddingView} from '@/components';

import {
  HeaderBackGray,
  HeaderCloseGray,
  QRLink,
  QRDownload,
  QRShare,
  Close,
  VerticalEllipsis
} from '@/assets/images/icons';
import {Colors, normalize} from '@/globals';

/**
 *
 * @param {
 *  close: toggle/close function
 *  paddingSize: size of padding * 8
 *  icon: "close" | "back" | JSX function | default back
 *  iconSize: size of icon | default 24
 *
 * } param0
 */

const ScreenHeaderTitle = ({
  close,
  paddingSize,
  icon,
  iconSize = 24,
  title,
  openOptions,
  withOptions = false,
  rightLink,
  rightLinkEvent,
  rightIcon,
  rightIconEvent
}) => {
  const RenderIcon = () => {
    if (icon === 'close')
      return (
        <HeaderCloseGray
          width={normalize(iconSize)}
          height={normalize(iconSize)}
        />
      );

    if (icon === 'back')
      return (
        <HeaderBackGray
          width={normalize(iconSize)}
          height={normalize(iconSize)}
        />
      );

    return (
      <HeaderBackGray
        width={normalize(iconSize)}
        height={normalize(iconSize)}
      />
    );
  };

  return (
    <PaddingView paddingSize={paddingSize} style={{width: '100%'}}>
      <View
        style={{
          position: 'relative',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          onPress={close}
          activeOpacity={0.7}
          style={{position: 'absolute', left: 0}}>
          <RenderIcon />
        </TouchableOpacity>
        <AppText customStyle={{textTransform: 'capitalize'}} textStyle="body3">
          {title}
        </AppText>
        {withOptions && (
          <TouchableOpacity
            onPress={openOptions}
            activeOpacity={0.7}
            style={{position: 'absolute', right: 0}}>
            <VerticalEllipsis height={normalize(24)} width={normalize(24)} />
          </TouchableOpacity>
        )}

        {rightIcon && (
          <TouchableOpacity
            onPress={rightIconEvent}
            activeOpacity={0.7}
            style={{position: 'absolute', right: 0}}>
            {rightIcon}
          </TouchableOpacity>
        )}
       
        {rightLink ? (
          <TouchableOpacity
            onPress={rightLinkEvent}
            activeOpacity={0.7}
            style={{position: 'absolute', right: 0}}>
            <AppText textStyle="captionConstant" color={Colors.contentOcean}>
              {rightLink}
            </AppText>
          </TouchableOpacity>
        ) : null}
      </View>
    </PaddingView>
  );
};

export default ScreenHeaderTitle;
