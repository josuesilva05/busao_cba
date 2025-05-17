import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  Animated,
  Image,
  FlatList
} from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import { useTheme } from './_layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HORARIOS_LINE } from '../../assets/mocks';

// Dados adicionais de exemplo para as rotas
const ROUTE_STOPS = [
  { id: 'stop1', name: 'Terminal Central', time: '00:00', isMajor: true },
  { id: 'stop2', name: 'Praça Alencastro', time: '03:00', isMajor: false },
  { id: 'stop3', name: 'Shopping Goiabeiras', time: '07:00', isMajor: true },
  { id: 'stop4', name: 'UFMT', time: '11:00', isMajor: true },
  { id: 'stop5', name: 'Bairro Boa Esperança', time: '16:00', isMajor: false },
  { id: 'stop6', name: 'Av. Miguel Sutil', time: '19:00', isMajor: false },
  { id: 'stop7', name: 'Terminal Parque Residencial', time: '25:00', isMajor: true }
];

export const options = {
  headerShown: false
};

const RouteStops = ({ stops, theme }) => {
  return (
    <View className="mt-3">
      {stops.map((stop, index) => {
        const isLast = index === stops.length - 1;
        return (
          <Animatable.View 
            key={stop.id}
            animation="fadeIn"
            delay={index * 50}
            duration={400}
          >
            <View className="flex-row items-start mb-3">
              {/* Linha de conexão vertical */}
              <View className="items-center mr-4 mt-1.5">
                <View 
                  className={`w-3 h-3 rounded-full ${stop.isMajor ? 'p-0.5' : ''}`}
                  style={{ 
                    backgroundColor: stop.isMajor ? theme.card : theme.border,
                    borderWidth: stop.isMajor ? 1.5 : 0,
                    borderColor: theme.primary,
                  }}
                />
                {!isLast && (
                  <View 
                    className="w-0.5 h-14 mt-1"
                    style={{ backgroundColor: theme.border }}
                  />
                )}
              </View>
              
              {/* Informações da parada */}
              <View className="flex-1">
                <Text 
                  className={`font-${stop.isMajor ? 'bold' : 'medium'} text-base`}
                  style={{ color: theme.text }}
                >
                  {stop.name}
                </Text>
                <Text 
                  className="text-xs mt-1"
                  style={{ color: theme.textSecondary }}
                >
                  {stop.isMajor ? 'Parada principal' : 'Parada comum'}
                </Text>
                {stop.time && (
                  <View 
                    className="mt-1 px-2 py-1 rounded-md self-start flex-row items-center"
                    style={{ backgroundColor: `${theme.primary}10` }}
                  >
                    <FontAwesome 
                      name="clock-o" 
                      size={10} 
                      color={theme.primary} 
                      style={{ marginRight: 4 }}
                    />
                    <Text className="text-xs" style={{ color: theme.primary }}>
                      ~{stop.time} min
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </Animatable.View>
        );
      })}
    </View>
  );
};

export default function LineDetails() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedDirection, setSelectedDirection] = useState('ida');
  const [selectedLine, setSelectedLine] = useState(HORARIOS_LINE[0]);
  const [showAllStops, setShowAllStops] = useState(false);
  const [favoriteLine, setFavoriteLine] = useState(false);
  
  // Animações
  const scrollY = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  
  // Animação quando mudar de tab ou direção
  useEffect(() => {
    Animated.sequence([
      Animated.timing(animatedOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeTab, selectedDirection, selectedLine]);

  const changeRoute = (line) => {
    setSelectedLine(line);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      setSelectedLine(line);
      slideAnim.setValue(0);
    });
  };
  
  // Obter cor com base no status
  const getScheduleStatusInfo = (status) => {
    switch (status) {
      case 'delayed':
        return { color: theme.danger, text: 'Atrasado' };
      case 'early':
        return { color: theme.secondary, text: 'Adiantado' };
      default:
        return { color: theme.success, text: 'No horário' };
    }
  };
  
  const renderHorarios = () => {
    const horarios = selectedDirection === 'ida' ? selectedLine.horariosIda : selectedLine.horariosVolta;
    
    return (
      <Animated.View style={{ opacity: animatedOpacity }}>
        <FlatList
          data={horarios}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
          renderItem={({ item, index }) => {
            const statusInfo = getScheduleStatusInfo(item.status);
            return (
              <Animatable.View
                animation="fadeInUp"
                delay={index * 50}
                duration={300}
                className="mb-3"
              >
                <View 
                  className="flex-row items-center justify-between p-4 rounded-xl shadow-sm"
                  style={{ 
                    backgroundColor: theme.card,
                    borderColor: theme.border, 
                    borderWidth: 1
                  }}
                >
                  <View className="flex-row items-center">
                    <View 
                      className="w-12 h-12 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: `${theme.primary}15` }}
                    >
                      <FontAwesome name="clock-o" size={20} color={theme.primary} />
                    </View>
                    <View>
                      <Text className="font-bold text-lg" style={{ color: theme.text }}>
                        {item.hora}
                      </Text>
                      <View className="flex-row items-center">
                        <View 
                          className="w-2 h-2 rounded-full mr-1.5"
                          style={{ backgroundColor: statusInfo.color }} 
                        />
                        <Text className="text-xs" style={{ color: statusInfo.color }}>
                          {statusInfo.text}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View 
                    className="px-3 py-1.5 rounded-lg"
                    style={{ backgroundColor: `${theme.primary}15` }}
                  >
                    <Text className="font-medium" style={{ color: theme.primary }}>
                      {selectedLine.nomeLinha.split(' ')[0]}
                    </Text>
                  </View>
                </View>
              </Animatable.View>
            );
          }}
        />
      </Animated.View>
    );
  };
  
  const renderRouteMap = () => {
    const visibleStops = showAllStops ? ROUTE_STOPS : ROUTE_STOPS.slice(0, 4);
    const mapBackgroundColor = isDarkMode ? 'night' : 'roadmap';
    
    return (
      <Animated.View style={{ opacity: animatedOpacity }}>
        <View 
          className="rounded-xl p-4 mb-4 shadow-sm"
          style={{ 
            backgroundColor: theme.card,
            borderColor: theme.border,
            borderWidth: 1
          }}
        >
          <Image
            source={{ uri: `https://maps.googleapis.com/maps/api/staticmap?center=-15.601411,-56.097892&zoom=12&size=600x300&maptype=${mapBackgroundColor}&path=color:0x3b82f6CC|weight:5|-15.605,-56.097|-15.603,-56.090|-15.601,-56.082|-15.597,-56.075|-15.593,-56.070&key=YOUR_API_KEY` }}
            style={{ width: '100%', height: 150, borderRadius: 8 }}
            resizeMode="cover"
          />
          
          <Text className="font-bold text-lg mt-3 mb-2" style={{ color: theme.text }}>
            Trajeto da linha
          </Text>
          
          <RouteStops stops={visibleStops} theme={theme} />
          
          {ROUTE_STOPS.length > 4 && (
            <TouchableOpacity
              className="mt-2 py-2 items-center"
              onPress={() => setShowAllStops(!showAllStops)}
            >
              <Text style={{ color: theme.primary, fontWeight: '500' }}>
                {showAllStops ? 'Mostrar menos paradas' : 'Ver todas as paradas'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    );
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
      <View className="flex-row justify-between items-center px-4 pt-2 pb-4">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full mr-3"
            style={{ backgroundColor: theme.card }}
          >
            <FontAwesome name="arrow-left" size={18} color={theme.text} />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold" style={{ color: theme.text }}>
              Horários e Rotas
            </Text>
            <Text className="text-sm" style={{ color: theme.textSecondary }}>
              {selectedLine.nomeLinha}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          onPress={() => setFavoriteLine(!favoriteLine)}
          className="w-10 h-10 items-center justify-center rounded-full"
          style={{ backgroundColor: theme.card }}
        >
          <FontAwesome 
            name={favoriteLine ? "star" : "star-o"} 
            size={18} 
            color={favoriteLine ? theme.secondary : theme.text} 
          />
        </TouchableOpacity>
      </View>
      
      {/* Seletor de linhas */}
      <View className="px-4 pb-4">
        <Text className="text-sm font-medium mb-2" style={{ color: theme.textSecondary }}>
          Selecione a linha:
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {HORARIOS_LINE.map((line, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => changeRoute(line)}
              className="mr-3 px-4 py-2 rounded-xl"
              style={{ 
                backgroundColor: selectedLine.nomeLinha === line.nomeLinha ? theme.primary : theme.card,
                borderColor: theme.border,
                borderWidth: 1,
              }}
            >
              <Text 
                className="font-medium"
                style={{ 
                  color: selectedLine.nomeLinha === line.nomeLinha ? 'white' : theme.text
                }}
              >
                {line.nomeLinha.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* Tabs de navegação */}
      <View className="px-4 mb-3">
        <View 
          className="flex-row rounded-xl overflow-hidden shadow-sm"
          style={{ 
            backgroundColor: theme.card,
            borderColor: theme.border, 
            borderWidth: 1
          }}
        >
          <TouchableOpacity
            className="flex-1 py-3.5 px-4"
            style={{ 
              backgroundColor: activeTab === 'schedule' ? theme.primary : 'transparent',
            }}
            onPress={() => setActiveTab('schedule')}
          >
            <Text 
              className="text-center font-medium"
              style={{ color: activeTab === 'schedule' ? 'white' : theme.text }}
            >
              Horários
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="flex-1 py-3.5 px-4"
            style={{ 
              backgroundColor: activeTab === 'route' ? theme.primary : 'transparent', 
            }}
            onPress={() => setActiveTab('route')}
          >
            <Text 
              className="text-center font-medium"
              style={{ color: activeTab === 'route' ? 'white' : theme.text }}
            >
              Trajeto
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Conteúdo principal */}
      <ScrollView 
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {activeTab === 'schedule' && (
          <>
            {/* Tabs ida/volta para horários */}
            <View 
              className="rounded-xl overflow-hidden mb-4 shadow-sm"
              style={{ 
                backgroundColor: theme.card,
                borderColor: theme.border, 
                borderWidth: 1
              }}
            >
              <View className="flex-row">
                <TouchableOpacity
                  className="flex-1 py-3 px-2"
                  style={{ 
                    borderBottomWidth: 2,
                    borderBottomColor: selectedDirection === 'ida' ? theme.primary : 'transparent'
                  }}
                  onPress={() => setSelectedDirection('ida')}
                >
                  <Text 
                    className="text-center font-medium"
                    style={{ 
                      color: selectedDirection === 'ida' ? theme.primary : theme.textSecondary
                    }}
                  >
                    Horários de Ida
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  className="flex-1 py-3 px-2"
                  style={{ 
                    borderBottomWidth: 2,
                    borderBottomColor: selectedDirection === 'volta' ? theme.primary : 'transparent'
                  }}
                  onPress={() => setSelectedDirection('volta')}
                >
                  <Text 
                    className="text-center font-medium"
                    style={{ 
                      color: selectedDirection === 'volta' ? theme.primary : theme.textSecondary
                    }}
                  >
                    Horários de Volta
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Descrição dos horários */}
            <View className="mb-4">
              <Text className="text-base font-medium" style={{ color: theme.text }}>
                {selectedDirection === 'ida' ? 'Saídas do Terminal:' : 'Retorno ao Terminal:'}
              </Text>
              <Text className="text-sm mb-3" style={{ color: theme.textSecondary }}>
                {selectedDirection === 'ida' 
                  ? 'Horários de partida do Terminal Central' 
                  : 'Horários de retorno do Terminal Parque Residencial'}
              </Text>
            </View>
            
            {/* Lista de horários */}
            {renderHorarios()}
          </>
        )}
        
        {activeTab === 'route' && renderRouteMap()}
      </ScrollView>
    </View>
  );
}