import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StatusBar, 
  TextInput,
  Dimensions,
  Pressable,
  Animated
} from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { 
  PROFILE_PLACEHOLDER, 
  RECENT_LINES
} from '../../assets/mocks';
import { faBus } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../app/_layout'; // Importamos o hook useTheme

const { width } = Dimensions.get('window');
// Botões de serviços para o aplicativo de ônibus
const SERVICE_BUTTONS = [
  {
    id: 'schedule',
    name: 'Horários',
    description: 'Consulte horários de todas as linhas',
    icon: 'calendar',
    screen: 'LineDetails',
    accentColor: '#3b82f6' // azul
  },
  {
    id: 'livebus',
    name: 'Live Bus',
    description: 'Acompanhe ônibus em tempo real',
    icon: 'bus',
    screen: 'RideDetails',
    accentColor: '#3b82f6' // azul
  },
  {
    id: 'busstops',
    name: 'Pontos',
    description: 'Encontre pontos de ônibus próximos',
    icon: 'map-marker',
    screen: 'search',
    accentColor: '#3b82f6' // azul
  },
  {
    id: 'help',
    name: 'Ajuda',
    description: 'Suporte e informações',
    icon: 'question-circle',
    screen: 'profile',
    accentColor: '#3b82f6' // azul
  }
];

// Componente de botão de serviço animado 
const ServiceButton = ({ service, onPress, theme }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      friction: 5,
      tension: 300,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View 
      style={{
        transform: [{ scale: scaleAnim }],
        width: '48%',
        marginBottom: 12,
      }}
    >
      <TouchableOpacity
        style={{ 
          borderRadius: 16,
          overflow: 'hidden',
          backgroundColor: theme.card,
          borderWidth: 1,
          borderColor: theme.border,
          shadowColor: theme.isDarkMode ? '#000' : '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: theme.isDarkMode ? 0.2 : 0.05,
          shadowRadius: 3,
          elevation: 2
        }}
        activeOpacity={0.8}
        onPress={() => onPress(service.screen)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={{ 
          padding: 14,
          height: 100,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <View style={{ 
              width: 28, 
              height: 28, 
              alignItems: 'center', 
              justifyContent: 'center',
              marginRight: 8
            }}>
              <FontAwesome
                name={service.icon} 
                size={18} 
                color={theme.primary}
              />
            </View>
            <Text style={{ 
              color: theme.text,
              fontWeight: 'bold',
              fontSize: 15,
            }}>
              {service.name}
            </Text>
          </View>
          
          <Text style={{ 
            color: theme.textSecondary,
            fontSize: 12,
            marginBottom: 16
          }}>
            {service.description}
          </Text>
          
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const { theme, isDarkMode } = useTheme(); // Usamos o hook useTheme
  const [greeting, setGreeting] = useState('');
  const searchBarRef = useRef(null);

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Bom dia');
    else if (hours < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');
  }, []);

  const handleServicePress = (screen) => {
    router.push(screen);
  };

  const handleSearchFocus = () => {
    router.push('search');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />
      
      {/* Fundo estático azul */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 384, zIndex: 0, backgroundColor: theme.primary }}>
        {/* Sobreposição opcional */}
        <View style={{ position: 'absolute', inset: 0, backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,100,0.1)' }} />
      </View>
      
      {/* Cabeçalho com botões de perfil e notificações */}
      <View style={{ paddingTop: 45, paddingBottom: 16, paddingHorizontal: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: '500' }}>
              {greeting}
            </Text>
            <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
              Usuário
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            {/* Botão de notificações */}
            <TouchableOpacity 
              style={{ 
                width: 40, 
                height: 40, 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                borderRadius: 20, 
                marginRight: 12, 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
              onPress={() => router.push('notifications')}
            >
              <FontAwesome
                name="bell" 
                size={18} 
                color="white" 
              />
            </TouchableOpacity>
            
            {/* Botão de perfil */}
            <TouchableOpacity 
              style={{ 
                width: 40, 
                height: 40, 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                borderRadius: 20, 
                overflow: 'hidden' 
              }}
              onPress={() => router.push('profile')}
            >
              <Image 
                source={{ uri: PROFILE_PLACEHOLDER }} 
                style={{ width: 40, height: 40 }} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Cartão principal com sombra */}
      <View style={{ 
        marginHorizontal: 16, 
        backgroundColor: theme.card, 
        borderRadius: 24, 
        shadowColor: isDarkMode ? '#000' : '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDarkMode ? 0.3 : 0.1,
        shadowRadius: 8,
        elevation: 5,
        overflow: 'hidden'
      }}>
        {/* Área de busca */}
        <Pressable 
          onPress={handleSearchFocus} 
          style={{ 
            padding: 20, 
            borderBottomWidth: 1, 
            borderBottomColor: theme.border 
          }}
        >
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: '600', marginBottom: 16 }}>Para onde vamos?</Text>
          <View style={{ 
            backgroundColor: theme.backgroundAlt, 
            borderRadius: 12, 
            flexDirection: 'row', 
            alignItems: 'center', 
            paddingHorizontal: 16, 
            paddingVertical: 14,
            borderWidth: 1,
            borderColor: theme.isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
            borderTopRightRadius: 10,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            borderTopLeftRadius: 10,
          }}>
            <FontAwesome
              name="search" 
              size={20} 
              color={theme.textSecondary}
              style={{ marginRight: 12 }} 
            />
            <TextInput
              ref={searchBarRef}
              style={{ flex: 1, color: theme.text }}
              placeholder="Buscar linhas..."
              placeholderTextColor={theme.textSecondary}
              editable={false}
              pointerEvents="none"
            />
          </View>
        </Pressable>

        {/* Linhas frequentes */}
        <View style={{ padding: 20 }}>
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: '600', marginBottom: 12 }}>Linhas frequentes</Text>
          {RECENT_LINES.map((line, index) => (
            <Pressable
              key={line.prefix}
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                paddingVertical: 12, 
                borderBottomWidth: index < RECENT_LINES.length - 1 ? 1 : 0, 
                borderBottomColor: theme.border 
              }}
              onPress={() => router.push('search')}
            >
              <View style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 20, 
                backgroundColor: `${theme.primary}15`, 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginRight: 16 
              }}>
                <Text style={{ color: theme.primary, fontWeight: '600', fontSize: 18 }}>
                  {line.prefix}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontWeight: '500' }}>{line.lineName}</Text>
                <Text style={{ color: theme.textSecondary, fontSize: 14 }}>{line.company}</Text>
              </View>
              <FontAwesome
                name="chevron-right" 
                size={20} 
                color={theme.textSecondary}
              />
            </Pressable>
          ))}
        </View>
      </View>

      {/* Botões de serviços */}
      <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
        <Text style={{ color: theme.text, fontSize: 18, fontWeight: '600', marginBottom: 16, marginLeft: 8 }}>Serviços</Text>
        <View style={{ 
          flexDirection: 'row', 
          flexWrap: 'wrap',
          justifyContent: 'space-between'
        }}>
          {SERVICE_BUTTONS.map(service => (
            <ServiceButton 
              key={service.id} 
              service={service} 
              onPress={handleServicePress} 
              theme={theme}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
