import { Images } from '@/assets/images'
import { Icons } from '@/assets/images/icons'
import Avatar from '@/components/Avatar/avatar'
import Button from '@/components/Button'
import Loader from '@/components/loader'
import Toast from '@/components/toast'
import { Context } from '@/context'
import { UserContext } from '@/context/UserContext'
import { Colors } from '@/globals'
import typography from '@/globals/typography'
import utilStyles from '@/globals/util-styles'
import { iconSize, normalize } from '@/globals/Utils'
import Api from '@/services/Api'
import React, { useState, useContext, useEffect, useCallback } from 'react'
import { PureComponent } from 'react'
import {
  View,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Text,
  FlatList,
  RefreshControl,
} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import ModalComponent from '../orders/modals'
import EmptyBlockList from './empty-block-user'

class BlockedUserItem extends PureComponent {
  render() {
    return (
      <View style={styles.blockedUserItem}>
        <View style={styles.avatarWrapper}>
          <Avatar
            path={this.props.user?.profile_photo}
            size="64x64"
            style={{
              height: '100%',
              width: '100%',
              borderRadius: normalize(24),
            }}
          />
        </View>
        <View style={utilStyles.flex1}>
          <View style={[utilStyles.row, utilStyles.alignCenter]}>
            <Text style={[typography.body1, typography.medium]}>
              {this.props.user.full_name}
            </Text>
            {this.props.user.account_verified && (
              <Icons.Verified
                style={{ marginLeft: normalize(6) }}
                {...iconSize(10)}
              />
            )}
          </View>
          <Text style={[typography.caption, { color: Colors.icon }]}>
            @{this.props.user.username}
          </Text>
        </View>
        <Button
          onPress={() => this.props.onUnblockPress(this.props.user)}
          style={{
            paddingHorizontal: normalize(24),
            borderWidth: normalize(1),
          }}
          type="secondary-outline"
          label="Unblock"
          size="medium"
        />
      </View>
    )
  }
}

/**
 * @typedef {object} BlockedUsersScreenProps
 */

/**
 * @typedef {object} RootProps
 * @property {BlockedUsersScreenProps} BlockedUsersScreen
 **/

