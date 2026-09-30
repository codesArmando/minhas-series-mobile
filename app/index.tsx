import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';


export default function Home() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50 p-4">
            <Text className="text-lg font-bold text-gray-800">Configuração OK!</Text>
    </View>
  );
}