import React, { useState } from 'react';
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-controller';
import { LayoutChangeEvent } from 'react-native';
import { useGlobalScrollHandler } from '@/lib/hooks/useGlobalScrollHandler';

const KeyboardScrollView = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
} & KeyboardAwareScrollViewProps) => {
  const [contentHeight, setContentHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const scrollHandler = useGlobalScrollHandler();

  const handleContentSizeChange = (contentWidth: number, contentHeight: number) => {
    setContentHeight(contentHeight);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerHeight(event.nativeEvent.layout.height);
  };

  // Enable scroll only if content is larger than container
  const shouldScroll = contentHeight > containerHeight;

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      bottomOffset={162}
      scrollEventThrottle={1}
      className={className}
      scrollEnabled={shouldScroll}
      onContentSizeChange={handleContentSizeChange}
      onLayout={handleLayout}
      onScroll={scrollHandler}
      {...props}>
      {children}
    </KeyboardAwareScrollView>
  );
};

export default KeyboardScrollView;
