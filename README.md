# Blog API

This is a RESTful API, the backend of an blog app built on the MERN stack.

The app follows an MVC design pattern.

Built with :

- Express
- Mongoose
- Passport and JWT

Consumer frontend: [link to frontend repo]

Admin frontend: [link to frontend repo]

## API

### Endpoints

As a RESTful API you can make requests using HTTP Verbs:

`GET, POST, PUT, DELETE`

And pointing to resources in the URI, namely:

- /posts
- /posts/:postid
- /posts/:postid/comments/:commentid (only to DELETE comments)

Authentication :

- /auth/login
- /auth/sign-up

#### Protected routes

Will require an Authorization header with a bearer JWT token are every POST, PUT, and DELETE endpoint.

- { "Authorization": "Bearer \<JWT Token\>" }

With the exception of `POST /posts/:postid` which is for the creation of comments in a post.

To access the JWT Token the client will need to [log in](#log-in).

#### Request body

For POST and PUT routes the client needs to send a request body with a JSON object containing the needed data.

Header:

- {"Content-Type" : "application/json" }

#### Read all posts

`GET /posts`

No headers or body required. The server will respond with an array of all posts sorted by time of creation.

#### Read single post

`GET /posts/:postid`

No headers or body required.

Response:

```js
{
  post: Post,
  comments: [
    comment: Comment,
    ...
  ]
}
```

#### Post creation

`POST /posts`

Protected route

Body

- title: String, between 10 and 100 characters
- text: String, between 10 and 2000 characters

The response will be the post object as declared in the [schema](#post-schema)

Posts will be created with a status of 'unpublished' by default. To make a post public the client will need to make a `PUT /posts/:postid` request and change the status to 'published'

#### Post update

`PUT /posts/:postid`

Protected route

Same headers and body as for [post creation](#post-creation).

Response will be the updated Post object

#### Post delete

`DELETE /posts/:postid`

Protected Route

No request body needed. The response will be the deleted Post.

#### Create comment

`POST /posts/:postid`

Request body:

- username: String, between 2 and 20 characters
- text: String, between 1 and 500 characters

#### Delete comment

`DELETE /posts/:postid/comments/:commentid`

Protected route

No request body. Response will be the deleted comment.

#### Log in

`POST /auth/login`

Request body:

- email: String
- password: String

When successful the response will contain a JWT Token that can be stored in Local Memory by the client and then used in Authorization headers to access protected routes.

Token expiration: 12 hours

#### Sign-up

`POST /auth/sign-up`

To make a new Admin capable of managing the blog posts and comments.

Request body:

- username: String
- email: String
- password : String
- secret: String

The password will be hashed and salted using `bcrypt`

The response will contain the user object

---

### Errors

Error responses are standardized to unify error sources (validation, database, bad parametes, exceptions, etc)

Generic `Error` objects are converted into `StandardError` and then passed to the final error handler that responds to the client with a detailed report:

```json
// EXAMPLE: Error trying to post a comment
// (postid parameter was incorrect)

{
  "path": "POST /posts/65a0494e5046608390f2b",
  "status": 404,
  "message": "No post found with provided ID",
  "cause": {
    "stringValue": "\"65a0494e5046608390f2b\"",
    "valueType": "string",
    "kind": "ObjectId",
    "value": "65a0494e5046608390f2b",
    "path": "_id",
    "reason": {},
    "name": "CastError",
    "message": "Cast to ObjectId failed for value \"65a0494e5046608390f2b\" (type string) at path \"_id\" for model \"post\""
  }
}
```

The `cause` object contains either the original error or an array of validation errors.

The only exception to this rule is when a protected route returns `401 Unauthorized` upon authorization failure

## Models

### Post Schema

```js
{
  author: { type: Schema.Types.ObjectId, required: true, ref: "admin" },
  title: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, required: true, default: new Date() },
  media: { type: String, required: false },
  status: { type: String, required: true, default: "unpublished" },
}
```

---

### Comment Schema

```js
{
  post: { type: Schema.Types.ObjectId, required: true, ref: "post" },
  username: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: String, required: true, default: new Date() },
}
```

---

### Admin Schema

```js
{
  username: { type: String, required: true },
  email: { type: String, requried: true },
  password: { type: String, required: true },
}
```
