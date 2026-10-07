/* =========================================================
   BINARY SEARCH TREE STUDIO
   ========================================================= */

class BSTNode {

    constructor(value) {

        this.value = value;

        this.left = null;

        this.right = null;

        this.id =
            "node-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 10);
    }
}


/* =========================================================
   GLOBAL VARIABLES
   ========================================================= */

let root = null;

let searchPath = [];

let animationTimer = null;


const NODE_RADIUS = 32;

const GAP_X = 125;

const GAP_Y = 110;

const PADDING = 90;


/* =========================================================
   EXAMPLES
   ========================================================= */

const examples = [

    {
        name: "Balanced BST",
        icon: "⚖️",
        description: "A well-distributed tree with smaller height.",
        values: [50, 30, 70, 20, 40, 60, 80]
    },

    {
        name: "Left-Skewed BST",
        icon: "↙️",
        description: "Nodes continuously grow towards the left.",
        values: [50, 40, 30, 20, 10]
    },

    {
        name: "Right-Skewed BST",
        icon: "↘️",
        description: "Nodes continuously grow towards the right.",
        values: [10, 20, 30, 40, 50]
    },

    {
        name: "Perfect BST",
        icon: "🎯",
        description: "Every internal node has two children.",
        values: [40, 20, 60, 10, 30, 50, 70]
    },

    {
        name: "Unbalanced BST",
        icon: "📐",
        description: "A tree with uneven node distribution.",
        values: [45, 15, 79, 10, 25, 60, 90, 20, 30]
    },

    {
        name: "Complete BST",
        icon: "🧩",
        description: "Nodes are filled level by level.",
        values: [60, 40, 80, 20, 50, 70, 90, 10, 30]
    },

    {
        name: "Mixed BST",
        icon: "🔀",
        description: "A mixture of left and right branches.",
        values: [55, 25, 75, 15, 35, 65, 85, 5, 20]
    },

    {
        name: "Wide BST",
        icon: "↔️",
        description: "A tree with a large horizontal spread.",
        values: [70, 40, 90, 20, 50, 80, 100, 10, 30]
    },

    {
        name: "Search Practice BST",
        icon: "🔎",
        description: "Useful for demonstrating search paths.",
        values: [65, 35, 85, 20, 45, 75, 95, 15, 25]
    },

    {
        name: "Deletion Example",
        icon: "🗑️",
        description: "Useful for practising node deletion.",
        values: [50, 30, 70, 20, 40, 60, 80, 10, 35, 90]
    },

    {
        name: "Irregular BST",
        icon: "🌿",
        description: "An irregular but valid Binary Search Tree.",
        values: [42, 18, 65, 9, 27, 54, 81, 22, 31]
    },

    {
        name: "Large Balanced BST",
        icon: "🏔️",
        description: "A larger balanced-style example.",
        values: [100, 50, 150, 25, 75, 125, 175, 10, 60, 90]
    },

    {
        name: "Layered BST",
        icon: "🏗️",
        description: "Multiple levels with balanced branching.",
        values: [50, 25, 75, 12, 37, 62, 87, 6, 18]
    },

    {
        name: "Deletion Practice",
        icon: "🧪",
        description: "Good example for deletion with branches.",
        values: [50, 30, 70, 20, 40, 60, 80, 35, 65]
    },

    {
        name: "Deep Balanced BST",
        icon: "🌲",
        description: "A deeper BST with several levels.",
        values: [80, 40, 120, 20, 60, 100, 140, 10, 30, 50, 70]
    },

    {
        name: "Complex BST",
        icon: "🧠",
        description: "A larger tree for advanced practice.",
        values: [55, 30, 80, 15, 40, 70, 95, 10, 20, 35, 45]
    }

];


/* =========================================================
   DOM
   ========================================================= */

const valueInput =
    document.getElementById("valueInput");

const buildInput =
    document.getElementById("buildInput");

const treeStage =
    document.getElementById("treeStage");

const treeSvg =
    document.getElementById("treeSvg");

const nodeLayer =
    document.getElementById("nodeLayer");

const emptyTree =
    document.getElementById("emptyTree");

const treeStatus =
    document.getElementById("treeStatus");

const operationText =
    document.getElementById("operationText");

const operationBadge =
    document.getElementById("operationBadge");


/* =========================================================
   INSERT
   ========================================================= */

