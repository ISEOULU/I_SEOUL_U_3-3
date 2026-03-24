# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Project**: Posts Manager Admin System (게시물 관리 시스템)
**Type**: React + TypeScript + Vite web application
**Status**: Undergoing FSD (Feature-Sliced Design) architecture refactoring
**API**: DummyJSON API via Vite proxy

This is an educational assignment to refactor legacy code into a clean, maintainable architecture using Feature-Sliced Design principles.

---

## Development Setup

### Install Dependencies
```bash
pnpm install
```

### Development Server
```bash
pnpm run dev
```
Starts Vite dev server on `http://localhost:5173` with proxy to DummyJSON API at `/api`.

### Build
```bash
pnpm run build
```
Compiles TypeScript and bundles with Vite.

### Linting
```bash
pnpm run lint
```
Runs ESLint with TypeScript support.

### Testing
```bash
pnpm run test
```
Runs Vitest for unit and integration tests.

```bash
pnpm run coverage
```
Generates code coverage report.

### Preview Production Build
```bash
pnpm run preview
```

---

## Architecture Overview

### Current State (Pre-Refactoring)
All logic is concentrated in a single large component:
- `src/pages/PostsManagerPage.tsx` (~700 lines)
  - Post management (CRUD)
  - Comment management (CRUD + likes)
  - Searching, filtering, sorting, pagination
  - User profile modal
  - Tag filtering

### Target State (FSD Architecture)

The project is being refactored into Feature-Sliced Design with the following layers:

