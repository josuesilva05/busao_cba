import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  FlatList,
  Image,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import { useTheme } from './_layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NOTIFICATIONS } from '../../assets/mocks';

// Mapeamento de ícones por tipo de notificação (será atualizado com o tema)
const getNotificationIcons = (theme) => ({
  alert: { 
    icon: 'exclamation-triangle',
    color: theme.secondary,
    background: `${theme.secondary}15`
  },
  arrival: { 
    icon: 'bus',
    color: theme.primary,
    background: `${theme.primary}15`
  },
  recharge: { 
    icon: 'credit-card',
    color: theme.success,
    background: `${theme.success}15`
  },
  info: { 
    icon: 'info-circle',
    color: theme.primary,
    background: `${theme.primary}15`
  },
  default: { 
    icon: 'bell',
    color: theme.textSecondary,
    background: `${theme.textSecondary}15`
  }
});

export const options = {
  headerShown: false
};

export default function Notifications() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, isDarkMode } = useTheme();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [allRead, setAllRead] = useState(false);
  const [animationActive, setAnimationActive] = useState(false);
  
  // Create a ref for each notification item
  const scaleAnimRefs = useRef(
    NOTIFICATIONS.reduce((acc, notification) => {
      acc[notification.id] = new Animated.Value(1);
      return acc;
    }, {})
  ).current;

  // Verifica se todas notificações estão lidas
  useEffect(() => {
    const areAllRead = notifications.every(n => n.read);
    setAllRead(areAllRead);
  }, [notifications]);

  // Marcar notificação como lida
  const markAsRead = (id) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  // Marcar todas como lidas
  const markAllAsRead = () => {
    setAnimationActive(true);
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
    
    // Desativar animação após um tempo
    setTimeout(() => {
      setAnimationActive(false);
    }, 1000);
  };

  // Remover notificação
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Obter configuração de ícone com base no tipo
  const getNotificationConfig = (type) => {
    const notificationIcons = getNotificationIcons(theme);
    return notificationIcons[type] || notificationIcons.default;
  };
  
  // Animar quando pressionar a notificação
  const animateNotification = (id, callback) => {
    Animated.sequence([
      Animated.timing(scaleAnimRefs[id], {
        toValue: 0.97,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnimRefs[id], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start(callback);
  };

  // Renderizador de notificação individual
  const renderNotification = ({ item, index }) => {
    const iconConfig = getNotificationConfig(item.type);
    
    const handlePress = () => {
      animateNotification(item.id, () => markAsRead(item.id));
    };
    
    return (
      <Animatable.View 
        animation="fadeInUp"
        duration={400}
        delay={index * 80}
        className="mb-3"
      >
        <Animated.View 
          style={{ 
            transform: [{ scale: scaleAnimRefs[item.id] }],
            opacity: item.read ? 0.9 : 1,
          }}
        >
          <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.8}
            className="rounded-xl shadow-sm overflow-hidden"
            style={{ 
              backgroundColor: theme.card,
              borderColor: item.read ? theme.border : theme.primary,
              borderWidth: 1,
              borderLeftWidth: 5,
            }}
          >
            <View className="p-4">
              <View className="flex-row items-start">
                <View 
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: iconConfig.background }}
                >
                  <FontAwesome 
                    name={iconConfig.icon} 
                    size={16} 
                    color={iconConfig.color} 
                  />
                </View>
                
                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-bold" style={{ color: theme.text }}>
                      {item.title}
                    </Text>
                    
                    <Text className="text-xs" style={{ color: theme.textSecondary }}>
                      {item.time}
                    </Text>
                  </View>
                  
                  <Text 
                    className="mt-1 text-sm"
                    style={{ color: theme.textSecondary }}
                    numberOfLines={2}
                  >
                    {item.message}
                  </Text>
                  
                  <View className="flex-row justify-between mt-3">
                    {!item.read && (
                      <View 
                        className="px-2 py-1 rounded-full"
                        style={{ backgroundColor: `${theme.primary}15` }}
                      >
                        <Text className="text-xs" style={{ color: theme.primary }}>
                          Não lida
                        </Text>
                      </View>
                    )}
                    
                    <TouchableOpacity 
                      onPress={() => removeNotification(item.id)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={{ marginLeft: 'auto' }}
                    >
                      <Text className="text-xs" style={{ color: theme.textSecondary }}>
                        Remover
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </Animatable.View>
    );
  };
  
  // Renderiza estado vazio
  const renderEmptyState = () => (
    <Animatable.View 
      animation="fadeIn" 
      duration={500}
      className="items-center justify-center p-10"
    >
      <FontAwesome 
        name="bell-slash" 
        size={60} 
        color={theme.border} 
      />
      <Text 
        className="text-lg font-medium mt-4 text-center"
        style={{ color: theme.textSecondary }}
      >
        Sem notificações
      </Text>
      <Text 
        className="text-sm text-center mt-2"
        style={{ color: theme.textSecondary }}
      >
        Você não tem novas notificações no momento.
      </Text>
      <TouchableOpacity
        className="mt-6 py-3 px-6 rounded-xl"
        style={{ backgroundColor: theme.primary }}
        onPress={() => router.back()}
      >
        <Text className="text-white font-medium">Voltar para o início</Text>
      </TouchableOpacity>
    </Animatable.View>
  );
  
  return (
    <View 
      className="flex-1"
      style={{ 
        backgroundColor: theme.background,
        paddingTop: insets.top
      }}
    >
      {/* Header customizado */}
      <View className="px-4 pt-2 pb-4 flex-row justify-between items-center">
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
              Notificações
            </Text>
            <Text className="text-xs" style={{ color: theme.textSecondary }}>
              {notifications.length > 0 
                ? `${notifications.filter(n => !n.read).length} não lidas de ${notifications.length} notificações`
                : 'Nenhuma notificação'
              }
            </Text>
          </View>
        </View>
        
        {notifications.length > 0 && !allRead && (
          <TouchableOpacity
            onPress={markAllAsRead}
            className="px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: theme.card }}
          >
            <Text style={{ color: theme.primary, fontWeight: '500' }}>
              Marcar todas como lidas
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Lista de notificações */}
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={item => item.id}
        contentContainerStyle={{ 
          paddingHorizontal: 16, 
          paddingTop: 10, 
          paddingBottom: 40,
          flexGrow: notifications.length === 0 ? 1 : undefined
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
      
      {/* Loading de "marcar todas como lidas" */}
      {animationActive && (
        <View 
          className="absolute inset-0 items-center justify-center"
          style={{ backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.8)' }}
        >
          <Animatable.View 
            animation="pulse" 
            iterationCount="infinite"
            duration={1000}
          >
            <FontAwesome 
              name="check-circle" 
              size={60} 
              color={theme.success} 
            />
          </Animatable.View>
          <Text 
            className="mt-4 font-medium"
            style={{ color: theme.text }}
          >
            Todas as notificações foram lidas
          </Text>
        </View>
      )}
    </View>
  );
}
