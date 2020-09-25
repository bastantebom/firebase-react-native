import {StyleSheet} from 'react-native';
import {Colors} from '@/globals';

const GlobalStyle = StyleSheet.create({
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    width: undefined,
    height: undefined,
  },

  marginLeft1: {
    marginLeft: 8,
  },
  marginLeft2: {
    marginLeft: 16,
  },
  marginBottom1: {
    marginBottom: 8,
  },
  marginBottom2: {
    marginBottom: 16,
  },
  dividerStyle: {
    backgroundColor: Colors.neutralsGainsboro,
    width: '100%',
  },
});

export default GlobalStyle;
