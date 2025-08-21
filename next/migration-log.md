# Next.js 15 & React 19 Migration Log

## Overview

This document details the migration from Next.js 14 to Next.js 15.5.0 and React 18 to React 19.1.1, including all issues encountered and their resolutions.

## Migration Steps

### 1. Package Updates

- **Next.js**: 14.x → 15.5.0
- **React**: 18.x → 19.1.1
- **Framer Motion**: Updated to v12.23.12 for React 19 compatibility
- **Package Manager**: Used npm instead of yarn for migration commands due to `yarn dlx` compatibility issues

### 2. Build Configuration

- Added `--legacy-peer-deps` flag to package.json scripts for dependency resolution
- Updated package.json with new dependency versions

## Issues Resolved

### Dynamic Zone Components

**File**: `components/dynamic-zone/manager.tsx`

- **Issue**: SSR compatibility with Next.js 15
- **Solution**: Added `'use client'` directive and removed `ssr: false` from dynamic imports
- **Fix**: Updated component key generation for uniqueness:
  ```tsx
  key={`${componentData.__component}-${componentData.id}-${index}`}
  ```

### Three.js Globe Component

**File**: `components/ui/globe.tsx`

- **Issue**: BufferGeometry NaN errors causing console warnings
- **Solution**: Added comprehensive coordinate validation and error handling
- **Key Changes**:
  - Implemented client-side only rendering with `isMounted` state
  - Added NaN validation for all coordinate data
  - Created safe accessor functions for arc data
  - Added try-catch blocks for animation functions

### Hydration Mismatches

**File**: `components/dynamic-zone/features/skeletons/second.tsx`

- **Issue**: `useId()` and `Math.random()` causing hydration mismatches
- **Solution**: Replaced with deterministic IDs:
  ```tsx
  const id = `circle-line-${index}`;
  ```

### Strapi API Error Handling

**File**: `lib/strapi/fetchContentType.ts`

- **Issue**: 400 errors crashing the application
- **Solution**: Added graceful error handling with fallback data:
  ```tsx
  if (!response.ok) {
    console.error(`Failed to fetch data from Strapi (url=${url.toString()}, status=${response.status})`);
    return spreadData ? null : { data: [] };
  }
  ```

### Framer Motion Compatibility

- **Issue**: Deprecated AnimationProps and API changes
- **Solution**: Updated imports and removed deprecated props
- **Version**: Upgraded to v12.23.12

### TypeScript Compatibility

- **Issue**: Various ref and type errors with React 19
- **Solution**: Updated useRef typing across multiple components
- **Approach**: Fixed without using TypeScript ignore comments

### React Key Prop Warnings

**File**: `components/dynamic-zone/form-next-to-section.tsx`

- **Issue**: Missing key prop in mapped fragments
- **Solution**: Replaced fragment with keyed div element:
  ```tsx
  <div key={`form-input-${index}`}>
  ```

## Testing Results

- ✅ Application builds successfully
- ✅ No TypeScript errors
- ✅ No console warnings
- ✅ All components render correctly
- ✅ SSR functionality maintained
- ✅ Error boundaries working properly

## Performance Improvements

- Enhanced error handling prevents application crashes
- Client-side rendering optimization for Three.js components
- Reduced hydration mismatches for better performance

## Migration Commands Used

```bash
# Initial migration attempt (failed due to yarn dlx)
yarn dlx @next/codemod@canary upgrade ./

# Successful migration using npm
npx @next/codemod@canary upgrade ./

# Package installation with legacy peer deps
npm install --legacy-peer-deps
```

## Final State

- All dependencies updated to latest compatible versions
- Zero build errors or warnings
- Application fully functional with Next.js 15 and React 19
- Enhanced error handling throughout the codebase
- Improved component stability and performance

## Recommendations for Future

1. Continue monitoring for any new React 19 compatibility issues
2. Consider updating other dependencies as React 19 support improves
3. Keep error handling patterns consistent across new components
4. Test thoroughly when adding new Three.js or animation features
