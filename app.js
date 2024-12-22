document.addEventListener('DOMContentLoaded', () => {
  const cells = document.querySelectorAll('.grid div'); 
  const playerZeroid = 'zeroid'; 
  const playerCube = 'cube'; 
  let currentPlayer = playerZeroid;


  function handleCellClick(event) {
    const clickedCell = event.target;
    console.log('clicked', event.target);
  }


  cells.forEach(cell => { console.log('cell', cell);
  cell.addEventListener('click', handleCellClick); 
});



});