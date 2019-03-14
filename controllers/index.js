const MongoClient = require("mongodb").MongoClient;
const { MONGO_URL } = require("../config/config.json");

module.exports = {
  getUsers() {
    return new Promise((resolve, reject) => {
      let response = {
        success: false
      };
      MongoClient.connect(
        MONGO_URL,
        {
          useNewUrlParser: true
        },
        function(err, db) {
          if (err) throw err;
          let dbo = db.db("master");
          dbo
            .collection("users")
            .find({})
            .toArray(function(err, data) {
              if (err) {
                (response.success = false), (response.message = err);
              }
              response.success = true;
              response.data = data;
              db.close();
              resolve(response);
            });
        }
      );
    });
  },

  getUserPosts(userId) {
    return new Promise((resolve, reject) => {
      let response = {
        success: false
      };
      MongoClient.connect(
        MONGO_URL,
        {
          useNewUrlParser: true
        },
        function(err, db) {
          if (err) throw err;
          let dbo = db.db(`user_${userId}`);
          dbo
            .collection("posts")
            .find({})
            .toArray(function(err, data) {
              if (err) {
                (response.success = false), (response.message = err);
              }
              if (data.length === 0) {
                (response.success = false),
                  (response.message = "No posts or user id does not exists");
              }
              response.success = true;
              response.data = data;
              db.close();
              resolve(response);
            });
        }
      );
    });
  },

  updateUserAvatar(userId, userAvatar) {
    return new Promise((resolve, reject) => {
      let response = {
        success: false
      };
      MongoClient.connect(
        MONGO_URL,
        {
          useNewUrlParser: true
        },
        function(err, db) {
          if (err) throw err;
          let dbo = db.db("master");
          dbo
            .collection("users")
            .findOneAndUpdate(
              { id: userId },
              { $set: { avatar: userAvatar } },
              { upsert: false, returnNewDocument: true }
            )
            .then(data => {
              console.log("success");
              console.log(data);
              if (data.lastErrorObject.updatedExisting === false) {
                (response.success = false),
                  (response.message =
                    "User Id not supplied or No user found with the ID : " +
                    userId);
              } else (response.success = true), (response.data = data);
            })
            .catch(err => {
              (response.success = false), (reponse.message = err);
            })
            .finally(() => {
              db.close();
              resolve(response);
            });
        }
      );
    });
  }
};
