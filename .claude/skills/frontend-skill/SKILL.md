---
name: frontend-skill
description: Build responsive frontend pages, reusable components, layouts, and styling. Use for UI development and design implementation.
---

# Frontend Skill – Pages, Components & Styling

## Instructions

1. **Page & Layout Structure**
   - Use semantic HTML elements
   - Responsive layouts (Flexbox / Grid)
   - Consistent spacing and alignment
   - Mobile-first design approach

2. **Components**
   - Build reusable, modular components
   - Clear separation of layout and logic
   - Support props / state where applicable
   - Follow component-driven architecture

3. **Styling**
   - Clean, scalable CSS (CSS Modules, Tailwind, or styled-components)
   - Consistent color palette and typography
   - Use design tokens or variables
   - Support light/dark themes if required

4. **Responsiveness**
   - Mobile, tablet, and desktop breakpoints
   - Fluid typography and spacing
   - Touch-friendly UI elements

5. **Accessibility**
   - Proper labels and ARIA attributes
   - Keyboard navigation support
   - Sufficient color contrast
   - Semantic roles for components

## Best Practices
- Keep components small and focused
- Reuse styles instead of duplicating
- Avoid hard-coded sizes where possible
- Optimize for performance and readability
- Match design specs precisely (Figma → Code)

## Example Structure
```html
<main class="page-container">
  <header class="navbar">
    <h1 class="logo">Brand</h1>
    <nav class="nav-links">
      <a href="#">Home</a>
      <a href="#">About</a>
    </nav>
  </header>

  <section class="content">
    <article class="card">
      <h2>Card Title</h2>
      <p>Card description text.</p>
      <button class="primary-btn">Action</button>
    </article>
  </section>
</main>
