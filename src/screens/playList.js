import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import songs from '../utils/data';
import Entypo from 'react-native-vector-icons/Entypo';
import {useRef} from 'react/cjs/react.production.min';
import {useNavigation} from '@react-navigation/native';
const PlayList = () => {
  const slider = useRef(null);
  const [playCd, setPlayCd] = useState('0deg');
  const navigation = useNavigation();
  const goNext = async () => {
    slider.current.scrollToOffset({
      offset: (index.current + 1) * width,
    });
    await TrackPlayer.play();
  };
  const goPrv = async () => {
    slider.current.scrollToOffset({
      offset: (index.current - 1) * width,
    });
    await TrackPlayer.play();
  };
  return (
    <View style={{flex: 1, backgroundColor: 'black'}}>
      <Text
        style={{
          color: 'white',
          fontSize: 25,
          fontWeight: '700',
          textAlign: 'center',
          paddingVertical: 10,
        }}>
        Play List
      </Text>
      <FlatList
        data={songs}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('playground', {
                  onNext: goNext,
                  onPrv: goPrv,
                  cdController: {playCd, setPlayCd},
                })
              }
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  margin: 15,
                  width: '50%',
                  paddingHorizontal: 10,
                  alignItems: 'center',
                }}>
                <View>
                  <Image
                    source={item.artwork}
                    style={{height: 70, width: 70}}
                  />
                </View>
                <View
                  style={{
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                  }}>
                  <Text style={{color: 'white'}}>{item.title}</Text>
                  <Text style={{color: 'white'}}>{item.artist}</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Entypo
                  name="dots-three-vertical"
                  style={{color: 'white'}}
                  size={25}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};
export default PlayList;

const styles = StyleSheet.create({});
