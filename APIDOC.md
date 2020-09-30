# Task List API Documentation
The task list API provides the backend support for tasks to be stored in the server
and able to add new tasks and remove tasks as needed

## Validate weather a new Task name is Valid.
**Request Format:** /validate

**Request Type:** GET

**Returned Data Format**: Plain Text

**Description:** Checks weather a passed in name is valid meaning weather is
appears more than once if it does it will send a message saying "Task name already exists"


**Example Request:** /validate?name=get CP4 Done

**Example Response:**
```
Task name available

```

**Error Handling:**
Possible 500(Internal Server Error) if the posts.json is not found
with the message: `Server side error {error message}`
Possible 400(Bad Request) is name passed in is empty with a message
`INVALID INPUT NAME EMPTY`

## Get All the Tasks
**Request Format:** /getPosts

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Gets all the posts from posts.json and returns it in JSON format

**Example Request:** /getPosts

**Example Response:**

```json
{
[
    {
        "name": "cet cp4 done",
        "description": "Submit it to grade scope"
    },
    {
        "name": "cet HW2 done",
        "description": "Submit it to grade scope"
    }
]
}
```

**Error Handling:**
Possible 500(Internal Server Error) if the posts.json is not found
with the message: `Server side error {error message}`

## posts a task to the server
**Request Format:** /postTask

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** Posts a task to the posts.json file


**Example Request:** /postTask with POST parameters of `name=INSERT NAME HERE` and `description = INSERT DESCRIPTION HERE`

**Example Response:**
```
post added with: {name} and {description}

```

**Error Handling:**
Possible 500(Internal Server Error) if the posts.json is not found
with the message: `Server side error {error message}`

## removes a task from the server.
**Request Format:** /removeTask

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** Removes a task from posts.json in  the server using
a given name thus duplicate names cannot exist


**Example Request:** /removeTask with POST parameter of `name = INSERT NAME HERE`

**Example Response:**
```
Removed

```

**Error Handling:**
Possible 500(Internal Server Error) if the posts.json is not found
with the message: `Server side error {error message}`