1. **shared/** - Common utilities, types, API clients, UI components
2. **entities/** - Domain objects (Post, Comment, User, Tag) with their models, APIs, and UI
3. **features/** - User-centric features (CreatePost, EditPost, SearchPosts, etc.) with logic and UI
4. **widgets/** - Composite components combining multiple entities/features
5. **pages/** - Page-level components that render widgets

**Key Refactoring Milestones**:
- [ ] Workflow.md created with detailed refactoring plan
- [ ] Phase 1: Type definitions in shared/types/
- [ ] Phase 2: Entities separation (post, comment, user, tag)
- [ ] Phase 3: Features implementation with state management (Zustand)
- [ ] Phase 4: Widgets and final integration

See `Workflow.md` for detailed refactoring strategy, folder structure, and step-by-step instructions.

---

## Technology Stack

### Core
- **React 19.2** - UI framework
- **TypeScript 5.9** - Type safety
- **Vite 7.2** - Build tool and dev server

### Routing & State
- **React Router DOM 7.10** - Client-side routing
- **Zustand 5.0** - Global state management (installed ✓)

### UI Components & Styling
- **Tailwind CSS** - Utility-first CSS (configured inline)
- **Radix UI** - Headless UI primitives (@radix-ui/react-dialog, @radix-ui/react-select)
- **Lucide React** - Icon library
- **Class Variance Authority (CVA)** - Component variant management

### API & Data
- **Axios 1.13** - HTTP client
- **DummyJSON API** - Mock API (proxied at /api)

### Testing & Quality
- **Vitest 4.0** - Fast unit/integration tests (Vite-native)
- **React Testing Library 16.3** - Component testing utilities
- **JSDOM 27.2** - DOM implementation for testing
- **MSW 2.12** - API mocking for tests
- **ESLint 9.39** - Code linting (with React, React Hooks, React Refresh plugins)
- **Prettier 3.7** - Code formatting

### Development
- **@vitejs/plugin-react 5.1** - React Fast Refresh
- **TypeScript ESLint 8.48** - TypeScript linting

---

## Key Files & Structure

### Configuration Files
- `vite.config.ts` - Vite configuration with DummyJSON API proxy at `/api`
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` - TypeScript configuration
- `eslint.config.js` - ESLint rules (React hooks, React Refresh)
- `.prettierrc` - Prettier formatting rules
- `vitest.config.ts` - Vitest configuration

### Source Files
```
src/
├── App.tsx                    # Root app with Router and layout
├── main.tsx                   # React entry point
├── index.tsx                  # DOM mount point
├── index.css                  # Global styles (Tailwind imports)
├── pages/
│   └── PostsManagerPage.tsx   # Currently contains all logic (to be refactored)
├── components/
│   ├── Header.tsx             # Navigation header
│   ├── Footer.tsx             # Footer
│   └── index.tsx              # Shared UI components (Button, Card, Dialog, Table, etc.)
└── assets/
    └── react.svg              # Logo
```

---

## Refactoring Principles

### 1. Feature-Sliced Design (FSD)
- Organize code by features (user actions), not technical layers
- Clear separation: shared → entities → features → widgets → pages
- Maximize feature independence and minimize coupling

### 2. Single Responsibility Principle
- Each component should have one reason to change
- Split the 700-line PostsManagerPage into focused components:
  - PostTable (rendering only)
  - SearchInput (search logic)
  - PostFilters (filter selection)
  - CreatePostDialog (form logic)
  - etc.

### 3. Type Safety
- Strict TypeScript usage throughout
- No `any` types
- Define interfaces for all API responses, props, and state

### 4. State Management (Zustand 5.0 installed ✓)
- Move from useState to Zustand for global state management
- Zustand advantages:
  - Minimal boilerplate (simpler than Context API)
  - DevTools integration for debugging
  - Selective state subscription (performance optimized)
  - Full TypeScript support with proper typing
- Separate concerns:
  - UI state (dialog visibility) → local useState or Zustand
  - Feature state (filters, search, forms) → Zustand stores (see Workflow.md)
  - Server state (posts, comments) → API layer (consider TanStack Query later)

### 5. API Organization
- Centralize API calls in entity-specific API files
- Use axios instance with common configuration
- Proper error handling and type safety

### 6. useEffect Discipline
- Minimize side effects
- Clear dependency arrays
- Consider moving to Zustand actions for side effect orchestration

---

## Current Issues (Pre-Refactoring)

As documented in README.md:

1. **Component too large and complex** - Single 700-line component
2. **Inadequate TypeScript usage** - Type definitions missing or incomplete
3. **No state management** - Too many useState without clear separation
4. **Unmanaged useEffect** - Dependency arrays unclear, side effects hard to follow
5. **Complex async logic** - fetch chaining is convoluted, error handling incomplete

These are being systematically addressed through FSD refactoring.

---

## API Integration

### Proxy Configuration
Vite proxies `/api` requests to `https://dummyjson.com` (configured in `vite.config.ts`).

### Example API Endpoints
```
GET  /api/posts?limit=10&skip=0
GET  /api/posts/{id}
POST /api/posts/add
PUT  /api/posts/{id}
DELETE /api/posts/{id}
GET  /api/posts/search?q=query
GET  /api/posts/tag/{tag}
GET  /api/posts/tags
GET  /api/comments/post/{postId}
POST /api/comments/add
PUT  /api/comments/{id}
PATCH /api/comments/{id}
DELETE /api/comments/{id}
GET  /api/users?limit=0&select=username,image
GET  /api/users/{id}
```

---

## Git Workflow

### Commit Convention
- `refactor:` for refactoring work (moving code, restructuring)
- `feat:` for new features
- `fix:` for bug fixes
- `type:` for TypeScript-only improvements

### Branch Strategy
- Work on `main` branch (single-branch workflow for this educational project)
- Commit frequently as you complete each refactoring phase
- Each phase completion should be a clear, descriptive commit

---

## ESLint & Prettier Rules

### Enforced
- React Hooks rules (dependency arrays, hooks ordering)
- React Refresh rules (only export components)
- TypeScript strict mode
- No unused variables

### Code Style
- Prettier formats code (see `.prettierrc`)
- Run `pnpm run lint` to check
- Use formatOnSave in your editor for convenience

---

## Testing

### Test Files Location
Place tests next to source files or in `__tests__` directories:
```
features/PostList/__tests__/PostListContainer.test.tsx
entities/post/__tests__/postApi.test.ts
shared/hooks/__tests__/useQueryParams.test.ts
```

### Testing Best Practices
- Use React Testing Library (test behavior, not implementation)
- Mock API calls with MSW
- Test at component level first
- Add integration tests for complex features

### Run Tests
```bash
# Run all tests
pnpm run test

# Watch mode
pnpm run test -- --watch

# Single file
pnpm run test -- PostListContainer.test.tsx

# Coverage
pnpm run coverage
```

---

## Common Development Tasks

### Adding a New Feature
1. Create feature folder: `features/MyFeature/`
2. Define types in feature's model or use entity types
3. Create Zustand store if needed: `features/MyFeature/model/store.ts`
4. Implement UI components: `features/MyFeature/ui/`
5. Export from feature's index.ts
6. Import and use in widget or page

### Adding Shared Utilities
1. Create in appropriate `shared/` subdirectory:
   - `shared/hooks/` for custom React hooks
   - `shared/utils/` for utility functions
   - `shared/types/` for TypeScript types
2. Export from `shared/index.ts`

### Adding Entity UI Components
1. Create in `entities/MyEntity/ui/`
2. Use entity's types from `entities/MyEntity/model/types.ts`
3. Keep components pure and focused on rendering
4. Export from entity's index.ts

### Making API Changes
1. Update types in `entities/MyEntity/model/types.ts`
2. Update API methods in `entities/MyEntity/api/myEntityApi.ts`
3. Update Zustand store if state changes
4. Update feature components that use the API

---

## Debugging Tips

### Check Component Hierarchy
```bash
# Use React DevTools browser extension
# Inspect component props and state in the component tree
```

### Debug Zustand Store
```typescript
// Add logging middleware
const useMyStore = create((set) => ({
  // ... state
}))

// Check store state in console
const store = useMyStore.getState()
console.log(store)
```

### API Issues
1. Check Vite proxy: Network tab shows `/api/...` requests
2. Check DummyJSON API response format
3. Verify TypeScript types match API response

### TypeScript Errors
```bash
pnpm run build  # Full type check
```

---

## Performance Considerations

### Current Concerns
- No memoization (React.memo)
- No lazy loading
- No code splitting

### Future Optimizations
- Use React.memo for expensive renders
- Implement React.lazy for feature splitting
- Consider React Query for server state caching
- Add performance monitoring

---

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ JavaScript features
- No IE11 support

---

## Reference

### Key Documentation
- `Workflow.md` - Detailed refactoring guide and architecture
- `README.md` - Project assignment details and requirements
- `.github/pull_request_template.md` - PR conventions

### External References
- [FSD Documentation](https://feature-sliced.design/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Hooks Rules](https://react.dev/reference/rules/rules-of-hooks)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vite.dev/)
- [Vitest Documentation](https://vitest.dev/)

---

## Questions & Issues

If you encounter issues during refactoring:
1. Check the Workflow.md for guidance on that phase
2. Verify types are properly defined in shared/types/
3. Ensure Zustand stores are properly initialized
4. Run `pnpm run lint` to check for style issues
5. Check browser console for runtime errors
6. Review the README.md assignment checklist
