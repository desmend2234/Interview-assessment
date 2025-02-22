# Blog Post Demo

A simple blog post demo built with React, TypeScript, Material-UI, and Tailwind CSS.

## Setup Instructions

1. Clone the repository

```bash
git clone [repository-url]
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables
   Create a `.env` file in the root directory with:

```bash
VITE_USER_ID=1
```

4. Start the development server

```bash
npm run dev
```

## Features

- **Post List Page**

  - Responsive design (desktop table view & mobile card view)
  - Pagination
  - Update posts with loading state
  - Author information display

- **Post Detail Page**

  - Full post content display
  - Comments section
  - Comment deletion (for logged-in user)
  - Loading states
  - Error handling

- **404 Page**
  - Custom 404 page design
  - Easy navigation back to home

## Technical Stack

- React 18
- TypeScript
- Material-UI v5
- Tailwind CSS
- React Router v6
- Vite
- Axios

## API

This demo uses [JSONPlaceholder](https://jsonplaceholder.typicode.com/) for mock data.

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react';

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
});
```
