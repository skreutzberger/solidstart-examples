# SolidStart - Flickering Example

This project demonstrates that refetching a `createResource()` resource causes the whole DOM to re-render (inside Suspense) and not just only the dynamic part in it.

A good visual indicator is what happens with the line

```ts
<p>loaded {characters() === undefined ? 0 : characters().length} characters</p>
```

in `index.tsx` after clicking on "all Houses" or "House Gryffindor". The whole paragraph is re-rendered instead of just the dynamic `characters().length` value.

I also left the standard click counter example in the source code to show how it should actually behave (just the dynamic value inside the paragraph should re-render).

### ✅ SOLUTION:

By wrapping the call of the refetcher in a transition the flickering is gone! See the `onClick` logic of the 2 buttons. Learn more at https://www.solidjs.com/docs/latest/api#starttransition

## Install & Run

```bash
npm install # install dependencies
npm run dev # start server
```
