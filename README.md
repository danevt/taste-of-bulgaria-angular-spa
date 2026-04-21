# Taste of Bulgaria

A single-page application for sharing and discovering traditional Bulgarian recipes.

## Overview

Taste of Bulgaria is a recipe-sharing platform where users can explore authentic Bulgarian cuisine, create and manage their own recipes, and engage with the community through comments. The application features a clean, responsive design and implements full CRUD operations with user authentication.

## Tech Stack

**Frontend:**

- Angular 20 (Standalone Components)
- TypeScript
- RxJS
- Template-driven Forms

**Backend:**

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Cookie-based Sessions

## Features

### Public Features

- Browse all recipes
- Filter recipes by category (Main Dishes, Salads, Desserts)
- View recipe details
- User registration and login

### Authenticated User Features

- Create new recipes
- Edit own recipes
- Delete own recipes
- Add comments to recipes
- Delete own comments
- Interact with comments: Like or dislike comments posted by other users (not available for own comments)
- Favorites: Add or remove recipes to a personal "Favorite Recipes" list in the profile
- View personal profile with Created recipes ("My Recipes") and Saved favorite recipes ("Favorite Recipes")

## Project Structure

```
TASTE-OF-BULGARIA/
├── server/           # Backend (Node.js + MongoDB)
├── client/           # Frontend (Angular)
└── README.md
```

## Installation

### Prerequisites

- Node.js (v18+)
- MongoDB (running locally or connection string)

### Backend Setup

1. Navigate to server folder:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Seed database with test data:

```bash
npm run seed
```

4. Start the server:

```bash
npm start
```

Backend runs on `http://localhost:3000`

**Note:** Project runs in development mode with default MongoDB connection (`mongodb://localhost:27017/bulgarian-recipes`). No `.env` file needed for local testing.

### Frontend Setup

1. Navigate to client folder:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Start the application:

```bash
npm serve
```

Frontend runs on `http://localhost:4200`

## Test Users

After running `npm run seed`, use these credentials:

**Test User 1:**

- Email: `john@example.com`
- Password: `12345`

**Test User 2:**

- Email: `maria@example.com`
- Password: `12345`

## Functional Guide

### Application Purpose

Taste of Bulgaria provides a platform for Bulgarian food enthusiasts to discover, share, and discuss traditional recipes. Users can browse authentic recipes, contribute their own family recipes, and engage with the community.

### User Roles

**Guest (Not Authenticated):**

- View home page with featured categories
- Browse recipe catalog
- View recipe details and comments
- Register or login

**Authenticated User:**

- All guest features
- Create new recipes
- Edit own recipes
- Delete own recipes
- Add comments to any recipe
- Delete own comments
- View personal profile

---

## Key User Flows

### Flow 1: Browse and Filter Recipes (Guest User)

1. User lands on **Home page**
2. Sees hero banner and 3 category cards (Salads, Main Dishes, Desserts)
3. Clicks on **"Main Dishes"** category card
4. Redirected to **All Recipes page** (`/recipes?category=Main Dishes`)
5. Catalog displays only Main Dishes recipes
6. User clicks on a recipe card
7. Redirected to **Recipe Details page** (`/recipes/:id`)
8. Views full recipe (ingredients, instructions, comments)
9. **Cannot** add comments, edit, delete, or favorite (guest restrictions)

---

### Flow 2: User Registration and Login

1. Guest clicks **"Register"** in navigation
2. Fills registration form (username, email, password)
3. Submits → Account created → Auto-logged in
4. Redirected to **Home page** as authenticated user
5. Navigation now shows: **All Recipes | Add Recipe | Profile | Logout**

**Alternative: Login**

1. Click **"Login"** → Enter credentials → Redirected to Home

---

### Flow 3: Create a Recipe (Authenticated User)

1. Logged-in user clicks **"Catalog"** in navigation
2. No recipes exist → Sees prompt: _"No recipes yet. Be the first to add one!"_
3. Clicks link → Redirected to **Add Recipe page** (`/recipes/new`)
4. Fills form:
    - Name: "Tarator"
    - Category: Salads
    - Ingredients: (one per line)
    - Instructions: (one per line)
    - Image URL: `https://example.com/tarator.jpg`
5. Submits → Recipe created
6. Redirected to **Recipe Details page** for new recipe
7. Recipe now appears in:
    - **All Recipes** (all recipes)
    - **Home page** (Recent Recipes if among latest 3)
    - **Profile page** (My Recipes section)

---

### Flow 4: Edit Own Recipe

1. User navigates to their recipe's details page
2. Sees **"Edit"** button (only visible to recipe owner)
3. Clicks Edit → Redirected to edit form (`/recipes/:id/edit`)
4. Form pre-filled with existing data
5. User modifies fields (e.g., adds ingredient)
6. Submits → Recipe updated in database
7. Redirected back to updated recipe details

---

### Flow 5: Delete Own Recipe

1. User on their recipe's details page
2. Clicks **"Delete"** button
3. Confirmation prompt: _"Are you sure you want to delete this recipe?"_
4. Confirms → Recipe deleted from:
    - Database
    - Catalog
    - User's profile
    - All comments associated with recipe
5. User redirected to **All Recipes page**

---

### Flow 6: Add Recipe to Favorites (Non-Owner)

