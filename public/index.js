/**
 * Name: Nikhil Alapati
 * Date: 5/18/2020
 * Section: CSE 154 A/AC
 *
 * This is the front end JS file for the Task List app this file keeps track
 * of the input and sends the input to the server to be stored this app also
 * gets the previously added tasks from the server and puts it back on the task
 * list
 */
"use strict";

(function() {
  // MODULE GLOBAL PARAMS is a variable for form data
  let PARAMS;

  /**
   * This prevents the JS from accessing the HTML elements before the page is
   * loaded and calls the init function once loaded
   */
  window.addEventListener("load", init);

  /**
   * called when the windows is loaded it calls getTasks which gets previously
   * created tasks from the server and adds it. the init also adds a event
   * listener on the submit button which then calls the validateData function
   */
  async function init() {
    id("task-desc").textContent = "";
    await getTasks();
    id("form").addEventListener("submit", (event) => {
      event.preventDefault();
      validateData();
    });
  }

  /**
   * gets the previous tasks from the server and calls processGetPostsData
   * which puts those task on the task list on the website
   */
  async function getTasks() {
    let url = "/getPosts";
    await fetch(url)
      .then(checkStatus)
      .then(resp => resp.json())
      .then(processGetPostsData)
      .catch((err) => {
        handleError("Server possibly down ERROR CODE:" + err.toString());
      });
  }

  /**
   * processes data to get the posts and put it on the website
   * @param {object} responseData data from the server
   */
  function processGetPostsData(responseData) {
    let posts = responseData;
    for (let i = 0; i < posts.length; i++) {
      let postForm = new FormData();
      postForm.append("name", posts[i].name);
      postForm.append("description", posts[i].description);
      addTask(postForm, false);
    }
  }

  /**
   * validates that there are no duplicate task names by making a request to
   * server and passing the name to it which checks if there is any duplicate
   */
  function validateData() {
    id("error").textContent = "";
    PARAMS = new FormData();
    PARAMS.append("name", id("task-name").value);
    PARAMS.append("description", id("task-desc").value);
    let url = "/validate?name=" + PARAMS.get("name");
    fetch(url)
      .then(checkStatus)
      .then(resp => resp.text())
      .then(processValidationData)
      .catch((err) => {
        handleError(err.toString());
      });
  }

  /**
   * processes the output data from the validate request if the server responds
   * that its a duplicate it calls the handleError function which shows a user
   * friendly message on the website
   * @param {string} responseData response text from server
   */
  function processValidationData(responseData) {
    if (responseData === "Task name already exists") {
      handleError("Task name already exists please enter a different name");
    } else {
      addTask(PARAMS, true);
    }
  }

  /**
   * adds the task to the DOM
   * @param {object} formDataParam form data passed in
   * @param {boolean} toPost weather to post the task to server of not
   */
  function addTask(formDataParam, toPost) {
    let url = "/postTask";
    if (toPost === true) {
      fetch(url, {method: "POST", body: formDataParam})
        .then(checkStatus)
        .catch((err) => {
          handleError(err.toString());
        });
    }
    let taskBox = gen("div");
    taskBox.classList.add("task");
    let namePara = gen("p");
    namePara.textContent = formDataParam.get("name");
    taskBox.appendChild(namePara);
    let descriptionPara = gen("p");
    descriptionPara.textContent = formDataParam.get("description");
    let removeBtn = gen("button");
    removeBtn.classList.add("remove");
    removeBtn.textContent = "Delete Task";
    removeBtn.addEventListener('click', () => {
      removeTask(taskBox);
    });
    taskBox.appendChild(descriptionPara);
    taskBox.appendChild(removeBtn);
    qs(".cards").appendChild(taskBox);
  }

  /**
   * removes a task from the DOM and sends a request to the server to remove it
   * @param {object} taskBox task element
   */
  function removeTask(taskBox) {
    let taskChildren = taskBox.children;
    let sendParams = new FormData();
    sendParams.append("name", taskChildren[0].textContent);
    sendParams.append("description", taskChildren[1].textContent);
    let url = "/removeTask";
    fetch(url, {method: "POST", body: sendParams})
      .then(checkStatus)
      .catch((err) => {
        handleError(err.toString());
      });
    qs(".cards").removeChild(taskBox);
  }

  /**
   * checks the status of the fetch call
   * @param {object} response response of the server
   * @returns {object} response response of the server
   */
  function checkStatus(response) {
    if (response.ok) {
      return response;
    }
    throw Error("Error in request: " + response.statusText);

  }

  /**
   * handles the error of fetch call
   * @param {string} errorMessage error message to be displayed
   */
  function handleError(errorMessage) {
    id("error").textContent = errorMessage;
  }

  /** ------------------------------ Helper Functions  ------------------------------ */

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} The first DOM object matching the query.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns a new element with the given tag name.
   * @param {string} tagName - HTML tag name for new DOM element.
   * @returns {object} New DOM object for given HTML tag.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

})();