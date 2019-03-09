const router = require("express").Router();
const MongoClient = require("mongodb").MongoClient;

const { MONGO_URL } = require("../config/config.json");

router.get("/users", getUsers);
router.get("/posts", getUserPosts);
router.put("/updateUserAvatar", updateUserAvatar);

function getUsers(req, res) {
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
          if (err)
            return res.status(400).json({
              success: false,
              message: err
            });

          res.status(200).json({ success: true, data });
          db.close();
        });
    }
  );
}

function getUserPosts(req, res) {
  let userId = req.query.userId;
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
        .toArray(function(err, result) {
          if (err)
            return res.status(400).json({
              success: false,
              message: err
            });
          if (result.length === 0)
            return res.status(404).json({
              success: false,
              message: "No posts or user id does not exists"
            });
          res.status(200).json({ success: true, result });
          db.close();
        });
    }
  );
}
function updateUserAvatar(req, res) {
  let userAvatar = req.body.avatarUrl;
  let userId = req.body.userId;
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
          { upsert: true, returnNewDocument: true }
        )
        .then(data => {
          return res.status(200).json({ success: true, data });
        })
        .catch(err => {
          return res.status(400).json({
            success: false,
            message: err
          });
        })
        .finally(() => db.close());
    }
  );
}
module.exports = router;
