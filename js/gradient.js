// function generateBlueShade() {
//     // Generate a shade of blue
//     const blueBase = Math.floor(Math.random() * 55) + 20; // 20-75
//     return `rgb(${blueBase}, ${blueBase + 100}, ${Math.min(255, blueBase + 150)})`;
//   }
  
//   function updateGradient() {
//     const button = document.querySelector('.pep');
    
//     const color1 = generateBlueShade();
//     const color2 = generateBlueShade();
//     const color3 = generateBlueShade();
//     const color4 = generateBlueShade();
    
//     const newGradient = `linear-gradient(45deg, ${color1}, ${color2}, ${color3}, ${color4})`;
    
//     button.style.setProperty('--gradient', newGradient);
//   }
  
//   // Update gradient every 5 seconds
//   setInterval(updateGradient, 9000);
  
//   // Initial update
//   updateGradient();