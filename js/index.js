// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";
import { getAuth,signOut, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getDatabase, ref, set, push, get, update, remove } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDlOzaOItsULh6D9bSbXfayh0bYoYZduJc",
  authDomain: "todo-app-javascript-cd16a.firebaseapp.com",
  databaseURL: "https://todo-app-javascript-cd16a-default-rtdb.firebaseio.com",
  projectId: "todo-app-javascript-cd16a",
  storageBucket: "todo-app-javascript-cd16a.appspot.com",
  messagingSenderId: "685467623041",
  appId: "1:685467623041:web:5486f224a7c572d49bf780",
  measurementId: "G-PZ65MB7YY0"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);
let currentUserId = null;

// Google Sign-In Functionality
function googleSignIn() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      currentUserId = user.uid;
      console.log(currentUserId);
      localStorage.setItem("currentUserId",currentUserId)
      
      if (currentUserId) {
        console.log("User signed in with Google:", user);
        checkIfUserExists(currentUserId, user);
      } else {
        console.error("Error: User ID not found after sign-in.");
      }
    })
    .catch((error) => {
      console.error("Error during Google sign-in:", error.message);
    });
}

// Function to check if the user exists in the database
function checkIfUserExists(userId, user) {
  const userRef = ref(database, 'users/' + userId);
  
  get(userRef).then((snapshot) => {
    if (snapshot.exists()) {
      console.log("User already exists:", snapshot.val());
      getData(userId); // Fetch and handle existing user data
    } else {
      console.log("New user detected. Storing user info...");
      storeUserData(userId, user);
      // Fetch data or initialize empty todos if needed
    }
  }).catch((error) => {
    console.error("Error checking if user exists:", error.message);
  });
}
// / Function to store new user data in the database
function storeUserData(userId, user) {
  set(ref(database, 'users/' + userId), {
    username: user.displayName,
    email: user.email,
    profile_picture: user.photoURL,
    todos: [] 
  })
  .then(() => {
    console.log("User data stored successfully.");
    // Optionally, proceed to fetch or initialize data
    getData(userId);
  })
  .catch((error) => {
    console.error("Error storing user data:", error.message);
  });
}
console.log();

// Handle Auth State Changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserId = user.uid;
    console.log("User is logged in:", user);
    // Access the first element with the class 'signIn'
    const signInElements = document.getElementsByClassName("signIn");
    const afterLogin = document.getElementsByClassName("afterLogin");
    document.getElementById("input-value").readOnly=false;
    if (signInElements.length > 0) {
      signInElements[0].style.display = "none";
      afterLogin[0].style.display = "block";
    }
   

    // Access the element with the id 'signOut'
    const signOutButton = document.getElementsByClassName("signOut");
    if (signOutButton) {
      signOutButton[0].style.display = "block";
    }
   
  } else {
    currentUserId = null;
    console.log("User is logged out");
   // Access the element with the id 'googleSignInButton'
   const signInButton = document.getElementsByClassName("signIn");
   const afterLogin = document.getElementsByClassName("afterLogin");
    document.getElementById("input-value").readOnly=true;
   if (signInButton) {
     signInButton[0].style.display = "block";
     afterLogin[0].style.display = "none";
    }
 

   // Access the element with the id 'googleSignOutButton'
   const signOutButton = document.getElementsByClassName("signOut");
   if (signOutButton) {
     signOutButton[0].style.display = "none";
   }
  }
});

// signout
function googleSignOut(){
  signOut(auth).then(() => {
    getData(); 
    localStorage.clear()
  }).catch((error) => {
  });
}

document.getElementById("googleSignInButton").addEventListener("click", googleSignIn);
document.getElementById("googleSignioutButton").addEventListener("click", googleSignOut);

// set light mode and dark mode
const themeToggleBtn = document.getElementById("theme-toggle");
const currentTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", currentTheme);
const currentcolor = localStorage.getItem("color") || "black";
themeToggleBtn.style.color = currentcolor;

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
const inputValue = document.getElementById("input-value");

let editKey = "";
let completedKeys = [];
let Keys = [];

// show loader
function showLoader() {
  const blurContainer = document.querySelector("#blur-container");
  const loader = document.querySelector("#loader");
  loader.classList.remove("hidden");
  blurContainer.classList.add("blur-container");
}

// hide loader
function hideLoader() {
  const blurContainer = document.querySelector("#blur-container");
  const loader = document.querySelector("#loader");
  loader.classList.add("hidden");
  blurContainer.classList.remove("blur-container");
}

