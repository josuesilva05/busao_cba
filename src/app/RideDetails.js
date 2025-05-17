import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  Animated,
  Dimensions,
  Platform,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import { useTheme } from './_layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';

// Mock de dados para ônibus em tempo real
const MOCK_BUS_DATA = [
  { 
    id: 'bus1',
    number: '302',
    name: 'Parque Residencial',
    company: 'Integração Transportes',
    distance: '5.2',
    eta: '12',
    lastUpdate: '45s',
    passengers: 18,
    capacity: 45,
    isMoving: true,
    speed: '35 km/h',
    icon: 'bus'
  },
  { 
    id: 'bus2',
    number: '450',
    name: 'Centro',
    company: 'Integração Transportes',
    distance: '1.8',
    eta: '5',
    lastUpdate: '20s',
    passengers: 32,
    capacity: 45,
    isMoving: true,
    speed: '28 km/h',
    icon: 'bus'
  },
  { 
    id: 'bus3',
    number: '608',
    name: 'Morada do Ouro',
    company: 'Integração Transportes',
    distance: '3.4',
    eta: '9',
    lastUpdate: '1m',
    passengers: 10,
    capacity: 45,
    isMoving: false,
    speed: '0 km/h',
    icon: 'bus'
  },
  { 
    id: 'bus4',
    number: '215',
    name: 'Campo Velho',
    company: 'Nova Cuiabá',
    distance: '4.1',
    eta: '11',
    lastUpdate: '30s',
    passengers: 25,
    capacity: 45,
    isMoving: true,
    speed: '32 km/h',
    icon: 'bus'
  }
];

// Componente para o ponto de pulsação no mapa
const PulseAnimation = ({ theme }) => {
  const pulseAnim = useRef(new Animated.Value(0.5)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true
        })
      ])
    ).start();
  }, []);
  
  return (
    <View className="absolute">
      <Animated.View
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: `${theme.primary}30`,
          transform: [{ scale: pulseAnim }],
          position: 'absolute',
          top: -25,
          left: -25
        }}
      />
      <View
        style={{
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: theme.primary,
          position: 'absolute',
          top: -6,
          left: -6,
          borderWidth: 1,
          borderColor: 'white',
        }}
      />
    </View>
  );
};

export const options = {
  headerShown: false
};