function insertNode(value) {

    if (
        typeof value !== "number" ||
        !Number.isFinite(value)
    ) {
        return null;
    }


    if (root === null) {

        root = new BSTNode(value);

        return root;
    }


    let current = root;


    while (true) {

        if (value === current.value) {

            return null;
        }


        if (value < current.value) {

            if (current.left === null) {

                current.left =
                    new BSTNode(value);

                return current.left;
            }

            current = current.left;

        } else {

            if (current.right === null) {

                current.right =
                    new BSTNode(value);

                return current.right;
            }

            current = current.right;
        }
    }
}


/* =========================================================
   INSERT VALUE
   ========================================================= */

function insertValue() {

    const raw =
        valueInput.value.trim();


    if (raw === "") {

        showOperation(
            "Error",
            "Please enter a number."
        );

        return;
    }


    const value =
        Number(raw);


    if (!Number.isFinite(value)) {

        showOperation(
            "Error",
            "Please enter a valid number."
        );

        return;
    }


    const inserted =
        insertNode(value);


    if (!inserted) {

        showOperation(
            "Duplicate",
            `${value} already exists in the tree.`
        );

        return;
    }


    searchPath = [];


    valueInput.value = "";


    drawTree();

    updateStats();


    showOperation(
        "Inserted",
        `${value} was inserted successfully.`
    );


    setTimeout(() => {

        const node =
            document.querySelector(
                `[data-id="${inserted.id}"]`
            );

        if (node) {

            node.classList.add("inserted");
        }

    }, 30);
}


/* =========================================================
   BUILD TREE
   ========================================================= */

function buildTree() {

    const raw =
        buildInput.value.trim();


    if (raw === "") {

        showOperation(
            "Error",
            "Please enter comma-separated values."
        );

        return;
    }


    const parts =
        raw.split(",");


    const values = [];


    for (const part of parts) {

        const clean =
            part.trim();


        /*
           THIS IS THE IMPORTANT FIX.
           Empty values are skipped.
           They are NEVER converted to 0.
        */

        if (clean === "") {
            continue;
        }


        const value =
            Number(clean);


        if (!Number.isFinite(value)) {

            showOperation(
                "Error",
                `"${clean}" is not a valid number.`
            );

            return;
        }


        values.push(value);
    }


    if (values.length === 0) {

        showOperation(
            "Error",
            "No valid numbers were entered."
        );

        return;
    }


    root = null;

    searchPath = [];


    values.forEach(value => {

        insertNode(value);

    });


    drawTree();

    updateStats();


    showOperation(
        "Tree Built",
        `BST created using ${values.length} value${values.length === 1 ? "" : "s"}.`
    );


    setTimeout(centerTree, 100);
}


/* =========================================================
   SEARCH
   ========================================================= */

function searchValue() {

    const raw =
        valueInput.value.trim();


    if (raw === "") {

        showOperation(
            "Error",
            "Enter a value to search."
        );

        return;
    }


    const value =
        Number(raw);


    if (!Number.isFinite(value)) {

        showOperation(
            "Error",
            "Enter a valid number."
        );

        return;
    }


    if (!root) {

        showOperation(
            "Search",
            "The tree is empty."
        );

        return;
    }


    const path = [];

    let current = root;

    let found = false;


    while (current) {

        path.push(current);


        if (value === current.value) {

            found = true;

            break;
        }


        if (value < current.value) {

            current = current.left;

        } else {

            current = current.right;
        }
    }


    searchPath =
        path.map(node => node.id);


    drawTree();

    animateSearch(
        path,
        found,
        value
    );
}


/* =========================================================
   SEARCH ANIMATION
   ========================================================= */

function animateSearch(
    path,
    found,
    value
) {

    if (animationTimer) {

        clearTimeout(animationTimer);
    }


    let index = 0;


    function step() {

        if (index >= path.length) {

            if (found) {

                showOperation(
                    "Found",
                    `${value} was found successfully.`
                );


                const target =
                    document.querySelector(
                        `[data-id="${path[path.length - 1].id}"]`
                    );


                if (target) {

                    target.classList.remove("visited");

                    target.classList.add("found");
                }

            } else {

                showOperation(
                    "Not Found",
                    `${value} does not exist in this BST.`
                );
            }

            return;
        }


        const currentNode =
            document.querySelector(
                `[data-id="${path[index].id}"]`
            );


        if (currentNode) {

            currentNode.classList.add("visited");
        }


        if (index > 0) {

            const edge =
                document.querySelector(
                    `[data-from="${path[index - 1].id}"][data-to="${path[index].id}"]`
                );


            if (edge) {

                edge.classList.add("active");

                edge.setAttribute(
                    "marker-end",
                    "url(#activeArrow)"
                );
            }
        }


        index++;


        animationTimer =
            setTimeout(
                step,
                500
            );
    }


    step();
}


