import { useState, useEffect, useCallback, useRef } from 'react';
import { STORAGE_KEYS, timerStorage } from '@/lib/utils/storage';

interface UseResendTimerOptions {
  durationSeconds?: number;
  autoStart?: boolean;
  onComplete?: () => void;
  timerKey?:
    | typeof STORAGE_KEYS.SIGNUP_RESEND_TIMER
    | typeof STORAGE_KEYS.RESET_PASSWORD_RESEND_TIMER;
}

export const useResendTimer = ({
  durationSeconds = 60,
  autoStart = false,
  onComplete,
  timerKey,
}: UseResendTimerOptions = {}) => {
  // time left in seconds for display
  const [timeLeft, setTimeLeft] = useState<number>(durationSeconds);
  // is timer running
  const [isRunning, setIsRunning] = useState<boolean>(false);
  // time when timer expires
  const expiresAtRef = useRef<number | null>(null);
  // interval ref for setInterval
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // clear timer from async storage
  const clearTimerFromStorage = useCallback(async () => {
    if (!timerKey) return;
    try {
      await timerStorage.clearTimer(timerKey);
    } catch (err) {
      console.error('Error clearing timer state:', err);
    }
  }, [timerKey]);

  // save timer to async storage
  const saveTimerToStorage = useCallback(
    async (expiresAt: number) => {
      if (!timerKey) return;
      try {
        await timerStorage.setTimer(timerKey, {
          expiresAt,
          durationSeconds,
        });
      } catch (err) {
        console.error('Error saving timer state:', err);
      }
    },
    [timerKey, durationSeconds]
  );

  // timer tick
  const onTimerTick = useCallback(() => {
    if (expiresAtRef.current == null) {
      return;
    }
    const now = Date.now();
    const diffMs = expiresAtRef.current - now;
    if (diffMs <= 0) {
      // timer expired
      setTimeLeft(0);
      setIsRunning(false);
      expiresAtRef.current = null;
      clearInterval(intervalRef.current!);
      intervalRef.current = null;
      clearTimerFromStorage();
      onComplete?.();
    } else {
      // update seconds
      const secsLeft = Math.ceil(diffMs / 1000);
      setTimeLeft(secsLeft);
    }
  }, [onComplete, clearTimerFromStorage]);

  const startTimerInternal = useCallback(
    (expiresAt: number) => {
      // Clear any previous interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      expiresAtRef.current = expiresAt;
      setIsRunning(true);
      onTimerTick(); // immediately update
      intervalRef.current = setInterval(() => {
        onTimerTick();
      }, 1000);
    },
    [onTimerTick]
  );

  const startResendTimer = useCallback(() => {
    const now = Date.now();
    const expiresAt = now + durationSeconds * 1000;
    saveTimerToStorage(expiresAt);
    setTimeLeft(durationSeconds);
    startTimerInternal(expiresAt);
  }, [durationSeconds, saveTimerToStorage, startTimerInternal]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    expiresAtRef.current = null;
    setIsRunning(false);
    setTimeLeft(durationSeconds);
    clearTimerFromStorage();
  }, [durationSeconds, clearTimerFromStorage]);

  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  const loadTimerFromStorage = useCallback(async () => {
    try {
      if (!timerKey) {
        return;
      }

      const saved = await timerStorage.getTimer(timerKey);
      if (saved && saved.expiresAt) {
        const now = Date.now();
        const diffMs = saved.expiresAt - now;
        if (diffMs > 0) {
          const secsLeft = Math.ceil(diffMs / 1000);
          setTimeLeft(secsLeft);
          startTimerInternal(saved.expiresAt);
        } else {
          await timerStorage.clearTimer(timerKey);
          if (autoStart) {
            startResendTimer();
          }
        }
      } else {
        // no saved => maybe autoStart
        if (autoStart) {
          startResendTimer();
        }
      }
    } catch (err) {
      console.error('Error loading timer state:', err);
    }
  }, [timerKey, autoStart, startResendTimer, startTimerInternal]);

  // On mount: load existing state
  useEffect(() => {
    loadTimerFromStorage();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [loadTimerFromStorage]);

  const canResend = !isRunning;

  return {
    timeLeft,
    isRunning,
    canResend,
    startResendTimer,
    stopTimer,
    formatTime,
  };
};
