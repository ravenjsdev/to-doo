const addInput = document.querySelector(".add-inp");
const addBtn = document.querySelector(".add-btn");
const tasksBox = document.querySelector(".tasks-box");
let noTasks = true;
const addList = document.querySelector(".add-lists");
const listsContain = document.querySelector(".lists-container");
let noLists = true;
const listTitle = document.querySelector(".list-title");
const tasksSection = document.querySelector(".tasks-section");
let listId = 0;
let listsData = {};
let currentListId = "list-1";
const hamBtn = document.querySelector(".logo-btn");
let sideOut = true;
const sideContain = document.querySelector(".side-container");
const logoSec = document.querySelector(".logo-section");
const hamMenu = document.querySelector(".hamburger-menu");
const addListColl = document.querySelector(".icons-div");
const removeList = document.querySelector(".remove-list-btn");


function taskAdder() {
  const inputValue = addInput.value.trim();
  
  if(inputValue === "") {
    addInput.focus();
    return;
  }

  const newTask =
  `     <div class="task-remove">
          <div class="task-container">
              <div class="main-flex">
                <input type="checkbox" class="check-box-main">
                <span class="main-tasks">- <span class="main-tasks-actual" contenteditable="true">${escapeHTML(inputValue)}</span></span>
              </div>
          </div>
          <button class="remove-btn">✘</button>
        </div>
  `

  if(noTasks === true) {
    tasksBox.innerHTML = newTask;
    tasksBox.classList.add("has-tasks");  
    noTasks = false;
  }else {
    tasksBox.insertAdjacentHTML("beforeend", newTask);
  }

  saveCurrentList();

  addInput.value = "";
  addInput.focus();
};

addBtn.addEventListener('click', taskAdder);
addInput.addEventListener('keydown', function(event){
  if(event.key === "Enter") {
    taskAdder();
  }
});

tasksBox.addEventListener('click', function(event) {
  if(event.target.classList.contains("remove-btn")) {
    const task = event.target.parentElement
    task.classList.add("removing");

    task.addEventListener('animationend', function () {
    task.remove();

    if(tasksBox.innerHTML.trim() === "") {
    tasksBox.innerHTML = `<p>To-Doo gives you a clean and simple place to plan your day and
turn your plans into progress.</p><p>Organize your tasks create lists.</p><p>Stay focused on your goals.</p>`;
    tasksBox.classList.remove("has-tasks");
    noTasks = true;
    }

    saveCurrentList()
    });
  }
});

function saveCurrentList() {
  listsData[currentListId].tasks = tasksBox.innerHTML;
  saveAll();
}

tasksBox.addEventListener('change', function(event) {
  if(event.target.classList.contains("check-box-main")){
    const task = event.target.parentElement.querySelector(".main-tasks-actual")
    if(event.target.checked) {
      event.target.setAttribute("checked", "");
      task.classList.add("box-checked");
      task.setAttribute("contenteditable", "false");
    } else {
      event.target.removeAttribute("checked");
      task.classList.remove("box-checked");
      task.setAttribute("contenteditable", "true");
    }
    saveCurrentList();
  };
});

tasksBox.addEventListener('input', saveCurrentList);

function listAdder() {

  listId++;

  const id = `list-${listId}`;
  currentListId = id;

  listsData[id] = {
    tasks: `<p>To-Doo gives you a clean and simple place to plan your day and
turn your plans into progress.</p><p>Organize your tasks create lists.</p><p>Stay focused on your goals.</p>`
  } 

  const newList =
  `
    <div class="lists" data-id="${id}">
      <span class="lists-dash">-</span>
      <span class="lists-actual">New list</span>
      <button class="remove-list-btn">✘</button>
    </div>

  `

  if(noLists) {
    listsContain.innerHTML = newList;
  } else {
    listsContain.insertAdjacentHTML("afterbegin", newList);
    
  }

  const newElement = listsContain.firstElementChild;
  const listText = newElement.querySelector(".lists-actual");

  requestAnimationFrame(() => {
    updateFade(listText);
  });

  noLists = false;
};

function updateFade(listText) {
  const list = listText.closest(".lists");

  if(listText.scrollWidth > listText.clientWidth) {
    list.classList.add("fade");
  } else {
    list.classList.remove("fade");
  }
}

if(!loadAll()) {
  listAdder();
}

function newListFunc() {
  tasksBox.innerHTML = `<p>To-Doo gives you a clean and simple place to plan your day and
turn your plans into progress.</p><p>Organize your tasks create lists.</p><p>Stay focused on your goals.</p>`;
  tasksBox.classList.remove("has-tasks");
  noTasks =true

  saveCurrentList();

  listTitle.textContent= "New list";
  listTitle.focus();
  document.execCommand("selectAll");
}

