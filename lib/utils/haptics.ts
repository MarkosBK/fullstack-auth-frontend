import * as Haptics from 'expo-haptics';

/**
 *
 * Usage scenarios:
 * - buttonPress: ordinary buttons, user actions
 * - importantAction: important actions (saving, sending)
 * - criticalAction: critical actions (deleting, exiting)
 * - success: successful operations (login, registration, saving)
 * - error: errors (validation, API, general errors)
 * - warning: warnings (not enough rights, restrictions)
 * - navigation: transitions between screens
 * - ui.toggle: toggles, checkboxes
 * - ui.swipe: swipes, gestures
 * - ui.longPress: long press
 * - ui.drag: dragging elements
 */
export const AppHaptics = {
  buttonPress: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },

  importantAction: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },

  criticalAction: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  },

  success: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },

  error: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  },

  warning: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  },

  selection: () => {
    Haptics.selectionAsync();
  },

  navigation: () => {
    Haptics.selectionAsync();
  },

  ui: {
    toggle: () => {
      Haptics.selectionAsync();
    },
    swipe: () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    longPress: () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    },
    drag: () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    },
  },
} as const;
