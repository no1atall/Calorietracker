// Storage Controller
const StorageCtrl = (function () {
  // Public Methods
  return {
    storeItem: function (item) {
      let items;

      //Check If Any Items In Local Storage
      if (localStorage.getItem("items") === null) {
        items = [];

        // Push item
        items.push(item);

        // Set Local Storage
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem("items"));

        //Push New Item
        items.push(item);
        console.log(items);

        // Reset Local Storage
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItemsFromStorage: function () {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }

      return items;
    },
    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function (item, index) {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemFromStorage: function (id) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function (item, index) {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    clearItemsFromStorage: function () {
      localStorage.removeItem("items");
    },
  };
})();

// Item Controller
// IFFY
const ItemCtrl = (function () {
  //Item constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };
  //Data Structure / State
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0,
  };

  // Public Methods
  return {
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calories) {
      // Create ID
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Cals to number
      calories = parseInt(calories);

      // Create New Item
      newItem = new Item(ID, name, calories);

      // Add item to item array
      data.items.push(newItem);

      return newItem;
    },
    getItemByID: function (id) {
      let found = null;
      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function (name, calories) {
      //Calories to num
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function (id) {
      // Get Ids
      const index = data.items.findIndex((x) => x.id == id);

      // Remove Item
      data.items.splice(index, 1);
    },
    clearAllItems: function () {
      data.items = [];
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    getTotalCalories: function () {
      // Loop through items and add cals
      let total = 0;
      data.items.forEach(function (item) {
        total += item.calories;
      });
      //Set total calories to total
      data.totalCalories = total;

      //return total
      return data.totalCalories;
    },
    logData: function () {
      return data;
    },
  };
})();

// UI Controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    itemName: "#item-name",
    itemCalories: "#item-calories",
    totalCalories: ".total-calories",
  };

  //Public Methods
  return {
    populateItemList: function (items) {
      let html = "";
      items.forEach(function (item) {
        html += `
            <li id="item-${item.id}" class="collection-item">
              <strong>${item.name}</strong> <em>${item.calories} Calories</em>
              <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
              </a>
            </li>
            `;
      });

      //Insert List items into DOM
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemName).value,
        calories: document.querySelector(UISelectors.itemCalories).value,
      };
    },

    addListItem: function (item) {
      //Show the list
      document.querySelector(UISelectors.itemList).style.display = "block";

      // Create li Element
      const li = document.createElement("li");
      // Add Class
      li.className = "collection-item";
      //Add ID
      li.id = `item-${item.id}`;
      //Add Html
      li.innerHTML = `
      <strong>${item.name}</strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>
      `;
      //Insert Item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node List Into Array
      listItems = Array.from(listItems);

      listItems.forEach(function (listItem) {
        const itemID = listItem.getAttribute("id");

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `
          <strong>${item.name}</strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
          `;
        }
      });
    },

    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },

    clearInputFields: function () {
      document.querySelector(UISelectors.itemName).value = "";
      document.querySelector(UISelectors.itemCalories).value = "";
    },
    addItemToForm: function () {
      document.querySelector(UISelectors.itemName).value =
        ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCalories).value =
        ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    removeItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node List Into Array
      listItems = Array.from(listItems);
      listItems.forEach(function (item) {
        item.remove();
      });
    },
    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent =
        totalCalories;
    },
    clearEditState: function () {
      UICtrl.clearInputFields();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    getSelectors: function () {
      return UISelectors;
    },
  };
})();

// App Controller
const App = (function (ItemCtrl, UICtrl, StorageCtrl) {
  //Event Listeners
  const loadEventListeners = function () {
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add Item Event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    // Disable Submit On Enter
    document.addEventListener("keypress", function (e) {
      if (e.key === "Enter" || e.keyCode === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Edit Icon Click
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClickSubmit);

    // Update Item Event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);

    // Delete Item Event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);

    // Back Button Event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UICtrl.clearEditState);

    // Clear Button Event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAllItemsClick);
  };
  // Add Item Submit
  const itemAddSubmit = function (e) {
    // Get Form Input from UICtrl
    const input = UICtrl.getItemInput();

    // Make sure fields are filled
    if (input.name !== "" && input.calories !== "") {
      // Add Item to data
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      //Add Item to UI list
      UICtrl.addListItem(newItem);

      //Get Total Calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //Add Total Calories to UI
      UICtrl.showTotalCalories(totalCalories);

      //Store In Local Storage
      StorageCtrl.storeItem(newItem);

      //Clear input fields
      UICtrl.clearInputFields();
    }

    e.preventDefault();
  };

  // Update Item Submit
  const itemEditClickSubmit = function (e) {
    if (e.target.classList.contains("edit-item")) {
      // Get List Item ID
      const listID = e.target.parentNode.parentNode.id;

      // Split id on the dash
      const listIDArray = listID.split("-");

      // Get actual ID from Array
      const id = parseInt(listIDArray[1]);

      // Get item
      const itemToEdit = ItemCtrl.getItemByID(id);

      // Set Item
      ItemCtrl.setCurrentItem(itemToEdit);

      //Add Item to form
      UICtrl.addItemToForm();
    }
    e.preventDefault();
  };

  const itemUpdateSubmit = function (e) {
    // Get Item Input
    const input = UICtrl.getItemInput();

    // Update Item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI
    UICtrl.updateListItem(updatedItem);

    // Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add Total Calories to UI
    UICtrl.showTotalCalories(totalCalories);

    //Update local Storage
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Delete Submit
  const itemDeleteSubmit = function (e) {
    // Get Current Item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete From Data Structure
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add Total Calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Delete From Local Storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Clear Items Event
  const clearAllItemsClick = function (e) {
    // Delete all items from data structure
    ItemCtrl.clearAllItems();

    // Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add Total Calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Remove from UI
    UICtrl.removeItems();

    // Remove from Local Storage
    StorageCtrl.clearItemsFromStorage()

    // Hide ul
    UICtrl.hideList();

    e.preventDefault();
  };

  // Public Methods
  return {
    init: function () {
      // Set Initial State
      UICtrl.clearEditState();

      // Get items for our data
      const items = ItemCtrl.getItems();

      //Check if any items are in data
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list with Items
        UICtrl.populateItemList(items);
      }

      //Get Total Calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //Add Total Calories to UI
      UICtrl.showTotalCalories(totalCalories);

      //Load Event Listeners
      loadEventListeners();
    },
  };
})(ItemCtrl, UICtrl, StorageCtrl);

//Initialize App
App.init();
