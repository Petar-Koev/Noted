// stores items in Local Storage

function initialize() {
  
    let form = document.getElementById("new-list");
    let input = document.getElementById("new-list-input");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let toDoLists = getParsedItemsFromLocalStorage("todolists") || [];
        let toDoListItems = getParsedItemsFromLocalStorage("todolistItems") || {};
        let list = input.value; 

        if (!list) {
          alert("Please fill out the name of the list!");
          return;
        }

        for(let i = 0; i < toDoLists.length; i++) {

          if(list == toDoLists[i]) {
            alert("This list is already added");
            return;
          }
        }

        toDoListItems[list] = [];

        toDoLists.push(list); 
        localStorage.setItem("todolists", JSON.stringify(toDoLists)); 
      
        localStorage.setItem("todolistItems", JSON.stringify(toDoListItems));

        input.value = ""; 

        displayList();
        openList(); // creates empty space on the right side

    });
        
    displayList();
    
}

// creates HTML structure for the added lists

function displayList() {
    let arrayOfLists =  getParsedItemsFromLocalStorage("todolists");

    let listStructure = "";

    for(let i = 0; i <arrayOfLists.length; i++) {
     
       listStructure += `
        <div class="list" id="list-${arrayOfLists[i]}">
          <div class="content">
            <input type="text" class="text" value="${arrayOfLists[i]}" readonly />
          </div>
          <div class="actions">
            <button class="open" value="${arrayOfLists[i]}">Open</button>
            <button class="delete" value="${arrayOfLists[i]}">Delete</button>
          </div>
        </div>
       ` ;
    }
    
    document.getElementById("all-lists").innerHTML = listStructure;

    setListenersForOpenListBtns();
    setListenersForDeleteListBtns();
}    

function setListenersForOpenListBtns(){
  let openBtns = document.getElementsByClassName("open");

    for(let i = 0; i < openBtns.length; i++) {
      openBtns[i].addEventListener("click", function(e) {
        openList(e);
      });
    }
}

function setListenersForDeleteListBtns() {
  let deleteBtns = document.getElementsByClassName("delete");

    for(let i = 0; i < deleteBtns.length; i++) {
      deleteBtns[i].addEventListener("click", function(e) {
        deleteList(e);
        displayList();
        deleteListItems(e);

      });
    }

}

// removes a specific ToDo List from "todolists"

function deleteList(e) {
  e = e || window.event;

  let arrayOfLists =  getParsedItemsFromLocalStorage("todolists");
  let index = arrayOfLists.indexOf(e.target.value);

  if (index > -1) {
    arrayOfLists.splice(index, 1);
    localStorage.setItem("todolists", JSON.stringify(arrayOfLists));
  }
}

// removes a specific ToDo List from "todolistItems"

function deleteListItems(e) {
  e = e || window.event;

  let toDoItems = localStorage.getItem("todolistItems");
  let objToDos = JSON.parse(toDoItems);
  let toDoListItemsDisplayArea = document.getElementById(e.target.value);

  if(Object.hasOwn(objToDos, e.target.value)) {
    delete objToDos[e.target.value];
    localStorage.setItem("todolistItems", JSON.stringify(objToDos));
    toDoListItemsDisplayArea.remove();
  }
}

// checks for stored lists in Local Storage
// adds HTML structure for the opened list
// adds event listener to the button

function openList(e) {
  e = e || window.event;

  let objOfItems = getParsedItemsFromLocalStorage("todolistItems");
  let toDosAddBtn = "";

  if(Object.hasOwn(objOfItems, e.target.value)) {
        toDosAddBtn += `
        <div id="${e.target.value}">
          <h2 id="list-name-h2">${e.target.value}</h2>
              <div id="item-display-area">
              </div>
          <div class="add-btn-form">
            <form id="new-todo">
              <input type="text" id="new-todo-input" placeholder="Add something"/> 
               <input type="submit" id="new-todo-submit" value="Add" />
            </form>
          </div>
       </div>
  `;
  }

  document.getElementById("single-todos-list").innerHTML = toDosAddBtn;

  displayToDoItems();
  setListenersForAddItemToListBtns();
  
}

function setListenersForAddItemToListBtns(){
  let addBtn = document.getElementById("new-todo");

  addBtn.addEventListener("submit", (e) => {
    e.preventDefault();
    addToDoItemToList(e);

  });
}

// checks for empty input and duplicates
// stores items in Local Storage as objects

