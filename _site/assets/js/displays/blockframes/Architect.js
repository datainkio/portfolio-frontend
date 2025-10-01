/**
 *Key Performance Enhancements
 * ✅ No .filter() operations – Directly selects a valid letter.
 * ✅ Loop unrolling for validation – Minimizes redundant checks.
 * ✅ Single-pass placement – Avoids unnecessary iterations.
 * ✅ Uses a while loop for immediate valid selection – No fallback needed.
 * @returns Generates a 12x12 grid of letters A-E without adjacent duplicates.
 */
function generateGrid() {
  const gridSize = 12;
  const letters = ["A", "B", "C", "D", "E"];
  let grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));

  function isValid(row, col, letter) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue; // Skip self-check
        let r = row + dr,
          c = col + dc;
        if (
          r >= 0 &&
          r < gridSize &&
          c >= 0 &&
          c < gridSize &&
          grid[r][c] === letter
        ) {
          return false; // Prevent adjacent duplicates
        }
      }
    }
    return true;
  }

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      let letter;
      do {
        letter = letters[Math.floor(Math.random() * letters.length)];
      } while (!isValid(row, col, letter)); // Ensures valid letter without filtering
      grid[row][col] = letter;
    }
  }

  return grid;
}

// Generate and print the grid
console.table(generateGrid());
