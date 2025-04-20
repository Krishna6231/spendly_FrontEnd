import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable} from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Easing } from 'react-native-reanimated';
// import  HapticFeedback  from 'react-native-haptic-feedback';

interface FabProps {
  onAddExpense: () => void;
  onAddCategory: () => void;
  goToSettings: () => void;
}

const Fab: React.FC<FabProps> = ({ onAddExpense, onAddCategory, goToSettings }) => {
  const [expanded, setExpanded] = useState(false);
  const offset = useSharedValue(0);
  // const handleAction = (callback: () => void) => {
  //   callback(); // Call the action (navigate, open modal, etc.)
  //   setTimeout(() => toggleFab(), 100); // Collapse FAB slightly after
  // };
  
  const toggleFab = (nextExpanded?: boolean) => {
    const shouldExpand = typeof nextExpanded === 'boolean' ? nextExpanded : !expanded;
    setExpanded(shouldExpand);
    offset.value = withTiming(shouldExpand ? 1 : 0, {
      duration: 250,
      easing: Easing.out(Easing.ease), // gives a smooth feel
    });  };
  
  const handleAction = (callback: () => void) => {
    // HapticFeedback.trigger('impactLight');

    // 1. Immediately trigger the callback (navigation, modal, etc.)
    callback();
  
    // 2. Wait a tiny bit before collapsing (to let the UI start transitioning)
    setTimeout(() => {
      toggleFab(false); // Collapse FAB
    }, 300); // You can try 200 or 400 too
  };
  
  

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ translateY: -offset.value * 70 }],
    opacity: offset.value,
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateY: -offset.value * 140 }],
    opacity: offset.value,
  }));

  const animatedStyle3 = useAnimatedStyle(() => ({
    transform: [{ translateY: -offset.value * 210 }],
    opacity: offset.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.actionButtonContainer, animatedStyle3]}>
        <Pressable style={styles.fabItem} onPress={() => handleAction(goToSettings)}     android_ripple={{ color: 'transparent' }} // 🔥 disables ripple!
        >
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Settings</Text>
          </View>
          <View style={styles.circleIcon}>
            <Icon name="settings" size={24} color="#fff" />
          </View>
        </Pressable>
      </Animated.View>


      <Animated.View style={[styles.actionButtonContainer, animatedStyle2]}>
        <Pressable style={styles.fabItem} onPress={() => handleAction(onAddCategory)}     android_ripple={{ color: 'transparent' }} // 🔥 disables ripple!
        >
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Add Category</Text>
          </View>
          <View style={styles.circleIcon}>
            <Icon name="category" size={24} color="#fff" />
          </View>
        </Pressable>
      </Animated.View>


      <Animated.View style={[styles.actionButtonContainer, animatedStyle1]}>
        <Pressable style={styles.fabItem} onPress={() => handleAction(onAddExpense)}     android_ripple={{ color: 'transparent' }} // 🔥 disables ripple!
        >
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Add Expense</Text>
          </View>
          <View style={styles.circleIcon}>
            <Icon name="attach-money" size={24} color="#fff" />
          </View>
        </Pressable>
      </Animated.View>


      <Pressable
  style={styles.fab}
  onPress={() => toggleFab()} // ✅ explicitly calling with no argument
  android_ripple={{ color: 'transparent' }}
  android_disableSound={true}
>
  <Icon name={expanded ? 'keyboard-arrow-up' : 'add'} size={30} color="#fff" />
</Pressable>


    </View>
  );
};

export default Fab;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 25,
    right: 30,
    alignItems: 'flex-end',
    pointerEvents: 'box-none',
  },
  
  fab: {
    width: 60,
    height: 60,
    borderRadius: 32.5,
    backgroundColor: '#8e24aa',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 5,
  },
  actionButtonContainer: {
    position: 'absolute',
    right: -7,
    // paddingRight: 70, // pushes everything leftwards
  },

  fabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 20,
    paddingHorizontal: 10, // this helps on narrow screens
    minWidth: 200, // optional, for consistent sizing
    gap: 7,
  },


  labelContainer: {
    backgroundColor: '#000',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    elevation: 5,
    maxWidth: 200, // limit width
    flexShrink: 1,  // allow it to shrink as needed
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 4,
  },


  label: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    flexShrink: 1,
  },

  circleIcon: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#ec407a',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 5,
  },

});



