// Calculate next review date based on difficulty rating
export const calculateNextReviewDate = (difficulty, currentInterval = 0) => {
    let nextInterval;
    
    switch (difficulty) {
      case 'again':
        nextInterval = 0.1; // Review in ~2 hours
        break;
      case 'hard':
        nextInterval = Math.max(currentInterval * 1.2, 1); // At least 1 day
        break;
      case 'good':
        nextInterval = Math.max(currentInterval * 2.5, 3); // At least 3 days
        break;
      case 'easy':
        nextInterval = Math.max(currentInterval * 3, 7); // At least 7 days
        break;
      default:
        nextInterval = 1;
    }
  
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + Math.floor(nextInterval));
    
    return {
      nextReviewDate: nextDate.toISOString(),
      interval: nextInterval
    };
  };
  
  // Check if card is due for review
  export const isCardDue = (lastStudied, nextReviewDate) => {
    if (!nextReviewDate) return true; // New card
    
    const now = new Date();
    const reviewDate = new Date(nextReviewDate);
    return now >= reviewDate;
  };
  
  // Filter cards that are due for study
  export const getDueCards = (cards) => {
    return cards.filter(card => {
      return isCardDue(card.last_studied, card.next_review_date);
    });
  };