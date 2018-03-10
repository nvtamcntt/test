function saveStorage() {
	setStorage();
	showStorage();
}

function setStorage() {
	localStorage.setItem('nameList', JSON.stringify({
		name1: document.getElementById("nameBox").value,
		name2: document.getElementById("nameBox2").value,
		name3: document.getElementById("nameBox3").value
	}));
}

function showStorage() {
	var li,text, nameList;
	clearNodes();
	
	nameList = JSON.parse(localStorage.getItem('nameList'));   
	for (var nameKey in nameList) {
		text = nameKey + " : " + nameList[nameKey];
		document.getElementById('itemArea')
		.appendChild(document.createElement('li'))
		.appendChild(document.createTextNode(text));
	}
}

function clearStorage() {
	localStorage.clear();
	showStorage();
}

function clearNodes() {
	var itemArea = document.getElementById('itemArea');
	while(itemArea.firstChild) {
		itemArea.removeChild(itemArea.firstChild);
	}
}