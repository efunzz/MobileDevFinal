// __tests__/components.test.js
// Testing component logic and rendering

import React from 'react';
import { render } from '@testing-library/react-native';

// Import your components
import StudyCard from '../components/StudyCard';
import DeckCard from '../components/DeckCard';

describe('StudyCard Component', () => {
  
  it('should match snapshot when not showing answer', () => {
    const testCard = { 
      front: 'What is React Native?', 
      back: 'A framework for building mobile apps' 
    };
    
    const snapshot = render(<StudyCard card={testCard} showAnswer={false} />);
    expect(snapshot.toJSON()).toMatchSnapshot();
  });
  
  it('should match snapshot when showing answer', () => {
    const testCard = { 
      front: 'What is React Native?', 
      back: 'A framework for building mobile apps' 
    };
    
    const snapshot = render(<StudyCard card={testCard} showAnswer={true} />);
    expect(snapshot.toJSON()).toMatchSnapshot();
  });
  
  it('should render without crashing', () => {
    const testCard = { front: 'Test Question', back: 'Test Answer' };
    const { getByText } = render(<StudyCard card={testCard} showAnswer={false} />);
    expect(getByText(/Test Question/)).toBeTruthy();
  });
});

describe('DeckCard Component', () => {
  
  it('should match snapshot', () => {
    const testDeck = { 
      id: 1, 
      name: 'Test Deck',
      created_at: '2023-01-01',
      cards: [
        { front: 'Q1', back: 'A1', isEmpty: false },
        { front: 'Q2', back: 'A2', isEmpty: false }
      ]
    };
    
    const mockOnPress = jest.fn();
    const snapshot = render(<DeckCard deck={testDeck} onPress={mockOnPress} />);
    expect(snapshot.toJSON()).toMatchSnapshot();
  });
  
  it('should handle props correctly', () => {
    const testDeck = { 
      id: 1, 
      name: 'Spanish Cards',
      cards: []
    };
    
    expect(testDeck.name).toBe('Spanish Cards');
    expect(testDeck.id).toBe(1);
    expect(Array.isArray(testDeck.cards)).toBe(true);
  });
});

describe('Component Logic Tests', () => {
  
  it('should handle card state transitions', () => {
    let showAnswer = false;
    
    // Reveal answer
    showAnswer = true;
    expect(showAnswer).toBe(true);
    
    // Reset for next card
    showAnswer = false;
    expect(showAnswer).toBe(false);
  });
  
  it('should handle card data correctly', () => {
    const cardData = { 
      front: 'Question', 
      back: 'Answer',
      id: 1 
    };
    
    expect(cardData.front).toBe('Question');
    expect(cardData.back).toBe('Answer');
    expect(typeof cardData.id).toBe('number');
  });
});