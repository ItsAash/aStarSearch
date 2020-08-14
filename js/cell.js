class Cell {
    constructor(x, y, grid, i, j, isTarget = false, isObstacle = false, isStart = false) {
        // ? Am i a target
        this.isTarget = isTarget

        // ? Am i a wall
        this.isObstacle = isObstacle

        // ? Am i a start
        this.isStart = isStart

        // ** Locations
        this.x = x
        this.y = y
        this.i = i
        this.j = j
        this.grid = grid
        this.gridLen = 20

        // ** A* Search Values
        this.f = 0
        this.g = 0
        this.h = 0

        // ** Neighbors
        this.neighbors = []


        this.path = false

        // ? Where did i come from ?
        this.previous = undefined;

    }
    show(color) {

        fill(255)
            // noStroke()
        if (this.isTarget) fill(200, 0, 0)
        if (this.isStart) fill(0, 200, 0)
        if (this.isObstacle) fill(0)
        if (this.path) fill(255, 255, 0)
        if (color) fill(color)
        rect(this.x, this.y, this.gridLen, this.gridLen)
    }
    contains(x, y) {
        const xCheck = x > this.x && x < (this.x + this.gridLen)
        const yCheck = y > this.y && y < (this.y + this.gridLen)
        return xCheck && yCheck
    }

    addNeighbors(grid) {
        var i = this.i;
        var j = this.j;
        if (i < Cols - 1) {
            this.neighbors.push(grid[i + 1][j]);
        }
        if (i > 0) {
            this.neighbors.push(grid[i - 1][j]);
        }
        if (j < Rows - 1) {
            this.neighbors.push(grid[i][j + 1]);
        }
        if (j > 0) {
            this.neighbors.push(grid[i][j - 1]);
        }
    }

    clear() {
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                this.grid[i][j].previous = undefined
                this.grid[i][j].path = false
                this.grid[i][j].isTarget = false
                this.grid[i][j].isStart = false
                this.grid[i][j].isObstacle = false
                this.grid[i][j].show()
            }
        }
    }
}