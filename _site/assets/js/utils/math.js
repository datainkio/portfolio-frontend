// Return the Fibonacci sequence
export function generateFibonacciSequence(start, length) {
    // Generate the first few numbers to cover any start position
    const fibonacci = [0, 1];
    for (let i = 2; i < start + length; i++) {
        fibonacci.push(fibonacci[i - 1] + fibonacci[i - 2]);
    }
    // Return the slice starting at 'start' with 'length' items
    return fibonacci.slice(start, start + length);
}

// Return a logarithmic progression of integers
export function generateLogarithmicProgression(start, end, steps) {
  const progression = [];  
  // Ensure end is greater than start for proper logarithmic progression
  if (end <= start || steps < 2) {
    console.error("End must be greater than start, and steps should be at least 2.");
    return [];
  } 
  const logStart = Math.log(start);
  const logEnd = Math.log(end);
  const stepSize = (logEnd - logStart) / (steps - 1);
  // Generate the progression
  for (let i = 0; i < steps; i++) {
    const value = Math.exp(logStart + stepSize * i);
    progression.push(Math.round(value));
  }
  return progression;
}

// Return a random value between -1 and 1, excluding any values between -N and N
export function generateDualRangedRandom(n = 0) {
  let randomNumber;
  do {
    randomNumber = (Math.random() * 2) - 1;
  } while (randomNumber > 0 - n && randomNumber < n);
  return randomNumber
}