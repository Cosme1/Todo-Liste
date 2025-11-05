var nodeList = document.getElementsByTagName("li");

for (i = 0; i < nodeList.length; i++) {
    var checkbox = document.createElement("INPUT");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    nodeList[i].insertBefore(checkbox, nodeList[i].firstChild);
    
    var span = document.createElement("SPAN");
    var closeIcon = document.createTextNode("X");
    span.className = "closeButton";
    span.appendChild(closeIcon);
    nodeList[i].appendChild(span);
    nodeList[i].className = "item";
    nodeList[i].draggable = true;
}

var closeButton = document.getElementsByClassName("close");
for (i = 0; i < closeButton.length; i++) {
    closeButton[i].onclick = function() {
        var div = this.parentElement;
        div.style.display = "none";
    }
}

var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
    var checkbox = ev.target.querySelector('.checkbox');
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
    }
  } else if (ev.target.className === 'checkbox') {
    var li = ev.target.parentElement;
    li.classList.toggle('checked');
  }
}, false);

function newElement() {
  var li = document.createElement("li");
  li.className = "item";
  li.draggable = true;
  
  var checkbox = document.createElement("INPUT");
  checkbox.type = "checkbox";
  checkbox.className = "checkbox";
  li.appendChild(checkbox);
  
  var inputValue = document.getElementById("taskInput").value;
  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === '') {
    alert("You must write something!");
    return;
  } else {
    document.getElementById("list").appendChild(li);
  }
  document.getElementById("taskInput").value = "";

  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "closeButton";
  span.appendChild(txt);
  li.appendChild(span);

  span.onclick = function() {
    var div = this.parentElement;
    div.style.display = "none";
    saveTasks();
  }

  attachDragEvents(li);
  saveTasks();
}

const inputField = document.getElementById("taskInput");

inputField.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        newElement();
    }
});

function attachDragEvents(item) {
    item.addEventListener('dragstart', (e) => {
        setTimeout(() => {
            item.classList.add('dragging');
        }, 0);
    });

    item.addEventListener('dragend', () => {
        setTimeout(() => {
            item.classList.remove('dragging');
        }, 0);
        saveTasks();
    });
}

function saveTasks() {
    const list = document.getElementById('list');
    const tasks = [];
    list.querySelectorAll('li').forEach(item => {
        if (item.style.display !== 'none') {
            const checkbox = item.querySelector('.checkbox');
            const text = item.childNodes[1].textContent;
            tasks.push({
                text: text,
                checked: checkbox ? checkbox.checked : false
            });
        }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const saved = localStorage.getItem('tasks');
    if (!saved) return;
    
    const tasks = JSON.parse(saved);
    const list = document.getElementById('list');
    
    tasks.forEach(task => {
        var li = document.createElement("li");
        li.className = "item";
        li.draggable = true;
        
        var checkbox = document.createElement("INPUT");
        checkbox.type = "checkbox";
        checkbox.className = "checkbox";
        checkbox.checked = task.checked;
        li.appendChild(checkbox);
        
        var t = document.createTextNode(task.text);
        li.appendChild(t);
        
        if (task.checked) {
            li.classList.add('checked');
        }
        
        var span = document.createElement("SPAN");
        var txt = document.createTextNode("\u00D7");
        span.className = "closeButton";
        span.appendChild(txt);
        li.appendChild(span);
        
        span.onclick = function() {
            this.parentElement.style.display = "none";
            saveTasks();
        }
        
        list.appendChild(li);
        attachDragEvents(li);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('list');
    
    loadTasks();
    
    list.querySelectorAll('li').forEach(item => {
        item.className = "item";
        item.draggable = true;
        
        if (!item.querySelector('.checkbox')) {
            var checkbox = document.createElement("INPUT");
            checkbox.type = "checkbox";
            checkbox.className = "checkbox";
            item.insertBefore(checkbox, item.firstChild);
        }
        
        attachDragEvents(item);
    });

    document.querySelectorAll('.closeButton').forEach(btn => {
        if (!btn.onclick) {
            btn.onclick = function() {
                this.parentElement.style.display = "none";
                saveTasks();
            }
        }
    });

    list.addEventListener('dragover', (e) => {
        e.preventDefault();
        const dragging = document.querySelector('.dragging');
        if (!dragging) return;
        
        const afterElement = getDragAfterElement(list, e.clientY);
        if (afterElement == null) {
            list.appendChild(dragging);
        } else {
            list.insertBefore(dragging, afterElement);
        }
    });
});

var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
    var checkbox = ev.target.querySelector('.checkbox');
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
    }
    saveTasks();
  } else if (ev.target.className === 'checkbox') {
    var li = ev.target.parentElement;
    li.classList.toggle('checked');
    saveTasks();
  }
}, false);

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}