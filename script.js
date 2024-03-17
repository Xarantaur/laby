"use strict";

window.addEventListener("load", start);

// ==================== MODEL ============================

const route = []; // den rute soleren har besøgt.

let lab;

function loadLabFromJsonFile() {
  return fetch("maze.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      lab = data;
    })
    .catch((error) => {
      console.error("There was a problem fetching the maze:", error);
    });
}

for (let i = 0; i < lab.maze.length; i++) {
  for (let j = 0; j < lab.maze[i].length; j++) {
    lab.maze[i][j].visited = false;
  }
}

// define which directions is default by design and how to mark cells at visited:
function visitCell(row, col) {
  // Push the starting cell onto the stack (route)
  route.push({ row, col });

  // Function to visit cells with a delay
  function visitWithDelay() {
    // While there are cells to visit in the stack (route)
    if (route.length > 0) {
      // Pop the top cell from the stack (route)
      const { row, col } = route.pop();

      // Mark the current cell as visited
      lab.maze[row][col].visited = true;
      console.log(`Visiting cell [row: ${row}, col: ${col}]`);

      // Remove 'current' class from the previously visited cell
      const previousCell = document.querySelector(".current");
      if (previousCell) {
        previousCell.classList.remove("current");
      }

      // Add 'current' class to the current cell
      const currentCell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
      currentCell.classList.add("current");

      // Check if the current cell is the goal
      if (row === lab.goal.row && col === lab.goal.col) {
        console.log("Goal reached!");
        updateView();
        return; // Stop further iterations
      }

      // Check neighbors in clockwise order: north, east, south, west
      const neighbors = [
        { newRow: row - 1, newCol: col, dir: "north" },
        { newRow: row, newCol: col + 1, dir: "east" },
        { newRow: row + 1, newCol: col, dir: "south" },
        { newRow: row, newCol: col - 1, dir: "west" },
      ];

      for (const neighbor of neighbors) {
        const { newRow, newCol, dir } = neighbor;

        // Check if the neighbor is within the maze bounds and unvisited
        if (
          newRow >= 0 &&
          newRow < lab.rows &&
          newCol >= 0 &&
          newCol < lab.cols &&
          !lab.maze[newRow][newCol].visited &&
          !lab.maze[row][col][dir] // Check if the wall is present in the current cell
        ) {
          // Push the neighbor onto the stack (route)
          route.push({ row: newRow, col: newCol });

          // Update the maze to indicate the direction to reach this neighbor
          lab.maze[row][col][dir] = true;
        }
      }

      // Update the view after each step
      updateView();

      // Schedule the next step after a delay
      setTimeout(visitWithDelay, 500);
    }
  }

  // Start visiting cells with a delay
  setTimeout(visitWithDelay, 500);
}

// Call the function to generate the maze

// ========================VIEW ==========================
function createGrid() {
  const container = document.getElementById("maze-container");
  container.innerHTML = ""; // Clear previous content

  // Iterate through each row of the maze
  for (let i = 0; i < lab.rows; i++) {
    // Iterate through each cell in the row
    for (let j = 0; j < lab.cols; j++) {
      // Create a div element for the cell
      const cell = document.createElement("div");

      // Access the cell data from the maze JSON
      const cellData = lab.maze[i][j];

      // Set classes for the cell based on the JSON properties
      cell.className = "cell";
      if (cellData.north) {
        cell.classList.add("north");
      }
      if (cellData.east) {
        cell.classList.add("east");
      }
      if (cellData.west) {
        cell.classList.add("west");
      }
      if (cellData.south) {
        cell.classList.add("south");
      }
      // Set data attributes for row and column
      cell.setAttribute("data-row", i);
      cell.setAttribute("data-col", j);

      if (i === lab.start.row && j === lab.start.col) {
        cell.classList.add("start");
      } else if (i === lab.goal.row && j === lab.goal.col) {
        cell.classList.add("goal");
      }

      // Append the cell to the container
      container.appendChild(cell);
    }
  }
}

function updateView() {
  const cells = document.querySelectorAll("#maze-container .cell");
  cells.forEach((cell, index) => {
    const row = Math.floor(index / lab.cols);
    const col = index % lab.cols;
    if (lab.maze[row][col].visited) {
      cell.classList.add("visited");
    } else {
      cell.classList.remove("visited");
    }
  });
}

// ======================= CONTROLLER =======================
function start() {
  loadLabFromJsonFile().then(() => {
    createGrid();
    visitCell(lab.start.row, lab.start.col);
  });
}
