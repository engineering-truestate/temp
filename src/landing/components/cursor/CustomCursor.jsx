import React, { useEffect } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext('2d');

    // Setup canvas dimensions to fill the screen
    const setupCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setupCanvas();
    window.addEventListener("resize", setupCanvas);

    // Track the cursor position
    const pointer = {
      x: 0.5 * window.innerWidth,
      y: 0.5 * window.innerHeight,
    };

    // Define parameters for the trail, spring effect, and line width
    const params = {
      spring: 0.4, // Controls how quickly points catch up
      pointsNumber: 5, // Number of points in the trail
      friction: 0.5, // Friction to slow down the points
      baseWidth: 0.2, // Base line width multiplier for tapering effect
    };

    // Initialize trail points
    const trail = new Array(params.pointsNumber).fill(null).map(() => ({
      x: pointer.x,
      y: pointer.y,
      dx: 0,
      dy: 0,
    }));

    // Function to update mouse position
    function updateMousePosition(eX, eY) {
      pointer.x = eX - window.scrollX;  // Adjust for horizontal scroll
      pointer.y = eY - window.scrollY;  // Adjust for vertical scroll
  }
  

    // Event listeners for mouse and touch movement
    window.addEventListener("mousemove", (e) => {
      updateMousePosition(e.pageX, e.pageY);
    });

    window.addEventListener("touchmove", (e) => {
      updateMousePosition(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
    });

    // Animation loop to create the trailing line effect with dynamic line width
    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

      ctx.beginPath(); // Start drawing the line
      trail.forEach((p, pIdx) => {
        const prev = pIdx === 0 ? pointer : trail[pIdx - 1];
        const spring = pIdx === 0 ? 0.4 * params.spring : params.spring;

        // Accumulate velocity (dx, dy) based on the distance to the previous point
        p.dx += (prev.x - p.x) * spring;
        p.dy += (prev.y - p.y) * spring;

        // Apply friction to slow down movement over time
        p.dx *= params.friction;
        p.dy *= params.friction;

        // Move the points based on the velocity
        p.x += p.dx;
        p.y += p.dy;

        // Start the line at the first point
        if (pIdx === 0) {
          ctx.moveTo(p.x, p.y);
        }
      });

      // Smooth the line with Bézier curves and dynamic line width
      for (let i = 1; i < trail.length - 1; i++) {
        const xc = 0.5 * (trail[i].x + trail[i + 1].x); // Calculate midpoint for curve
        const yc = 0.5 * (trail[i].y + trail[i + 1].y);
        ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc); // Draw curve to midpoint

        // Set dynamic line width for tapering effect
        ctx.lineWidth = params.baseWidth * (params.pointsNumber - i);
        ctx.strokeStyle = `rgba(21, 62, 59, 1)`; // Line color
        ctx.lineCap = 'round'; // Rounded line ends
        ctx.stroke(); // Draw the smooth line
      }

      // Continue the animation loop
      window.requestAnimationFrame(update);
    };

    update(); // Start the animation loop

    return () => {
      // Clean up event listeners on component unmount
      window.removeEventListener("resize", setupCanvas);
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("touchmove", updateMousePosition);
    };
  }, []);

  return <canvas id="custom-cursor-canvas"></canvas>;
};

export default CustomCursor;
