/** */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";
import {
  getAuth,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  push,
  get,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

/** 
@Name : Amresh
@Description : This is config with firebase 
*/
const firebaseConfig = {
  apiKey: "AIzaSyDlOzaOItsULh6D9bSbXfayh0bYoYZduJc",
  authDomain: "todo-app-javascript-cd16a.firebaseapp.com",
  databaseURL: "https://todo-app-javascript-cd16a-default-rtdb.firebaseio.com",
  projectId: "todo-app-javascript-cd16a",
  storageBucket: "todo-app-javascript-cd16a.appspot.com",
  messagingSenderId: "685467623041",
  appId: "1:685467623041:web:5486f224a7c572d49bf780",
  measurementId: "G-PZ65MB7YY0",
};
/** 
@Name : Amresh
@Description : This is config with firebase 
*/
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);

/** 
@Name : Amresh
@Description : Here Create all Globle variable
*/
let currentUserId = null;
let editKey = "";
let completedKeys = [];
let allTodoKeys = [];
let filter = "all";
let profileImage = "";

/** 
@Name : Amresh
@Description : Google Sign-In Functionality
*/
function googleSignIn() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      currentUserId = user.uid;
      localStorage.setItem("currentUserId", currentUserId);
      localStorage.setItem("user", JSON.stringify(user));
      if (currentUserId) {
        console.log("User signed in with Google:", user);
        const userdetails = localStorage.getItem("user");
        const loginUserdetails = JSON.parse(userdetails);
        setTimeout(() => {
          profileImage = document.getElementById("profileImage");
          const userName = document.getElementById("userName");
          userName.innerText = loginUserdetails.displayName;
          profileImage.src = loginUserdetails.photoURL;
        }, 0);
        checkIfUserExists(currentUserId, user);
      } else {
        console.error("Error: User ID not found after sign-in.");
      }
    })
    .catch((error) => {
      console.error("Error during Google sign-in:", error.message);
    });
}

/** 
@Name : Amresh
@Description : Function to check if the user exists in the database
*/
function checkIfUserExists(userId, user) {
  const userRef = ref(database, "users/" + userId);
  get(userRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log("User already exists:", snapshot.val());
        getTodo();
        userId;
      } else {
        console.log("New user detected. Storing user info...");
        storeUserData(userId, user);
      }
    })
    .catch((error) => {
      console.error("Error checking if user exists:", error.message);
    });
}
/** 
@Name : Amresh
@Description : Function to store new user data in the database
*/
function storeUserData(userId, user) {
  set(ref(database, "users/" + userId), {
    username: user.displayName,
    email: user.email,
    profile_picture: user.photoURL,
    todos: [],
  })
    .then(() => {
      console.log("User data stored successfully.");
      getTodo();
      userId;
    })
    .catch((error) => {
      console.error("Error storing user data:", error.message);
    });
}

/** 
@Name : Amresh
@Description :  Handle Auth State Changes
*/
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserId = user.uid;
    console.log("User is logged in:", user);
    const userdetails = localStorage.getItem("user");
    const loginUserdetails = JSON.parse(userdetails);
    const signInElements = document.getElementsByClassName("signIn");
    const afterLogin = document.getElementsByClassName("afterLogin");
    const beforeMessage = document.getElementById("beforeMessage");
    setTimeout(() => {
      profileImage = document.getElementById("profileImage");
      const userName = document.getElementById("userName");
      userName.innerText = loginUserdetails.displayName;
      profileImage.src = loginUserdetails.photoURL;
    }, 1000);
    document.getElementById("input-value").readOnly = false;
    if (signInElements.length > 0) {
      signInElements[0].style.display = "none";
      afterLogin[0].style.display = "block";
      beforeMessage.style.display = "none";
    }
    const signOutButton = document.getElementsByClassName("signOut");
    if (signOutButton) {
      signOutButton[0].style.display = "block";
    }
  } else {
    currentUserId = null;
    console.log("User is logged out");
    const signInButton = document.getElementsByClassName("signIn");
    const afterLogin = document.getElementsByClassName("afterLogin");
    const beforeMessage = document.getElementById("beforeMessage");
    document.getElementById("input-value").readOnly = true;
    setTimeout(() => {
      profileImage = document.getElementById("profileImage");
      profileImage.src = "./images/profile-user.png";
    }, 0);
    if (signInButton) {
      signInButton[0].style.display = "block";
      afterLogin[0].style.display = "none";
      beforeMessage.style.display = "block";
    }

    // Access the element with the id 'googleSignOutButton'
    const signOutButton = document.getElementsByClassName("signOut");
    if (signOutButton) {
      signOutButton[0].style.display = "none";
    }
  }
});
/** 
@Name : Amresh
@Description : Signout google account 
*/
function googleSignOut() {
  signOut(auth)
    .then(() => {
      localStorage.clear();
      getTodo();
    })
    .catch((error) => {});
}
/** 
@Name : Amresh
@Description :  addEventListener click on googleSignIn()
*/
document
  .getElementById("googleSignInButton")
  .addEventListener("click", googleSignIn);
