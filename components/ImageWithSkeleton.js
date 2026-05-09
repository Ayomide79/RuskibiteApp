import { useState } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import Skeleton from './Skeleton';

export default function ImageWithSkeleton({ source, style, ...props }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {!loaded && (
        <Skeleton width="100%" height="100%" style={StyleSheet.absoluteFill} />
      )}
      <Image
        source={source}
        style={[style, loaded ? styles.visible : styles.hidden]}
        onLoad={() => setLoaded(true)}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  visible: {
    opacity: 1,
  },
  hidden: {
    opacity: 0,
    position: 'absolute',
  },
});