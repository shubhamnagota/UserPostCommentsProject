const axios = require("axios");
const MongoClient = require("mongodb").MongoClient;

let url = require("./config/config.json").MONGO_URL;

getUsersData = async () => {
  try {
    const { status, data } = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );
    if (status === 200) return data;
  } catch (e) {
    console.log(e);
  }
};
getPostsData = async () => {
  try {
    const { status, data } = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    if (status === 200) return data;
  } catch (e) {
    console.log(e);
  }
};
getCommentsData = async () => {
  try {
    const { status, data } = await axios.get(
      "https://jsonplaceholder.typicode.com/comments"
    );
    if (status === 200) return data;
  } catch (e) {
    console.log(e);
  }
};

getUsersData()
  .then(usersData => {
    writeDataToMongo("master", "users", usersData);
    getPostsData()
      .then(postsData => {
        getCommentsData()
          .then(commentsData => {
            let postsDataWithComments = mapPostsToComments(
              postsData,
              commentsData
            );
            // writeDataToFile("postsData", newPostCommentObject);

            writeUsersDataWithPosts(usersData, postsDataWithComments);
          })
          .catch(e => console.log(e));
      })
      .catch(e => {
        console.log(e);
        process.exit(1);
      });
  })
  .catch(e => {
    console.log(e);
    process.exit(1);
  });

mapPostsToComments = (postsObject, commentsObject) => {
  let newPostCommentObject = [];
  postsObject.forEach(post => {
    let comments = [];
    commentsObject.forEach(comment => {
      if (post.id === comment["postId"]) {
        delete comment["postId"];
        comments.push(comment);
      }
    });
    post["comments"] = comments;
    newPostCommentObject.push(post);
  });
  return newPostCommentObject;
};

writeUsersDataWithPosts = (usersData, postsData) => {
  usersData.forEach(user => {
    let posts = [];
    postsData.forEach(post => {
      if (user.id === post["userId"]) {
        delete post["userId"];
        posts.push(post);
      }
    });
    // Final method to write posts data to individual user's DB
    writeDataToMongo(`user_${user["id"]}`, "posts", posts);
  });
};

writeDataToFile = (filename, data) => {
  require("fs").writeFile(`${filename}.json`, JSON.stringify(data), function(
    err
  ) {
    if (err) {
      return console.log(err);
    }
    console.log(filename + " was saved!");
  });
};

writeDataToMongo = (dbName, collectionName, data) => {
  MongoClient.connect(
    url,
    {
      useNewUrlParser: true
    },
    function(err, db) {
      if (err) throw err;
      let dbo = db.db(dbName);
      dbo.collection(collectionName).insertMany(data, function(err, res) {
        if (err) throw err;
        console.log(
          `Number of documents inserted in DB : ${dbName} and Collection : ${collectionName} are ` +
            res.insertedCount
        );
        db.close();
      });
    }
  );
};
