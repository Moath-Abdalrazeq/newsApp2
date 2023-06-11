import React from 'react';
import {View,   Text} from 'react-native';

const Header = (props) => {
  return (
    <View  >
      <Text  style={{fontSize:35, fontWeight:'bold' , color:'white'}}  >{props.name}</Text>
    </View>
  );
}

 
export default Header;