/* =========================================================
   DELETE
   ========================================================= */

function deleteValue() {

    const raw =
        valueInput.value.trim();


    if (raw === "") {

        showOperation(
            "Error",
            "Enter a value to delete."
        );

        return;
    }


    const value =
        Number(raw);


    if (!Number.isFinite(value)) {

        showOperation(
            "Error",
            "Enter a valid number."
        );

        return;
    }


    if (!root) {

        showOperation(
            "Delete",
            "The tree is empty."
        );

        return;
    }


    const result =
        deleteNode(
            root,
            value
        );


    root =
        result.root;


    if (!result.deleted) {

        showOperation(
            "Not Found",
            `${value} was not found in the tree.`
        );

        return;
    }


    valueInput.value = "";

    searchPath = [];


    drawTree();

    updateStats();


    showOperation(
        "Deleted",
        `${value} was deleted successfully.`
    );
}


/* =========================================================
   DELETE LOGIC
   ========================================================= */

function deleteNode(
    node,
    value
) {

    if (!node) {

        return {
            root: null,
            deleted: false
        };
    }


    if (value < node.value) {

        const result =
            deleteNode(
                node.left,
                value
            );


        node.left =
            result.root;


        return {
            root: node,
            deleted: result.deleted
        };
    }


    if (value > node.value) {

        const result =
            deleteNode(
                node.right,
                value
            );


        node.right =
            result.root;


        return {
            root: node,
            deleted: result.deleted
        };
    }


    if (
        node.left === null &&
        node.right === null
    ) {

        return {
            root: null,
            deleted: true
        };
    }


    if (node.left === null) {

        return {
            root: node.right,
            deleted: true
        };
    }


    if (node.right === null) {

        return {
            root: node.left,
            deleted: true
        };
    }


    let successor =
        node.right;


    while (successor.left) {

        successor =
            successor.left;
    }


    node.value =
        successor.value;


    const result =
        deleteNode(
            node.right,
            successor.value
        );


    node.right =
        result.root;


    return {
        root: node,
        deleted: true
    };
}


/* =========================================================
   CLEAR
   ========================================================= */

function clearTree() {

    root = null;

    searchPath = [];


    if (animationTimer) {

        clearTimeout(animationTimer);
    }


    drawTree();

    updateStats();


    showOperation(
        "Cleared",
        "The Binary Search Tree has been cleared."
    );
}


/* =========================================================
   RANDOM
   ========================================================= */

function generateRandomTree() {

    root = null;

    searchPath = [];


    const values =
        new Set();


    const count =
        7 +
        Math.floor(
            Math.random() * 6
        );


    while (values.size < count) {

        values.add(
            Math.floor(
                Math.random() * 99
            ) + 1
        );
    }


    values.forEach(value => {

        insertNode(value);

    });


    drawTree();

    updateStats();


    showOperation(
        "Random Tree",
        `Generated a random BST with ${count} unique nodes.`
    );


    setTimeout(centerTree, 100);
}


/* =========================================================
   LAYOUT
   ========================================================= */

function calculateLayout() {

    const positions =
        new Map();

    let index = 0;

    let maxDepth = 0;


    function inorderLayout(
        node,
        depth
    ) {

        if (!node) {
            return;
        }


        inorderLayout(
            node.left,
            depth + 1
        );


        const x =
            PADDING +
            index * GAP_X;


        const y =
            PADDING +
            depth * GAP_Y;


        positions.set(
            node.id,
            {
                x,
                y,
                node
            }
        );


        index++;


        maxDepth =
            Math.max(
                maxDepth,
                depth
            );


        inorderLayout(
            node.right,
            depth + 1
        );
    }


    inorderLayout(
        root,
        0
    );


    return {
        positions,
        count: index,
        maxDepth
    };
}


/* =========================================================
   DRAW TREE
   ========================================================= */

