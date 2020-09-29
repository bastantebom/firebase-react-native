import React from 'react';
import { Dimensions, View } from 'react-native';
import PropTypes from 'prop-types';
import { connectHighlight } from 'react-instantsearch-native';
import { AppText } from '@/components';

const { width } = Dimensions.get("window");

const Highlight = ({ attribute, hit, highlight }) => {

  const highlights = highlight({
    highlightProperty: '_highlightResult',
    attribute,
    hit,
  });

  return (
    <View style={{ flexWrap: 'wrap', flex: 0, flexDirection: 'row' }}>
      {highlights.map(({ value, isHighlighted }, index) => {
        return (
          <AppText 
            key={index} 
            textStyle={isHighlighted ? 'body3' : 'body2' } 
            // customStyle={{ backgroundColor: isHighlighted ? 'yellow' : 'transparent' }}
          >
            {value}
          </AppText>
        );
      })}
    </View>
  );
};

Highlight.propTypes = {
  attribute: PropTypes.string.isRequired,
  hit: PropTypes.object.isRequired,
  highlight: PropTypes.func.isRequired,
};

export default connectHighlight(Highlight);