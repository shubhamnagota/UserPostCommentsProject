# User Post Comments Project

A simple application which uses JSONPlaceholder.com to get the data and store it into MongoDB and then exposes some basic API for some operations.

### Technology Used

- [Node.js](https://nodejs.org/) - evented I/O for the backend
- [MongoDB](https://www.mongodb.com/) - Database-as-a-Service for MongoDB
- [Postman](https://www.getpostman.com/) - Postman Simplifies API Development

### How to run

[Assuming you have MongoDB installed and the mongo server is running at http://localhost:27017]

This application is tested on Node.js v10.x

```sh
$ git clone https://github.com/shubhamnagota/UserPostCommentsProject.git
$ cd UserPostCommentsProject
$ node DataPopulator.js
$ npm start
```

### Testing

- Open the postman and go to the link 'http://localhost:4000', if it says {success:true}
- Then test the app by following apis:
  - GetUsers : http://localhost:4000/api/users [GET]
  - GetUserPosts : http://localhost:4000/api/posts?userId=1 [GET]
  - GetAllUsersWithPosts : http://localhost:4000/api/getAllUsersWithPosts [GET]
  - UpdateUserAvatar : http://localhost:4000/api/updateUserAvatar [PUT]
    Note: you have to pass userid and avatar parameters in the body as json for updateuseravatar api
