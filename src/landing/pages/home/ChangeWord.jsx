import { useState, useEffect } from "react";

const ChangeWord = () => {
  // State to track the current word being typed (Evaluation, Investment, Management)
  const [currentWord, setCurrentWord] = useState("");

  // State to manage typing or deleting action
  const [isDeleting, setIsDeleting] = useState(false);

  // State to keep track of which word in the array is being typed
  const [loopNum, setLoopNum] = useState(0);

  // Speed of typing and deleting characters
  const [typingSpeed, setTypingSpeed] = useState(300);

  // Array of words that will cycle through in the typing effect
  const words = ["Evaluation", "Investment", "Management"];

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % words.length; // Loop over words array
      const fullText = words[i]; // Get the current word to type

      // Logic for typing or deleting the current word
      setCurrentWord((prev) =>
        isDeleting
          ? fullText.substring(0, prev.length - 1) // Delete characters if isDeleting is true
          : fullText.substring(0, prev.length + 1) // Add characters otherwise
      );

      // If word is completely typed out
      if (!isDeleting && currentWord === fullText) {
        setTimeout(() => setIsDeleting(true), 1000); // Wait 1 second, then start deleting
      }
      // If word is completely deleted
      else if (isDeleting && currentWord === "") {
        setIsDeleting(false); // Switch to typing mode
        setLoopNum((prevLoopNum) => prevLoopNum + 1); // Move to the next word
      }

      setTypingSpeed(isDeleting ? 100 : 200); // Adjust typing speed (faster when deleting)
    };

    // Set a timer to handle typing speed
    const timer = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(timer); // Cleanup the timer on each render
  }, [currentWord, isDeleting]); // Dependencies for useEffect

  return (
    <span className="italic text-GableGreen">
      {currentWord}
    
    </span>
  );
};

export default ChangeWord;
