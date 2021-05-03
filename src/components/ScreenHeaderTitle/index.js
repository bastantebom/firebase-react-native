import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'

import { AppText, PaddingView } from '@/components'
import { Icons } from '@/assets/images/icons'
import { VerticalEllipsis } from '@/assets/images/icons'
import { Colors, normalize } from '@/globals'

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
  iconSize = normalize(24),
  title,
  openOptions,
  withOptions = false,
  rightLink,
  rightLinkEvent,
  rightIcon,
  rightIconEvent,
  customTitleStyle,
}) => {
  const RenderIcon = () => {
    if (icon === 'close')
      return (
        <Icons.Back
          style={{
            width: normalize(iconSize),
            height: normalize(iconSize),
            color: Colors.primaryMidnightBlue,
          }}
        />
      )

    if (icon === 'back') return <Icons.Back style={styles.backButton} />

    return (
      <Icons.Back
        style={{
          width: normalize(iconSize),
          height: normalize(iconSize),
          color: Colors.primaryMidnightBlue,
        }}
      />
    )
  }

  return (
    <PaddingView paddingSize={paddingSize} style={{ width: '100%' }}>
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
          style={{
            position: 'absolute',
            left: normalize(-6),
            padding: normalize(6),
          }}>
          <RenderIcon />
        </TouchableOpacity>
        <AppText
          customStyle={{ ...customTitleStyle }}
          textStyle="body3"
          numberOfLines={1}>
          {title}
        </AppText>
        {withOptions && (
          <TouchableOpacity
            onPress={openOptions}
            activeOpacity={0.7}
            style={{ position: 'absolute', right: 0 }}>
            <VerticalEllipsis
              style={{ color: Colors.primaryMidnightBlue }}
              height={normalize(24)}
              width={normalize(24)}
            />
          </TouchableOpacity>
        )}

        {rightIcon && (
          <TouchableOpacity
            onPress={rightIconEvent}
            activeOpacity={0.7}
            style={{ position: 'absolute', right: 0 }}>
            {rightIcon}
          </TouchableOpacity>
        )}

        {rightLink ? (
          <TouchableOpacity
            onPress={rightLinkEvent}
            activeOpacity={0.7}
            style={{ position: 'absolute', right: 0 }}>
            <AppText textStyle="captionConstant" color={Colors.contentOcean}>
              {rightLink}
            </AppText>
          </TouchableOpacity>
        ) : null}
      </View>
    </PaddingView>
  )
}

const styles = StyleSheet.create({
  backButton: {
    color: Colors.primaryMidnightBlue,
  },
})

export default ScreenHeaderTitle