/** 
@Name : Amresh
@Description :  addEventListener click on googleSignOut()
*/
document
  .getElementById("googleSignioutButton")
  .addEventListener("click", googleSignOut);

/** 
@Name : Amresh
@Description :  Store inputvalue in this variable
*/
const inputValue = document.getElementById("input-value");
const editModeCancle = document.getElementById("edit-mode-cancel");
/** 
@Name : Amresh
@Description : Set light/dark mode
*/
const themeToggleBtn = document.getElementById("theme-toggle");
const currentTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", currentTheme);
/** 
@Name : Amresh
@Description : Set light/dark icon color
*/
const currentcolor = localStorage.getItem("color") || "black";
themeToggleBtn.style.color = currentcolor;

/** 
@Name : Amresh
@Description : Click on icon dark and ligt mode set 
*/
themeToggleBtn.addEventListener("click", function () {
  let theme = document.documentElement.getAttribute("data-theme");
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    localStorage.setItem("color", "white");
    themeToggleBtn.style.color = "white";
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
    localStorage.setItem("color", "black");
    themeToggleBtn.style.color = "black";
  }
});

/** 
@Name : Amresh
@Description :showloader function call loader 
*/
function showLoader() {
  const blurContainer = document.querySelector("#blur-container");
  const loader = document.querySelector("#loader");
  loader.classList.remove("hidden");
  blurContainer.classList.add("blur-container");
}

/** 
@Name : Amresh
@Description :hideLoader function call  hide loader
*/
function hideLoader() {
  const blurContainer = document.querySelector("#blur-container");
  const loader = document.querySelector("#loader");
  loader.classList.add("hidden");
  blurContainer.classList.remove("blur-container");
}

/** 
@Name : Amresh
@Description :Check key value and call functon postTodo and editTodo
*/
inputValue.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && inputValue.value) {
    if (editKey === "") {
      postTodo();
    } else {
      editTodoDetail();
    }
  }
});

/** 
@Name : Amresh
@Description : Get Todo Data from Firebase
*/
async function getTodo() {
  console.log("dscdc");

  const currentUserId = localStorage.getItem("currentUserId");
  showLoader();
  const userRef = ref(database, `users/${currentUserId}/todos`);
  try {
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      renderData(snapshot.val());
    } else {
      renderData(null);
    }
  } catch (error) {
    console.log("Error getting data:", error);
  }
}

/** 
@Name : Amresh
@Description : Post  Todo Data to Firebase
*/
async function postTodo() {
  const userRef = ref(database, `users/${currentUserId}/todos`);
  try {
    const newTodoRef = push(userRef);
    await set(newTodoRef, {
      userInput: inputValue.value,
      completed: false,
    });
    inputValue.value = "";
    getTodo();
  } catch (error) {
    console.log("Error posting data:", error);
  }
}

