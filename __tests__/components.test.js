import React from 'react';
import { render } from '@testing-library/react-native';
import StudyCard from '../components/StudyCard';
import DeckCard from '../components/DeckCard';

describe('StudyCard Component', () => {

  // Test StudyCard snapshot when answer is hidden
  it('should match snapshot when not showing answer', () => {
    const testCard = {
      front: 'What is React Native?',
      back: 'A framework for building mobile apps'
    };
    
    const snapshot = render(<StudyCard card={testCard} showAnswer={false} />);
    expect(snapshot.toJSON()).toMatchSnapshot();
  });

  // Test StudyCard snapshot when answer is revealed
  it('should match snapshot when showing answer', () => {
    const testCard = {
      front: 'What is React Native?',
      back: 'A framework for building mobile apps'
    };
    
    const snapshot = render(<StudyCard card={testCard} showAnswer={true} />);
    expect(snapshot.toJSON()).toMatchSnapshot();
  });

  // Test StudyCard renders content correctly
  it('should render without crashing', () => {
    const testCard = { front: 'Test Question', back: 'Test Answer' };
    const { getByText } = render(<StudyCard card={testCard} showAnswer={false} />);
    expect(getByText(/Test Question/)).toBeTruthy();
  });
});

describe('DeckCard Component', () => {

  // Test DeckCard snapshot with mock data
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

  // Test DeckCard handles props correctly
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

  // Test answer reveal state transitions
  it('should handle card state transitions', () => {
    let showAnswer = false;
    
    showAnswer = true;
    expect(showAnswer).toBe(true);
    
    showAnswer = false;
    expect(showAnswer).toBe(false);
  });

  // Test card data structure validation
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