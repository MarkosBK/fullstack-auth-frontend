import { cn } from '@/lib/utils/cn';
import { Text, TextProps } from 'react-native';

// Display - для больших заголовков экранов
export function DisplayLarge(props: TextProps & { className?: string }) {
  return (
    <Text
      {...props}
      className={cn('font-inter-extrabold text-display-large text-text-500', props.className)}
    />
  );
}

export function DisplayMedium(props: TextProps & { className?: string }) {
  return (
    <Text
      {...props}
      className={cn('font-inter-extrabold text-display-medium text-text-500', props.className)}
    />
  );
}

export function DisplaySmall(props: TextProps & { className?: string }) {
  return (
    <Text
      {...props}
      className={cn('font-inter-extrabold text-display-small text-text-500', props.className)}
    />
  );
}

// Headline - для заголовков секций
export function HeadlineLarge(props: TextProps & { className?: string }) {
  return (
    <Text
      {...props}
      className={cn('font-inter-bold text-headline-large text-text-500', props.className)}
    />
  );
}

export function HeadlineMedium(props: TextProps & { className?: string }) {
  return (
    <Text
      {...props}
      className={cn('font-inter-bold text-headline-medium text-text-500', props.className)}
    />
  );
}

export function HeadlineSmall(props: TextProps & { className?: string }) {
  return (
    <Text
      {...props}
      className={cn('font-inter-bold text-headline-small text-text-500', props.className)}
    />
  );
}

// Title - для подзаголовков
export function TitleLarge(props: TextProps & { className?: string }) {
  return (
    <Text
      {...props}
      className={cn('font-inter-semibold text-title-large text-text-500', props.className)}
    />
  );
}

export function TitleMedium(props: TextProps & { className?: string }) {
  return (
    <Text
      {...props}
      className={cn('font-inter-semibold text-title-medium text-text-500', props.className)}
    />
  );
}

export function TitleSmall(props: TextProps & { className?: string }) {
  return (
    <Text
      {...props}
      className={cn('font-inter-semibold text-title-small text-text-500', props.className)}
    />
  );
}

// Body - для основного текста
export function BodyLarge(props: TextProps & { className?: string }) {
  return (
    <Text
      {...props}
      className={cn('font-inter-regular text-body-large text-text-500', props.className)}
    />
  );
}

export function BodyMedium(props: TextProps & { className?: string }) {
  return (
    <Text
      {...props}
      className={cn('font-inter-regular text-body-medium text-text-500', props.className)}
    />
  );
}

export function BodySmall(props: TextProps & { className?: string }) {
  return (
    <Text
      {...props}
      className={cn('font-inter-regular text-body-small text-text-600', props.className)}
    />
  );
}

// Label - для кнопок и мелких элементов
export function LabelLarge(props: TextProps & { className?: string }) {
  return (
    <Text
      {...props}
      className={cn('font-inter-medium text-label-large text-text-500', props.className)}
    />
  );
}

export function LabelMedium(props: TextProps & { className?: string }) {
  return (
    <Text
      {...props}
      className={cn('font-inter-medium text-label-medium text-text-500', props.className)}
    />
  );
}

export function LabelSmall(props: TextProps & { className?: string }) {
  return (
    <Text
      {...props}
      className={cn('font-inter-medium text-label-small text-text-600', props.className)}
    />
  );
}

// Legacy компоненты для обратной совместимости
export function Title(props: TextProps & { className?: string }) {
  return <HeadlineLarge {...props} />;
}

export function Subtitle(props: TextProps & { className?: string }) {
  return <TitleLarge {...props} />;
}

export function BodyText(props: TextProps & { className?: string }) {
  return <BodyMedium {...props} />;
}

export function ButtonText(props: TextProps & { className?: string }) {
  return <LabelLarge {...props} className={cn('uppercase', props.className)} />;
}

export function Caption(props: TextProps & { className?: string }) {
  return <LabelSmall {...props} className={cn('text-text-700', props.className)} />;
}
