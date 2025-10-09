function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './providers/**/*.{js,ts,tsx}',
    './utils/**/*.{js,ts,tsx}',
    './screens/**/*.{js,ts,tsx}',
  ],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        'inter-light': ['Inter_300Light'],
        'inter-regular': ['Inter_400Regular'],
        'inter-medium': ['Inter_500Medium'],
        'inter-semibold': ['Inter_600SemiBold'],
        'inter-bold': ['Inter_700Bold'],
        'inter-extrabold': ['Inter_800ExtraBold'],
      },
      fontSize: {
        // Display sizes
        'display-large': ['57px', { lineHeight: '64px', letterSpacing: '-0.25px' }],
        'display-medium': ['45px', { lineHeight: '52px', letterSpacing: '0px' }],
        'display-small': ['36px', { lineHeight: '44px', letterSpacing: '0px' }],

        // Headline sizes
        'headline-large': ['32px', { lineHeight: '40px', letterSpacing: '0px' }],
        'headline-medium': ['28px', { lineHeight: '36px', letterSpacing: '0px' }],
        'headline-small': ['24px', { lineHeight: '32px', letterSpacing: '0px' }],

        // Title sizes
        'title-large': ['22px', { lineHeight: '28px', letterSpacing: '0px' }],
        'title-medium': ['16px', { lineHeight: '24px', letterSpacing: '0.15px' }],
        'title-small': ['14px', { lineHeight: '20px', letterSpacing: '0.1px' }],

        // Body sizes
        'body-large': ['16px', { lineHeight: '24px', letterSpacing: '0.5px' }],
        'body-medium': ['14px', { lineHeight: '20px', letterSpacing: '0.25px' }],
        'body-small': ['12px', { lineHeight: '16px', letterSpacing: '0.4px' }],

        // Label sizes
        'label-large': ['14px', { lineHeight: '20px', letterSpacing: '0.1px' }],
        'label-medium': ['12px', { lineHeight: '16px', letterSpacing: '0.5px' }],
        'label-small': ['11px', { lineHeight: '16px', letterSpacing: '0.5px' }],
      },
      colors: {
        primary: {
          DEFAULT: withOpacity('--color-primary'),
          50: withOpacity('--color-primary-50'),
          100: withOpacity('--color-primary-100'),
          200: withOpacity('--color-primary-200'),
          300: withOpacity('--color-primary-300'),
          400: withOpacity('--color-primary-400'),
          500: withOpacity('--color-primary-500'),
          600: withOpacity('--color-primary-600'),
          700: withOpacity('--color-primary-700'),
          800: withOpacity('--color-primary-800'),
          900: withOpacity('--color-primary-900'),
          950: withOpacity('--color-primary-950'),
        },

        background: {
          DEFAULT: withOpacity('--color-background'),
          300: withOpacity('--color-background-300'),
          400: withOpacity('--color-background-400'),
          500: withOpacity('--color-background-500'),
          600: withOpacity('--color-background-600'),
          700: withOpacity('--color-background-700'),
        },

        text: {
          DEFAULT: withOpacity('--color-text'),
          500: withOpacity('--color-text-500'),
          600: withOpacity('--color-text-600'),
          700: withOpacity('--color-text-700'),
        },

        error: {
          DEFAULT: withOpacity('--color-error'),
          50: withOpacity('--color-error-50'),
          100: withOpacity('--color-error-100'),
          200: withOpacity('--color-error-200'),
          300: withOpacity('--color-error-300'),
          400: withOpacity('--color-error-400'),
          500: withOpacity('--color-error-500'),
          600: withOpacity('--color-error-600'),
          700: withOpacity('--color-error-700'),
          800: withOpacity('--color-error-800'),
          900: withOpacity('--color-error-900'),
          950: withOpacity('--color-error-950'),
        },
      },
    },
  },
  plugins: [],
};
