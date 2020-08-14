let gridArray;

// * Open and Closed Sets
var openSet = [];
var closedSet = [];

// * Start and End
var start;
var end;

// * A road to be Taken
var path = [];
// * ROws and Cols
var Cols;
var Rows;


var looping = true;
var animating = false

function setup() {
    createCanvas(1000, 560)

    gridArray = make2DArray(width / 20, height / 20)
    for (let i = 0; i < gridArray.length; i++) {
        for (let j = 0; j < gridArray[i].length; j++) {
            gridArray[i][j] = new Cell(i * 20, j * 20, gridArray, i, j)
        }
    }

    // * Add Neighbours
    for (var i = 0; i < Cols; i++) {
        for (var j = 0; j < Rows; j++) {
            gridArray[i][j].addNeighbors(gridArray);
        }
    }
}

function draw() {
    // * Here comes all logics
    if (animating) {
        if (openSet.length > 0) {
            var winner = 0;
            for (let i = 0; i < openSet.length; i++) {
                if (openSet[i].f <= openSet[winner].f) {
                    winner = i
                }
            }

            var current = openSet[winner]
            removeFromArray(openSet, current)
            closedSet.push(current)

            if (current == end) {
                animating = false;
                console.log('Done');

                path = [];
                var temp = current.previous
                path.push(temp)
                while (temp.previous) {
                    path.push(temp.previous)
                    temp = temp.previous
                }

                path.forEach(cell => {
                    if (!cell.isStart && !cell.isTarget) {
                        cell.path = true
                    }
                })
                console.log(path.length)
                looping = false;
                openSet = [];
                closedSet = []
                return;
            }
            var neighbors = current.neighbors
            for (let neighbor of neighbors) {
                if (!closedSet.includes(neighbor) && !neighbor.isObstacle) {
                    var tempG = current.g + heuristic(neighbor, current)

                    var newPath = false
                    if (openSet.includes(neighbor) && !neighbor.isObstacle) {
                        if (tempG < neighbor.g) {
                            neighbor.g = tempG;
                            newPath = true;
                        }
                    } else {
                        neighbor.g = tempG;
                        newPath = true;
                        openSet.push(neighbor);
                    }
                    if (newPath) {
                        neighbor.h = heuristic(neighbor, end);
                        neighbor.f = neighbor.g + neighbor.h;
                        neighbor.previous = current;
                    }
                }
            }

        } else {
            console.log('no solution');
            looping = false
            return;
        }
    }
    background(0);
    // * Shows Grid
    for (let i = 0; i < gridArray.length; i++) {
        for (let j = 0; j < gridArray[i].length; j++) {
            gridArray[i][j].show()

            // * Set Start And End
            if (gridArray[i][j].isStart) {
                start = gridArray[i][j]
            }
            if (gridArray[i][j].isTarget) {
                end = gridArray[i][j]
            }
        }
    }

    openSet.forEach(cell => {
        if (!cell.isObstacle && !cell.isStart && !cell.isTarget && !cell.neighbors.includes(end)) {
            cell.show(color(0, 200, 0, 70))
        }
    })

    closedSet.forEach(cell => {
        if (!cell.isStart) {
            cell.show(color(200, 0, 0, 70))
        }
    })

}

function mouseDragged() {
    if (looping) {
        drawObstacles()
    }
}

function drawObstacles() {
    for (let i = 0; i < gridArray.length; i++) {
        for (let j = 0; j < gridArray[i].length; j++) {
            if (gridArray[i][j].contains(mouseX, mouseY) && !gridArray[i][j].isStart && !gridArray[i][j].isTarget) {
                gridArray[i][j].isObstacle = true;
            }
        }
    }
}

function keyPressed() {

    if (key == 't') {
        for (let i = 0; i < gridArray.length; i++) {
            for (let j = 0; j < gridArray[i].length; j++) {
                if (gridArray[i][j].contains(mouseX, mouseY) && !gridArray[i][j].isStart) {
                    const cell = getCellInfo(gridArray, false)
                    if (cell) cell.isTarget = false
                    gridArray[i][j].isObstacle = false
                    gridArray[i][j].isTarget = true;
                }
            }
        }
    } else if (key == 's') {
        for (let i = 0; i < gridArray.length; i++) {
            for (let j = 0; j < gridArray[i].length; j++) {
                if (gridArray[i][j].contains(mouseX, mouseY) && !gridArray[i][j].isTarget) {
                    const cell = getCellInfo(gridArray, true)
                    if (cell) cell.isStart = false
                    gridArray[i][j].isObstacle = false
                    gridArray[i][j].isStart = true;
                }
            }
        }
    } else if (key == ' ') {
        // * Get Start and Ends
        start = getCellInfo(gridArray, true)
        end = getCellInfo(gridArray, false)

        // * Check if Start and End exist or not
        if (start && end) {
            animating = true;
            openSet = [];
            closedSet = [];
            openSet.push(start);
        } else {
            console.log('missing');
            return;
        }
    }
}

function getCellInfo(grid, targetOrStart) {
    var cellToReturn;
    for (let row of grid) {
        for (let cell of row) {
            if (targetOrStart) {
                if (cell.isStart) {
                    cellToReturn = cell
                }
            } else {
                if (cell.isTarget) {
                    cellToReturn = cell
                }
            }
        }
    }
    if (cellToReturn) {
        return cellToReturn
    } else {
        return false
    }
}



function make2DArray(cols, rows) {
    Cols = cols
    Rows = rows
    var arr = new Array(cols);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}

// * An educated guess of how far it is between two points
function heuristic(a, b) {
    var d = dist(a.i, a.j, b.i, b.j);
    return d;
}

function removeFromArray(arr, elt) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == elt) {
            arr.splice(i, 1);
        }
    }
}

function resetboard() {
    animating = false;
    looping = true;
    gridArray[0][0].clear()

}

function clearWalls() {
    for (let i = 0; i < gridArray.length; i++) {
        for (let j = 0; j < gridArray[i].length; j++) {
            gridArray[i][j].isObstacle = false
        }
    }
}