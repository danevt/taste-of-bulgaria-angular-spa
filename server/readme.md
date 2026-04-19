# Taste of Bulgaria — REST API

## Base URL

`http://localhost:3000/api`

## Getting Started

Test the API is running:

`GET /api/test`

Response:

```json
{
    "name": "taste-of-bulgaria-api",
    "version": "1.0.0",
    "description": "REST-api for Taste of Bulgaria Angular app",
    "main": "index.js"
}
```

---

## Authentication

Cookie-based JWT authentication. Include `{ withCredentials: true }` in every Angular `HttpClient` request that requires auth.

---

## Endpoints: Users

- `/users/register` -- signing up;
- `/users/login` -- signing in;
- `/users/logout` -- logging out;

### Register

`POST /api/register`

Body:

```json
{
    "email": "john@email.com",
    "username": "Johny",
    "password": "12345"
}
```

| Field      | Type   | Required | Rules                               |
| ---------- | ------ | -------- | ----------------------------------- |
| `email`    | string | ✅       | unique                              |
| `username` | string | ✅       | unique, min 5 chars, latin + digits |
| `password` | string | ✅       | min 5 chars, latin + digits         |

Success `200`:

```json
{
    "_id": "5f1875690916010017964978",
    "email": "john@email.com",
    "username": "Johny",
    "recipes": [],
    "comments": [],
    "favorites": [],
    "created_at": "2020-10-14T08:04:12.196Z"
}
```

Error `409`:

```json
{ "message": "Email or username is already registered!" }
```

---

### Login

`POST /api/login`

Body:

```json
{
    "email": "ivan@test.com",
    "password": "12345"
}
```

Success `200` — returns the same structure as Register.

Error `401`:

```json
{ "message": "Wrong email or password" }
```

---

### Logout

`POST /api/logout`

Success `204`

---

### Get Profile

`GET /api/users/profile` 🔒

Success `200`:

```json
{
    "_id": "5f1875690916010017964978",
    "email": "john@email.com",
    "username": "Johny",
    "recipes": ["5f86c38abfa44331a0ff0093"],
    "comments": [],
    "favorites": [],
    "created_at": "2020-10-14T08:04:12.196Z"
}
```

---

### Edit Profile

`PUT /api/users/profile` 🔒

Body:

```json
{
    "username": "NewUsername",
    "email": "new@email.com"
}
```

---

## Endpoints: Recipes

### Get All Recipes

`GET /api/recipes`

Success `200`:

```json
[
    {
        "_id": "5f86c38abfa44331a0ff0093",
        "name": "Banitsa",
        "category": "Main Dishes",
        "ingredients": ["dough", "cheese", "eggs"],
        "instructions": [
            "Arrange the dough",
            "Add the filling",
            "Bake for 40 minutes"
        ],
        "imageUrl": "https://example.com/banitsa.jpg",
        "userId": { "_id": "...", "username": "Johny" },
        "comments": [],
        "favorites": [],
        "created_at": "2020-10-14T09:23:22.102Z"
    }
]
```

---

### Get Recipe by ID

`GET /api/recipes/:recipeId`

Success 200 — returns the recipe with populated comments and userId.

---

### Create Recipe

`POST /api/recipes` 🔒

Body:

```json
{
    "name": "Banitsa",
    "category": "Main Dishes",
    "ingredients": ["dough", "cheese", "eggs"],
    "instructions": [
        "Arrange the dough",
        "Add the filling",
        "Bake for 40 minutes"
    ],
    "imageUrl": "https://example.com/banitsa.jpg",
    "commentText": "Classic recipe!"
}
```

| Field          | Type     | Required | Rules                                            |
| -------------- | -------- | -------- | ------------------------------------------------ |
| `name`         | string   | ✅       |                                                  |
| `category`     | string   | ✅       | `Main Dishes`, `Salads & Appetizers`, `Desserts` |
| `ingredients`  | string[] | ✅       |                                                  |
| `instructions` | string[] | ✅       |                                                  |
| `imageUrl`     | string   | ✅       |                                                  |
| `commentText`  | string   | ❌       | Creates the first comment                        |

---

### Toggle Favorite

`PUT /api/recipes/:recipeId` 🔒

Success 200 — returns the updated recipe.

---

## Endpoints: Comments

### Add Comment

`POST /api/recipes/:recipeId` 🔒

Body:

```json
{ "commentText": "Great recipe!" }
```

Success 200 — returns the updated recipe.

---

### Edit Comment

`PUT /api/recipes/:recipeId/comments/:commentId` 🔒

Body:

```json
{ "commentText": "Edited comment" }
```

Success `200` — returns the updated comment.

Error `401`:

```json
{ "message": "Not allowed!" }
```

---

### Delete Comment

`DELETE /api/recipes/:recipeId/comments/:commentId` 🔒

Success `200` — returns the deleted comment.

Error `401`:

```json
{ "message": "Not allowed!" }
```

---

### Get Latest Comments

`GET /api/comments?limit=5`

Success 200 — array of comments with populated recipeId and userId.

---

## TypeScript Interfaces

```typescript
export interface User {
    _id: string;
    username: string;
    email: string;
    recipes: string[];
    comments: string[];
    favorites: string[];
    created_at: string;
}

export interface Recipe {
    _id: string;
    name: string;
    category: 'Main Dishes' | 'Salads & Appetizers' | 'Desserts';
    ingredients: string[];
    instructions: string[];
    imageUrl: string;
    userId: string | User;
    comments: string[] | RecipeComment[];
    favorites: string[];
    created_at: string;
    updatedAt: string;
}

export interface RecipeComment {
    _id: string;
    text: string;
    userId: string | User;
    recipeId: string;
    created_at: string;
}
```

---

## Angular Integration Notes

- **Base URL:** `http://localhost:3000/api`
- **Auth:** Add `{ withCredentials: true }` to all 🔒 requests
- **ID полета:** `_id` (not `id`)
- **Автор:** `userId`
- **🔒** = requires authenticated user
