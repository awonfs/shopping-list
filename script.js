const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const filter = document.getElementById("filter");
const formBtn = itemForm.querySelector("button");
let isEditmode = false;

function displayItems() {
	const itemsFromStorage = getItemsFromStorage();
	itemsFromStorage.forEach((item) => {
		additemToDOM(item);
	});
	checkUI();
}

function createButton(classes) {
	const button = document.createElement("button");
	button.className = classes;
	const icon = createIcon("fa-solid fa-xmark");
	button.appendChild(icon);
	return button;
}

function createIcon(classes) {
	const icon = document.createElement("i");
	icon.className = classes;
	return icon;
}

function addItemToStorage(item) {
	const itemsFromStorage = getItemsFromStorage();

	itemsFromStorage.push(item);
	localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
	let itemsFromStorage;
	if (localStorage.getItem("items") === null) {
		itemsFromStorage = [];
	} else {
		itemsFromStorage = JSON.parse(localStorage.getItem("items"));
	}
	return itemsFromStorage;
}

function onSubmit(e) {
	e.preventDefault();
	newItem = itemInput.value;
	if (newItem === "") {
		alert("Please enter a value");
		return;
	}

	if (isEditmode) {
		const itemToEdit = itemList.querySelector(".edit-mode");
		removeItemFromStorage(itemToEdit.textContent);
		itemToEdit.classList.remove("edit-mode");
		itemToEdit.remove();
		isEditmode = false;
	} else {
		if (checkDuplicates(newItem)) {
			itemInput.value = "";
			alert("Item already exists");
			return;
		}
	}
	additemToDOM(newItem);
	addItemToStorage(newItem);
	checkUI();
	itemInput.value = "";
}

function additemToDOM(item) {
	const li = document.createElement("li");
	li.appendChild(document.createTextNode(item));
	const button = createButton("remove-item btn-link text-red");
	li.appendChild(button);
	itemList.appendChild(li);
}

function onClickItem(e) {
	if (e.target.parentElement.classList.contains("remove-item")) {
		removeItem(e.target.parentElement.parentElement);
	} else {
		setItemToEdit(e.target);
	}
}

function checkDuplicates(item) {
	const itemsFromStorage = getItemsFromStorage();
	return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
	isEditmode = true;
	itemList.querySelectorAll("li").forEach((item) => {
		item.classList.remove("edit-mode");
	});
	item.classList.add("edit-mode");
	formBtn.innerHTML = "<i class='fa-solid fa-pen'></i> Update item";
	formBtn.style.backgroundColor = "#228B22";
	itemInput.value = item.textContent;
}

function removeItem(item) {
	if (confirm("Are you sure?")) {
		// Remove from UI
		item.remove();
		// Remove from storage
		removeItemFromStorage(item.textContent);
		checkUI();
	}
}

function removeItemFromStorage(item) {
	let itemsFromStorage = getItemsFromStorage();
	itemsFromStorage = itemsFromStorage.filter((i) => i !== item);
	localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function clearItems() {
	if (confirm("Are you sure? This will remove all the items.")) {
		while (itemList.firstChild) {
			itemList.removeChild(itemList.firstChild);
		}
		localStorage.removeItem("items");
		checkUI();
	}
}

function checkUI() {
	itemInput.value = "";
	const items = document.querySelectorAll("li");
	if (items.length === 0) {
		clearBtn.style.display = "none";
		filter.style.display = "none";
	} else {
		clearBtn.style.display = "block";
		filter.style.display = "block";
	}
	formBtn.innerHTML = "<i class='fa-solid fa-plus'></i> Add item";
	formBtn.style.backgroundColor = "black";
	isEditmode = false;
}

function filterItems(e) {
	const text = e.target.value.toLowerCase();
	const items = document.querySelectorAll("li");
	items.forEach((item) => {
		const itemName = item.firstChild.textContent.toLowerCase();
		if (itemName.indexOf(text) != -1) {
			item.style.display = "flex";
		} else {
			item.style.display = "none";
		}
	});
}

// Initialize app
function init() {
	itemForm.addEventListener("submit", onSubmit);
	itemList.addEventListener("click", onClickItem);
	clearBtn.addEventListener("click", clearItems);
	filter.addEventListener("input", filterItems);
	document.addEventListener("DOMContentLoaded", displayItems);
	checkUI();
}

init();
