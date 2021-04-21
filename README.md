# JWT Authentication

A Node.js API that supports username and password authentication with JSON Web Token

# Endpoints

## GET `/users`

    Return the list of users in the database as an array.

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
