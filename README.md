# Scientific Journal Publication Trend Tracking System

Frontend for a scientific journal publication trend tracking system built with Next.js App Router, TypeScript, Tailwind CSS v4, shadcn/ui, Axios, TanStack Query, Zustand, React Hook Form, Zod, Recharts, Lucide React, and react-hot-toast.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

Root `/` redirects to `/login`.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Source Structure

```txt
src/
  app/                 Next.js routes, layouts, pages
  features/            feature entry points and feature-only components
  shared/ui/           raw/customized shadcn primitives
  components/common/   project reusable components
  service/             axios client and domain API services
  hooks/               TanStack Query hooks
  store/               Zustand stores
  types/               shared and domain types
  config/              env, routes, endpoints, site config
  lib/                 utilities
  providers/           app providers
```

## Agent Implementation Guide

### Feature Implementation Order

When implementing any new feature, always follow this order:

```txt
app route/page
  -> features/<feature>/index.tsx
    -> features/<feature>/components/*
      -> shared/ui and components/common
```

Rules:

- `src/app` only wires routes/pages/layouts.
- `src/features/<feature>/index.tsx` is the feature entry point.
- Fetching, hook calls, local orchestration, fake data, and data mapping live in `features/<feature>/index.tsx`.
- Feature UI must be split into components under `features/<feature>/components`.
- Feature components receive data via props from the feature `index.tsx`.
- Do not put large UI directly in route files.
- Do not fetch data inside low-level presentational components unless there is a strong reason.

Example:

```txt
src/app/(auth)/login/page.tsx
  imports -> src/features/auth/index.tsx

src/features/auth/index.tsx
  imports -> src/features/auth/components/loginCard.tsx
  imports -> src/features/auth/components/loginBrandPanel.tsx
```

### UI Component Rules

Always build UI from the existing component layers:

```txt
src/shared/ui          raw/customized shadcn primitives
src/components/common  project-level reusable components
src/features/*/components feature-specific components
```

Use `components/common` first for app-level UI patterns:

```tsx
import { PageShell, ResponsiveContainer, KpiCard } from "@/components/common";
```

Use `shared/ui` for primitive controls:

```tsx
import { Button } from "@/shared/ui/button";
import { InputWithIcon } from "@/shared/ui/input";
```

If a needed primitive does not exist:

1. Ask before adding a new shadcn/ui primitive.
2. Add it to `src/shared/ui`.
3. Wrap/customize reusable app behavior in `src/components/common`.
4. Use the common component from feature code.

Do not repeatedly hand-roll buttons, inputs, cards, empty states, loading states, or layout containers inside feature components.

### File Naming

- React component files use `camelCase`.
- React component names use `PascalCase`.
- Variables/functions use `camelCase`.
- Types/interfaces use `PascalCase`.
- Avoid `snake_case` for React/Next files.

Examples:

```txt
loginCard.tsx
roleSelector.tsx
authTextField.tsx
```

```tsx
export function LoginCard() {}
```

### Styling Rules

Use semantic classes for feature/page-specific styles when JSX becomes noisy.

Feature/page styles should be placed in `src/app/globals.css` under `@layer components`, using clear names:

```css
.auth-page {}
.auth-panel {}
.auth-promo {}
```

Avoid vague names like `hero` unless the screen is truly a marketing hero.

shadcn primitives may keep CVA/Tailwind styling in `src/shared/ui`, because that is the shadcn pattern.

## API Implementation Guide

When adding an API-backed feature, use this order:

```txt
types/<domain>
  -> config/apiEndpoints
  -> service/apiClient
  -> service/<domain>/specificService
  -> hooks/<domain>/useSpecificMutationOrQuery
  -> store/<domain> if global client state is needed
  -> features/<domain>/index.tsx
  -> toast / redirect / save token in feature orchestration
```

Example for login:

```txt
types/auth
  -> config/apiEndpoints
  -> service/apiClient
  -> service/auth/loginService
  -> hooks/auth/useLogin
  -> store/auth if needed
  -> features/auth/LoginPage
  -> redirect / toast / save token
```

### API Layer Responsibilities

#### `service/apiClient.ts`

Owns Axios setup:

- `baseURL`
- timeout
- headers
- auth token interceptor
- error normalization
- `get/post/put/patch/deleteRequest` helpers

#### `service/<domain>/index.ts`

Owns endpoint calls only.

Preferred style:

```ts
export const loginService = (data: ILoginRequest) =>
  post<ILoginResponse, ILoginRequest>(apiEndpoints.auth.login, data);
```

Do not put toast, redirect, component state, or UI behavior in service functions.

#### `hooks/<domain>/index.ts`

Owns TanStack Query state.

Hooks should generally expose query/mutation behavior and stay UI-agnostic:

```ts
export function useLogin() {
  return useMutation({
    mutationFn: (data: ILoginRequest) => loginService(data),
  });
}
```

Do not hard-code route redirects in reusable hooks.
Do not hard-code toasts in reusable hooks by default.

### Where Toast And Redirect Go

Toast, redirect, and token persistence should be handled in the feature orchestration layer, usually `features/<feature>/index.tsx`, via mutation callbacks:

```ts
loginMutation.mutate(payload, {
  onSuccess: (data) => {
    setAuth(data);
    localStorage.setItem("accessToken", data.accessToken);
    toast.success("Signed in successfully");
    router.push("/dashboard");
  },
  onError: (error) => {
    toast.error(getErrorMessage(error));
  },
});
```

Reason:

- Hooks remain reusable and testable.
- UI feedback stays close to the user flow.
- Different pages can handle the same mutation differently.

Exception:

- A hook may accept optional callbacks or options if repeated behavior becomes necessary.
- A domain-specific hook can centralize toast only when the product behavior is truly identical everywhere.

## Store Usage

Use Zustand only for global client state:

- current user
- auth token if needed in memory
- UI state shared across pages
- selected global filters if shared widely

Do not use Zustand for server cache. Use TanStack Query for server data.

## Verification

After implementation, always run:

```bash
npm run lint
npm run build
```

If UI changed significantly, also review the page in browser at the relevant route.
