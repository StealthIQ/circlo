
import React, { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';

// Array of sustainability quotes
const sustainabilityQuotes = [
  {
    text: "We don't inherit the Earth from our ancestors; we borrow it from our children.",
    author: "Native American Proverb"
  },
  {
    text: "The greatest threat to our planet is the belief that someone else will save it.",
    author: "Robert Swan"
  },
  {
    text: "We do not need to accept the world as it is. We can create the world as it could be.",
    author: "Ray Anderson"
  },
  {
    text: "The Earth is what we all have in common.",
    author: "Wendell Berry"
  },
  {
    text: "There is no such thing as 'away'. When we throw anything away, it must go somewhere.",
    author: "Annie Leonard"
  },
  {
    text: "The future will either be green or not at all.",
    author: "Bob Brown"
  },
  {
    text: "Sustainability is no longer about doing less harm. It's about doing more good.",
    author: "Jochen Zeitz"
  },
  {
    text: "Conservation is a state of harmony between men and land.",
    author: "Aldo Leopold"
  },
  {
    text: "The environment is where we all meet; where we all have a mutual interest; it is the one thing all of us share.",
    author: "Lady Bird Johnson"
  },
  {
    text: "A sustainable world means working together to create prosperity for all.",
    author: "Jacqueline Novogratz"
  }
];

interface QuoteCarouselProps {
  interval?: number; // Time in milliseconds between quote changes
}

export const QuoteCarousel: React.FC<QuoteCarouselProps> = ({ interval = 10000 }) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState<number>(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  // Change quote at the specified interval
  useEffect(() => {
    const quoteTimer = setInterval(() => {
      // Start fade out
      setFadeState('out');
      
      // After fade out completes, change quote and fade in
      setTimeout(() => {
        setCurrentQuoteIndex((prevIndex) => 
          (prevIndex + 1) % sustainabilityQuotes.length
        );
        setFadeState('in');
      }, 500); // Fade out duration
      
    }, interval);
    
    return () => clearInterval(quoteTimer);
  }, [interval]);

  const currentQuote = sustainabilityQuotes[currentQuoteIndex];

  return (
    <div className="bg-white p-4 rounded-xl shadow-md overflow-hidden">
      <div className={`flex items-start transition-opacity duration-500 ${
        fadeState === 'in' ? 'opacity-100' : 'opacity-0'
      }`}>
        <Quote className="text-secondary flex-shrink-0 mt-1 mr-3" size={24} />
        <div>
          <p className="text-gray-800 font-medium italic">{currentQuote.text}</p>
          <p className="text-right text-gray-500 text-sm mt-2">— {currentQuote.author}</p>
        </div>
      </div>
    </div>
  );
};
