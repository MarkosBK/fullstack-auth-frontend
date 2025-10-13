import { cn } from '@/lib/utils/cn';
import { Text, TextProps } from 'react-native';


// Display - для больших заголовков экранов
export function DisplayLarge(props: TextProps & { className?: string }) {
  return (
    <Text
      {...props}
      className={cn('font-inter-extrabold text-[57px] leading-[64px] tracking-[-0.25px] text-text-500', props.className)}
    />
  );
}

export function DisplayMedium(props: TextProps & { className?: string }) {
  return (
    <Text
      {...props}
      className={cn('font-inter-extrabold text-[45px] leading-[52px] tracking-[0px] text-text-500', props.className)}
    />
  );
}

export function DisplaySmall(props: TextProps & { className?: string }) {
  return (
    <Text
      {...props}
      className={cn('font-inter-extrabold text-[36px] leading-[44px] tracking-[0px] text-text-500', props.className)}
    />
  );
}

// Headline - для заголовков секций
export function HeadlineLarge(props: TextProps & { className?: string }) {
  return (
    <Text
      {...props}
      className={cn('font-inter-bold text-[32px] leading-[40px] tracking-[0px] text-text-500', props.className)}
    />
  );
}

export function HeadlineMedium(props: TextProps & { className?: string }) {
  return (
    <Text
      {...props}
      className={cn('font-inter-bold text-[28px] leading-[36px] tracking-[0px] text-text-500', props.className)}
    />
  );
}

export function HeadlineSmall(props: TextProps & { className?: string }) {
  return (
    <Text
      {...props}
      className={cn('font-inter-bold text-[24px] leading-[32px] tracking-[0px] text-text-500', props.className)}
    />
  );
}

// Title - для подзаголовков
export function TitleLarge(props: TextProps & { className?: string }) {
  return (
    <Text
      {...props}
      className={cn('font-inter-semibold text-[22px] leading-[28px] tracking-[0px] text-text-500', props.className)}
    />
  );
}

export function TitleMedium(props: TextProps & { className?: string }) {
  return (
    <Text
      {...props}
      className={cn('font-inter-semibold text-[16px] leading-[24px] tracking-[0.15px] text-text-500', props.className)}
    />
  );
}

export function TitleSmall(props: TextProps & { className?: string }) {
  return (
    <Text
      {...props}
      className={cn('font-inter-semibold text-[14px] leading-[20px] tracking-[0.1px] text-text-500', props.className)}
    />
  );
}

// Body - для основного текста
export function BodyLarge(props: TextProps & { className?: string }) {
  return (
    <Text
      {...props}
      className={cn('font-inter-regular text-[16px] leading-[24px] tracking-[0.5px] text-text-500', props.className)}
    />
  );
}

export function BodyMedium(props: TextProps & { className?: string }) {
  return (
    <Text
      {...props}
      className={cn('font-inter-regular text-[14px] leading-[20px] tracking-[0.25px] text-text-500', props.className)}
    />
  );
}

export function BodySmall(props: TextProps & { className?: string }) {
  return (
    <Text
      {...props}
      className={cn('font-inter-regular text-[12px] leading-[16px] tracking-[0.4px] text-text-600', props.className)}
    />
  );
}

// Label - для кнопок и мелких элементов
export function LabelLarge(props: TextProps & { className?: string }) {
  return (
    <Text
      {...props}
      className={cn('font-inter-medium text-[14px] leading-[20px] tracking-[0.1px] text-text-500', props.className)}
    />
  );
}

export function LabelMedium(props: TextProps & { className?: string }) {
  return (
    <Text
      {...props}
      className={cn('font-inter-medium text-[12px] leading-[16px] tracking-[0.5px] text-text-500', props.className)}
    />
  );
}

export function LabelSmall(props: TextProps & { className?: string }) {
  return (
    <Text
      {...props}
      className={cn('font-inter-medium text-[11px] leading-[16px] tracking-[0.5px] text-text-600', props.className)}
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
