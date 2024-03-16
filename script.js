"use strict";

let LAB_WIDTH = 4;
let LAB_HEIGHT = 4;

window.addEventListener("load", start);

// ==================== MODEL ============================

const lab = {
  rows: 4,
  cols: 4,
  start: { row: 0, col: 0 },
  goal: { row: 2, col: 3 },
  maze: [
    [
      { row: 0, col: 0, north: true, east: true, west: true, south: false },
      { row: 0, col: 1, north: true, east: false, west: true, south: false },
      { row: 0, col: 2, north: true, east: false, west: false, south: true },
      { row: 0, col: 3, north: true, east: true, west: false, south: false },
    ],
    [
      { row: 1, col: 0, north: false, east: false, west: true, south: true },
      { row: 1, col: 1, north: false, east: true, west: false, south: true },
      { row: 1, col: 2, north: true, east: false, west: true, south: false },
      { row: 1, col: 3, north: false, east: true, west: false, south: true },
    ],
    [
      { row: 2, col: 0, north: true, east: false, west: true, south: false },
      { row: 2, col: 1, north: true, east: true, west: false, south: true },
      { row: 2, col: 2, north: false, east: true, west: true, south: false },
      { row: 2, col: 3, north: true, east: true, west: true, south: false },
    ],
    [
      { row: 3, col: 0, north: false, east: false, west: true, south: true },
      { row: 3, col: 1, north: true, east: false, west: false, south: true },
      { row: 3, col: 2, north: false, east: false, west: false, south: true },
      { row: 3, col: 3, north: false, east: true, west: false, south: true },
    ],
  ],
};

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

// Call the function to generate the maze

// ========================VIEW ==========================

// ======================= CONTROLLER =======================
function start() {
  createGrid();
}
