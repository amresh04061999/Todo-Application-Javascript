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
let completedKeys =[];
let Keys =[];
let loader = false;
  const loaderDiv= document.querySelector("#loader");
     loaderDiv.style.display="none"      
     const blurContainer = document.querySelector("#blur-container");
     console.log(blurContainer);
     blurContainer.style.display = "none";

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
function renderData(data) {
  const container = document.querySelector("#container");
  container.innerHTML = ""; 
// update total and left items
const totalItem = document.getElementById("total-item");
const leftItem = document.getElementById("left-item");
  const totalItemsCount = !data || Object.keys(data).length === 0 ? 0 : Object.keys(data).length;
  const itemsLeftCount = !data ? 0 : Object.keys(data).filter(key => data[key].completed === false).length;
  totalItem.innerHTML = `${totalItemsCount} Total Items`;
  leftItem.innerHTML = `${itemsLeftCount} Items Left`;

  if (!data || Object.keys(data).length === 0) {
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
  }else 
  {
      
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
       const item = data[key];
          if(data[key].completed){
            completedKeys.push(key)
          }
        Keys.push(key)
        // Create div to insert all details
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("list-of-item");
        
        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = item.completed;
        checkbox.classList.add("checkbox-round");
        checkbox.addEventListener("change", (e) => {
          checkboxFunction(key, item.userInput, e.target.checked);
        });
    

        // User input display
        const userInputElement = document.createElement("p");
        userInputElement.textContent = item.userInput;
        if (item.completed) {
          userInputElement.style.textDecorationLine = "line-through";
        }

        // Edit icon
        const editIcon = document.createElement("span");
        if (!item.completed) {
          editIcon.classList.add("bi", "bi-pencil-square");
          editIcon.style.cursor = "pointer";
          editIcon.addEventListener("click", () => {
            editKey = key;
            inputValue.value = item.userInput;
          });
        }

        // Delete icon
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
   
  }
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

if(completedKeys.length === 0){
  const clearCompleted = document.getElementById("clearCompleted");
  // Add event listener to clear completed items
  clearCompleted.addEventListener("click", async () => {
   if (confirm("Are you sure you want to delete all completed items?")) {
       deleteCompletedItem(completedKeys); 
   }
 });
}

//  Delete all completed items
async function deleteCompletedItem(keys) {
  const updates = {};
  keys.forEach(key => {
    updates[`${key}`] = null;
  });
  const URL = `https://todo-app-javascript-cd16a-default-rtdb.firebaseio.com/data/`;
  try {
    const response = await fetch(`${URL}.json`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify(updates)
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
if(Keys.length === 0){
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
  Keys.forEach(key => {
    updates[`${key}`] = null;
  });
  const URL = `https://todo-app-javascript-cd16a-default-rtdb.firebaseio.com/data/`;
  try {
    const response = await fetch(`${URL}.json`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify(updates)
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