export default function RideDetails() {
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const [busData, setBusData] = useState(MOCK_BUS_DATA);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMapType, setSelectedMapType] = useState('map'); // map ou satellite
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Animações
  const moveAnimation = useRef(new Animated.Value(0)).current;
  const mapScaleAnim = useRef(new Animated.Value(1)).current;
  
  // Simulação de atualização em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      simulateMovement();
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Animação para o indicador de movimento
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnimation, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true
        }),
        Animated.timing(moveAnimation, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true
        })
      ])
    ).start();
  }, []);
  
  // Simula o movimento dos ônibus
  const simulateMovement = () => {
    setIsRefreshing(true);
    
    setTimeout(() => {
      setIsRefreshing(false);
      
      setBusData(prevBuses => prevBuses.map(bus => {
        // Simula alterações aleatórias nos dados
        const distanceChange = Math.random() * 0.5;
        const newDistance = Math.max(0.1, parseFloat(bus.distance) - (bus.isMoving ? distanceChange : 0)).toFixed(1);
        const newEtaValue = Math.max(1, parseInt(bus.eta) - (bus.isMoving ? 1 : 0));
        const hasArrived = parseFloat(newDistance) < 0.3;
        const passengerChange = Math.floor(Math.random() * 5) - 2; // -2 a +2 passageiros
        const newPassengers = Math.max(0, Math.min(bus.capacity, bus.passengers + passengerChange));
        
        return {
          ...bus,
          distance: `${newDistance}`,
          eta: `${newEtaValue}`,
          lastUpdate: '10s',
          passengers: newPassengers,
          isMoving: !hasArrived && Math.random() > 0.1, // 10% de chance de parar
          speed: hasArrived || !bus.isMoving ? '0 km/h' : `${Math.floor(20 + Math.random() * 20)} km/h`
        };
      }));
    }, 1000);
  };
  
  // Classificar ônibus por ETA
  const sortedBusData = [...busData].sort((a, b) => parseInt(a.eta) - parseInt(b.eta));
  
  // Obter cor com base na ocupação
  const getOccupancyColor = (passengers, capacity) => {
    const percentage = (passengers / capacity) * 100;
    if (percentage < 40) return theme.success;
    if (percentage < 75) return theme.secondary;
    return theme.danger;
  };
  
  // Obtém o texto da ocupação
  const getOccupancyText = (passengers, capacity) => {
    const percentage = (passengers / capacity) * 100;
    if (percentage < 40) return "Vazio";
    if (percentage < 75) return "Moderado";
    if (percentage < 90) return "Cheio";
    return "Lotado";
  };
  
  // Formatar hora atual
  const getFormattedTime = () => {
    return currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Animação de zoom no mapa
  const zoomMap = () => {
    Animated.sequence([
      Animated.timing(mapScaleAnim, {
        toValue: 1.03,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(mapScaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
    
    simulateMovement();
  };
  
  return (
    <View 
      className="flex-1"
      style={{ 
        backgroundColor: theme.background,
        paddingTop: insets.top
      }}
    >
      {/* Header customizado */}
      <View className="px-4 pt-2 pb-0 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full mr-3"
            style={{ backgroundColor: theme.isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.8)' }}
          >
            <FontAwesome name="arrow-left" size={18} color={theme.text} />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold" style={{ color: theme.text }}>Live Bus</Text>
            <View className="flex-row items-center">
              <FontAwesome name="clock-o" size={12} color={theme.primary} className="mr-1" />
              <Text className="text-xs" style={{ color: theme.textSecondary }}>
                Atualizado às {getFormattedTime()}
              </Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          onPress={zoomMap}
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: theme.isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.8)' }}
        >
          <FontAwesome 
            name="refresh" 
            size={18} 
            color={isRefreshing ? theme.primary : theme.text} 
            style={{ 
              transform: [{ rotate: isRefreshing ? '45deg' : '0deg' }],
            }}
          />
        </TouchableOpacity>
      </View>
      
      {/* Mapa simulado */}
      <View className="h-56 relative mx-4 mt-2 rounded-2xl overflow-hidden">
        <Animated.View 
          style={{ 
            transform: [{ scale: mapScaleAnim }] 
          }}
        >
          <Image 
            source={{ 
              uri: selectedMapType === 'map' 
                ? 'https://maps.googleapis.com/maps/api/staticmap?center=-15.601411,-56.097892&zoom=14&size=600x300&maptype=roadmap&key=YOUR_API_KEY' 
                : 'https://maps.googleapis.com/maps/api/staticmap?center=-15.601411,-56.097892&zoom=14&size=600x300&maptype=satellite&key=YOUR_API_KEY'
            }}
            style={{
              width: '100%',
              height: 220,
              backgroundColor: theme.isDarkMode ? '#222' : '#e5e7eb',
            }}
            resizeMode="cover"
          />
        </Animated.View>
        
        {/* Indicador de localização atual com animação de pulso */}
        <View className="absolute top-1/2 left-1/2">
          <PulseAnimation theme={theme} />
        </View>
        
        {/* Controles do mapa */}
        <View className="absolute bottom-3 right-3 flex-row">
          <TouchableOpacity
            onPress={() => setSelectedMapType('map')}
            className="w-8 h-8 rounded-l-lg items-center justify-center"
            style={{ 
              backgroundColor: selectedMapType === 'map' ? theme.primary : theme.isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.8)'
            }}
          >
            <FontAwesome 
              name="map" 
              size={16} 
              color={selectedMapType === 'map' ? 'white' : theme.textSecondary} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedMapType('satellite')}
            className="w-8 h-8 rounded-r-lg items-center justify-center"
            style={{ 
              backgroundColor: selectedMapType === 'satellite' ? theme.primary : theme.isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.8)'
            }}
          >
            <FontAwesome 
              name="globe" 
              size={16} 
              color={selectedMapType === 'satellite' ? 'white' : theme.textSecondary} 
            />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Estatísticas rápidas */}
      <View className="mt-4 mx-4">
        <Animatable.View 
          animation="fadeInUp" 
          duration={600}
          className="rounded-2xl p-4 shadow-sm"
          style={{ 
            backgroundColor: theme.card,
            borderColor: theme.border, 
            borderWidth: 1 
          }}
        >
          <Text className="font-bold text-lg mb-3" style={{ color: theme.text }}>
            Ônibus próximos
          </Text>
          
          <View className="flex-row justify-between mb-3">
            <View className="items-center">
              <Text className="text-2xl font-bold" style={{ color: theme.primary }}>
                {sortedBusData.length}
              </Text>
              <Text className="text-xs" style={{ color: theme.textSecondary }}>
                Ônibus
              </Text>
            </View>
            
            <View className="items-center">
              <Text className="text-2xl font-bold" style={{ color: theme.primary }}>
                {Math.min(...sortedBusData.map(b => parseInt(b.eta)))}
              </Text>
              <Text className="text-xs" style={{ color: theme.textSecondary }}>
                min (próximo)
              </Text>
            </View>
            
            <View className="items-center">
              <Text className="text-2xl font-bold" style={{ color: theme.primary }}>
                {sortedBusData.filter(b => b.isMoving).length}
              </Text>
              <Text className="text-xs" style={{ color: theme.textSecondary }}>
                Em movimento
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            className="py-3 rounded-xl items-center"
            style={{ backgroundColor: theme.primary }}
            onPress={zoomMap}
            activeOpacity={0.8}
          >
            <Text className="font-medium text-white">Atualizar localização</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
      
      {/* Lista de ônibus */}
      <ScrollView 
        className="mt-4 px-4" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {sortedBusData.map((bus, index) => (
          <Animatable.View
            key={bus.id}
            animation="fadeInUp"
            delay={index * 100}
            duration={500}
            className="rounded-2xl mb-3 overflow-hidden shadow-sm"
            style={{ 
              backgroundColor: theme.card,
              borderColor: theme.border, 
              borderWidth: 1 
            }}
          >
            <View className="p-4 border-b" style={{ borderColor: theme.border }}>
              <View className="flex-row items-start justify-between">
                <View className="flex-row items-start">
                  <View 
                    className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                    style={{ backgroundColor: `${theme.primary}15` }}
                  >
                    <FontAwesome name="bus" size={22} color={theme.primary} />
                  </View>
                  
                  <View>
                    <View className="flex-row items-center">
                      <View 
                        className="px-2.5 py-0.5 rounded-full mr-2"
                        style={{ backgroundColor: theme.primaryLight }}
                      >
                        <Text 
                          className="font-bold text-xs"
                          style={{ color: theme.primary }}
                        >
                          {bus.number}
                        </Text>
                      </View>
                      <Text 
                        className="font-bold text-base"
                        style={{ color: theme.text }}
                      >
                        {bus.name}
                      </Text>
                    </View>
                    
                    <Text 
                      className="text-sm"
                      style={{ color: theme.textSecondary }}
                    >
                      {bus.company}
                    </Text>
                    
                    <View className="flex-row items-center mt-2">
                      {bus.isMoving ? (
                        <View className="flex-row items-center">
                          <Animated.View 
                            style={{ 
                              width: 6, 
                              height: 6, 
                              borderRadius: 3,
                              backgroundColor: theme.success,
                              opacity: moveAnimation,
                              marginRight: 4
                            }}
                          />
                          <Text className="text-xs" style={{ color: theme.success }}>
                            Em movimento • {bus.speed}
                          </Text>
                        </View>
                      ) : (
                        <View className="flex-row items-center">
                          <View 
                            style={{ 
                              width: 6, 
                              height: 6, 
                              borderRadius: 3,
                              backgroundColor: theme.textSecondary,
                              marginRight: 4
                            }}
                          />
                          <Text className="text-xs" style={{ color: theme.textSecondary }}>
                            Parado
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
                
                <View className="items-end">
                  <Text 
                    className="font-bold text-lg"
                    style={{ color: theme.primary }}
                  >
                    {bus.eta} min
                  </Text>
                  
                  <Text className="text-xs" style={{ color: theme.textSecondary }}>
                    {bus.distance} km
                  </Text>
                </View>
              </View>
            </View>
            
            {/* Detalhes adicionais */}
            <View className="p-4 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <FontAwesome name="refresh" size={14} color={theme.textSecondary} className="mr-2" />
                <Text className="text-sm" style={{ color: theme.textSecondary }}>
                  Atualizado {bus.lastUpdate} atrás
                </Text>
              </View>
              
              <View className="flex-row items-center">
                <FontAwesome name="users" size={14} color={theme.textSecondary} className="mr-2" />
                <Text className="text-sm" style={{ color: theme.textSecondary }}>
                  {bus.passengers}/{bus.capacity}
                </Text>
                <View 
                  className="ml-2 w-2 h-2 rounded-full"
                  style={{ backgroundColor: getOccupancyColor(bus.passengers, bus.capacity) }}
                />
              </View>
            </View>
            
            {/* Botão de ver detalhes */}
            <TouchableOpacity
              className="py-3 border-t items-center"
              style={{ borderColor: theme.border }}
              activeOpacity={0.7}
            >
              <Text style={{ color: theme.primary, fontWeight: '500' }}>
                Ver detalhes do ônibus
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </ScrollView>
    </View>
  );
}