/** 
@Name : Amresh
@Description : This method edit todo item  after after edit get new todo list
*/
function editTodoDetail() {
  const itemRef = ref(database, `users/${currentUserId}/todos/${editKey}`);
  update(itemRef, { userInput: inputValue.value })
    .then(() => {
      inputValue.value = "";
      editKey = "";
      getTodo();
    })
    .catch((error) => {
      console.log("Error updating data:", error);
    });
}
// Render data with filter
/** 
@Name : Amresh
@Description :Render todo base on filter by all active and completed  
*/
function renderData(data) {
  const tabs = document.querySelectorAll(".tab");
  let draggedItem = null;
  function removeActiveClass() {
    tabs.forEach((tab) => tab.classList.remove("active"));
  }
  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      removeActiveClass();
      tab.classList.add("active");
      filter = tab.getAttribute("data-filter");
      renderData(data);
    });
  });

  const container = document.querySelector("#container");
  container.innerHTML = "";
  const totalItemsCount = !data ? 0 : Object.keys(data).length;
  const itemsLeftCount = !data
    ? 0
    : Object.keys(data).filter((key) => !data[key].completed).length;
  document.getElementById(
    "total-item"
  ).innerHTML = `${totalItemsCount} Total Items`;
  document.getElementById(
    "left-item"
  ).innerHTML = `${itemsLeftCount} Items Left`;

  if (totalItemsCount === 0) {
    const p = document.createElement("p");
    p.innerHTML = "No Record Found";
    p.classList.add(
      "d-flex",
      "justify-content-center",
      "align-items-center",
      "h-100",
      "p-16"
    );
    container.appendChild(p);
  } else {
    let filteredTodos;
    if (filter === "active") {
      filteredTodos = Object.keys(data).filter((key) => !data[key].completed);
    } else if (filter === "completed") {
      filteredTodos = Object.keys(data).filter((key) => data[key].completed);
    } else {
      filteredTodos = Object.keys(data);
    }
    for (let key of filteredTodos.reverse()) {
      const item = data[key];
      allTodoKeys.push(key);
      if (data[key].completed) {
        completedKeys.push(key);
      }
      // Create div to insert all details
      const itemDiv = document.createElement("div");
      itemDiv.setAttribute("draggable", "true");
      itemDiv.setAttribute("data-index", key);
      itemDiv.classList.add("list-of-item");
      // Drag-and-drop event listeners
      itemDiv.addEventListener("dragstart", function () {
        draggedItem = itemDiv;
      });

      itemDiv.addEventListener("dragend", function () {
          draggedItem = null;
      });

      itemDiv.addEventListener("dragover", function (e) {
        e.preventDefault();
      });

      itemDiv.addEventListener("drop", function () {
        if (draggedItem !== itemDiv) {
          container.insertBefore(draggedItem, itemDiv.nextSibling);
          // Update the data structure to reflect the new order if necessary
        }
      });
      // Create Checkbox
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = item.completed;
      checkbox.classList.add("checkbox-round");
      checkbox.addEventListener("change", (e) => {
        checkboxFunction(key, e.target.checked);
      });
      // User input display
      const userInputElement = document.createElement("p");
      userInputElement.textContent = item.userInput;
      if (item.completed) {
        editCancekl();
        userInputElement.style.textDecorationLine = "line-through";
      }
      // Edit and delete icons
      const editIcon = document.createElement("span");
      if (!item.completed) {
        editIcon.classList.add("bi", "bi-pencil-square");
        editIcon.style.cursor = "pointer";
        editIcon.addEventListener("click", () => {
          editModeCancle.classList.remove("hidden");
          editKey = key;
          inputValue.value = item.userInput;
        });
      }
      const deleteIcon = document.createElement("span");
      deleteIcon.classList.add("bi", "bi-trash");
      deleteIcon.style.cursor = "pointer";
      deleteIcon.addEventListener("click", () => {
        const deleteStatus = "delete";
        editCancekl();
        showConfirmBox(key, deleteStatus);
      });
      // Action div
      const actionDiv = document.createElement("div");
      actionDiv.append(editIcon);
      actionDiv.append(deleteIcon);
      // Append checkbox, user input, and actions to the item div
      itemDiv.appendChild(checkbox);
      itemDiv.appendChild(userInputElement);
      itemDiv.appendChild(actionDiv);
      // Append item div to the container
      container.appendChild(itemDiv);
    }
  }
  hideLoader();
}
/** 
@Name : Amresh
@Description : This method edit mode cancle
*/
editModeCancle.addEventListener("click", editCancekl);
function editCancekl() {
  editKey = "";
  inputValue.value = "";
  editModeCancle.classList.add("hidden");
}
/** 
@Name : Amresh
@Description : This method call checkboxFunction and check toto completed or not 
              after get Todo
*/
function checkboxFunction(key, checkBoxValue) {
  const itemRef = ref(database, `users/${currentUserId}/todos/${key}`);
  update(itemRef, { completed: checkBoxValue })
    .then(() => {
      getTodo();
    })
    .catch((error) => {
      console.log("Error updating data:", error);
    });
}

