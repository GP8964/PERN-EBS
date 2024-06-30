/* scripts.js */

document.addEventListener('DOMContentLoaded', () => {
    // Assuming weaponData is loaded from weapon.js and is available globally
    createAndAppendTree(weaponData);
});

function createAndAppendTree(data) {
    const treeContainer = document.getElementById('treeContainer');
    treeContainer.innerHTML = ''; // Clear any existing tree
    const tree = createTree(data);
    treeContainer.appendChild(tree);

    // Expand/collapse functionality
    const toggler = document.getElementsByClassName("caret");
    const nodes = document.getElementsByClassName("node");

    for (let i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function() {
            const parentLi = this.parentElement.parentElement;
            const nestedUl = parentLi.querySelector(".nested");

            nestedUl.classList.toggle("active");
            this.classList.toggle("caret-down");

            if (this.classList.contains("caret-down")) {
                this.textContent = "-";
            } else {
                this.textContent = "+";
            }
        });
    }

    for (let i = 0; i < nodes.length; i++) {
        nodes[i].addEventListener("click", function(event) {
            // Prevent the caret from triggering form submission
            if (event.target.classList.contains('caret') || event.target.textContent == "- なし" || event.target.textContent == "+ なし") {
                return;
            }
            const wname = this.getAttribute('data-wname');
            const form = document.getElementById('treeForm');
            const input = document.getElementById('wname');
            input.value = wname;
            form.submit();
        });
    }

    // Expand all nodes by default
    expandAllNodes(tree);
}

function createTree(data) {
    const root = document.createElement('ul');

    function addNode(parent, key) {
        const li = document.createElement('li');
        const div = document.createElement('div');
        div.classList.add('node');
        div.setAttribute('data-wname', key);
        div.innerHTML = `<span class="caret">+</span> ${data[key]}`;
        li.appendChild(div);

        const nestedUl = document.createElement('ul');
        nestedUl.classList.add('nested');

        for (const k in data) {
            if (k.startsWith(key) && k !== key && k.length === key.length + 1) {
                addNode(nestedUl, k);
            }
        }

        if (nestedUl.childNodes.length > 0) {
            li.appendChild(nestedUl);
        } else {
            div.innerHTML = data[key]; // Remove caret if no children
        }

        parent.appendChild(li);
    }

    for (const key in data) {
        if (key.length === 1) {
            addNode(root, key);
        }
    }

    return root;
}

function expandAllNodes(tree) {
    const nestedElements = tree.querySelectorAll('.nested');
    nestedElements.forEach(element => {
        element.classList.add('active');
    });

    const caretElements = tree.querySelectorAll('.caret');
    caretElements.forEach(element => {
        element.classList.add('caret-down');
        element.textContent = "-";
    });
}