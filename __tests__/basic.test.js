// __tests__/basic.test.js
// Following the exact pattern from Coursera videos

describe('Sample Tests - Basic Logic', () => {
  
    // Following the 5×5=25 pattern from the course
    it('5 x 5 should be 25', () => {
      expect(5 * 5).toBe(25);
    });
    
    it('progress calculation should be correct', () => {
      expect(Math.round((2 / 3) * 100)).toBe(67);
    });
    
    // Test your actual app logic
    it('confidence rating increment should work', () => {
      const initialStats = { again: 0, hard: 0, good: 0, easy: 0 };
      const rating = 'easy';
      const updatedStats = {
        ...initialStats,
        [rating]: initialStats[rating] + 1
      };
      expect(updatedStats.easy).toBe(1);
    });
    
    it('empty card filtering should work', () => {
      const cards = [
        { front: 'Q1', back: 'A1', isEmpty: false },
        { front: '', back: '', isEmpty: true },
        { front: 'Q2', back: 'A2', isEmpty: false }
      ];
      
      const studyCards = cards.filter(card => !card.isEmpty);
      expect(studyCards.length).toBe(2);
    });
    
    it('deck name validation should work', () => {
      const validName = 'My Study Deck';
      const invalidName = '';
      
      expect(validName.trim().length > 0).toBe(true);
      expect(invalidName.trim().length > 0).toBe(false);
    });
  });
  
  describe('Study Session Logic', () => {
    
    it('should identify last card correctly', () => {
      const totalCards = 5;
      const currentIndex = 4;
      const isLastCard = currentIndex === totalCards - 1;
      expect(isLastCard).toBe(true);
    });
    
    it('should calculate progress percentage', () => {
      const currentCard = 3;
      const totalCards = 10;
      const progress = ((currentCard + 1) / totalCards) * 100;
      expect(progress).toBe(40);
    });
  });