// Post data to the database using enty kys value
inputValue.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && inputValue.value) {
    if (editKey === "") {
      postData();
    } else {
      editDetail();
    }
  }
});
// // Get data from the database
// async function getData() {
//   showLoader();
//   const URL =
//     "https://todo-app-javascript-cd16a-default-rtdb.firebaseio.com/data.json";
//   try {
//     const response = await fetch(URL, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     const data = await response.json();
//     renderData(data);
//   } catch (error) {
//     console.log("Error getting data:", error);
//   }
// }
// Get Data from Firebase
async function getData() {
 const currentUserId= localStorage.getItem("currentUserId")
  showLoader();
  const userRef = ref(database, `users/${currentUserId}/todos`);
  try {
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      renderData(snapshot.val());
      console.log(snapshot.val());
      
    } else {
      renderData(null);
    }
  } catch (error) {
    console.log("Error getting data:", error);
  }
}

// post data
// async function postData() {
//   const URL =
//     "https://todo-app-javascript-cd16a-default-rtdb.firebaseio.com/data.json";
//   try {
//     const response = await fetch(URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ userInput: inputValue.value, completed: false }),
//     });
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     inputValue.value = "";
//     const data = await response.json();
//     if (data) {
//       getData();
//     }
//   } catch (error) {
//     console.log("Error posting data:", error);
//   }
// }
// Post Data to Firebase

async function postData() {

  const userRef = ref(database, `users/${currentUserId}/todos`);
  try {
    const newTodoRef = push(userRef);
    await set(newTodoRef, {
      userInput: inputValue.value,
      completed: false,
    });
    inputValue.value = "";
    getData();
  } catch (error) {
    console.log("Error posting data:", error);
  }
}