function drawTree() {

    treeSvg.innerHTML = "";

    nodeLayer.innerHTML = "";


    if (!root) {

        emptyTree.style.display = "block";

        treeStage.style.width = "900px";

        treeStage.style.height = "560px";

        treeSvg.setAttribute("width", "900");

        treeSvg.setAttribute("height", "560");

        treeStatus.textContent =
            "Your tree will appear here";

        return;
    }


    emptyTree.style.display = "none";


    const layout =
        calculateLayout();


    const width =
        Math.max(
            900,
            PADDING * 2 +
            (layout.count - 1) * GAP_X
        );


    const height =
        Math.max(
            560,
            PADDING * 2 +
            layout.maxDepth * GAP_Y
        );


    treeStage.style.width =
        `${width}px`;


    treeStage.style.height =
        `${height}px`;


    treeSvg.setAttribute(
        "width",
        width
    );


    treeSvg.setAttribute(
        "height",
        height
    );


    treeSvg.setAttribute(
        "viewBox",
        `0 0 ${width} ${height}`
    );


    createSVGDefinitions();


    drawEdges(
        root,
        layout.positions
    );


    drawNodes(
        root,
        layout.positions
    );


    treeStatus.textContent =
        `${layout.count} node${layout.count === 1 ? "" : "s"} • Height ${layout.maxDepth + 1}`;
}


/* =========================================================
   SVG DEFINITIONS
   ========================================================= */

function createSVGDefinitions() {

    const defs =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "defs"
        );


    const filter =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "filter"
        );


    filter.id = "edgeGlow";

    filter.setAttribute("x", "-100%");

    filter.setAttribute("y", "-100%");

    filter.setAttribute("width", "300%");

    filter.setAttribute("height", "300%");


    const blur =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "feGaussianBlur"
        );


    blur.setAttribute(
        "stdDeviation",
        "3"
    );


    const merge =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "feMerge"
        );


    const blurNode =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "feMergeNode"
        );


    blurNode.setAttribute(
        "in",
        "blur"
    );


    const sourceNode =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "feMergeNode"
        );


    sourceNode.setAttribute(
        "in",
        "SourceGraphic"
    );


    merge.appendChild(blurNode);

    merge.appendChild(sourceNode);

    filter.appendChild(blur);

    filter.appendChild(merge);

    defs.appendChild(filter);


    /* NORMAL ARROW */

    const marker =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "marker"
        );


    marker.id = "arrow";

    marker.setAttribute(
        "markerWidth",
        "14"
    );

    marker.setAttribute(
        "markerHeight",
        "14"
    );

    marker.setAttribute(
        "refX",
        "11"
    );

    marker.setAttribute(
        "refY",
        "5"
    );

    marker.setAttribute(
        "orient",
        "auto"
    );

    marker.setAttribute(
        "markerUnits",
        "userSpaceOnUse"
    );


    const arrow =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );


    arrow.setAttribute(
        "d",
        "M0 0 L11 5 L0 10 Z"
    );


    arrow.setAttribute(
        "fill",
        "#7786e8"
    );


    marker.appendChild(arrow);

    defs.appendChild(marker);


    /* ACTIVE ARROW */

    const activeMarker =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "marker"
        );


    activeMarker.id =
        "activeArrow";


    activeMarker.setAttribute(
        "markerWidth",
        "15"
    );

    activeMarker.setAttribute(
        "markerHeight",
        "15"
    );

    activeMarker.setAttribute(
        "refX",
        "12"
    );

    activeMarker.setAttribute(
        "refY",
        "5"
    );

    activeMarker.setAttribute(
        "orient",
        "auto"
    );

    activeMarker.setAttribute(
        "markerUnits",
        "userSpaceOnUse"
    );


    const activeArrow =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );


    activeArrow.setAttribute(
        "d",
        "M0 0 L12 5 L0 10 Z"
    );


    activeArrow.setAttribute(
        "fill",
        "#27d4f3"
    );


    activeMarker.appendChild(
        activeArrow
    );

    defs.appendChild(
        activeMarker
    );


    treeSvg.appendChild(defs);
}


/* =========================================================
   DRAW EDGES
   ========================================================= */

function drawEdges(
    node,
    positions
) {

    if (!node) {
        return;
    }


    if (node.left) {

        createEdge(
            node,
            node.left,
            positions,
            "left"
        );


        drawEdges(
            node.left,
            positions
        );
    }


    if (node.right) {

        createEdge(
            node,
            node.right,
            positions,
            "right"
        );


        drawEdges(
            node.right,
            positions
        );
    }
}