listTitle.addEventListener('blur', function() {
  const newName = listTitle.textContent.trim();
  const currentList = listsContain.querySelector(`.lists[data-id="${currentListId}"] .lists-actual`);

  if(newName === "") {
    listTitle.textContent = currentList.textContent;
    return;
  }

  currentList.textContent = newName;

  updateFade(currentList);
  saveAll();
});

listTitle.addEventListener('keydown', function(event) {
  if(event.key === "Enter") {
    event.preventDefault();
    listTitle.blur();
  }
});

listsContain.addEventListener('click', function(event) {

  if(event.target.classList.contains("remove-list-btn")) {
    const list = event.target.closest(".lists");
    const deletedListId = list.dataset.id;

    if(currentListId === deletedListId) {
      const nextList = list.nextElementSibling;
      const previousList = list.previousElementSibling;

      delete listsData[deletedListId];
      list.remove();

      const newActiveList =nextList || previousList;

      if(newActiveList) {
        currentListId = newActiveList.dataset.id;
        listTitle.textContent = newActiveList.querySelector(".lists-actual").textContent;
        tasksBox.innerHTML = listsData[currentListId].tasks;
    
        if(tasksBox.innerHTML.trim() === `<p>To-Doo gives you a clean and simple place to plan your day and
turn your plans into progress.</p><p>Organize your tasks create lists.</p><p>Stay focused on your goals.</p>`) {
        noTasks = true;
        tasksBox.classList.remove("has-tasks");
        } else {
        noTasks = false;
        tasksBox.classList.add("has-tasks");
        }

        } else {
         
        listAdder();
        newListFunc();
      }
      saveAll();
      return;
    }

    delete listsData[deletedListId];
    list.remove();

    saveAll();
    return;
  }

  const list = event.target.closest(".lists");

  if(list) {
    saveCurrentList();

    currentListId = list.dataset.id;
    listTitle.textContent = list.querySelector(".lists-actual").textContent;
    tasksBox.innerHTML = listsData[currentListId].tasks;

    if(tasksBox.innerHTML.trim() === `<p>To-Doo gives you a clean and simple place to plan your day and
turn your plans into progress.</p><p>Organize your tasks create lists.</p><p>Stay focused on your goals.</p>`) {
      noTasks = true;
      tasksBox.classList.remove("has-tasks");
    } else {
      noTasks = false;
      tasksBox.classList.add("has-tasks");
    }
    
    saveAll();
  }
})

addList.addEventListener('click', function() {
  saveCurrentList();
  listAdder();
  newListFunc();
});

addListColl.addEventListener('click', function() {
  saveCurrentList();
  listAdder();
  newListFunc();
});

function saveAll() {
  localStorage.setItem("todoo", JSON.stringify({
    listId,
    currentListId,
    listsData,
    sidebar: listsContain.innerHTML,
    title: listTitle.textContent
  }));
}

function loadAll() {

  try {
  const saved = localStorage.getItem("todoo");
  if(!saved) return false;
  const data = JSON.parse(saved);
  listId = data.listId;
  currentListId = data.currentListId;
  listsData = data.listsData;

  listsContain.innerHTML = data.sidebar;
  listTitle.textContent = data.title;
  tasksBox.innerHTML = listsData[currentListId].tasks;

  const empty = tasksBox.innerHTML.trim() === `<p>To-Doo gives you a clean and simple place to plan your day and
turn your plans into progress.</p><p>Organize your tasks create lists.</p><p>Stay focused on your goals.</p>`;
  noLists = false;
  noTasks = empty;
  tasksBox.classList.toggle("has-tasks", !empty)
  
  return true;
  } catch (e) {
    localStorage.removeItem("todoo");
    return false
  }
}

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML
} 

function setSideBar(open) {
  sideOut = open;
  sideContain.classList.toggle("collapsed", !open);
  logoSec.classList.toggle("collapsed", !open);
  hamMenu.classList.toggle("collapsed", !open);
}

logoSec.addEventListener('click', function() {
  setSideBar(!sideOut);

    if(window.innerWidth > 800) {
      localStorage.setItem("todoo-sidebar", sideOut ? "open" : "closed");
    }
});

const isphone = window.innerWidth <= 800;
const savedSide = localStorage.getItem("todoo-sidebar");

if(isphone) {
  setSideBar(false);
} else if(savedSide === "closed") {
  setSideBar(false);
} else {
  setSideBar(true);
}