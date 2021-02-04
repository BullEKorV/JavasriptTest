"use strict";


let animals = ["Katt", "Katt1", "Katt1Igen"];

let listRoot = document.querySelector("#list-root");
let listForm = document.querySelector("[data-list-form]");
let listInput = document.querySelector("[data-list-input]");

listForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if(listInput.value.trim() === "") {
        return;
    }
    animals.push(listInput.value.trim());
    updateList();
    listInput.value = "";
});

function todoList(items) {
    let list = document.createElement("ul");
    items.forEach((item) => {
        let todoListItem = document.createElement("li");
        todoListItem.innerText = item;
        todoListItem.classList.add("todo-list-item");
        todoListItem.addEventListener("click", removeItem);
        list.append(todoListItem);
    });
    return list;
}

function removeItem(event) {
    let itemToRemove = event.target.innerText;
    animals = animals.filter((item) =>  item !== itemToRemove);
    updateList();
}
function updateList() {
    listRoot.innerHTML = "";
    listRoot.append(todoList(animals));
}
updateList();