/** 
@Name : Amresh
@Description : This method delete todo item  after delete get new todo list
*/
function deleteTodoItem(key) {
  const itemRef = ref(database, `users/${currentUserId}/todos/${key}`);
  remove(itemRef)
    .then(() => {
      getTodo();
    })
    .catch((error) => {
      console.log("Error deleting data:", error);
    });
}

/** 
@Name : Amresh
@Description : This method  delete all todo item in firebase database and update todo list
*/
function showConfirmBox(keys, deleteStatus) {
  document.getElementById("confirmBox").style.display = "flex";
  const confirm = document.getElementById("confirm");
  const cancel = document.getElementById("cancel");
  confirm.addEventListener("click", () => {
    switch (deleteStatus) {
      case "delete":
        deleteTodoItem(keys);
        document.getElementById("confirmBox").style.display = "none";
        break;
      case "deleteAll":
        deleteAllTodoItems(keys);
        document.getElementById("confirmBox").style.display = "none";
        break;
      case "deleteCompleted":
        deleteCompletedToditem(keys);
        document.getElementById("confirmBox").style.display = "none";
        break;
      default:
        break;
    }
  });
  cancel.addEventListener("click", () => {
    document.getElementById("confirmBox").style.display = "none";
  });
}

/** 
@Name : Amresh
@Description : get  reference and click on eventlistner or call deleteCompletedToditem 
*/
if (completedKeys.length === 0) {
  const clearCompleted = document.getElementById("clearCompleted");
  clearCompleted.addEventListener("click", () => {
    const deleteStatus = "deleteCompleted";
    console.log(completedKeys);
    showConfirmBox(completedKeys, deleteStatus);
  });
}

/** 
@Name : Amresh
@Description : This method  delete comppleted all todo item in fire base database and update todo list
*/
async function deleteCompletedToditem(keys) {
  const userRef = ref(database, `users/${currentUserId}/todos`);
  const updates = {};
  keys.forEach((key) => {
    updates[key] = null;
  });
  try {
    await update(userRef, updates);
    getTodo();
  } catch (error) {
    console.log("Error deleting data:", error);
  }
}

/** 
@Name : Amresh
@Description : get reference and click on eventlistner or call deleteAllTodoItems 
*/
if (allTodoKeys.length === 0) {
  const clearAll = document.getElementById("clearAll");
  clearAll.addEventListener("click", () => {
    const deleteStatus = "deleteAll";
    showConfirmBox(allTodoKeys, deleteStatus);
  });
  getTodo();
}

/** 
@Name : Amresh
@Description : This method  delete all todo item in firebase database and update todo list
*/
async function deleteAllTodoItems(Keys) {
  const userRef = ref(database, `users/${currentUserId}/todos`);
  const updates = {};
  Keys.forEach((key) => {
    updates[`${key}`] = null;
  });
  try {
    const response = await update(userRef, updates);
    getTodo();
  } catch (error) {
    console.log("Error deleting data:", error);
  }
}
