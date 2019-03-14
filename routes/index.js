const router = require("express").Router();
const controller = require("../controllers");

router.get("/users", getUsers);
router.get("/posts", getUserPosts);
router.get("/getAllUsersWithPosts", getAllUsersWithPosts);
router.put("/updateUserAvatar", updateUserAvatar);

function getUsers(req, res) {
  controller.getUsers().then(responseJson => {
    if (responseJson.success === false) {
      res.status(400).json(responseJson);
    }
    res.status(200).json(responseJson);
  });
}

function getUserPosts(req, res) {
  let userId = req.query.userId;
  controller.getUserPosts(userId).then(responseJson => {
    if (responseJson.success === false) {
      res.status(400).json(responseJson);
    }
    res.status(200).json(responseJson);
  });
}

function updateUserAvatar(req, res) {
  let userAvatar = req.body.avatarUrl;
  let userId = req.body.userId;
  controller.updateUserAvatar(userId, userAvatar).then(responseJson => {
    if (responseJson.success === false) {
      res.status(400).json(responseJson);
    }
    res.status(200).json(responseJson);
  });
}

function getAllUsersWithPosts(req, res) {
  controller.getUsers().then(users => {
    let usersIdArr = [];
    let promiseArr = [];
    users.data.forEach(user => {
      usersIdArr.push(user.id);
      promiseArr.push(controller.getUserPosts(user.id));
    });
    Promise.all(promiseArr).then(result => {
      let usersJsonWithPosts_Array = result.map((postsData, index) => {
        let usersJsonWithPosts = {};
        usersJsonWithPosts.userId = usersIdArr[index];
        usersJsonWithPosts.posts = postsData.data;
        return usersJsonWithPosts;
      });
      res.json({ success: true, data: usersJsonWithPosts_Array });
    });
  });
}

module.exports = router;