/* =========================================================
   PRECISE EDGE MAPPING
   ========================================================= */

function createEdge(
    parentNode,
    childNode,
    positions,
    side
) {

    const parent =
        positions.get(
            parentNode.id
        );


    const child =
        positions.get(
            childNode.id
        );


    const dx =
        child.x -
        parent.x;


    const dy =
        child.y -
        parent.y;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    const ux =
        dx / distance;


    const uy =
        dy / distance;


    /*
       EDGE STARTS AT
       PARENT CIRCLE BORDER
    */

    const startX =
        parent.x +
        ux * NODE_RADIUS;


    const startY =
        parent.y +
        uy * NODE_RADIUS;


    /*
       EDGE ENDS AT
       CHILD CIRCLE BORDER
    */

    const endX =
        child.x -
        ux * NODE_RADIUS;


    const endY =
        child.y -
        uy * NODE_RADIUS;


    const curve =
        Math.min(
            35,
            distance * 0.15
        );


    let c1x;
    let c1y;
    let c2x;
    let c2y;


    if (side === "left") {

        c1x =
            startX -
            curve;

        c1y =
            startY +
            curve * 0.25;


        c2x =
            endX +
            curve;

        c2y =
            endY -
            curve * 0.25;

    } else {

        c1x =
            startX +
            curve;

        c1y =
            startY +
            curve * 0.25;


        c2x =
            endX -
            curve;

        c2y =
            endY -
            curve * 0.25;
    }


    const path =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );


    path.setAttribute(
        "d",
        `
        M ${startX} ${startY}
        C ${c1x} ${c1y},
          ${c2x} ${c2y},
          ${endX} ${endY}
        `
    );


    path.classList.add("tree-edge");


    path.dataset.from =
        parentNode.id;


    path.dataset.to =
        childNode.id;


    path.setAttribute(
        "marker-end",
        "url(#arrow)"
    );


    treeSvg.appendChild(path);
}


/* =========================================================
   DRAW NODES
   ========================================================= */

function drawNodes(
    node,
    positions
) {

    if (!node) {
        return;
    }


    const position =
        positions.get(
            node.id
        );


    const element =
        document.createElement("div");


    element.className =
        "tree-node";


    element.dataset.id =
        node.id;


    element.textContent =
        node.value;


    element.style.left =
        `${position.x}px`;


    element.style.top =
        `${position.y}px`;


    element.onclick =
        function () {

            valueInput.value =
                node.value;


            showOperation(
                "Selected",
                `Node ${node.value} selected.`
            );
        };


    nodeLayer.appendChild(element);


    drawNodes(
        node.left,
        positions
    );


    drawNodes(
        node.right,
        positions
    );
}


/* =========================================================
   TRAVERSALS
   ========================================================= */

function inorder(
    node,
    result = []
) {

    if (!node) {
        return result;
    }


    inorder(
        node.left,
        result
    );


    result.push(node.value);


    inorder(
        node.right,
        result
    );


    return result;
}


function preorder(
    node,
    result = []
) {

    if (!node) {
        return result;
    }


    result.push(node.value);


    preorder(
        node.left,
        result
    );


    preorder(
        node.right,
        result
    );


    return result;
}


function postorder(
    node,
    result = []
) {

    if (!node) {
        return result;
    }


    postorder(
        node.left,
        result
    );


    postorder(
        node.right,
        result
    );


    result.push(node.value);


    return result;
}


/* =========================================================
   STATISTICS
   ========================================================= */

function countNodes(node) {

    if (!node) {
        return 0;
    }


    return (
        1 +
        countNodes(node.left) +
        countNodes(node.right)
    );
}


function getHeight(node) {

    if (!node) {
        return 0;
    }


    return (
        1 +
        Math.max(
            getHeight(node.left),
            getHeight(node.right)
        )
    );
}


function getMinimum(node) {

    if (!node) {
        return null;
    }


    while (node.left) {
        node = node.left;
    }


    return node.value;
}


function getMaximum(node) {

    if (!node) {
        return null;
    }


    while (node.right) {
        node = node.right;
    }


    return node.value;
}


function balanceHeight(node) {

    if (!node) {
        return 0;
    }


    const left =
        balanceHeight(node.left);


    const right =
        balanceHeight(node.right);


    if (
        left === -1 ||
        right === -1 ||
        Math.abs(left - right) > 1
    ) {

        return -1;
    }


    return (
        1 +
        Math.max(left, right)
    );
}