// Render data
let filter = "all";
function renderData(data) {
  console.log(data);
  
  const tabs = document.querySelectorAll(".tab");
  // Function to remove the active class from all tabs
  function removeActiveClass() {
    tabs.forEach((tab) => tab.classList.remove("active"));
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      removeActiveClass();
      tab.classList.add("active");

      filter = tab.getAttribute("data-filter");
      console.log(filter);
      renderData(data);
    });
  });

  const container = document.querySelector("#container");
  container.innerHTML = "";
  const totalItem = document.getElementById("total-item");
  const leftItem = document.getElementById("left-item");

  const totalItemsCount = !data ? 0 : Object.keys(data).length;
  const itemsLeftCount = !data
    ? 0
    : Object.keys(data).filter((key) => !data[key].completed).length;

  totalItem.innerHTML = `${totalItemsCount} Total Items`;
  leftItem.innerHTML = `${itemsLeftCount} Items Left`;

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
    for (let key of filteredTodos .reverse()) {
      const item = data[key];
      completedKeys.push(key);
      // Create div to insert all details
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("list-of-item");
      // Checkbox
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = item.completed;
      checkbox.classList.add("checkbox-round");
      checkbox.setAttribute("data-key", key); // Storing the key for later use
      // Handle individual checkbox changes
      checkbox.addEventListener("change", (e) => {
        checkboxFunction(key, item.userInput, e.target.checked);
        updateCheckAllStatus();
      });
      // User input display
      const userInputElement = document.createElement("p");
      userInputElement.textContent = item.userInput;
      if (item.completed) {
        userInputElement.style.textDecorationLine = "line-through";
      }
      // Edit and delete icons
      const editIcon = document.createElement("span");
      if (!item.completed) {
        editIcon.classList.add("bi", "bi-pencil-square");
        editIcon.style.cursor = "pointer";
        editIcon.addEventListener("click", () => {
          editKey = key;
          inputValue.value = item.userInput;
        });
      }
      const deleteIcon = document.createElement("span");
      deleteIcon.classList.add("bi", "bi-trash");
      deleteIcon.style.cursor = "pointer";
      deleteIcon.addEventListener("click", () => {
        deleteItem(key);
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

// // Delete data
// function deleteItem(key) {
//   const confirmDelete = confirm("Are you sure you want to delete this item?");
//   if (confirmDelete) {
//     async function deleteData() {
//       const URL = `https://todo-app-javascript-cd16a-default-rtdb.firebaseio.com/data/${key}.json`;
//       try {
//         const response = await fetch(URL, {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         getData();
//       } catch (error) {
//         console.log("Error deleting data:", error);
//       }
//     }
//     deleteData();
//   }
// }

// Delete Item
function deleteItem(key) {
  if (confirm("Are you sure you want to delete this item?")) {
    const itemRef = ref(database, `users/${currentUserId}/todos/${key}`);
    remove(itemRef)
      .then(() => {
        getData();
      })
      .catch((error) => {
        console.log("Error deleting data:", error);
      });
  }
}
// Edit details
// function editDetail() {
//   const URL = `https://todo-app-javascript-cd16a-default-rtdb.firebaseio.com/data/${editKey}.json`;
//   async function updateData() {
//     try {
//       const response = await fetch(URL, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ userInput: inputValue.value }),
//       });
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       inputValue.value = "";
//       editKey = ""; // Reset editKey after updating
//       getData();
//     } catch (error) {
//       console.log("Error updating data:", error);
//     }
//   }
//   updateData();
// }
// Edit Details
function editDetail() {

  const itemRef = ref(database, `users/${currentUserId}/todos/${editKey}`);
  update(itemRef, { userInput: inputValue.value })
    .then(() => {
      inputValue.value = "";
      editKey = "";
      getData();
    })
    .catch((error) => {
      console.log("Error updating data:", error);
    });
}

// function checkboxFunction(key, data, checkBoxValue) {
//   const URL = `https://todo-app-javascript-cd16a-default-rtdb.firebaseio.com/data/${key}.json`;
//   async function updateData() {
//     try {
//       const response = await fetch(URL, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ userInput: data, completed: checkBoxValue }),
//       });
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       inputValue.value = "";
//       editKey = "";
//       getData();
//     } catch (error) {
//       console.log("Error updating data:", error);
//     }
//   }
//   updateData();
// }
// Handle Checkbox State Changes
function checkboxFunction(key, data, checkBoxValue) {
  const itemRef = ref(database, `users/${currentUserId}/todos/${key}`);
  update(itemRef, { completed: checkBoxValue })
    .then(() => {
      getData();
    })
    .catch((error) => {
      console.log("Error updating data:", error);
    });
}

const clearCompleted = document.getElementById("clearCompleted");
// Add event listener to clear completed items
clearCompleted.addEventListener("click", async () => {
  if (confirm("Are you sure you want to delete all completed items?")) {
    deleteCompletedItem(completedKeys);
  }
});

//  Delete all completed items
// async function deleteCompletedItem(keys) {
//   const updates = {};
//   keys.forEach((key) => {
//     updates[`${key}`] = null;
//   });
//   console.log(updates);

//   const URL = `https://todo-app-javascript-cd16a-default-rtdb.firebaseio.com/data/`;
//   try {
//     const response = await fetch(`${URL}.json`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(updates),
//     });
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     console.log(`Deleted item with key: ${keys}`);
//     getData(); // Refresh data after deletion
//   } catch (error) {
//     console.log("Error deleting data:", error);
//   }
// }
// Clear Completed Items
async function deleteCompletedItem(keys) {
  const userRef = ref(database, `users/${currentUserId}/todos`);
  const updates = {};
  keys.forEach((key) => {
    updates[key] = null;
  });
  try {
    await update(userRef, updates);
    getData();
  } catch (error) {
    console.log("Error deleting data:", error);
  }
}
if (Keys.length === 0) {
  const clearAll = document.getElementById("clearAll");
  // Add event listener to clear completed items
  clearAll.addEventListener("click", async () => {
    if (confirm("Are you sure you want to delete all items?")) {
      deleteAllItems(Keys);
    }
  });
  getData();
}
// Delete  all items
// async function deleteAllItems(Keys) {
//   const updates = {};
//   Keys.forEach((key) => {
//     updates[`${key}`] = null;
//   });
//   const URL = `https://todo-app-javascript-cd16a-default-rtdb.firebaseio.com/data/`;
//   try {
//     const response = await fetch(`${URL}.json`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(updates),
//     });
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     getData(); // Refresh data after deletion
//     console.log(`Deleted item with key: ${keys}`);
//   } catch (error) {
//     console.log("Error deleting data:", error);
//   }
// }
// Delete All Items
async function deleteAllItems(Keys) {
  const userRef = ref(database, `users/${currentUserId}/todos`);
  try {
    await update(userRef, null);
    getData();
  } catch (error) {
    console.log("Error deleting data:", error);
  }
}



// function showConfirmBox() {
//   document.getElementById("confirmBox").style.display = "flex";
// }

// function handleConfirm(isConfirmed) {
//   document.getElementById("confirmBox").style.display = "none";
//   if (isConfirmed) {
//       alert("You confirmed the action!");
//   } else {
//       alert("You canceled the action.");
//   }
// }



