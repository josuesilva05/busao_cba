import { Stack } from 'expo-router';
import '../../global.css';
import React, { useEffect, useState, createContext, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, View, Text, Platform, useColorScheme } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cores do tema para toda a aplicação
export const LIGHT_THEME = {
  primary: '#3b82f6',       // azul principal
  primaryDark: '#2563eb',   // azul escuro para hover/pressed
  primaryLight: '#93c5fd',  // azul claro para backgrounds sutis
  secondary: '#f59e0b',     // laranja para alertas e destaques
  success: '#10b981',       // verde para sucessos
  danger: '#ef4444',        // vermelho para erros
  background: '#f9fafb',    // background geral claro
  card: '#ffffff',          // cards e elementos acima do background
  text: '#1f2937',          // texto principal
  textSecondary: '#6b7280', // texto secundário
  border: '#e5e7eb',        // bordas sutis
};

export const DARK_THEME = {
  primary: '#60a5fa',       // azul principal (mais claro para modo escuro)
  primaryDark: '#3b82f6',   // azul escuro para hover/pressed
  primaryLight: '#1e40af',  // azul escuro para backgrounds sutis
  secondary: '#f59e0b',     // laranja para alertas e destaques
  success: '#10b981',       // verde para sucessos
  danger: '#ef4444',        // vermelho para erros
  background: '#111827',    // background escuro
  card: '#1f2937',          // cards e elementos acima do background
  text: '#f9fafb',          // texto principal
  textSecondary: '#d1d5db', // texto secundário
  border: '#374151',        // bordas sutis
};

// Cria o contexto de tema
export const ThemeContext = createContext({
  theme: LIGHT_THEME,
  isDarkMode: false,
  toggleTheme: () => {},
});

// Hook personalizado para usar o tema
export const useTheme = () => useContext(ThemeContext);

// Componente personalizado para o botão de voltar com animação
const CustomBackButton = ({ canGoBack, onPress, theme }) => {
  if (!canGoBack) return null;
  
  return (
    <Animatable.View
      animation="fadeIn"
      duration={300}
    >
      <TouchableOpacity 
        onPress={onPress} 
        className="w-10 h-10 rounded-full items-center justify-center ml-2"
        style={{ 
          overflow: 'hidden',
          backgroundColor: 'rgba(255,255,255,0.2)'
        }}
        activeOpacity={0.7}
      >
        <View className="flex items-center justify-center w-full h-full">
          <FontAwesome name="chevron-left" size={20} color="#fff" />
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
};

export default function RootLayout() {
  const deviceColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState(LIGHT_THEME);

  // Carregar preferência de tema do armazenamento local
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedThemePreference = await AsyncStorage.getItem('isDarkMode');
        if (savedThemePreference !== null) {
          const isDark = savedThemePreference === 'true';
          setIsDarkMode(isDark);
          setTheme(isDark ? DARK_THEME : LIGHT_THEME);
        } else {
          // Se não houver preferência salva, usar a preferência do dispositivo
          const shouldUseDarkMode = deviceColorScheme === 'dark';
          setIsDarkMode(shouldUseDarkMode);
          setTheme(shouldUseDarkMode ? DARK_THEME : LIGHT_THEME);
        }
      } catch (error) {
        console.error('Erro ao carregar preferência de tema:', error);
      }
    };

    loadThemePreference();
  }, [deviceColorScheme]);

  // Função para alternar entre temas
  const toggleTheme = async () => {
    try {
      const newIsDarkMode = !isDarkMode;
      setIsDarkMode(newIsDarkMode);
      setTheme(newIsDarkMode ? DARK_THEME : LIGHT_THEME);
      await AsyncStorage.setItem('isDarkMode', newIsDarkMode.toString());
    } catch (error) {
      console.error('Erro ao salvar preferência de tema:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Stack
        initialRouteName="index"
        screenOptions={({ route, navigation }) => ({
          // Configurações padrão para todas as telas
          headerStyle: {
            backgroundColor: theme.primary,
            elevation: 0,
            shadowColor: 'transparent',
          },
          headerTintColor: '#fff',
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          headerTitleAlign: 'center',
          // Botão de voltar personalizado
          headerLeft: (props) => (
            <CustomBackButton 
              canGoBack={navigation.canGoBack()} 
              onPress={navigation.goBack}
              theme={theme}
            />
          ),
          headerBackVisible: false,
          headerShown: false,
          headerShadowVisible: false,
          // Configurações de animação para transições
          animation: 'slide_from_right',
          presentation: 'card',
          // Configurações de estilo baseadas no tema
          contentStyle: { 
            backgroundColor: theme.background 
          },
          // Configurações adicionais específicas para iOS
          ...Platform.select({
            ios: {
              headerTransparent: false,
            },
          }),
        })}
      />
    </ThemeContext.Provider>
  );
}