function isBalanced() {

    return balanceHeight(root) !== -1;
}


/* =========================================================
   UPDATE STATISTICS
   ========================================================= */

function updateStats() {

    const count =
        countNodes(root);


    const height =
        getHeight(root);


    document.getElementById(
        "nodeCount"
    ).textContent = count;


    document.getElementById(
        "treeHeight"
    ).textContent = height;


    document.getElementById(
        "minValue"
    ).textContent =
        root
            ? getMinimum(root)
            : "—";


    document.getElementById(
        "maxValue"
    ).textContent =
        root
            ? getMaximum(root)
            : "—";


    document.getElementById(
        "balanceStatus"
    ).textContent =
        root
            ? (
                isBalanced()
                    ? "Balanced"
                    : "Skewed"
            )
            : "—";


    document.getElementById(
        "inorderResult"
    ).textContent =
        root
            ? inorder(root).join(" → ")
            : "—";


    document.getElementById(
        "preorderResult"
    ).textContent =
        root
            ? preorder(root).join(" → ")
            : "—";


    document.getElementById(
        "postorderResult"
    ).textContent =
        root
            ? postorder(root).join(" → ")
            : "—";
}


/* =========================================================
   OPERATION MESSAGE
   ========================================================= */

function showOperation(
    type,
    message
) {

    operationBadge.textContent =
        type;


    operationText.textContent =
        message;
}


/* =========================================================
   EXAMPLES
   ========================================================= */

function createExamples() {

    const container =
        document.getElementById(
            "examplesGrid"
        );


    container.innerHTML = "";


    examples.forEach(
        (example, index) => {

            const button =
                document.createElement("button");


            button.className =
                "example-btn";


            button.innerHTML = `

                <div class="example-icon">
                    ${example.icon}
                </div>

                <div class="example-name">
                    ${example.name}
                </div>

                <div class="example-description">
                    ${example.description}
                </div>

                <div class="example-values">
                    ${example.values.join(", ")}
                </div>

            `;


            button.onclick =
                () => loadExample(index);


            container.appendChild(button);
        }
    );
}


/* =========================================================
   LOAD EXAMPLE
   ========================================================= */

function loadExample(index) {

    const example =
        examples[index];


    root = null;

    searchPath = [];


    example.values.forEach(
        value => insertNode(value)
    );


    drawTree();

    updateStats();


    showOperation(
        "Example Loaded",
        `${example.name} loaded successfully.`
    );


    setTimeout(
        centerTree,
        100
    );
}


/* =========================================================
   CENTER TREE
   ========================================================= */

function centerTree() {

    const scroll =
        document.getElementById(
            "treeScroll"
        );


    if (!scroll) {
        return;
    }


    scroll.scrollTo({

        left:
            Math.max(
                0,
                (
                    scroll.scrollWidth -
                    scroll.clientWidth
                ) / 2
            ),

        top:
            Math.max(
                0,
                (
                    scroll.scrollHeight -
                    scroll.clientHeight
                ) / 2
            ),

        behavior: "smooth"
    });
}


/* =========================================================
   ENTER KEY
   ========================================================= */

function handleEnter(event) {

    if (event.key === "Enter") {

        insertValue();
    }
}


/* =========================================================
   THEME TOGGLE
   ========================================================= */

function toggleTheme() {

    document.body.classList.toggle("light");


    const isLight =
        document.body.classList.contains("light");


    const themeButton =
        document.getElementById("themeBtn");


    themeButton.textContent =
        isLight
            ? "🌙"
            : "☀️";


    localStorage.setItem(
        "bst-theme",
        isLight
            ? "light"
            : "dark"
    );
}


/* =========================================================
   INITIALIZE THEME
   ========================================================= */

function initializeTheme() {

    const savedTheme =
        localStorage.getItem("bst-theme");


    if (savedTheme === "light") {

        document.body.classList.add("light");

        document.getElementById(
            "themeBtn"
        ).textContent = "🌙";

    } else {

        document.body.classList.remove("light");

        document.getElementById(
            "themeBtn"
        ).textContent = "☀️";
    }
}


/* =========================================================
   INITIALIZE APP
   ========================================================= */

function initialize() {

    initializeTheme();

    createExamples();

    drawTree();

    updateStats();
}


initialize();