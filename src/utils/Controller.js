import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TrackPlayer, {usePlaybackState} from 'react-native-track-player';
export default function Controller({onNext, onPrv, cdController}) {
  const playbackState = usePlaybackState();
  const isPlaying = useRef('paused'); //paused play loading
  useEffect(() => {
    //set the player state
    if (playbackState === 'playing' || playbackState === 3) {
      isPlaying.current = 'playing';
      cdController.setPlayCd('360deg');
    } else if (playbackState === 'paused' || playbackState === 2) {
      isPlaying.current = 'paused';
      cdController.setPlayCd('0deg');
    } else {
      isPlaying.current = 'loading';
    }
  }, [playbackState]);
  const returnPlayBtn = () => {
    switch (isPlaying.current) {
      case 'playing':
        return <Icon color="black" name="pause" size={45} />;
      case 'paused':
        return <Icon color="black" name="play-arrow" size={45} />;
      default:
        return <ActivityIndicator size={45} color="black" />;
    }
  };

  const onPlayPause = () => {
    if (isPlaying.current === 'playing') {
      TrackPlayer.pause();
    } else if (isPlaying.current === 'paused') {
      TrackPlayer.play();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPrv}>
        <Icon color="black" name="skip-previous" size={45} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onPlayPause}>
        {returnPlayBtn()}
      </TouchableOpacity>
      <TouchableOpacity onPress={onNext}>
        <Icon color="black" name="skip-next" size={45} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 250,
  },
});
