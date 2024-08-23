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