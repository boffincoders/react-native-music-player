import React, {useRef, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Easing,
  Dimensions,
  Animated,
  FlatList,
  Button,
} from 'react-native';
import TrackPlayer, {
  usePlaybackState,
  TrackPlayerEvents,
} from 'react-native-track-player';
import songs from '../utils/data';
import Controller from '../utils/Controller';
import SliderComp from '../components/SliderComp';
import {PLAYBACK_TRACK_CHANGED} from 'react-native-track-player/lib/eventTypes';
import Entypo from 'react-native-vector-icons/Entypo';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import PlayerScreen from './PlayerScreen';
const {width, height} = Dimensions.get('window');
const TRACK_PLAYER_CONTROLS_OPTS = {
  waitforBuffer: true,
  stopWithApp: false,
  alwaysPauseOnInterruption: true,
  capabilities: [
    TrackPlayer.CAPABILITY_PLAY,
    TrackPlayer.CAPABILITY_PAUSE,
    TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
    TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
    TrackPlayer.CAPABILITY_SEEK_TO,
  ],
  compactCapabilities: [
    TrackPlayer.CAPABILITY_PLAY,
    TrackPlayer.CAPABILITY_PAUSE,
    TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
    TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
  ],
};
const PlayList = () => {
  const [isTrackPlayerInit, setIsTrackPlayerInit] = useState(false);
  const [spinAnim] = useState(new Animated.Value(0));
  const [songIndex, setSongIndex] = useState();
  const slider = useRef(null);
  const [playCd, setPlayCd] = useState('0deg');
  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', playCd],
  });

  const index = useRef(0);
  const isPlaying = useRef('paused');
  const playbackState = usePlaybackState();
  const trackPlayerInit = async () => {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.add(songs);
    return true;
  };
  useEffect(() => {
    const startPlayer = async () => {
      let isInit = await trackPlayerInit();
      setIsTrackPlayerInit(isInit);
    };
    startPlayer();
  }, []);
  const bottomSheetRef = useRef(null);
  const onSongPlay = async (songId, index) => {
    bottomSheetRef.current.open();
    setSongIndex(index);
    TrackPlayer.play();
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
    if (songId) {
      TrackPlayer.skip(songId)
        .then(_ => {
          console.log('changed track');
        })
        .catch(e => console.log('error in changing track ', e));
    }
    isPlayerReady.current = true;
    await TrackPlayer.updateOptions(TRACK_PLAYER_CONTROLS_OPTS);
    TrackPlayer.skip(songId)
      .then(_ => {
        console.log('changed track alone');
      })
      .catch(e => console.log('error in changing track ', e));

    // TrackPlayer.skip(songId)
    //   .then(_ => {
    //     console.log('changed track with Id');
    //   })
    //   .catch(e => console.log('error in changing track ', e));
  };

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
        ref={slider}
        data={songs}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              onPress={() => onSongPlay(item.id, index)}
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
      <RBSheet
        ref={bottomSheetRef}
        height={400}
        openDuration={200}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingVertical: 20,
            backgroundColor: 'white',
            justifyContent: 'space-around',
            alignItems: 'center',
          },
        }}>
        <Animated.Image
          style={{
            height: 150,
            width: 150,
            borderRadius: 100,
            transform: [{rotate: spin}],
          }}
          source={songs[songIndex]?.artwork}
        />
        <View>
          <Text style={styles.title}>{songs[songIndex]?.title}</Text>
          <Text style={styles.artist}>{songs[songIndex]?.artist}</Text>
        </View>
        <SliderComp />
        <Controller
          onNext={goNext}
          onPrv={goPrv}
          cdController={{playCd, setPlayCd}}
        />
      </RBSheet>
    </View>
  );
};
export default PlayList;

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: '600',
    textTransform: 'capitalize',
    color: 'black',
  },
  artist: {
    fontSize: 18,
    textAlign: 'center',
    color: 'black',
    textTransform: 'capitalize',
  },
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    backgroundColor: 'black',
    // maxHeight: 600,
  },
});
