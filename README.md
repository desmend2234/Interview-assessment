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
