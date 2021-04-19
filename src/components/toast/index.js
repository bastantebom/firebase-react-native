import { Icons } from '@/assets/images/icons'
import { Colors } from '@/globals'
import typography from '@/globals/typography'
import { iconSize, normalize } from '@/globals/Utils'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { navigationRef } from '../../../Routes'

/**
 * @typedef {object} ToastConfig
 * @property {number | undefined} timeout autohide timeout in milliseconds
 * @property {React.Component} content
 * @property {boolean} dismissible
 * @property {() => React.Component} renderDismiss
 * @property {() => React.Component} renderIcon
 * @property {string} type
 */
export default class Toast extends React.Component {
  static _refs = {}

  static setRef(ref = {}, id) {
    Toast._refs[id] = ref
  }

  static getRef(id) {
    return Toast._refs[id]
  }

  static clearRef() {
    Toast._refs = {}
  }

  /**
   * @param {ToastConfig} config
   * @returns {string} toast id
   */
  static show(_config = {}) {
    const { screenId, ...config } = _config
    const currentScreen = navigationRef.current
      ?.getCurrentRoute?.()
      ?.name?.toLowerCase?.()
    return Toast._refs[screenId || currentScreen]?.show(config)
  }

  static hide(config = {}) {
    const { screenId, id } = config

    Toast._refs[screenId]?.hide(id)
  }

  constructor(props) {
    super(props)
    this.state = {
      toasts: [],
    }
    this.show = this.show.bind(this)
    this.hide = this.hide.bind(this)
  }

  /**
   * @param {ToastConfig} config
   * @returns {string} toast id
   */
  show(config = {}) {
    const id = Math.random().toString(36).substring(2)
    this.setState({
      toasts: [
        ...this.state.toasts,
        {
          ...config,
          id,
        },
      ],
    })

    if (config.timeout) {
      setTimeout(() => {
        this.hide(id)
      }, config.timeout)
    }
    return id
  }

  /**
   * @param {string} id toast id
   */
  hide(id) {
    const toasts = [...this.state.toasts]
    const index = toasts.findIndex(toast => toast.id === id)
    toasts.splice(index, 1)
    this.setState({
      toasts,
    })
  }

  render() {
    const { containerStyle } = this.props

    return (
      <View style={[styles.wrapper, containerStyle]}>
        {this.state.toasts.map(toast => (
          <BaseToast key={toast.id} {...toast} onDismiss={this.hide} />
        ))}
      </View>
    )
  }
}

export class BaseToast extends React.Component {
  constructor(props) {
    super(props)

    this.handleOnDismiss = this.handleOnDismiss.bind(this)
  }

  handleOnDismiss() {
    this.props.onDismiss(this.props.id)
  }

  render() {
    const {
      content,
      label,
      dismissible,
      renderDismiss,
      renderIcon,
      type,
    } = this.props

    const colors = {
      success: Colors.secondaryShamrock,
      error: Colors.secondaryBrinkPink,
    }

    const color = colors[type]
    const icons = {
      error: <Icons.Warning style={{ color }} {...iconSize(24)} />,
      success: <Icons.CircleTick style={{ color }} {...iconSize(24)} />,
    }
    const icon = icons[type]

    return (
      <View style={[styles.toast]}>
        <View style={[styles.statusIndicator, { backgroundColor: color }]} />
        <View style={styles.toastContentWrapper}>
          {renderIcon?.() ? (
            <View style={styles.iconContainer}>{renderIcon()}</View>
          ) : (
            <View style={styles.iconContainer}>{icon}</View>
          )}
          <View style={styles.toastContent}>
            {label && !content ? (
              <Text style={[typography.body2, styles.label]}>{label}</Text>
            ) : (
              content
            )}
          </View>
          {!!dismissible && (
            <>
              {renderDismiss ? (
                renderDismiss()
              ) : (
                <TouchableOpacity
                  style={styles.closeButton}
                  activeOpacity={0.7}
                  onPress={this.handleOnDismiss}>
                  <Icons.Close
                    style={{ color: Colors.icon }}
                    {...iconSize(24)}
                  />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: '100%',
    left: 0,
    top: 0,
    zIndex: 10000000,
    paddingHorizontal: normalize(10),
  },
  toast: {
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderRadius: normalize(8),
    marginBottom: normalize(8),

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  toastContent: {
    flex: 1,
    marginRight: normalize(40),
  },
  toastContentWrapper: {
    padding: normalize(16),
    flexDirection: 'row',
  },
  closeButton: {},
  iconContainer: {
    marginRight: normalize(8),
  },
  label: {
    color: Colors.contentPlaceholder,
  },
  statusIndicator: {
    width: normalize(8),
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
})
