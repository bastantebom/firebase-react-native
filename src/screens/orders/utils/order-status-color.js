import { Colors } from '@/globals'

const getStatusColor = ({ userType, status, postType }) => {
  if (status === 'pending' || (status === 'ongoing' && postType === 'need'))
    return Colors.checkboxBorderActive
  else if (
    [
      'confirmed',
      'delivering',
      'processing',
      'read',
      'ongoing',
      'paid',
    ].includes(status)
  )
    return Colors.secondaryShamrock
  else if (['declined', 'cancelled'].includes(status))
    return Colors.secondaryBrinkPink
  else return Colors.contentOcean
}

export default getStatusColor
