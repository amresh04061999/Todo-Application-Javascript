const themeToggleBtn = document.getElementById("theme-toggle");
const currentTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", currentTheme);

const currentcolor = localStorage.getItem("color") || "black";
themeToggleBtn.style.color = "currentcolor";

themeToggleBtn.addEventListener("click", function () {
  // window.location.href="https://google.com"
  let theme = document.documentElement.getAttribute("data-theme");
  console.log(theme);
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
//  Post data in database
inputValue.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    async function postData() {
      const URL =
        "https://todo-app-javascript-cd16a-default-rtdb.firebaseio.com/data.json";
      try {
        const response = await fetch(URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userInput: inputValue.value }),
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
        console.log("error post data", error);
      }
    }
    postData();
  }
});

// Get data in dataBase

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

    renderdata(data);
  } catch (error) {
    console.log("error post data", error);
  }
}
getData();

//Render data
function renderdata(data) {
  const container = document.querySelector("#container");
  container.innerHTML = "";

  if (!data || Object.keys(data).length === 0) {
    const p = document.createElement("p");
    p.innerHTML = "<p>No Record Found</p>";
    p.classList.add(
      "d-flex",
      "justify-content-center",
      "align-item-center",
      "h-100"
    );
    container.appendChild(p);
  }

  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      const item = data[key];

      //   create div insert all details
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("list-of-item");

      //   Checkbox
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("checkbox-round");

      // create p with all item
      const userInputElement = document.createElement("p");
      userInputElement.textContent = `${item.userInput}`;

      //  Create edit icon
      const editIcon = document.createElement("span");
      editIcon.classList.add("bi", "bi-pencil-square");
      editIcon.style.cursor = "pointer";
      editIcon.addEventListener("click", (e) => {
          editItem(key, item.userInput,e); 
        //Change icon back to edit
        })

      // Create edit icon
      const deleteIcon = document.createElement("span");
      deleteIcon.classList.add("bi", "bi-trash");
      deleteIcon.style.cursor = "pointer";

      deleteIcon.addEventListener("click", (e) => {
        if (e) {
          deleteItem(key);
        }
      });

      //Create div for action
      const actionDiv = document.createElement("div");
      //append action item edit icon and delete icon
      actionDiv.append(editIcon);
      actionDiv.append(deleteIcon);
      //append div inside checkbox,user value , actionItem(edite icon,delete icon)
      itemDiv.appendChild(checkbox);
      itemDiv.appendChild(userInputElement);
      itemDiv.appendChild(actionDiv);
      // append container inside in conatiner
      container.appendChild(itemDiv);
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
        if (response.ok) {
          getData();
        }
      } catch (error) {
        console.log("error post data", error);
      }
    }
    deleteData();
  }
}

// Edit details
function editItem(key, data) {
  if (data) {
    inputValue.value = data;
      async function editDetail() {
        const URL = `https://todo-app-javascript-cd16a-default-rtdb.firebaseio.com/data/${key}.json`;
        try {
          const response = await fetch(URL, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userInput: data }),
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          if (response.ok) {
            getData();
          }
        } catch (error) {
          console.log("error updated data", error);
        }
      }
      editDetail()
    }
  
}
