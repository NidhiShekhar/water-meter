import React from 'react';
import { StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import Svg, { Circle, Rect, Mask } from 'react-native-svg';

export default function CameraOverlay() {
  return (
    <BlurView intensity={0} style={StyleSheet.absoluteFill}>
      <Svg style={StyleSheet.absoluteFill} height="100%" width="100%">
        <Mask id="circleMask">
          <Rect width="100%" height="100%" fill="white" />
          <Circle cx="50%" cy="50%" r="33%" fill="black" />
        </Mask>
        <Rect
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.6)"
          mask="url(#circleMask)"
        />
        <Rect
          x="20%"
          y="35%"
          width="60%"
          height="10%"
          fill="none"
          stroke="white"
          strokeWidth="2"
        />
      </Svg>
    </BlurView>
  );
}