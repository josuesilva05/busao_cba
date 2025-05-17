import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  Switch,
  Image,
  Animated
} from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import { useTheme } from './_layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PROFILE_PLACEHOLDER } from '../../assets/mocks';

// Dados do perfil
const USER_INFO = {
  name: "Carlos Silva",
  email: "carlos.silva@example.com",
  phone: "(65) 99999-8888",
  cardId: "1234-5678-9101",
  cardBalance: 85.5,
  memberSince: "Jan 2024",
  favoriteLines: ["302", "450", "608"],
  tripHistoryCount: 127
};

// Componente de opção do menu de perfil
const ProfileMenuOption = ({ option, index, theme }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      friction: 5,
      tension: 300,
      useNativeDriver: true
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 400,
      useNativeDriver: true
    }).start();
  };
  
  return (
    <Animatable.View
      animation="fadeInUp"
      delay={index * 100}
      duration={500}
      className="mb-3"
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          className="flex-row p-4 rounded-xl shadow-sm"
          style={{ 
            backgroundColor: theme.card,
            borderColor: theme.border, 
            borderWidth: 1 
          }}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
        >
          <View 
            className="w-12 h-12 rounded-xl items-center justify-center mr-4"
            style={{ backgroundColor: `${option.color}15` }}
          >
            <FontAwesome name={option.icon} size={20} color={option.color} />
          </View>
          
          <View className="flex-1 justify-center">
            <Text className="font-bold text-base" style={{ color: theme.text }}>
              {option.title}
            </Text>
            {option.description && (
              <Text className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                {option.description}
              </Text>
            )}
          </View>
          
          <View className="justify-center">
            <FontAwesome name="chevron-right" size={16} color={theme.border} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Animatable.View>
  );
};

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isLocationEnabled, setIsLocationEnabled] = useState(true);
  
  // Opções do perfil com cores baseadas no tema
  const PROFILE_OPTIONS = [
    {
      id: 'favorites',
      title: 'Linhas Favoritas',
      description: 'Gerencie suas linhas favoritas',
      icon: 'star',
      color: theme.secondary,
    },
    {
      id: 'history',
      title: 'Histórico de Viagens',
      description: 'Veja suas viagens recentes',
      icon: 'history',
      color: theme.primary,
    },
    {
      id: 'cards',
      title: 'Meus Cartões',
      description: 'Gerencie seus cartões de transporte',
      icon: 'credit-card',
      color: theme.success,
    },
    {
      id: 'settings',
      title: 'Configurações',
      description: 'Ajuste as configurações do app',
      icon: 'cog',
      color: theme.textSecondary,
    }
  ];

  // Opções de ajuda
  const HELP_OPTIONS = [
    {
      id: 'faq',
      title: 'Perguntas Frequentes',
      description: 'Dúvidas comuns sobre o aplicativo',
      icon: 'question-circle',
      color: theme.primary,
    },
    {
      id: 'contact',
      title: 'Fale Conosco',
      description: 'Entre em contato com o suporte',
      icon: 'envelope',
      color: theme.primary,
    },
    {
      id: 'about',
      title: 'Sobre o App',
      description: 'Informações sobre o aplicativo',
      icon: 'info-circle',
      color: theme.primary,
    }
  ];
  
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Lidar com scroll para mostrar/esconder header flutuante
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );
  
  // Acompanhar o scroll para animar o header
  React.useEffect(() => {
    const listenerId = scrollY.addListener(({ value }) => {
      if (value > 100) {
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        }).start();
      } else {
        Animated.timing(headerOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        }).start();
      }
    });
    
    return () => scrollY.removeListener(listenerId);
  }, []);
  
  // Efeito para troca de tema com animação
  const handleToggleTheme = () => {
    // Chamamos a função toggleTheme do ThemeContext
    toggleTheme();
  };
  
  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      {/* Header flutuante animado */}
      <Animated.View 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: theme.card,
          zIndex: 10,
          opacity: headerOpacity,
          transform: [{
            translateY: headerOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: [-50, 0]
            })
          }],
          paddingTop: insets.top,
          paddingBottom: 10,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
          shadowColor: isDarkMode ? '#000' : '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDarkMode ? 0.3 : 0.1,
          shadowRadius: 3,
          elevation: 5,
        }}
      >
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full mr-3"
            style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
          >
            <FontAwesome name="arrow-left" size={18} color={theme.text} />
          </TouchableOpacity>
          <Text className="font-bold text-lg" style={{ color: theme.text }}>
            Perfil
          </Text>
        </View>
        
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center rounded-full"
          style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
        >
          <FontAwesome name="ellipsis-v" size={18} color={theme.text} />
        </TouchableOpacity>
      </Animated.View>
      
      {/* Conteúdo principal */}
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Cabeçalho de perfil */}
        <View 
          className="pt-16 pb-20 px-4"
          style={{ backgroundColor: theme.primary }}
        >
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center rounded-full mr-auto"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <FontAwesome name="arrow-left" size={18} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <FontAwesome name="cog" size={18} color="white" />
            </TouchableOpacity>
          </View>
          
          <View className="items-center">
            <View className="mb-4 relative">
              <Image 
                source={{ uri: PROFILE_PLACEHOLDER }}
                className="w-24 h-24 rounded-full border-4"
                style={{ borderColor: 'white' }}
              />
              <TouchableOpacity
                className="absolute right-0 bottom-0 w-8 h-8 rounded-full bg-white items-center justify-center"
                style={{ 
                  borderWidth: 2, 
                  borderColor: theme.primary,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2,
                }}
              >
                <FontAwesome name="camera" size={14} color={theme.primary} />
              </TouchableOpacity>
            </View>
            
            <Text className="text-white font-bold text-2xl">
              {USER_INFO.name}
            </Text>
            <Text className="text-white opacity-80 mt-1">
              {USER_INFO.email}
            </Text>
            
            <View className="flex-row mt-5 bg-white/20 rounded-xl p-2">
              <View className="flex-1 items-center p-2 border-r border-white/20">
                <Text className="text-white font-bold text-xl">
                  {USER_INFO.favoriteLines.length}
                </Text>
                <Text className="text-white text-xs opacity-80">
                  Favoritas
                </Text>
              </View>
              
              <View className="flex-1 items-center p-2">
                <Text className="text-white font-bold text-xl">
                  {USER_INFO.tripHistoryCount}
                </Text>
                <Text className="text-white text-xs opacity-80">
                  Viagens
                </Text>
              </View>
              
              <View className="flex-1 items-center p-2 border-l border-white/20">
                <Text className="text-white font-bold text-xl">
                  R$ {USER_INFO.cardBalance.toFixed(2)}
                </Text>
                <Text className="text-white text-xs opacity-80">
                  Saldo
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Conteúdo dos cards */}
        <View className="px-4 -mt-10">
          {/* Seção de opções principais */}
          <Animatable.View
            animation="fadeInUp"
            duration={400}
            className="mb-5"
          >
            <Text className="font-bold text-lg mb-3 px-1" style={{ color: theme.text }}>
              Suas Opções
            </Text>
            
            {PROFILE_OPTIONS.map((option, index) => (
              <ProfileMenuOption 
                key={option.id} 
                option={option} 
                index={index}
                theme={theme}
              />
            ))}
          </Animatable.View>
          
          {/* Seção de configurações */}
          <Animatable.View
            animation="fadeInUp"
            duration={400}
            delay={200}
            className="mb-5"
          >
            <Text className="font-bold text-lg mb-3 px-1" style={{ color: theme.text }}>
              Configurações
            </Text>
            
            <View 
              className="rounded-xl p-4 mb-4 shadow-sm"
              style={{ 
                backgroundColor: theme.card,
                borderColor: theme.border, 
                borderWidth: 1 
              }}
            >
              {/* Notificações */}
              <View className="flex-row items-center justify-between py-3 border-b" style={{ borderColor: theme.border }}>
                <View className="flex-row items-center">
                  <View className="w-8 h-8 rounded-full items-center justify-center mr-3" style={{ backgroundColor: `${theme.primary}15` }}>
                    <FontAwesome name="bell" size={16} color={theme.primary} />
                  </View>
                  <View>
                    <Text className="font-medium" style={{ color: theme.text }}>Notificações</Text>
                    <Text className="text-xs" style={{ color: theme.textSecondary }}>
                      {isNotificationsEnabled ? 'Ativadas' : 'Desativadas'}
                    </Text>
                  </View>
                </View>
                <Switch
                  trackColor={{ false: '#e5e7eb', true: `${theme.primary}50` }}
                  thumbColor={isNotificationsEnabled ? theme.primary : '#9ca3af'}
                  onValueChange={() => setIsNotificationsEnabled(prev => !prev)}
                  value={isNotificationsEnabled}
                />
              </View>
              
              {/* Localização */}
              <View className="flex-row items-center justify-between py-3 border-b" style={{ borderColor: theme.border }}>
                <View className="flex-row items-center">
                  <View className="w-8 h-8 rounded-full items-center justify-center mr-3" style={{ backgroundColor: `${theme.primary}15` }}>
                    <FontAwesome name="map-marker" size={16} color={theme.primary} />
                  </View>
                  <View>
                    <Text className="font-medium" style={{ color: theme.text }}>Localização</Text>
                    <Text className="text-xs" style={{ color: theme.textSecondary }}>
                      {isLocationEnabled ? 'Ativada' : 'Desativada'}
                    </Text>
                  </View>
                </View>
                <Switch
                  trackColor={{ false: '#e5e7eb', true: `${theme.primary}50` }}
                  thumbColor={isLocationEnabled ? theme.primary : '#9ca3af'}
                  onValueChange={() => setIsLocationEnabled(prev => !prev)}
                  value={isLocationEnabled}
                />
              </View>
              
              {/* Modo escuro - Agora realmente funciona */}
              <View className="flex-row items-center justify-between py-3">
                <View className="flex-row items-center">
                  <View className="w-8 h-8 rounded-full items-center justify-center mr-3" style={{ backgroundColor: `${theme.text}15` }}>
                    <FontAwesome name={isDarkMode ? "moon-o" : "sun-o"} size={16} color={theme.text} />
                  </View>
                  <View>
                    <Text className="font-medium" style={{ color: theme.text }}>Modo Escuro</Text>
                    <Text className="text-xs" style={{ color: theme.textSecondary }}>
                      {isDarkMode ? 'Ativado' : 'Desativado'}
                    </Text>
                  </View>
                </View>
                <Switch
                  trackColor={{ false: '#e5e7eb', true: `${theme.primary}50` }}
                  thumbColor={isDarkMode ? theme.primary : '#9ca3af'}
                  onValueChange={handleToggleTheme}
                  value={isDarkMode}
                />
              </View>
            </View>
          </Animatable.View>
          
          {/* Seção de ajuda */}
          <Animatable.View
            animation="fadeInUp"
            duration={400}
            delay={400}
            className="mb-5"
          >
            <Text className="font-bold text-lg mb-3 px-1" style={{ color: theme.text }}>
              Ajuda e Suporte
            </Text>
            
            {HELP_OPTIONS.map((option, index) => (
              <ProfileMenuOption 
                key={option.id} 
                option={option} 
                index={index}
                theme={theme}
              />
            ))}
          </Animatable.View>
          
          {/* Botão de sair */}
          <Animatable.View
            animation="fadeInUp"
            duration={400}
            delay={600}
          >
            <TouchableOpacity
              className="flex-row items-center justify-center p-4 rounded-xl shadow-sm"
              style={{ 
                backgroundColor: theme.card,
                borderColor: theme.border, 
                borderWidth: 1 
              }}
              activeOpacity={0.8}
            >
              <FontAwesome name="sign-out" size={18} color={theme.danger} style={{ marginRight: 8 }} />
              <Text style={{ color: theme.danger, fontWeight: '500' }}>Sair da conta</Text>
            </TouchableOpacity>
            
            <Text className="text-center mt-6 text-xs" style={{ color: theme.textSecondary }}>
              Versão 1.0.0 • Busão CBA
            </Text>
          </Animatable.View>
        </View>
      </ScrollView>
    </View>
  );
}