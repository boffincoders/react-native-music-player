import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  Easing,
  Dimensions,
  Animated,
  StyleSheet,
} from 'react-native';
import TrackPlayer, {
  usePlaybackState,
  TrackPlayerEvents,
} from 'react-native-track-player';
import songs from '../utils/data';
import Controller from '../utils/Controller';
import SliderComp from '../components/SliderComp';
import {PLAYBACK_TRACK_CHANGED} from 'react-native-track-player/lib/eventTypes';
const {width, height} = Dimensions.get('window');
// const events = [
//   TrackPlayerEvents.PLAYBACK_STATE,
//   TrackPlayerEvents.PLAYBACK_ERROR
// ];

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

export default function PlayerScreen() {
  let rotateValueHolder = new Animated.Value(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slider = useRef(null);
  const isPlayerReady = useRef(false);
  const index = useRef(0);
  const [songIndex, setSongIndex] = useState(0);
  const isItFromUser = useRef(true);
  const position = useRef(Animated.divide(scrollX, width)).current;
  const [playCd, setPlayCd] = useState('0deg');
  const playbackState = usePlaybackState();
  const [spinAnim] = useState(new Animated.Value(0));
  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', playCd],
  });
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
    scrollX.addListener(
      ({value}) => {
        const val = Math.round(value / width);
        setSongIndex(val);
      },
      [rotateValueHolder],
    );
    TrackPlayer.setupPlayer().then(async () => {
      console.log('Player ready');
      await TrackPlayer.reset();
      await TrackPlayer.add(songs);
      TrackPlayer.play();
      isPlayerReady.current = true;
      await TrackPlayer.updateOptions(TRACK_PLAYER_CONTROLS_OPTS);
      //add listener on track change
      TrackPlayer.addEventListener(PLAYBACK_TRACK_CHANGED, async e => {
        console.log('song ended', e);
        const trackId = (await TrackPlayer.getCurrentTrack()) - 1; //get the current id
        console.log('track id', trackId, 'index', index.current);
        if (trackId !== index.current) {
          setSongIndex(trackId);
          isItFromUser.current = false;
          if (trackId > index.current) {
            goNext();
          } else {
            goPrv();
          }
          setTimeout(() => {
            isItFromUser.current = true;
          }, 200);
        }

        // isPlayerReady.current = true;
      });

      // monitor intterupt when other apps start playing music
      TrackPlayer.addEventListener(TrackPlayerEvents.REMOTE_DUCK, e => {
        // console.log(e);
        if (e.paused) {
          // if pause true we need to pause the music
          TrackPlayer.pause();
        } else {
          TrackPlayer.play();
        }
      });
    });

    return () => {
      scrollX.removeAllListeners();
      TrackPlayer.destroy();

      // exitPlayer();
    };
  }, [scrollX]);

  // change the song when index changes
  useEffect(() => {
    if (isPlayerReady.current && isItFromUser.current) {
      TrackPlayer.skip(songs[songIndex].id)
        .then(_ => {
          console.log('changed track');
        })
        .catch(e => console.log('error in changing track ', e));
    }
    index.current = songIndex;
  }, [songIndex]);

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
  const renderItem = ({index, item}) => {
    return (
      <Animated.View
        style={{
          alignItems: 'center',
          width: width,
          transform: [
            {
              translateX: Animated.multiply(
                Animated.add(position, -index),
                -100,
              ),
            },
          ],
        }}>
        <Animated.Image
          style={{
            height: 150,
            width: 150,
            borderRadius: 100,
            transform: [{rotate: spin}],
          }}
          source={item?.artwork}
        />
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={slider}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        data={songs}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: true},
        )}
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
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: '600',
    textTransform: 'capitalize',
    color: '#ffffff',
  },
  artist: {
    fontSize: 18,
    textAlign: 'center',
    color: '#ffffff',
    textTransform: 'capitalize',
  },

  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'black',
    // maxHeight: 600,
  },
});
