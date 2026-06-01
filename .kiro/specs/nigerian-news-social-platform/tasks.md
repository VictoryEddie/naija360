# Implementation Plan: Nigerian News Social Platform

## Overview

This implementation plan breaks down the Nigerian News Social Platform into discrete, actionable coding tasks. The platform is built with Next.js 14+ App Router, TypeScript, Tailwind CSS, shadcn/ui, and Firebase. Each task builds incrementally on previous work, with checkpoints to validate progress. The implementation follows a mobile-first approach with Nigerian cultural aesthetics (green #008751 primary, amber #F59E0B accents).

## Tasks

- [ ] 1. Project setup and core infrastructure
  - Initialize Next.js 14+ project with TypeScript and App Router
  - Configure Tailwind CSS with Nigerian color palette (green #008751, amber #F59E0B)
  - Install and configure shadcn/ui components
  - Set up Firebase client with environment variables
  - Configure ESLint, Prettier, and TypeScript strict mode
  - Create folder structure: `app/`, `components/`, `lib/`, `hooks/`, `types/`
  - Set up Framer Motion for animations
  - _Requirements: 10.2, 10.8_

- [ ] 2. Firestore database schema and Firebase configuration
  - [ ] 2.1 Create Firestore database schema
    - Create `users` collection with profile fields (username, email, avatar_url, created_at, total_likes, total_comments)
    - Create `articles` collection (title, source, published_date, image_url, excerpt, category, external_url, cached_at, like_count, comment_count)
    - Create `likes` subcollection under articles with userId as document ID
    - Create `comments` subcollection under articles with parent_comment_id for threading and nesting_level field
    - Add composite indexes: articles(category, published_date DESC), comments(parent_comment_id, created_at ASC)
    - Set up Firebase Security Rules for all collections
    - _Requirements: 2.8, 5.8, 6.7, 6.9_
  
  - [ ]* 2.2 Write property test for article schema normalization
    - **Property 1: Article Data Normalization**
    - **Validates: Requirements 2.8**
  
  - [ ]* 2.3 Write property test for article deduplication
    - **Property 3: Article Deduplication**
    - **Validates: Requirements 2.11**

- [ ] 3. Authentication system
  - [ ] 3.1 Implement Firebase Auth integration
    - Create auth context provider with session management
    - Implement email/password authentication flows
    - Add social login providers (Google, Facebook, Twitter)
    - Create middleware for protected routes
    - Implement session persistence and refresh logic
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_
  
  - [ ] 3.2 Build authentication UI components
    - Create LoginPage with email/password form using React Hook Form + Zod
    - Create SignupPage with email verification flow
    - Add social login buttons with provider icons
    - Implement form validation with inline error messages
    - Add loading states and error toast notifications
    - _Requirements: 1.3, 11.8_
  
  - [ ]* 3.3 Write unit tests for auth flows
    - Test successful login, failed login, logout, session refresh
    - Test form validation edge cases
    - _Requirements: 1.2, 1.3, 1.4, 1.5_

- [ ] 4. External API integration and data normalization
  - [ ] 4.1 Create API client utilities
    - Create typed API client functions for NewsAPI, GNews, CoinGecko, CoinMarketCap, TMDb, NSE API, Alpha Vantage
    - Implement rate limiting logic with exponential backoff
    - Add error handling with fallback to cached data
    - Create data normalization functions to convert external API responses to unified article schema
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9_
  
  - [ ]* 4.2 Write property test for API failure resilience
    - **Property 2: API Failure Resilience**
    - **Validates: Requirements 2.9**
  
  - [ ]* 4.3 Write unit tests for data normalization
    - Test normalization for each external API response format
    - Test handling of missing or malformed fields
    - _Requirements: 2.8_

- [ ] 5. Article aggregation and caching system
  - [ ] 5.1 Implement article fetching and caching logic
    - Create Next.js API route `/api/articles/fetch` for background article fetching
    - Implement 15-minute refresh interval using cron job or scheduled function
    - Add deduplication logic based on article URL
    - Store normalized articles in Firestore `articles` collection
    - Implement error logging to Sentry for failed API calls
    - _Requirements: 2.8, 2.9, 2.10, 2.11, 11.6_
  
  - [ ]* 5.2 Write property test for article deduplication
    - **Property 3: Article Deduplication**
    - **Validates: Requirements 2.11**

- [ ] 6. Checkpoint - Verify data pipeline
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Feed display with infinite scroll
  - [ ] 7.1 Create article feed components
    - Create `ArticleCard` component with title, source, date, image, excerpt, like/comment counts
    - Implement Next.js Image optimization with WebP format
    - Add skeleton loading states for cards
    - Create `FeedContainer` with infinite scroll using Intersection Observer
    - Implement TanStack Query `useInfiniteQuery` for paginated article fetching
    - _Requirements: 3.1, 3.2, 3.3, 3.6, 3.7, 10.3, 10.7_
  
  - [ ] 7.2 Implement pagination and loading logic
    - Create API route `/api/articles` with pagination (20 articles per page)
    - Add cursor-based pagination using article ID
    - Implement prefetching for next page at 50% scroll
    - Add end-of-feed message when no more articles available
    - _Requirements: 3.1, 3.2, 3.4, 10.4_
  
  - [ ]* 7.3 Write property test for article chronological ordering
    - **Property 4: Article Chronological Ordering**
    - **Validates: Requirements 3.5**
  
  - [ ]* 7.4 Write property test for article rendering completeness
    - **Property 5: Article Rendering Completeness**
    - **Validates: Requirements 3.6**
  
  - [ ]* 7.5 Write unit tests for infinite scroll behavior
    - Test loading next page on scroll
    - Test skeleton display during loading
    - Test end-of-feed message
    - _Requirements: 3.2, 3.3, 3.4_

- [ ] 8. Category filtering system
  - [ ] 8.1 Implement category filter UI and logic
    - Create `CategoryFilter` component with tabs for All, News, Crypto, Entertainment, Stocks
    - Implement category selection with URL query parameter persistence
    - Add filter logic to API route to query by category
    - Reset scroll position and refetch articles on category change
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_
  
  - [ ]* 8.2 Write property test for category filtering correctness
    - **Property 6: Category Filtering Correctness**
    - **Validates: Requirements 4.2**
  
  - [ ]* 8.3 Write property test for category filter URL persistence
    - **Property 7: Category Filter URL Persistence Round-Trip**
    - **Validates: Requirements 4.6, 4.7**

- [ ] 9. Like functionality with real-time updates
  - [ ] 9.1 Implement like system backend
    - Create API route `/api/articles/[id]/like` for POST (add like) and DELETE (remove like)
    - Implement duplicate like prevention using userId as document ID in likes subcollection
    - Add like count aggregation using Firestore transactions
    - Set up Firestore onSnapshot listener for like events
    - _Requirements: 5.1, 5.2, 5.3, 5.8, 7.2_
  
  - [ ] 9.2 Create like button component with optimistic updates
    - Create `LikeButton` component with active/inactive states
    - Implement TanStack Query mutation with optimistic UI updates
    - Add rollback logic for failed like actions
    - Subscribe to Firestore onSnapshot for live like count updates
    - _Requirements: 5.4, 5.5, 5.6, 5.7, 7.2, 7.4_
  
  - [ ]* 9.3 Write property test for like creation and removal
    - **Property 8: Like Creation and Removal**
    - **Validates: Requirements 5.1, 5.2**
  
  - [ ]* 9.4 Write property test for like count accuracy
    - **Property 9: Like Count Accuracy**
    - **Validates: Requirements 5.3**
  
  - [ ]* 9.5 Write property test for like button state consistency
    - **Property 10: Like Button State Consistency**
    - **Validates: Requirements 5.5**
  
  - [ ]* 9.6 Write property test for duplicate like prevention
    - **Property 11: Duplicate Like Prevention**
    - **Validates: Requirements 5.8**

- [ ] 10. Comment system with threading
  - [ ] 10.1 Implement comment backend
    - Create API route `/api/articles/[id]/comments` for GET (fetch comments) and POST (create comment)
    - Implement comment validation (non-empty, non-whitespace-only)
    - Add parent_comment_id support for replies in comments subcollection
    - Implement 3-level nesting limit enforcement
    - Create recursive query to fetch comment threads from Firestore
    - Set up Firestore onSnapshot listener for comment events
    - _Requirements: 6.2, 6.3, 6.5, 6.7, 6.9, 7.3_
  
  - [ ] 10.2 Create comment UI components
    - Create `CommentSection` component that expands on button click
    - Create `CommentList` with chronological ordering (oldest first)
    - Create `CommentItem` with user avatar, name, text, timestamp
    - Implement `CommentThread` with visual indentation for nested replies
    - Add reply button and nested reply input fields
    - Implement comment count display and real-time updates
    - _Requirements: 6.1, 6.5, 6.6, 6.8, 6.10, 6.11, 7.3, 7.4_
  
  - [ ]* 10.3 Write property test for comment creation and association
    - **Property 12: Comment Creation and Association**
    - **Validates: Requirements 6.2**
  
  - [ ]* 10.4 Write property test for comment validation
    - **Property 13: Comment Validation**
    - **Validates: Requirements 6.3**
  
  - [ ]* 10.5 Write property test for comment chronological ordering
    - **Property 14: Comment Chronological Ordering**
    - **Validates: Requirements 6.5**
  
  - [ ]* 10.6 Write property test for reply parent-child relationship
    - **Property 15: Reply Parent-Child Relationship**
    - **Validates: Requirements 6.7**
  
  - [ ]* 10.7 Write property test for comment thread display and nesting limit
    - **Property 16: Comment Thread Display and Nesting Limit**
    - **Validates: Requirements 6.8, 6.9**
  
  - [ ]* 10.8 Write property test for comment rendering completeness
    - **Property 17: Comment Rendering Completeness**
    - **Validates: Requirements 6.10**
  
  - [ ]* 10.9 Write property test for comment count accuracy
    - **Property 18: Comment Count Accuracy**
    - **Validates: Requirements 6.11**

- [ ] 11. Checkpoint - Verify social features
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Real-time subscriptions
  - [ ] 12.1 Implement Firestore real-time integration
    - Create custom hook `useRealtimeArticle` for subscribing to article updates using onSnapshot
    - Implement subscription lifecycle (subscribe on mount, unsubscribe on unmount)
    - Add automatic reconnection logic with exponential backoff
    - Create connection status indicator component
    - Handle realtime events for likes and comments
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_
  
  - [ ]* 12.2 Write property test for realtime UI update responsiveness
    - **Property 19: Realtime UI Update Responsiveness**
    - **Validates: Requirements 7.4**
  
  - [ ]* 12.3 Write unit tests for realtime subscription lifecycle
    - Test subscribe, unsubscribe, reconnection logic
    - _Requirements: 7.1, 7.5, 7.6_

- [ ] 13. User profile and activity history
  - [ ] 13.1 Create user profile page
    - Create `/profile` page with user info display (username, email, join date)
    - Display aggregate statistics (total likes, total comments) from user document
    - Create profile edit form with React Hook Form + Zod validation
    - Implement avatar upload to Firebase Storage
    - Add profile update API route with validation
    - _Requirements: 8.1, 8.2, 8.3, 8.7, 8.8_
  
  - [ ] 13.2 Implement activity history
    - Create paginated list of user's liked articles using Firestore queries
    - Create paginated list of user's comments using Firestore queries
    - Add navigation to articles from activity items
    - _Requirements: 8.4, 8.5, 8.6_
  
  - [ ]* 13.3 Write property test for user profile completeness
    - **Property 20: User Profile Completeness**
    - **Validates: Requirements 8.1, 8.2, 8.3**
  
  - [ ]* 13.4 Write property test for profile update validation
    - **Property 21: Profile Update Validation and Storage**
    - **Validates: Requirements 8.7, 8.8**

- [ ] 14. Theme support (light/dark mode)
  - [ ] 14.1 Implement theme system
    - Create theme context with light/dark mode state
    - Implement theme toggle button in navigation header
    - Add localStorage persistence for theme preference
    - Configure Tailwind CSS dark mode with class strategy
    - Apply Nigerian color palette to both themes
    - Ensure WCAG 4.5:1 contrast ratios in both themes
    - Add smooth theme transition animations
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_
  
  - [ ]* 14.2 Write property test for theme preference persistence
    - **Property 22: Theme Preference Persistence Round-Trip**
    - **Validates: Requirements 9.2, 9.3, 9.4**
  
  - [ ]* 14.3 Write property test for color contrast accessibility
    - **Property 23: Color Contrast Accessibility**
    - **Validates: Requirements 9.6**

- [ ] 15. Performance optimization
  - [ ] 15.1 Implement performance optimizations
    - Configure Next.js Image component with WebP format and quality 80
    - Implement code splitting with dynamic imports for heavy components
    - Add TanStack Query caching with 5-minute stale time
    - Implement prefetching for next page at 50% scroll
    - Add lazy loading for images with Intersection Observer
    - Configure server-side rendering for initial feed page
    - Optimize bundle size with tree shaking and minification
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9_
  
  - [ ]* 15.2 Run Lighthouse performance audit
    - Verify performance score of 90+ on mobile
    - Verify initial load time under 2 seconds on 3G
    - _Requirements: 10.1, 10.9_

- [ ] 16. Error handling and monitoring
  - [ ] 16.1 Implement error handling system
    - Create global error boundary component with retry option
    - Implement toast notification system for API errors
    - Add user-friendly error messages for common failures (rate limit, session timeout, network error)
    - Create placeholder image component for failed image loads
    - Add inline form validation error display
    - Ensure no stack traces or technical details shown to users
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.7, 11.8_
  
  - [ ] 16.2 Set up Sentry monitoring
    - Install and configure Sentry SDK
    - Add error logging with context (user, timestamp, error message, stack trace)
    - Configure email alerts for critical errors
    - _Requirements: 11.6_
  
  - [ ]* 16.3 Write property test for error toast display
    - **Property 24: Error Toast Display**
    - **Validates: Requirements 11.1**
  
  - [ ]* 16.4 Write property test for image fallback handling
    - **Property 25: Image Fallback Handling**
    - **Validates: Requirements 11.5**
  
  - [ ]* 16.5 Write property test for error logging completeness
    - **Property 26: Error Logging Completeness**
    - **Validates: Requirements 11.6**
  
  - [ ]* 16.6 Write property test for error message sanitization
    - **Property 27: Error Message Sanitization**
    - **Validates: Requirements 11.7**
  
  - [ ]* 16.7 Write property test for form validation error display
    - **Property 28: Form Validation Error Display**
    - **Validates: Requirements 11.8**

- [ ] 17. Security implementation
  - [ ] 17.1 Implement rate limiting
    - Install and configure rate limiting middleware (e.g., `@upstash/ratelimit`)
    - Add rate limiting to all API routes (10/min unauthenticated, 100/min authenticated)
    - Return 429 status with retry-after header when limit exceeded
    - _Requirements: 12.1, 12.2, 12.3, 12.4_
  
  - [ ] 17.2 Implement input validation and sanitization
    - Add Zod validation schemas for all API inputs
    - Implement XSS prevention with DOMPurify for comment text
    - Add SQL injection prevention with parameterized queries (Supabase handles this)
    - Validate all user input on both client and server
    - _Requirements: 12.5, 12.6_
  
  - [ ] 17.3 Configure security headers and cookies
    - Add security headers middleware (HSTS, CSP, X-Frame-Options, X-Content-Type-Options)
    - Configure session cookies with HttpOnly, Secure, SameSite=Strict
    - Implement CORS policies restricting to application domain
    - Ensure bcrypt password hashing with 12+ salt rounds (Supabase handles this)
    - Verify no API keys or secrets in client-side code
    - _Requirements: 12.7, 12.8, 12.9, 12.10, 12.11_
  
  - [ ]* 17.4 Write property test for rate limit enforcement
    - **Property 29: Rate Limit Enforcement**
    - **Validates: Requirements 12.2, 12.3, 12.4**
  
  - [ ]* 17.5 Write property test for input validation and sanitization
    - **Property 30: Input Validation and Sanitization**
    - **Validates: Requirements 12.5, 12.6**
  
  - [ ]* 17.6 Write property test for password hashing security
    - **Property 31: Password Hashing Security**
    - **Validates: Requirements 12.10**

- [ ] 18. Mobile responsiveness
  - [ ] 18.1 Implement responsive layouts
    - Create mobile-first CSS with Tailwind breakpoints
    - Implement 1-column layout for mobile (<768px)
    - Implement 2-column layout for tablet (768px-1024px)
    - Implement 3-column layout with sidebar for desktop (>1024px)
    - Ensure 44x44px minimum touch targets for all interactive elements
    - Add responsive typography scaling
    - Prevent horizontal scrolling at all viewport widths
    - Add touch feedback animations with Framer Motion
    - Preserve scroll position on device rotation
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9_
  
  - [ ]* 18.2 Write property test for touch target accessibility
    - **Property 32: Touch Target Accessibility**
    - **Validates: Requirements 13.2**
  
  - [ ]* 18.3 Write property test for horizontal scroll prevention
    - **Property 33: Horizontal Scroll Prevention**
    - **Validates: Requirements 13.7**
  
  - [ ]* 18.4 Write property test for scroll position preservation on rotation
    - **Property 34: Scroll Position Preservation on Rotation**
    - **Validates: Requirements 13.9**

- [ ] 19. Checkpoint - Verify responsive design
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 20. Accessibility implementation
  - [ ] 20.1 Implement accessibility features
    - Use semantic HTML elements (nav, main, article, button, a)
    - Add ARIA labels to all icon buttons and interactive elements without visible text
    - Implement keyboard navigation for all interactive features
    - Add visible focus indicators with custom focus ring styles
    - Add alt text to all article images
    - Ensure color is not the only means of conveying information
    - Implement ARIA live regions for dynamic content updates (new comments, like counts)
    - Add skip-to-content link for keyboard users
    - Associate all form inputs with labels using htmlFor/id
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8, 14.9_
  
  - [ ]* 20.2 Write property test for ARIA label completeness
    - **Property 35: ARIA Label Completeness**
    - **Validates: Requirements 14.2**
  
  - [ ]* 20.3 Write property test for keyboard navigation and focus indicators
    - **Property 36: Keyboard Navigation and Focus Indicators**
    - **Validates: Requirements 14.3, 14.4**
  
  - [ ]* 20.4 Write property test for image alt text accessibility
    - **Property 37: Image Alt Text Accessibility**
    - **Validates: Requirements 14.5**
  
  - [ ]* 20.5 Write property test for dynamic content announcements
    - **Property 38: Dynamic Content Announcements**
    - **Validates: Requirements 14.7**
  
  - [ ]* 20.6 Write property test for form input label association
    - **Property 39: Form Input Label Association**
    - **Validates: Requirements 14.9**

- [ ] 21. Analytics and monitoring
  - [ ] 21.1 Implement analytics tracking
    - Install analytics SDK (e.g., Google Analytics, Plausible, or custom)
    - Track page views for each article
    - Track user engagement events (likes, comments, time on page)
    - Track API response times and error rates
    - Track external API usage for rate limit monitoring
    - Implement opt-out mechanism with localStorage flag
    - Respect opt-out preference in all tracking code
    - _Requirements: 15.1, 15.2, 15.3, 15.6, 15.8, 15.9_
  
  - [ ] 21.2 Create admin dashboard (optional)
    - Create protected admin route with role-based access
    - Display key metrics (daily active users, popular articles, engagement rates)
    - Add charts for visualizing trends
    - _Requirements: 15.7_
  
  - [ ]* 21.3 Write property test for analytics event tracking
    - **Property 40: Analytics Event Tracking**
    - **Validates: Requirements 15.1, 15.2, 15.3, 15.6**
  
  - [ ]* 21.4 Write property test for analytics opt-out enforcement
    - **Property 41: Analytics Opt-Out Enforcement**
    - **Validates: Requirements 15.9**

- [ ] 22. UI polish and animations
  - [ ] 22.1 Add Framer Motion animations
    - Add page transition animations (fade/slide)
    - Add button press animations (whileTap scale 0.97)
    - Add card hover animations (whileHover scale 1.02)
    - Add modal animations (scale in on open, fade out on close)
    - Add loading skeleton shimmer with animate-pulse
    - Add staggered list animations (staggerChildren 0.05)
    - Add toast notification slide-in animations
    - _Requirements: Global Rules - Animations and UX_
  
  - [ ] 22.2 Create empty states and loading states
    - Create empty feed state with guidance message
    - Create loading skeletons for article cards
    - Create loading states for buttons and forms
    - _Requirements: 3.3, 3.8, Global Rules - Code Quality_

- [ ] 23. Final integration and polish
  - [ ] 23.1 Wire all components together
    - Integrate all features into main app layout
    - Add navigation header with theme toggle and user menu
    - Create branded 404 page
    - Add favicon and Open Graph images
    - Create README with setup instructions
    - _Requirements: Global Rules - Delivery Standards_
  
  - [ ] 23.2 Environment configuration
    - Create `.env.example` with all required environment variables
    - Document Firebase setup steps (create project, enable Auth, Firestore, Storage)
    - Document external API key requirements
    - Add `.env` to `.gitignore`
    - _Requirements: 12.11, Global Rules - Security Defaults_

- [ ] 24. Final checkpoint - Complete testing and deployment preparation
  - Run all tests and ensure they pass
  - Test on real mobile device
  - Verify Lighthouse performance score 90+ on mobile
  - Verify all accessibility features work with keyboard navigation
  - Test authentication flows end-to-end
  - Test social features (likes, comments) with multiple users
  - Verify error handling for all failure scenarios
  - Ask the user if questions arise before deployment.

## Notes

- Tasks marked with `*` are optional property-based tests and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and allow for user feedback
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The implementation uses TypeScript throughout as specified in the tech stack
- All code follows Next.js 14+ App Router conventions with server and client components
- Security, performance, and accessibility are built in from the start, not added later
- Firebase is used for authentication, Firestore for database, Firebase Storage for media, and Firestore real-time listeners for live updates
