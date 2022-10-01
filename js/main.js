// It access the HTML part that we need.

window.addEventListener('load', () => {
    let form = document.querySelector("#new-list");
    let input = document.querySelector("#new-list-input");

    // When clicking submit, we stop the default event from happening
    // In this case - refreshing the page!

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let toDoLists = JSON.parse(localStorage.getItem('todolists')) || []; // Variable that gets a saved Item.
        let toDoListItems = JSON.parse(localStorage.getItem('todolistItems')) || {};
        let list = input.value; // This is the input value

        if (!list) {
          alert("Please fill out the name of the list!");
          return;
      }
        toDoListItems[list] = [];

        toDoLists.push(list); // This puts a new item in the local storage array ["todolists"]

        localStorage.setItem("todolists", JSON.stringify(toDoLists)); // here we save the input in local storage

      
        localStorage.setItem("todolistItems", JSON.stringify(toDoListItems));

        input.value = ""; // This clears the field after a list is being added!
        displayList();
        openList();

    });
       
    displayList();
    
})

function displayList() {
    let itemsFromLocalStorage = localStorage.getItem("todolists");
    let arrayOfLists = JSON.parse(itemsFromLocalStorage); // It creates an array with the ToDoLists
    let listStructure = "";

    for(let i = 0; i <arrayOfLists.length; i++) {
     
       listStructure += `
       <div class="list" id="list-${arrayOfLists[i]}">
            <div class="content">
   
         <input type="text" class="text" value="${arrayOfLists[i]}" readonly />
   
       </div>
       <div class="actions">
         <button class="open" value="${arrayOfLists[i]}" >Open</button>
         <button class="delete" value="${arrayOfLists[i]}">Delete</button>
       </div>
     </div>
       ` ;
    }
    
    document.getElementById("all-lists").innerHTML = listStructure;

    let openBtns = document.getElementsByClassName("open");

    for(let i = 0; i < openBtns.length; i++) {
      openBtns[i].addEventListener("click", function(e) {
        openList(e);
      });
    }

    let deleteBtns = document.getElementsByClassName("delete");

    for(let i = 0; i < deleteBtns.length; i++) {
      deleteBtns[i].addEventListener("click", function(e) {
        deleteList(e);
        deleteListItems(e);

      });
    }
}    

function deleteList(e) {
  e = e || window.event;

  let itemsFromLocalStorage = localStorage.getItem("todolists");
  let arrayOfLists = JSON.parse(itemsFromLocalStorage);
  let index = arrayOfLists.indexOf(e.target.value);

  if (index > -1) {
    arrayOfLists.splice(index, 1);
  
    localStorage.setItem("todolists", JSON.stringify(arrayOfLists));
  
  }
  displayList();

}

function deleteListItems(e) {
  e = e || window.event;

  let toDoItems = localStorage.getItem("todolistItems");
  let objToDos = JSON.parse(toDoItems);
  let rightDivCode = document.getElementById(e.target.value);

  if(Object.hasOwn(objToDos, e.target.value)) {
    delete objToDos[e.target.value];
    localStorage.setItem("todolistItems", JSON.stringify(objToDos));
    rightDivCode.remove();
  }
}

function openList(e) {
  e = e || window.event;

  let todolistItemsStored = localStorage.getItem("todolistItems");
  let objOfItems = JSON.parse(todolistItemsStored);
  let toDosAddBtn = "";

  if(Object.hasOwn(objOfItems, e.target.value)) {
        toDosAddBtn += `
        <div id="${e.target.value}">
          <h2 id="list-name-h2">${e.target.value}</h2>
              <div id="temp-solution">
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

  let addBtn = document.getElementById("new-todo");

  addBtn.addEventListener("submit", (e) => {
    e.preventDefault();
    addToDoItemToList(e);

  });

}

function addToDoItemToList(e) {
  let addToDo = document.getElementById("new-todo-input").value;

  if (!addToDo) {
    alert("Please fill out the field");
    return;
  } 

  let targetedList = document.getElementById("list-name-h2").innerHTML;
  let toDoListItems = localStorage.getItem("todolistItems");
  let objOfItems = JSON.parse(toDoListItems);
 
  objOfItems[`${targetedList}`].push(addToDo);
  localStorage.setItem("todolistItems", JSON.stringify (objOfItems));

  displayToDoItems();
    
  document.getElementById("new-todo-input").value = "";

}

function displayToDoItems() {
  let targetedList = document.getElementById("list-name-h2").innerHTML;
  let toDoListItems = localStorage.getItem("todolistItems");
  let objOfItems = JSON.parse(toDoListItems);

  let toDoStructure = `
  <div id="list-of-items">
      <ul class="list-of-todos">`;

  for(let i = 0; i < objOfItems[`${targetedList}`].length; i++) {
    toDoStructure += `
          <li class="single-todo-list">
              ${objOfItems[`${targetedList}`][i]}
              <div class="single-todo-btns">
                    <button class="Chek">Check</button>
                    <button class="delete-tds" value="${objOfItems[`${targetedList}`][i]}">Delete</button>
              </div>
          </li>
    `;
  }

  toDoStructure += `
     </ul>
  </div>
  `; 

  document.getElementById("temp-solution").innerHTML = toDoStructure;

  let deleteToDoBtns = document.getElementsByClassName("delete-tds");

  for(let i = 0; i < deleteToDoBtns.length; i++) {
    deleteToDoBtns[i].addEventListener("click", function(e) {
      deleteToDos(e);

    });
  }
}

function deleteToDos(e) {
  e = e || window.event;

  let itemsFromLocalStorage = localStorage.getItem("todolistItems");
  let objOfItems = JSON.parse(itemsFromLocalStorage);
  let targetedList = document.getElementById("list-name-h2").innerHTML;
  let index = objOfItems[`${targetedList}`].indexOf(e.target.value);

  if (index > -1) {
    objOfItems[`${targetedList}`].splice(index, 1);
  
    localStorage.setItem("todolistItems", JSON.stringify(objOfItems));
  
  }

  displayToDoItems();

}