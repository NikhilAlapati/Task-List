/**
 * Name: Nikhil Alapati
 * Date: 5/18/2020
 * Section: CSE 154 A/AC
 *
 * This the the backend Node JS for the task list app this keeps track of all
 * the posts sent to it by storing it in a json file each different task name
 * must be unique and it removes the post when called and validates whether the
 * name is unique
 */
"use strict";

/**
 * Dependencies
 */
const express = require("express");
const multer = require("multer");
const app = express();

// code for the server issue code
const ERROR_STATUS_CODE = 500;

// code for invalid input
const ERROR_INVALID_REQUEST = 400;

// For application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

// For application/json
app.use(express.json());

// For multipart/form-data (required with FormData)
app.use(multer().none());

// For file reading and writing
const fs = require("fs").promises;

/**
 * Returns the stored posts by parsing the JSON file
 */
async function getPosts() {
  let posts = await fs.readFile("posts.json", "UTF-8");
  return JSON.parse(posts);
}

/**
 * Adds post to the json file
 * @param {string} name name of the new task post
 * @param {string} description description of the new task
 */
async function addPost(name, description) {
  let posts;
  await getPosts()
    .then((responseData) => {
      posts = responseData;
    });
  posts.push({"name": name,
    "description": description});
  fs.writeFile("posts.json", JSON.stringify(posts));
}

/**
 * Validates name of task validation checks whether there is a duplicate task
 * name if there is a duplicate it sends back that its not valid
 * @param {string} postedName name of the task
 */
async function validateName(postedName) {
  let posts;
  await getPosts()
    .then((responseData) => {
      posts = responseData;
    });
  for (let i = 0; i < posts.length; i++) {
    if (posts[i].name === postedName) {
      return false;
    }
  }
  return true;
}

/**
 * Get endpoint for to validate name
 * requests a name as a query parameter
 * returns a text
 */
app.get("/validate", (req, res) => {
  let name = req.query.name;
  if (name.trim === "") {
    res.status(ERROR_INVALID_REQUEST).send("INVALID INPUT NAME EMPTY");
  } else {
    validateName(name).then((responseData) => {
      if (responseData === false) {
        res.type("text").send("Task name already exists");
      } else {
        res.type("text").send("Task name available");
      }
    })
      .catch((err) => {
        res.status(ERROR_STATUS_CODE).send("Server side error " + err);
      });
  }
});

/**
 * Get endpoint to get all the posts from JSON
 * returns JSON
 */
app.get("/getPosts", (req, res) => {
  getPosts()
    .then((responseData) => {
      res.type("JSON").send(responseData);
    })
    .catch((err) => {
      res.status(ERROR_STATUS_CODE).send("Server side error " + err);
    });
});

/**
 * Post endpoint to post a task
 * requests a name as body parameter
 * returns a text message saying it is successful on adding
 */
app.post("/postTask", (req, res) => {
  let name = req.body.name;
  let description = req.body.description;
  addPost(name, description)
    .catch((err) => {
      res.status(ERROR_STATUS_CODE).send("Server side error " + err);
    });
  res.type("text").send("post added with: " + name + " and " + description);
});

/**
 * Post endpoint for removing a task
 * requests a name as a body parameter
 * and returns if the post is removed
 */
app.post("/removeTask", async (req, res) => {
  let name = req.body.name;
  let posts = [];
  await removeTask(name)
    .then((responseData) => {
      posts = responseData;
    })
    .catch((err) => {
      res.status(ERROR_STATUS_CODE).send("Server side error " + err);
    });
  fs.writeFile("posts.json", JSON.stringify(posts));
  res.type("text").send("Removed");
});

/**
 * Removes task
 * @param {string}name of task to be removed
 */
async function removeTask(name) {
  let posts;
  let newPosts = [];
  await getPosts()
    .then((responseData) => {
      posts = responseData;
    });
  for (let i = 0; i < posts.length; i++) {
    if (posts[i].name !== name) {
      newPosts.push(posts[i]);
    }
  }
  return newPosts;
}

// Tells the app to use public folder for frontend
app.use(express.static("public"));

// The port
const PORT_NUM = 8000;
const PORT = process.env.PORT || PORT_NUM;

// Tells the app to use this port to listen to
app.listen(PORT);