/** @param {import('@react-navigation/stack').StackScreenProps<RootProps, 'BlockedUsersScreen'>} param0 */
const BlockedUsersScreen = ({ navigation }) => {
  const { user } = useContext(UserContext)
  const { setDashboardNeedsRefresh } = useContext(Context)
  const [users, setUsers] = useState({})
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [
    confirmUnblockUserModalVisible,
    setConfirmUnblockUserModalVisible,
  ] = useState(false)
  const [unblockingUser, setUnblockingUser] = useState()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [hasMoreItems, setHasMoreItems] = useState(true)
  const [isEmpty, setIsEmpty] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [lastId, setLastId] = useState(false)

  const handleOnRefresh = async () => {
    if (isRefreshing) return
    setIsRefreshing(true)
    setUsers({})
    setIsEmpty(false)
    setHasMoreItems(true)
    await loadData()
    setIsRefreshing(false)
  }

  const handleOnEndReached = useCallback(() => {
    if (!isScrolled || isLoading || !hasMoreItems) return
    setIsScrolled(false)
    loadData({ lastId })
  }, [isScrolled, isLoading, hasMoreItems, setIsScrolled, loadData])

  const loadData = useCallback(
    async ({ lastId } = {}) => {
      setIsLoading(true)
      try {
        const params = { uid: user.uid, limit: 10 }
        if (lastId) params.last_id = lastId
        const response = await Api.getBlockedUsers(params)
        if (!response.success) throw new Error(response.message)
        const newData = response.blocked_users
          .filter(user => !!user)
          .reduce(
            (_users, user) => ({
              ..._users,
              [user.blocked_uid]: { uid: user.blocked_uid },
            }),
            {}
          )

        setUsers(users => ({ ...users, ...newData }))
        setLastId(response.last_id)
        if (!response.blocked_users.length) setHasMoreItems(false)
        if (!response.blocked_users.length && !Object.values(users).length)
          setIsEmpty(true)
      } catch (error) {
        console.log(error)
        Toast.show({
          type: 'error',
          label: 'Uh-oh, An error occurred. Please try again',
          dismissible: true,
          timeout: 5000,
          screenId: 'blocked-users',
        })
      }
      setIsLoading(false)
    },
    [setUsers, setLastId, setIsEmpty, setHasMoreItems, setIsLoading]
  )

  const handleOnUnblock = useCallback(async () => {
    setConfirmUnblockUserModalVisible(false)
    setIsPageLoading(true)
    try {
      const response = await Api.unblockUser({ uid: unblockingUser.uid })
      if (!response.success) throw new Error(response.message)

      setUsers(users => {
        delete users[unblockingUser.uid]
        return users
      })
      setUnblockingUser(null)

      setDashboardNeedsRefresh(true)
      const firstName = (unblockingUser?.full_name || '').split(' ')[0]
      Toast.show({
        type: 'success',
        timeout: 8000,
        dismissible: true,
        screenId: 'root',
        label: (
          <Text style={typography.body2}>
            You have successfully unblocked{' '}
            <Text style={typography.medium}>{firstName}</Text>.
          </Text>
        ),
      })
    } catch (error) {
      console.log(error)
      Toast.show({
        type: 'error',
        label: 'Uh-oh, An error occurred. Please try again',
        dismissible: true,
        timeout: 5000,
        screenId: 'blocked-users',
      })
    }
    setIsPageLoading(false)
  }, [unblockingUser, setUsers])

  const handleOnUnblockPress = user => {
    setUnblockingUser(user)
    setConfirmUnblockUserModalVisible(true)
  }

  const renderItem = ({ item }) => {
    return <BlockedUserItem user={item} onUnblockPress={handleOnUnblockPress} />
  }

  const getDeferredData = user => {
    return Api.getUser({ uid: user.uid })
      .then(response => {
        setUsers(users => ({
          ...users,
          [user.uid]: {
            ...users[user.uid],
            ...response.data,
          },
        }))
      })
      .catch(() => {
        setUsers(users => ({
          ...users,
          [user.uid]: {
            ...users[user.uid],
            $hasErrors: true,
          },
        }))
      })
  }

  useEffect(() => {
    Object.values(users)
      .filter(user => !user.$promise)
      .forEach(user => {
        if (users[user.uid].$promise) return

        setUsers(users => {
          return {
            ...users,
            [user.uid]: {
              ...users[user.uid],
              $promise: getDeferredData(user),
            },
          }
        })
      })
  }, [users])

  useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <>
      <Toast
        containerStyle={{ marginTop: getStatusBarHeight() }}
        ref={ref => Toast.setRef(ref, 'blocked-users')}
      />
      <Loader visible={isPageLoading} />
      <StatusBar
        translucent={true}
        barStyle="dark-content"
        backgroundColor="#fff"
      />
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={navigation.goBack}>
            <Icons.Back style={styles.backArrowIcon} {...iconSize(24)} />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={[typography.body2, typography.medium]}>
              Blocked Users
            </Text>
          </View>
        </View>
        <View style={styles.content}>
          <FlatList
            keyExtractor={item => item.uid}
            contentContainerStyle={{ flex: 1 }}
            data={Object.values(users)}
            renderItem={renderItem}
            initialNumToRender={20}
            ListEmptyComponent={isEmpty && <EmptyBlockList />}
            onMomentumScrollBegin={() => setIsScrolled(true)}
            onEndReached={handleOnEndReached}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                titleColor={Colors.primaryMidnightBlue}
                tintColor={Colors.primaryYellow}
                onRefresh={handleOnRefresh}
              />
            }
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          />
        </View>
      </View>
      <ModalComponent
        isVisible={confirmUnblockUserModalVisible}
        setIsVisible={setConfirmUnblockUserModalVisible}>
        <View style={styles.confirmUnblockUser}>
          <View style={styles.avatarWrapper}>
            <Avatar
              path={unblockingUser?.profile_photo}
              size="64x64"
              style={{
                height: '100%',
                width: '100%',
                borderRadius: normalize(24),
              }}
            />
          </View>
          <Text
            style={[
              typography.display6,
              { color: Colors.primaryMidnightBlue, marginTop: normalize(16) },
            ]}>
            Unblock {(unblockingUser?.full_name || '').split(' ')[0]}
          </Text>
          <Text
            style={[
              typography.body2,
              typography.textCenter,
              { marginTop: normalize(8) },
            ]}>
            Your profile and public posts will be visible to{' '}
            {(unblockingUser?.full_name || '').split(' ')[0]}.
          </Text>
          <Button
            onPress={handleOnUnblock}
            style={styles.confirmModalButton}
            label="Yes"
            type="primary"
          />
          <Button
            onPress={() => setConfirmUnblockUserModalVisible(false)}
            style={styles.confirmModalButton}
            label="Cancel"
            type="disabled"
          />
        </View>
      </ModalComponent>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: getStatusBarHeight(),
  },
  header: {
    flexDirection: 'row',
  },
  backButton: {
    padding: normalize(16),
    zIndex: 2,
  },
  backArrowIcon: {
    color: Colors.primaryMidnightBlue,
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
    paddingVertical: normalize(16),
  },
  content: {
    flex: 1,
    paddingHorizontal: normalize(24),
    paddingTop: normalize(12),
  },
  emptyStateWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: normalize(28),
    flex: 1,
  },
  avatarWrapper: {
    height: normalize(42),
    width: normalize(42),
    borderRadius: normalize(24),
    overflow: 'hidden',
    marginRight: normalize(8),
  },
  blockedUserItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemSeparator: {
    backgroundColor: '#f6f6f6',
    height: normalize(1),
    width: '100%',
    marginVertical: normalize(16),
  },
  confirmUnblockUser: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: normalize(24),
    paddingBottom: normalize(12),
    paddingHorizontal: normalize(28),
  },
  confirmModalButton: {
    width: '100%',
    marginTop: normalize(16),
  },
})

export default BlockedUsersScreen
