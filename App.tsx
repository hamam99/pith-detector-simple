/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  ToastAndroid,
} from 'react-native';
import {PERMISSIONS, request} from 'react-native-permissions';
import {PitchDetector} from 'react-native-pitch-detector';
function App(): JSX.Element {
  const [note, setNotes] = useState({
    frequency: '',
    tone: '',
  });
  const [isRecording, setRecoding] = useState(false);

  const checkPermission = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
        if (response !== 'granted') {
          return reject('Permission not granted');
        }
        return resolve('Permission granted');
      } catch (err) {
        return reject('Something went wrong');
      }
    });
  };

  const onRecord = async () => {
    if (isRecording) {
      setRecoding(false);
      await PitchDetector.stop(); // Promise<void>
      return;
    }

    await PitchDetector.start();
    setRecoding(true);
  };

  const doOnPress = async () => {
    try {
      await checkPermission();
      await onRecord();
    } catch (err) {
      ToastAndroid.show(err || 'Something went wrong', ToastAndroid.SHORT);
      console.log(`err`, err);
    }
  };

  useEffect(() => {
    if (isRecording) {
      PitchDetector.addListener(item => {
        console.log(`PitchDetector`, {item});
        setNotes({
          frequency: item?.frequency,
          tone: item?.tone,
        });
      });
    } else {
      PitchDetector.removeListener();
    }
  }, [isRecording]);

  return (
    <SafeAreaView
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      }}>
      <Text style={{width: 250, textAlign: 'left'}}>
        Frequency : {note?.frequency}
      </Text>
      <Text style={{width: 250, textAlign: 'left'}}>Tone: {note?.tone}</Text>
      <Button title={isRecording ? 'Stop' : 'Start'} onPress={doOnPress} />
    </SafeAreaView>
  );
}

export default App;
