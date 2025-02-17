## Database Architecture

The schemas for the database are documented in the directory `server/models/schema`.
A class diagram for the schema definition is shown below:

![Class Diagram](class-diagram.png)

## API Routes

#### `/answer`

| Endpoint   | Method | Description      |
| ---------- | ------ | ---------------- |
| /addAnswer | POST   | Add a new answer |

#### `/comment`

| Endpoint    | Method | Description       |
| ----------- | ------ | ----------------- |
| /addComment | POST   | Add a new comment |

#### `/messaging`

| Endpoint     | Method | Description           |
| ------------ | ------ | --------------------- |
| /addMessage  | POST   | Add a new message     |
| /getMessages | GET    | Retrieve all messages |

#### `/question`

| Endpoint          | Method | Description                     |
| ----------------- | ------ | ------------------------------- |
| /getQuestion      | GET    | Fetch questions by filter       |
| /getQuestionById/ | GET    | Fetch a specific question by ID |
| /addQuestion      | POST   | Add a new question              |
| /upvoteQuestion   | POST   | Upvote a question               |
| /downvoteQuestion | POST   | Downvote a question             |

#### `/tag`

| Endpoint                   | Method | Description                                   |
| -------------------------- | ------ | --------------------------------------------- |
| /getTagsWithQuestionNumber | GET    | Fetch tags along with the number of questions |
| /getTagByName/             | GET    | Fetch a specific tag by name                  |

#### `/user`

| Endpoint       | Method | Description                    |
| -------------- | ------ | ------------------------------ |
| /signup        | POST   | Create a new user account      |
| /login         | POST   | Log in as a user               |
| /resetPassword | PATCH  | Reset user password            |
| /getUser/      | GET    | Fetch user details by username |
| /deleteUser/   | DELETE | Delete a user by username      |

## Running Stryker Mutation Testing

Mutation testing helps you measure the effectiveness of your tests by introducing small changes (mutations) to your code and checking if your tests catch them. To run mutation testing with Stryker, use the following command in `server/`:

```sh
npm run stryker
```

{ : .note } In case you face an "out of memory" error while running Stryker, use the following command to increase the memory allocation to 4GB for Node.js:

```sh
node --max-old-space-size=4096 ./node_modules/.bin/stryker run
```
