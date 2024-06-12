// Setting up our App database fetures with firebase realtime database
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://cart-database-5b27c-default-rtdb.firebaseio.com/",
};
const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "GroceriesList");

// Manipuating an showing the grocery items on the DOM
const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-btn");
const shoppingListEl = document.getElementById("shopping-list");

addButtonEl.addEventListener("click", () => {
  let inputValue = inputFieldEl.value;
  push(shoppingListInDB, inputValue);
  clearInputFieldEl();
});

// fetching Items from the Firebase realTime database and displaying the fetched items on the Unordered list in the DOM
onValue(shoppingListInDB, (snapshot) => {
  if (snapshot.exists()) {
    let itemsArr = Object.entries(snapshot.val());

    clearShoppingListEl();

    for (let i = 0; i < itemsArr.length; i++) {
      let currentItem = itemsArr[i];

      addListItemsToShoppingList(currentItem);
    }
  } else {
    shoppingListEl.textContent = "No items yet...add some !!";
  }
});

function clearInputFieldEl() {
  inputFieldEl.value = " ";
}

function clearShoppingListEl() {
  shoppingListEl.innerHTML = "";
}

function addListItemsToShoppingList(item) {
  let itemId = item[0];
  let itemValue = item[1];

  let itemList = document.createElement("li");

  itemList.textContent += itemValue;

  itemList.addEventListener("dblclick", () => {
    let exactLocationOfItemInDB = ref(database, `GroceriesList/${itemId}`);
    remove(exactLocationOfItemInDB);
  });

  shoppingListEl.appendChild(itemList);
}
