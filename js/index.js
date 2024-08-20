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

function showLoader() {
  const blurContainer = document.querySelector("#blur-container");
  const loader = document.querySelector("#loader");
  loader.classList.remove("hidden");
  blurContainer.classList.add("blur-container");
}

function hideLoader() {
  const blurContainer = document.querySelector("#blur-container");
  const loader = document.querySelector("#loader");
  loader.classList.add("hidden");
  blurContainer.classList.remove("blur-container");
}

// Post data to the database
inputValue.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && inputValue.value) {
    if (editKey === "") {
      postData();
    } else {
      editDetail();
    }
  }
});

// post data
async function postData() {
  const URL =
    "https://todo-app-javascript-cd16a-default-rtdb.firebaseio.com/data.json";
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput: inputValue.value, completed: false }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    inputValue.value = "";
    const data = await response.json();
    if (data) {
      getData();
    }
  } catch (error) {
    console.log("Error posting data:", error);
  }
}

// Get data from the database
async function getData() {
  showLoader();
  const URL =
    "https://todo-app-javascript-cd16a-default-rtdb.firebaseio.com/data.json";
  try {
    const response = await fetch(URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    renderData(data);
  } catch (error) {
    console.log("Error getting data:", error);
  }
}

// Render data
// Function to handle individual checkbox state changes
function checkboxFunction(key, userInput, isChecked) {
  // Update the data model and UI based on the checkbox state
  console.log(
    `Checkbox for ${userInput} is now ${isChecked ? "checked" : "unchecked"}.`
  );
  // You would update your data here accordingly
}

// Render data

let filter = "all"; // Initialize filter with default value

function renderData(data) {
  const tabs = document.querySelectorAll(".tab");

  // Function to remove the active class from all tabs
  function removeActiveClass() {
    tabs.forEach((tab) => tab.classList.remove("active"));
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      removeActiveClass();
      tab.classList.add("active");

      filter = tab.getAttribute("data-filter"); // Update the filter based on the selected tab
      console.log(filter);

      // Re-render data based on the new filter
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

    for (let key of filteredTodos) {
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

    // Check All functionality
    const CheckAll = document.querySelector("#CheckAll");
    CheckAll.addEventListener("change", (e) => {
      const allCheckboxes = document.querySelectorAll(".checkbox-round");
      allCheckboxes.forEach((checkbox) => {
        checkbox.checked = e.target.checked;
        const key = checkbox.getAttribute("data-key");
        checkboxFunction(key, data[key].userInput, checkbox.checked);
      });
    });

    // Update the "Check All" checkbox state based on individual checkboxes
    function updateCheckAllStatus() {
      const allCheckboxes = document.querySelectorAll(".checkbox-round");
      const allChecked = Array.from(allCheckboxes).every(
        (checkbox) => checkbox.checked
      );
      CheckAll.checked = allChecked;
    }

    // Initial status check
    updateCheckAllStatus();
  }

  hideLoader();
}

// Delete data
function deleteItem(key) {
  const confirmDelete = confirm("Are you sure you want to delete this item?");
  if (confirmDelete) {
    async function deleteData() {
      const URL = `https://todo-app-javascript-cd16a-default-rtdb.firebaseio.com/data/${key}.json`;
      try {
        const response = await fetch(URL, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        getData();
      } catch (error) {
        console.log("Error deleting data:", error);
      }
    }
    deleteData();
  }
}

// Edit details
function editDetail() {
  const URL = `https://todo-app-javascript-cd16a-default-rtdb.firebaseio.com/data/${editKey}.json`;
  async function updateData() {
    try {
      const response = await fetch(URL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput: inputValue.value }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      inputValue.value = "";
      editKey = ""; // Reset editKey after updating
      getData();
    } catch (error) {
      console.log("Error updating data:", error);
    }
  }
  updateData();
}

function checkboxFunction(key, data, checkBoxValue) {
  const URL = `https://todo-app-javascript-cd16a-default-rtdb.firebaseio.com/data/${key}.json`;
  async function updateData() {
    try {
      const response = await fetch(URL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput: data, completed: checkBoxValue }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      inputValue.value = "";
      editKey = "";
      getData();
    } catch (error) {
      console.log("Error updating data:", error);
    }
  }
  updateData();
}

const clearCompleted = document.getElementById("clearCompleted");
// Add event listener to clear completed items
clearCompleted.addEventListener("click", async () => {
  if (confirm("Are you sure you want to delete all completed items?")) {
    deleteCompletedItem(completedKeys);
  }
});

//  Delete all completed items
async function deleteCompletedItem(keys) {
  const updates = {};
  keys.forEach((key) => {
    updates[`${key}`] = null;
  });
  console.log(updates);

  const URL = `https://todo-app-javascript-cd16a-default-rtdb.firebaseio.com/data/`;
  try {
    const response = await fetch(`${URL}.json`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    console.log(`Deleted item with key: ${keys}`);
    getData(); // Refresh data after deletion
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
}
// Delete  all items
async function deleteAllItems(Keys) {
  const updates = {};
  Keys.forEach((key) => {
    updates[`${key}`] = null;
  });
  const URL = `https://todo-app-javascript-cd16a-default-rtdb.firebaseio.com/data/`;
  try {
    const response = await fetch(`${URL}.json`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    getData(); // Refresh data after deletion
    console.log(`Deleted item with key: ${keys}`);
  } catch (error) {
    console.log("Error deleting data:", error);
  }
}

getData();
