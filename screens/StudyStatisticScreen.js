import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView
} from 'react-native';
import PieChart from 'react-native-pie-chart';

// Generate performance message based on confidence ratings
const getPerformanceMessage = (goodPercent, easyPercent) => {
  const easyAndGoodPercent = goodPercent + easyPercent;
  if (easyAndGoodPercent >= 80) return { text: "Excellent work!", color: '#10b981' };
  if (easyAndGoodPercent >= 60) return { text: "Great progress!", color: '#3b82f6' };
  if (easyAndGoodPercent >= 40) return { text: "Keep practicing!", color: '#f59e0b' };
  return { text: "Review these cards more!", color: '#ef4444' };
};

// Study completion screen showing performance statistics and pie chart
const StudyStatisticsScreen = ({ route, navigation }) => {
  const { studyStats, deckName } = route.params || {};
  
  if (!studyStats) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No study data available</Text>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }
  
  const totalCards = (studyStats.again || 0) + (studyStats.hard || 0) + (studyStats.good || 0) + (studyStats.easy || 0);
  
  const againPercent = totalCards > 0 ? Math.round(((studyStats.again || 0) / totalCards) * 100) : 0;
  const hardPercent = totalCards > 0 ? Math.round(((studyStats.hard || 0) / totalCards) * 100) : 0;
  const goodPercent = totalCards > 0 ? Math.round(((studyStats.good || 0) / totalCards) * 100) : 0;
  const easyPercent = totalCards > 0 ? Math.round(((studyStats.easy || 0) / totalCards) * 100) : 0;

  const widthAndHeight = 180;
  
  const series = [];
  if (studyStats.again > 0) {
    series.push({ value: studyStats.again, color: '#ef4444' });
  }
  if (studyStats.hard > 0) {
    series.push({ value: studyStats.hard, color: '#f59e0b' });
  }
  if (studyStats.good > 0) {
    series.push({ value: studyStats.good, color: '#3b82f6' });
  }
  if (studyStats.easy > 0) {
    series.push({ value: studyStats.easy, color: '#10b981' });
  }
  
  if (series.length === 0) {
    series.push({ value: 1, color: '#e5e7eb' });
  }
  
  const chartData = [];
  if (studyStats.again > 0) {
    chartData.push({ name: 'Again', value: studyStats.again, color: '#ef4444', percentage: againPercent });
  }
  if (studyStats.hard > 0) {
    chartData.push({ name: 'Hard', value: studyStats.hard, color: '#f59e0b', percentage: hardPercent });
  }
  if (studyStats.good > 0) {
    chartData.push({ name: 'Good', value: studyStats.good, color: '#3b82f6', percentage: goodPercent });
  }
  if (studyStats.easy > 0) {
    chartData.push({ name: 'Easy', value: studyStats.easy, color: '#10b981', percentage: easyPercent });
  }

  const performanceMessage = getPerformanceMessage(goodPercent, easyPercent);

  // Navigate back to study screen with same cards
  const handleStudyAgain = () => {
    navigation.navigate('StudyScreen', { 
      cards: route.params.cards
    });
  };

  // Return to home screen
  const handleDone = () => {
    navigation.popToTop();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Study Complete!</Text>
          <Text style={styles.deckName}>{deckName}</Text>
        </View>

        <View style={styles.messageContainer}>
          <Text style={[styles.performanceMessage, { color: performanceMessage.color }]}>
            {performanceMessage.text}
          </Text>
        </View>

        <View style={styles.chartContainer}>
          <View style={styles.chartWrapper}>
            <PieChart
              widthAndHeight={widthAndHeight}
              series={series}
              cover={0.6}
            />
            
            <View style={styles.centerContent}>
              <Text style={styles.totalCardsText}>{totalCards}</Text>
              <Text style={styles.totalCardsLabel}>cards</Text>
            </View>
          </View>
        </View>

        <View style={styles.percentageGrid}>
          {chartData.map((item, index) => (
            <View key={index} style={styles.percentageItem}>
              <View style={[styles.colorDot, { backgroundColor: item.color }]} />
              <Text style={styles.percentageText}>{item.percentage}%</Text>
              <Text style={styles.percentageLabel}>{item.name}</Text>
            </View>
          ))}
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={[styles.statPercentage, { color: performanceMessage.color }]}>
              {goodPercent + easyPercent}%
            </Text>
            <Text style={styles.statLabel}>Confident</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statPercentage, { color: '#6b7280' }]}>
              {againPercent + hardPercent}%
            </Text>
            <Text style={styles.statLabel}>Need Practice</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <Pressable style={styles.studyAgainButton} onPress={handleStudyAgain}>
          <Text style={styles.studyAgainButtonText}>Study Again</Text>
        </Pressable>
        
        <Pressable style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>Done</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  deckName: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  messageContainer: {
    padding: 20,
    alignItems: 'center',
  },
  performanceMessage: {
    fontSize: 18,
    fontWeight: '600',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 32,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalCardsText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
  },
  totalCardsLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  percentageGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  percentageItem: {
    alignItems: 'center',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  percentageText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  percentageLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statPercentage: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    flexDirection: 'row',
    gap: 12,
  },
  studyAgainButton: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  studyAgainButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  doneButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StudyStatisticsScreen;