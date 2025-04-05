import { View, Text } from 'react-native';

type Props = {
  category: string;
  spent: number;
  limit: number;
};

export const ExpenseWidget = ({ category, spent, limit }: Props) => {
  const percentage = (spent / limit) * 100;
  let color = '#4caf50'; // green

  if (percentage > 90) color = '#f44336'; // red
  else if (percentage > 50) color = '#ff9800'; // orange

  return (
    <View
      style={{
        padding: 12,
        borderRadius: 10,
        backgroundColor: color,
        marginBottom: 12,
      }}
    >
      <Text style={{ fontWeight: 'bold', color: '#fff' }}>{category}</Text>
      <Text style={{ color: '#fff' }}>
        ₹{spent} / ₹{limit}
      </Text>
    </View>
  );
};
