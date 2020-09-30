import React, { useState, useContext } from 'react';
import { 
  StyleSheet, 
  View, 
  Dimensions,
  TouchableOpacity
} from 'react-native';
import Modal from 'react-native-modal'
import { normalize, Colors } from '@/globals';
import { AppText, PaddingView, Posts } from '@/components';
import { HeaderBackGray } from '@/assets/images/icons';
import { Context } from '@/context';

const { width, height } = Dimensions.get('window');

const Tags = () => {

  const tags = ["Burger", "N95 Mask", "Isopropyl alcohol", "Milk Tea", "Horchata", "Arabica Coffee Beans", "Talbos ng Kamote"]

  const dummyPost = [{

  }]

  const {posts} = useContext(Context);

  const [tagsModal, setTagsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View>
      <AppText 
        textStyle="body3" 
        color={Colors.contentPlaceholder}
        customStyle={{ marginTop: 25, marginBottom: 20 }}
      >
        Popular Tags Near You
      </AppText>
      <View style={{ flex: 0, flexDirection: 'row', width: '100%', flexWrap: 'wrap' }}>
        {tags.map((item, index) => {
          return (
            <TouchableOpacity 
              key={index} 
              onPress={() => setTagsModal(!tagsModal)}
              style={styles.tagContainer}
            >
              <AppText textStyle="caption">{item}</AppText>
            </TouchableOpacity> 
          )
        })}
      </View>
      <Modal
        isVisible={tagsModal}
        animationIn="slideInRight"
        animationInTiming={300}
        animationOut="slideOutRight"
        animationOutTiming={300}
        onBackButtonPress={() => setTagsModal(false)}
        style={{
          margin: 0,
          backgroundColor: 'white',
          flexGrow: 1,
        }}
      >
        <View 
          style={{
            height: '100%',
          }}
        >
          <PaddingView paddingSize={2} style={{ paddingBottom: 0 }}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setTagsModal(false)}
                activeOpacity={0.7}
                style={{position: 'absolute', left: 0}}
              >
                <HeaderBackGray width={normalize(25)} height={normalize(25)} />
              </TouchableOpacity>
              <AppText textStyle="body3">Popular Tags Near You</AppText>
            </View>
          </PaddingView>
          <View 
            style={{ 
              borderBottomWidth: 1, 
              borderColor: Colors.neutralGray, 
              elevation: 3
            }}
          />
          <PaddingView paddingSize={2}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AppText textStyle="body2" color={Colors.contentPlaceholder}>Results for:</AppText> 
              <View style={[styles.tagContainer, { marginBottom: 0, backgroundColor: Colors.primaryCream }]}>
                <AppText textStyle="caption">Isopropyl alcohol</AppText>
              </View>
            </View>
          </PaddingView>
          <Posts
            type="dashboard"
            data={posts}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </View>
      </Modal>
    </View>
  )
};

export default Tags;

const styles = StyleSheet.create({
  modalHeader: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
    // backgroundColor: 'red'
  },
  tagContainer: {
    backgroundColor: Colors.neutralsZircon, 
    borderRadius: 50, 
    paddingVertical: 8, 
    paddingHorizontal: 10, 
    marginHorizontal: 4, 
    marginBottom: 10
  }
})