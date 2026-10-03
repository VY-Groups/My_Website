---
name: DevOps Cloud Portfolio
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#958ea0'
  outline-variant: '#494454'
  surface-tint: '#d0bcff'
  primary: '#d0bcff'
  on-primary: '#3c0091'
  primary-container: '#a078ff'
  on-primary-container: '#340080'
  inverse-primary: '#6d3bd7'
  secondary: '#ddb7ff'
  on-secondary: '#490080'
  secondary-container: '#6f00be'
  on-secondary-container: '#d6a9ff'
  tertiary: '#c3c6d4'
  on-tertiary: '#2c303b'
  tertiary-container: '#8d909e'
  on-tertiary-container: '#262934'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb7ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6900b3'
  tertiary-fixed: '#dfe2f1'
  tertiary-fixed-dim: '#c3c6d4'
  on-tertiary-fixed: '#171b26'
  on-tertiary-fixed-variant: '#434652'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 3rem
---

## Brand & Style

This design system establishes a high-performance, immersive aesthetic tailored for modern DevOps engineering portfolios and cloud infrastructure enterprises. The personality is authoritative, precise, cutting-edge, and reliable. It evokes a sense of deep technological mastery, infinite scale, and meticulous system architecture.

The visual style merges **Glassmorphism** with a **Dark-Mode Minimalist** foundation. It features deep navy void backgrounds, semi-transparent frosted cards with subtle luminous borders, and vibrant violet-to-purple glowing accents that symbolize connectivity and active execution paths.

## Colors

The color palette is anchored by a profound deep navy canvas (`#0b0f19`) that creates infinite depth and reduces eye strain in developer-focused environments. Luminous violet (`#8b5cf6`) and electric purple (`#a855f7`) serve as the primary and secondary accents for interactive states, glowing borders, and key data highlights. Neutrals range from stark white for primary headings to muted slate (`#94a3b8`) for secondary body text and metadata.

## Typography

Typography balances geometric modernism for headings with extreme legibility for body text and code-informed mono labels for technical metadata. Font sizes scale down gracefully on mobile viewports to prevent awkward wrapping of critical infrastructure metrics.

## Layout & Spacing

Utilizes a responsive **Fluid Grid** system tailored for dashboard-class layouts and editorial portfolio storytelling. Content containers sit within max-width boundaries with generous outer canvas margins (`2rem` desktop, `1rem` mobile). Vertical rhythm relies on a consistent 8px base spacing scale, ensuring comfortable breathing room inside dense glassmorphic panels.

## Elevation & Depth

Depth is communicated primarily through **Glassmorphism and low-contrast ghost borders**. Surfaces use semi-transparent dark navy fills (`rgba(11, 15, 25, 0.75)`) layered over subtle background grid graphics or gradient glows. Borders are hairline strokes featuring gradient opacity (transitioning from violet to transparent) to create a luminous edge effect without heavy drop shadows. Ambient glows are restricted to active states, primary call-to-action buttons, and focused step indicators.

## Shapes

Adopt a balanced **Rounded** shape language (`roundedness` level 2). Cards, input fields, and interactive containers feature a 0.5rem (8px) border radius, giving them a modern software-native feel. Pill-shaped badges and buttons use full rounding (`9999px`) to cleanly encapsulate tech stack tags and status indicators.

## Components

### Buttons
Primary actions feature vibrant violet-to-purple gradient backgrounds with subtle outer box-shadow glows on hover. Secondary and ghost actions utilize translucent dark fills with thin, low-opacity violet borders and smooth color transitions.

### Chips & Badges
Compact pill tags dedicated to skills and technologies feature ultra-low opacity purple/violet backgrounds, thin crisp borders, and monospaced or clean sans-serif text in light accent colors.

### Cards
Constructed with frosted glass surfaces (`backdrop-filter: blur(12px)`), dark translucent fills, and soft gradient borders. Cards house project details, service steps, or core metrics cleanly with internal padding matching `space-lg`.

### Input Fields & Forms
Dark-mode native inputs with deep navy fills, subtle inset shadows, and focused violet rings (`#8b5cf6`). Placeholder text is styled in muted slate for optimal contrast.

### Lists & Steps
Numbered progression steps (e.g., 01, 02, 03) are anchored in glowing circular nodes connected by faint gradient horizontal layout lines, visualizing sequential execution pipelines clearly.