function addToDoItemToList(e) {
  let addToDo = document.getElementById("new-todo-input").value;

  if (!addToDo) {
    alert("Please fill out the field");
    return;
  } 

  let targetedList = document.getElementById("list-name-h2").innerHTML;
  let objOfItems = getParsedItemsFromLocalStorage("todolistItems");
  let objToDoItem = {name:addToDo, isChecked: false};

  if(checkListItemsForDuplicates(objOfItems,targetedList,addToDo)) {
    return;
  }

  objOfItems[`${targetedList}`].push(objToDoItem);
  localStorage.setItem("todolistItems", JSON.stringify (objOfItems));

  displayToDoItems();
    
  document.getElementById("new-todo-input").value = "";

} 

function checkListItemsForDuplicates(objectOfItems, targetedList, toDoValue){
  for(let i = 0; i < objectOfItems[`${targetedList}`].length; i++){

    if(objectOfItems[`${targetedList}`][i].name == toDoValue) {
      alert("This item is already added");
      document.getElementById("new-todo-input").value = "";
      return true;
    }
  } 
  return false;

}

function displayToDoItems() {
  let targetedList = document.getElementById("list-name-h2").innerHTML;
  let objOfItems = getParsedItemsFromLocalStorage("todolistItems");

  let toDoStructure = `
  <div id="list-of-items">
      <ul class="list-of-todos">`;

  for(let i = 0; i < objOfItems[`${targetedList}`].length; i++) {
    let checkIcons = setCheckIcon(objOfItems, targetedList, i);
    toDoStructure += `
          <li class="single-todo-list">
              <p id="${objOfItems[`${targetedList}`][i].name}" style="text-decoration: ${checkIcons.lineThrough}"> ${objOfItems[`${targetedList}`][i].name} </p>
              <div class="single-todo-btns">
                    <i class="fa-solid ${checkIcons.checkedIcon} check-btn" 
                       checkItem="${objOfItems[`${targetedList}`][i].name}"></i>
                    <i class="fa-solid fa-trash delete-tds"
                    deleteItem="${objOfItems[`${targetedList}`][i].name}"></i>
              </div>
          </li>
    `;
  }

  toDoStructure += `
     </ul>
  </div>
  `; 

  document.getElementById("item-display-area").innerHTML = toDoStructure;
  setListenersForCheckBtns();
  setListenersForDeleteItemBtns();
}

function setListenersForCheckBtns() {
  let checkBtns = document.getElementsByClassName("check-btn");

  for(let i = 0; i < checkBtns.length; i++) {
    checkBtns[i].addEventListener("click", function(e) {
      isChecked(e);
      displayToDoItems();
    });
  }
}

function setListenersForDeleteItemBtns() {
  let deleteToDoBtns = document.getElementsByClassName("delete-tds");

  for(let i = 0; i < deleteToDoBtns.length; i++) {
    deleteToDoBtns[i].addEventListener("click", function(e) {
      deleteToDos(e);
      displayToDoItems();
    });
  }
}

function setCheckIcon(objectOfItems, targetedList, index) {
  let result = {
    lineThrough: "",
    checkedIcon: ""
  };

  if(objectOfItems[`${targetedList}`][index].isChecked == false) {
    result.lineThrough = "none";
    result.checkedIcon = "fa-check";
    
  } else {
    result.lineThrough = "line-through";
    result.checkedIcon = "fa-check-double";
  }
  return result;
}

// removes an item from "todolistItems"
// sets the updated version in Local Storage

function deleteToDos(e) {
  e = e || window.event;

  let deleteItem = e.target.getAttribute("deleteItem");
  let objOfItems = getParsedItemsFromLocalStorage("todolistItems");
  let targetedList = document.getElementById("list-name-h2").innerHTML;
  let index = objOfItems[`${targetedList}`].map(element => element.name).indexOf(deleteItem);

  if (index > -1) {
    objOfItems[`${targetedList}`].splice(index, 1);
  
    localStorage.setItem("todolistItems", JSON.stringify(objOfItems));
  
  }
}

// triggered on the check button click

function isChecked(e) {
  e = e || window.event;

  let checkItem = e.target.getAttribute("checkItem");
  let objOfItems = getParsedItemsFromLocalStorage("todolistItems");
  let targetedList = document.getElementById("list-name-h2").innerHTML;
  let index = objOfItems[`${targetedList}`].map(element => element.name).indexOf(checkItem);
  let selectedItem = objOfItems[`${targetedList}`][index];

  if(selectedItem.isChecked == false) {
    selectedItem.isChecked = true;
  } else {
    selectedItem.isChecked = false;
  }
  localStorage.setItem("todolistItems", JSON.stringify(objOfItems));
}

function getParsedItemsFromLocalStorage(name){
  let itemsFromLocalStorage = localStorage.getItem(name);
  let parsedResult = JSON.parse(itemsFromLocalStorage);
  return parsedResult;
}

initialize();