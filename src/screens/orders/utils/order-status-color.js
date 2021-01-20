import { Colors } from '@/globals'

const getStatusColor = ({ status, postType, paymentMethod, past }) => {
  if (past) return Colors.secondaryShamrock
  if (
    status === 'pending' ||
    (status === 'ongoing' && postType === 'need') ||
    (status === 'confirmed' && paymentMethod !== 'cash' && postType !== 'need')
  )
    return Colors.checkboxBorderActive
  else if (
    ['delivering', 'processing', 'read', 'ongoing', 'paid', 'pickup'].includes(
      status
    ) ||
    (status === 'confirmed' &&
      (paymentMethod === 'cash' || postType === 'need'))
  )
    return Colors.secondaryShamrock
  else if (['declined', 'cancelled'].includes(status))
    return Colors.secondaryBrinkPink
  else if (status === 'completed') return Colors.secondaryRoyalBlue
  else return Colors.contentOcean
}

export default getStatusColor
