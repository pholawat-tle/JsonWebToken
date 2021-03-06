# JWT Authentication

A Node.js API that supports username and password authentication with JSON Web Token

# Highlights

-   Users data in SQL
-   Auth (JWT, Access-Token, Refresh-Token)
-   Containerized (docker & docker-compose)
-   Reverse Proxy (nginx)

# Available APIs

<h4 align="center">Endpoint : <a>http://localhost:3050/api/</a></h4>

## GET `/me`

    Return the information of the authenticated user

The header must includes:

-   `Authorization` => Access Token

## GET `/users`

    Return the list of users in the database as an array

The header must includes:

-   `Authorization` => Access Token

## POST `/users`

    POST to `/users` to create a new user

The body must includes:

-   `username` (case-insensitive and less than 10 characters)
-   `password`

## POST `/users/login`

    POST to `/users/login` to Authenticate

The body must includes:

-   `username` (case-insensitive and less than 10 characters)
-   `password`

```javascript
{
    access_token : "YOUR ACCESS TOKEN",
    refresh_token: "YOUR REFRESH TOKEN"
}
```

## POST `/users/logout`

    POST to `/users/logout` to Log out

The body must includes:

-   `token` => Refresh Token

## POST `/token`

    POST to `/token` to get a new access token

The body must includes:

-   `token` => Refresh Token

---
