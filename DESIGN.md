# Naija360 Design System

**Brand Identity**: Nigerian news and social platform combining editorial credibility with modern social engagement.

**Design Philosophy**: Blend of The Verge's bold, tech-forward aesthetic with WIRED's editorial density and readability, infused with Nigerian cultural identity through green and amber accents.

---

## 1. Visual Theme & Atmosphere

### Overall Mood
- **Editorial Authority**: Professional journalism meets social media engagement
- **Nigerian Pride**: Green (#008751) as primary brand color representing Nigerian flag
- **Modern & Bold**: Tech-forward, attention-grabbing headlines and cards
- **Dense Information**: News-rich layout optimized for content consumption
- **Dark-First**: Primary experience in dark mode with excellent light mode support

### Design Density
- **High Information Density**: Multiple articles visible above fold
- **Scannable Headlines**: Large, bold typography for quick scanning
- **Card-Based Layout**: Instagram-style feed with clear article boundaries
- **Breathing Room**: Strategic whitespace between content blocks

### Atmosphere Keywords
Modern • Editorial • Bold • Nigerian • Social • Trustworthy • Fast • Engaging

---

## 2. Color Palette & Roles

### Brand Colors

| Color Name | Hex | RGB | Role |
|------------|-----|-----|------|
| **Nigerian Green** | `#008751` | `0, 135, 81` | Primary brand, CTAs, active states, links |
| **Amber Accent** | `#F59E0B` | `245, 158, 11` | Secondary actions, highlights, crypto/stocks indicators |
| **Deep Forest** | `#006B3F` | `0, 107, 63` | Hover states for green elements |
| **Warm Amber** | `#D97706` | `217, 119, 6` | Hover states for amber elements |

### Dark Mode (Primary)

| Color Name | Hex | RGB | Role |
|------------|-----|-----|------|
| **Void Black** | `#000000` | `0, 0, 0` | Page background |
| **Charcoal** | `#0A0A0A` | `10, 10, 10` | Card backgrounds |
| **Slate** | `#1A1A1A` | `26, 26, 26` | Elevated surfaces, modals |
| **Border Gray** | `#2A2A2A` | `42, 42, 42` | Subtle borders, dividers |
| **Text Primary** | `#FFFFFF` | `255, 255, 255` | Headlines, primary text |
| **Text Secondary** | `#A3A3A3` | `163, 163, 163` | Body text, metadata |
| **Text Tertiary** | `#737373` | `115, 115, 115` | Timestamps, auxiliary info |

### Light Mode

| Color Name | Hex | RGB | Role |
|------------|-----|-----|------|
| **Paper White** | `#FFFFFF` | `255, 255, 255` | Page background |
| **Cream** | `#FAFAFA` | `250, 250, 250` | Card backgrounds |
| **Light Gray** | `#F5F5F5` | `245, 245, 245` | Elevated surfaces |
| **Border Light** | `#E5E5E5` | `229, 229, 229` | Borders, dividers |
| **Text Primary** | `#0A0A0A` | `10, 10, 10` | Headlines, primary text |
| **Text Secondary** | `#525252` | `82, 82, 82` | Body text, metadata |
| **Text Tertiary** | `#A3A3A3` | `163, 163, 163` | Timestamps, auxiliary info |

### Semantic Colors

| Color Name | Hex | Role |
|------------|-----|------|
| **Success Green** | `#10B981` | Success states, positive indicators |
| **Warning Amber** | `#F59E0B` | Warnings, attention needed |
| **Error Red** | `#EF4444` | Errors, destructive actions |
| **Info Blue** | `#3B82F6` | Information, neutral highlights |

### Category Colors (for content tagging)

| Category | Hex | Usage |
|----------|-----|-------|
| **News** | `#008751` | General Nigerian news |
| **Crypto** | `#F59E0B` | Cryptocurrency content |
| **Entertainment** | `#EC4899` | Entertainment news |
| **Stocks** | `#8B5CF6` | Stock market, finance |

---

## 3. Typography Rules

### Font Families

**Display/Headlines**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `sans-serif`
- Weight: 700-900 (Bold to Black)
- Used for: Article headlines, section titles, hero text

**Body/Reading**: `Georgia`, `"Times New Roman"`, `serif`
- Weight: 400-500 (Regular to Medium)
- Used for: Article body text, long-form content

**UI/Interface**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `sans-serif`
- Weight: 400-600 (Regular to Semibold)
- Used for: Buttons, navigation, metadata, UI elements

**Monospace**: `"JetBrains Mono"`, `"Fira Code"`, `Consolas`, `monospace`
- Weight: 400
- Used for: Code snippets, technical data

### Type Scale

| Element | Font | Size | Weight | Line Height | Letter Spacing |
|---------|------|------|--------|-------------|----------------|
| **Hero Headline** | Inter | 48px / 3rem | 900 | 1.1 | -0.02em |
| **Article Headline** | Inter | 32px / 2rem | 800 | 1.2 | -0.01em |
| **Card Headline** | Inter | 20px / 1.25rem | 700 | 1.3 | -0.01em |
| **Section Title** | Inter | 24px / 1.5rem | 700 | 1.3 | 0 |
| **Body Large** | Georgia | 18px / 1.125rem | 400 | 1.7 | 0 |
| **Body Regular** | Georgia | 16px / 1rem | 400 | 1.6 | 0 |
| **UI Text** | Inter | 14px / 0.875rem | 500 | 1.5 | 0 |
| **Metadata** | Inter | 13px / 0.8125rem | 500 | 1.4 | 0 |
| **Caption** | Inter | 12px / 0.75rem | 400 | 1.4 | 0.01em |

### Typography Rules
- Headlines: Always Inter, bold weights, tight line-height
- Article body: Always Georgia serif for readability
- UI elements: Always Inter for consistency
- Never use pure black (#000) for text in light mode - use #0A0A0A
- Maintain 4.5:1 contrast ratio minimum for body text
- Use -0.01em to -0.02em letter-spacing for large headlines

---

## 4. Component Stylings

### Buttons

#### Primary Button (Nigerian Green)
```
Background: #008751
Text: #FFFFFF
Font: Inter, 14px, weight 600
Padding: 12px 24px
Border-radius: 8px
Transition: all 150ms ease

Hover:
  Background: #006B3F
  Transform: translateY(-1px)
  Shadow: 0 4px 12px rgba(0, 135, 81, 0.3)

Active:
  Transform: translateY(0)
  Shadow: 0 2px 4px rgba(0, 135, 81, 0.2)

Disabled:
  Background: #2A2A2A (dark) / #E5E5E5 (light)
  Text: #737373
  Cursor: not-allowed
```

#### Secondary Button (Amber)
```
Background: #F59E0B
Text: #000000
Font: Inter, 14px, weight 600
Padding: 12px 24px
Border-radius: 8px

Hover:
  Background: #D97706
```

#### Ghost Button
```
Background: transparent
Text: #FFFFFF (dark) / #0A0A0A (light)
Border: 1px solid #2A2A2A (dark) / #E5E5E5 (light)
Padding: 12px 24px
Border-radius: 8px

Hover:
  Background: #1A1A1A (dark) / #F5F5F5 (light)
  Border-color: #008751
```

#### Icon Button
```
Size: 40px × 40px
Background: transparent
Border-radius: 8px

Hover:
  Background: #1A1A1A (dark) / #F5F5F5 (light)
```

### Cards (Article Cards)

#### Standard Article Card
```
Background: #0A0A0A (dark) / #FFFFFF (light)
Border: 1px solid #2A2A2A (dark) / #E5E5E5 (light)
Border-radius: 12px
Padding: 16px
Transition: all 200ms ease

Hover:
  Border-color: #008751
  Transform: translateY(-2px)
  Shadow: 0 8px 24px rgba(0, 0, 0, 0.4) (dark)
         0 8px 24px rgba(0, 0, 0, 0.1) (light)

Structure:
  - Featured image (16:9 aspect ratio, rounded-lg)
  - Category badge (top-left on image)
  - Headline (20px, Inter 700)
  - Excerpt (14px, Georgia 400, 2 lines max)
  - Metadata row (author, time, engagement)
  - Action bar (like, comment, share icons)
```

#### Featured Article Card (Hero)
```
Same as standard but:
  - Larger image (21:9 aspect ratio)
  - Headline: 32px, Inter 800
  - Excerpt: 16px, 3 lines max
  - Padding: 24px
```

### Inputs

#### Text Input
```
Background: #1A1A1A (dark) / #FFFFFF (light)
Border: 1px solid #2A2A2A (dark) / #E5E5E5 (light)
Border-radius: 8px
Padding: 12px 16px
Font: Inter, 14px, weight 400
Text: #FFFFFF (dark) / #0A0A0A (light)

Focus:
  Border-color: #008751
  Outline: 2px solid rgba(0, 135, 81, 0.2)
  Outline-offset: 2px

Error:
  Border-color: #EF4444
  Outline: 2px solid rgba(239, 68, 68, 0.2)
```

### Navigation

#### Header
```
Background: rgba(0, 0, 0, 0.8) (dark) / rgba(255, 255, 255, 0.8) (light)
Backdrop-filter: blur(12px)
Height: 64px
Border-bottom: 1px solid #2A2A2A (dark) / #E5E5E5 (light)
Position: sticky top-0
Z-index: 50

Logo:
  - "360" badge: 32px circle, #008751 background
  - "Naija360" text: Inter 700, 20px

Nav Links:
  Font: Inter, 14px, weight 500
  Color: #A3A3A3 (inactive)
  Hover: #008751
  Active: #008751 with underline
```

#### Category Pills
```
Background: transparent
Border: 1px solid #2A2A2A (dark) / #E5E5E5 (light)
Border-radius: 20px (full pill)
Padding: 8px 16px
Font: Inter, 13px, weight 500

Active:
  Background: #008751
  Border-color: #008751
  Text: #FFFFFF
```

### Engagement Elements

#### Like Button
```
Icon: Heart (lucide-react)
Size: 20px
Color: #737373 (inactive)

Active:
  Color: #EF4444 (red)
  Animation: scale bounce

Count:
  Font: Inter, 13px, weight 500
  Color: #A3A3A3
```

#### Comment Button
```
Icon: MessageCircle
Size: 20px
Color: #737373

Hover:
  Color: #008751
```

#### Share Button
```
Icon: Share2
Size: 20px
Color: #737373

Hover:
  Color: #F59E0B
```

### Badges

#### Category Badge
```
Background: Category color (see Category Colors)
Text: #FFFFFF
Font: Inter, 11px, weight 600, uppercase
Padding: 4px 8px
Border-radius: 4px
Letter-spacing: 0.05em
```

### Modals

```
Background: #1A1A1A (dark) / #FFFFFF (light)
Border-radius: 16px
Padding: 24px
Max-width: 600px
Shadow: 0 20px 60px rgba(0, 0, 0, 0.6) (dark)
        0 20px 60px rgba(0, 0, 0, 0.2) (light)

Overlay:
  Background: rgba(0, 0, 0, 0.8) (dark)
              rgba(0, 0, 0, 0.4) (light)
  Backdrop-filter: blur(4px)
```

---

## 5. Layout Principles

### Spacing Scale (Tailwind-based)
```
4px   (1)  - Tight spacing, icon gaps
8px   (2)  - Small gaps, inline elements
12px  (3)  - Default gap between related items
16px  (4)  - Card padding, section gaps
24px  (6)  - Large gaps, section padding
32px  (8)  - Major section spacing
48px  (12) - Hero section padding
64px  (16) - Page section dividers
```

### Grid System

#### Desktop (1280px+)
```
Container: max-width 1280px, centered
Columns: 3 columns for article grid
Gap: 24px
Padding: 32px horizontal
```

#### Tablet (768px - 1279px)
```
Container: max-width 100%, padding 24px
Columns: 2 columns for article grid
Gap: 16px
```

#### Mobile (< 768px)
```
Container: max-width 100%, padding 16px
Columns: 1 column (stack)
Gap: 16px
```

### Content Width
- **Reading width**: 680px max (for article body)
- **Feed width**: 1280px max (for card grid)
- **Full width**: Hero sections, images

### Whitespace Philosophy
- **Generous vertical spacing**: 48px-64px between major sections
- **Tight horizontal spacing**: Keep related content close
- **Breathing room in cards**: 16px padding minimum
- **Dense information**: Maximize content above fold without cramping

---

## 6. Depth & Elevation

### Shadow System

#### Level 0 (Flat)
```
box-shadow: none
Usage: Default state, inline elements
```

#### Level 1 (Subtle)
```
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) (dark)
            0 1px 3px rgba(0, 0, 0, 0.1) (light)
Usage: Cards at rest, inputs
```

#### Level 2 (Raised)
```
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) (dark)
            0 4px 12px rgba(0, 0, 0, 0.15) (light)
Usage: Hover states, dropdowns
```

#### Level 3 (Floating)
```
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5) (dark)
            0 8px 24px rgba(0, 0, 0, 0.2) (light)
Usage: Modals, popovers, sticky header
```

#### Level 4 (Elevated)
```
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6) (dark)
            0 20px 60px rgba(0, 0, 0, 0.3) (light)
Usage: Full-screen modals, important overlays
```

### Surface Hierarchy (Dark Mode)
```
Level 0: #000000 (page background)
Level 1: #0A0A0A (cards)
Level 2: #1A1A1A (elevated cards, modals)
Level 3: #2A2A2A (popovers, tooltips)
```

---

## 7. Do's and Don'ts

### ✅ Do's

**Color**
- ✅ Use Nigerian Green (#008751) for all primary actions
- ✅ Use Amber (#F59E0B) for secondary highlights and crypto/stocks
- ✅ Maintain 4.5:1 contrast ratio for body text
- ✅ Use semantic colors consistently (green=success, red=error)

**Typography**
- ✅ Use Inter for headlines and UI
- ✅ Use Georgia serif for article body text
- ✅ Keep headlines bold (700-900 weight)
- ✅ Use tight line-height (1.1-1.3) for headlines
- ✅ Use generous line-height (1.6-1.7) for body text

**Layout**
- ✅ Maximize content above fold
- ✅ Use card-based layout for articles
- ✅ Maintain consistent 12px/16px/24px spacing
- ✅ Keep reading width at 680px max

**Interaction**
- ✅ Provide hover states for all interactive elements
- ✅ Use smooth transitions (150-200ms)
- ✅ Show loading states during data fetch
- ✅ Provide immediate feedback on user actions

**Accessibility**
- ✅ Minimum 44px touch targets on mobile
- ✅ Keyboard navigation support
- ✅ ARIA labels on icon buttons
- ✅ Focus indicators on all interactive elements

### ❌ Don'ts

**Color**
- ❌ Never use pure black (#000) for text in light mode
- ❌ Don't use Nigerian Green for errors or warnings
- ❌ Don't mix category colors randomly
- ❌ Avoid low-contrast text (below 4.5:1)

**Typography**
- ❌ Never use Comic Sans or decorative fonts
- ❌ Don't use all-caps for body text
- ❌ Avoid mixing more than 2 font families
- ❌ Don't use font sizes below 12px

**Layout**
- ❌ Don't exceed 1280px container width
- ❌ Avoid cramming too many columns on mobile
- ❌ Don't use inconsistent spacing values
- ❌ Never exceed 680px for reading width

**Interaction**
- ❌ No instant transitions (minimum 100ms)
- ❌ Don't disable buttons without explanation
- ❌ Avoid auto-playing videos with sound
- ❌ Don't hide critical actions in menus

**Accessibility**
- ❌ Never remove focus indicators
- ❌ Don't use color alone to convey information
- ❌ Avoid touch targets smaller than 44px
- ❌ Don't use images without alt text

---

## 8. Responsive Behavior

### Breakpoints
```
Mobile:  < 768px
Tablet:  768px - 1279px
Desktop: ≥ 1280px
```

### Responsive Strategy

#### Navigation
- **Desktop**: Full horizontal nav with all categories visible
- **Tablet**: Horizontal nav with "More" dropdown for overflow
- **Mobile**: Hamburger menu with slide-out drawer

#### Article Grid
- **Desktop**: 3 columns
- **Tablet**: 2 columns
- **Mobile**: 1 column (stack)

#### Typography
- **Desktop**: Full type scale
- **Tablet**: Reduce headlines by 10%
- **Mobile**: Reduce headlines by 20%, increase body line-height to 1.7

#### Images
- **All sizes**: Responsive images with srcset
- **Mobile**: Reduce image quality slightly for performance
- **Aspect ratios**: Maintain 16:9 for cards, 21:9 for hero

#### Touch Targets
- **Mobile**: Minimum 44px × 44px
- **Tablet**: Minimum 40px × 40px
- **Desktop**: Minimum 32px × 32px (mouse precision)

#### Spacing
- **Desktop**: Full spacing scale
- **Tablet**: Reduce by 25%
- **Mobile**: Reduce by 50%

### Collapsing Strategy
1. **First**: Hide secondary navigation items
2. **Second**: Reduce image sizes
3. **Third**: Stack multi-column layouts
4. **Fourth**: Reduce typography scale
5. **Last**: Reduce padding/margins

---

## 9. Agent Prompt Guide

### Quick Color Reference
```
Primary: #008751 (Nigerian Green)
Secondary: #F59E0B (Amber)
Background Dark: #000000
Card Dark: #0A0A0A
Text Dark: #FFFFFF
Background Light: #FFFFFF
Card Light: #FAFAFA
Text Light: #0A0A0A
```

### Ready-to-Use Prompts

#### "Build me a news feed page"
```
Create a dark-mode news feed with:
- Sticky header (#000 background, 64px height)
- 3-column article grid (1280px max-width)
- Article cards (#0A0A0A background, 12px border-radius)
- Nigerian Green (#008751) for CTAs and links
- Inter font for headlines, Georgia for body
- Like/comment/share buttons on each card
```

#### "Create an article card component"
```
Build an article card with:
- #0A0A0A background, 1px #2A2A2A border
- 16:9 featured image with rounded corners
- Category badge (top-left, category color)
- Headline: Inter 700, 20px, #FFFFFF
- Excerpt: Georgia 400, 14px, #A3A3A3, 2 lines
- Engagement row: like (heart), comment, share icons
- Hover: lift 2px, #008751 border, shadow
```

#### "Design a login modal"
```
Create a centered modal with:
- #1A1A1A background, 16px border-radius
- 600px max-width, 24px padding
- Overlay: rgba(0,0,0,0.8) with blur
- Nigerian Green (#008751) primary button
- Input fields: #2A2A2A background, #008751 focus border
- "Sign in with Google" secondary button
```

#### "Build a responsive header"
```
Create a sticky header with:
- rgba(0,0,0,0.8) background, backdrop-blur
- Logo: "360" badge (#008751) + "Naija360" text
- Nav links: All, News, Crypto, Entertainment, Stocks
- Theme toggle (sun/moon icon)
- User avatar or Login button (#008751)
- Mobile: hamburger menu
```

---

## Design System Version
**Version**: 1.0.0  
**Last Updated**: 2026-05-26  
**Maintained by**: Naija360 Team

---

## Notes for AI Agents

This design system combines:
- **The Verge**: Bold headlines, tech-forward aesthetic, modern card layouts
- **WIRED**: Editorial density, serif body text, broadsheet information richness
- **Nigerian Identity**: Green (#008751) and Amber (#F59E0B) color palette

Key principles:
1. **Dark-first**: Primary experience is dark mode
2. **Content-dense**: Maximize information above fold
3. **Social-ready**: Instagram-style engagement (likes, comments, shares)
4. **Editorial credibility**: Professional journalism aesthetic
5. **Nigerian pride**: Green and amber throughout

When building components, always:
- Start with dark mode
- Use Nigerian Green for primary actions
- Maintain card-based layouts
- Provide hover states and transitions
- Ensure mobile responsiveness