1. User views **another user's recipe** details
2. Sees **"Add to Favorites"** button (not available for own recipes)
3. Clicks button → Recipe added to user's favorites
4. Button text changes to **"Remove from Favorites"**
5. User navigates to **Profile page**
6. Recipe appears in **"Favorite Recipes"** section
7. Click recipe → View details again

**Remove from Favorites:**

1. Click **"Remove from Favorites"** on details page
2. Recipe removed from Profile favorites list

---

### Flow 7: Comment on a Recipe

1. Logged-in user on recipe details page
2. Scrolls to **Comments section** below recipe
3. Sees comment form (textarea + "Post Comment" button)
4. Writes comment: _"Amazing traditional recipe!"_
5. Clicks **"Post Comment"**
6. Comment appears immediately in comments list with:
    - Username
    - Timestamp (e.g., "2 minutes ago")
7. Refreshing page → Comment persists
8. Interact with comments: User sees "Like" and "Dislike" buttons on comments posted by others.
9. Ownership restriction: User can like/dislike other people's comments, but cannot interact with their own comments.

**Delete Own Comment:**

1. User sees **"Delete"** button on their own comments only
2. Clicks Delete → Confirmation → Comment removed

---

### Flow 8: View Profile and Manage Content

1. User clicks **"Profile"** in navigation
2. Profile page displays:
    - User info (username, email, member since date)
    - **"My Recipes (2)"** section with recipe cards
    - **"Favorite Recipes (1)"** section with favorited recipes
3. User clicks on a recipe card → Redirected to details
4. User clicks **"Add your first recipe!"** (if no recipes) → Redirected to create form

---

### Flow 9: Logout

1. User clicks **"Logout"** in navigation
2. Session cleared (localStorage)
3. Redirected to **Home page**
4. Navigation reverts to: **All Recipes | Login | Register**
5. User can no longer access:
    - Create Recipe
    - Profile
    - Edit/Delete actions
    - Comment posting
    - Add to Favorites

---

### Flow 10: Access Control (Route Guards)

**Guest trying to access protected page:**

1. Guest manually navigates to `/recipes/new`
2. **AuthGuard** blocks access
3. Redirected to **Login page**

**Logged-in user trying to access login:**

1. Authenticated user navigates to `/login`
2. **GuestGuard** blocks access
3. Redirected to **Home page**

---

### Flow 11: Error Handling

**Network error (backend down):**

1. User tries to login while backend offline
2. HTTP request fails
3. **Error notification** appears: _"An unexpected error occurred. Please try again."_
4. Notification auto-dismisses after 5 seconds

**Invalid credentials:**

1. User enters wrong password
2. Backend returns `401 Unauthorized`
3. Error notification: _"Wrong email or password"_
4. Form fields marked as touched → validation errors visible

### Data Structure

**Recipe Object:**

- `_id` - unique identifier
- `name` - recipe title
- `category` - Main Dishes | Salads | Desserts
- `ingredients` - array of ingredients
- `instructions` - array of preparation steps
- `imageUrl` - recipe image URL
- `userId` - creator reference
- `comments` - array of comment references
- `created_at` - creation timestamp

**Comment Object:**

- `_id` - unique identifier
- `text` - comment content
- `userId` - author reference
- `recipeId` - recipe reference
- `created_at` - creation timestamp

**User Object:**

- `_id` - unique identifier
- `email` - user email
- `username` - display name
- `recipes` - created recipes
- `comments` - user comments
- `created_at` - registration date

### Technologies Used

- **Angular 20** - Frontend framework
- **TypeScript** - Type-safe development
- **RxJS** - Reactive programming
- **Node.js + Express** - Backend API
- **MongoDB + Mongoose** - Database
- **JWT** - Authentication

## How to Run the Project

### Step 1: Clone Repository

```bash
git clone
cd taste-of-bulgaria
```

### Step 2: Start MongoDB

Ensure MongoDB is running on `mongodb://localhost:27017`

### Step 3: Seed Database (Required)

```bash
cd server
npm install
npm run seed
```

This creates test users and recipes.

### Step 4: Start Backend

```bash
npm start
```

### Step 5: Start Frontend

```bash
cd ../client
npm install
ng serve
```

### Step 6: Access Application

Open `http://localhost:4200`

**Test Credentials:**

- john@example.com / 12345
- maria@example.com / 12345

## Project Architecture

```
client/src/app/
├── core/
│   ├── guards/           # Route protection
│   ├── interceptors/     # HTTP interceptors
│   └── services/         # Business logic
├── features/
│   ├── auth/             # Login/Register
│   ├── home/             # Landing page
│   ├── recipes/          # Recipe CRUD
│   ├── comments/         # Comment system
│   └── profile/          # User profile
├── models/               # TypeScript interfaces
└── shared/
    ├── components/       # Reusable UI
    └── pipes/            # Custom pipes
```

## Notes for Evaluation

- All forms include validation and error handling
- Route guards prevent unauthorized access
- Cookies are used for authentication (httpOnly)
- Responsive design works on desktop and mobile
- Error messages display for failed operations
- Comments require authentication
- Users can only edit/delete own content
- Custom pipes for TimeAgo and Title Slicing
- Dynamic image fallback system based on recipe category

## Author

Todor Danev - SoftUni Angular Final Exam Project - 2026
