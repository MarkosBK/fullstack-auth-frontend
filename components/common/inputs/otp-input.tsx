import React, { useRef, useState, useCallback } from 'react';
import { TextInput, View } from 'react-native';
import { cn } from '@/lib/utils/cn';
import { useTheme } from '@/stores/theme.store';
import { AppHaptics } from '@/lib/utils/haptics';

interface OTPInputProps {
  length?: number;
  value: string;
  onChangeText: (text: string) => void;
  onComplete?: (code: string) => void;
  isError?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChangeText,
  onComplete,
  isError = false,
  disabled = false,
  autoFocus = true,
  className,
}) => {
  const { themeColors } = useTheme();
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const onChangeCode = useCallback(
    (text: string, index: number) => {
      // If long text is pasted (e.g., from SMS)
      if (text.length > 1) {
        const newCodes = text.split('').slice(0, length);
        const paddedCodes = [...newCodes, ...Array(length - newCodes.length).fill('')];
        const newValueString = paddedCodes.join('');

        onChangeText(newValueString);

        // Focus on last filled field
        const lastFilledIndex = Math.min(newCodes.length - 1, length - 1);
        inputRefs.current[lastFilledIndex]?.focus();
        setFocusedIndex(lastFilledIndex);

        // If code is complete, call onComplete
        if (newValueString.length === length && onComplete) {
          onComplete(newValueString);
        }
        return;
      }

      // Regular single character input
      const newCodes = value.split('');
      newCodes[index] = text;
      const newValueString = newCodes.join('');

      onChangeText(newValueString);

      if (text !== '' && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
        setFocusedIndex(index + 1);
      }

      // If code is complete, call onComplete
      if (newValueString.length === length && onComplete) {
        AppHaptics.success();
        onComplete(newValueString);
      }
    },
    [value, onChangeText, length, onComplete]
  );

  const handleFocus = useCallback((index: number) => {
    setFocusedIndex(index);
    AppHaptics.selection();
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedIndex(null);
  }, []);

  const handleKeyPress = useCallback(
    (event: any, index: number) => {
      if (event.nativeEvent.key === 'Backspace') {
        AppHaptics.buttonPress();

        // If current field is filled, clear it
        if (value[index]) {
          const newCodes = value.split('');
          newCodes[index] = '';
          onChangeText(newCodes.join(''));
        } else if (index > 0) {
          // If current field is empty, move to previous and clear it
          const newCodes = value.split('');
          newCodes[index - 1] = '';
          onChangeText(newCodes.join(''));
          inputRefs.current[index - 1]?.focus();
          setFocusedIndex(index - 1);
        }
      }
    },
    [value, onChangeText]
  );

  return (
    <View className={cn('w-full', className)}>
      <View className="flex-row justify-center gap-2">
        {Array(length)
          .fill(0)
          .map((_, index) => {
            const digit = value[index] || '';
            const isFocused = focusedIndex === index;
            const hasError = !!isError;

            return (
              <TextInput
                key={index}
                autoComplete="one-time-code"
                enterKeyHint={index === length - 1 ? 'done' : 'next'}
                inputMode="numeric"
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                value={digit}
                onChangeText={(text) => onChangeCode(text, index)}
                onFocus={() => handleFocus(index)}
                onBlur={handleBlur}
                onKeyPress={(event) => handleKeyPress(event, index)}
                maxLength={index === 0 ? length : 1}
                caretHidden={true}
                editable={!disabled}
                autoFocus={autoFocus && index === 0}
                className={cn(
                  'max-w-16 flex-1 rounded-2xl border py-5 text-center text-xl font-bold leading-6',
                  'border-background-400 bg-background-300 text-text-500',
                  isFocused && 'border-primary-500 bg-primary-500/5',
                  hasError && 'border-error-500 bg-error-500/5',
                  disabled && 'opacity-50'
                )}
                style={{
                  borderColor: isFocused
                    ? themeColors['primary-500']
                    : hasError
                      ? themeColors['error-500']
                      : themeColors['background-400'],
                }}
              />
            );
          })}
      </View>

      {isError && (
        <View className="mt-3">
          <TextInput value="" style={{ opacity: 0, position: 'absolute' }} editable={false} />
        </View>
      )}
    </View>
  );
};

OTPInput.displayName = 'OTPInput';
