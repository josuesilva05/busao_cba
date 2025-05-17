export const screenOptions = { title: 'Buscar' };

import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  StatusBar,
  Animated,
  Easing,
  Image,
  Keyboard
} from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import { useTheme } from './_layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

// Dados mockados para a busca
const MOCK_BUS_LINES = [
  { id: '1', number: '302', name: 'Parque Residencial', company: 'Integração Transportes', distance: '4.8 km', arrival: '11 min', icon: 'bus' },
  { id: '2', number: '450', name: 'Centro', company: 'Integração Transportes', distance: '1.2 km', arrival: '4 min', icon: 'bus' },
  { id: '3', number: '410', name: 'Grande Terceiro', company: 'Integração Transportes', distance: '3.5 km', arrival: '9 min', icon: 'bus' },
  { id: '4', number: '608', name: 'Morada do Ouro', company: 'Integração Transportes', distance: '6.1 km', arrival: '15 min', icon: 'bus' },
  { id: '5', number: '215', name: 'Campo Velho', company: 'Integração Transportes', distance: '2.3 km', arrival: '7 min', icon: 'bus' },
];

const MOCK_BUS_STOPS = [
  { id: '1', name: 'Terminal Central', address: 'Av. Getúlio Vargas, 2321', distance: '1.3 km', lines: ['302', '450', '608'], icon: 'map-marker' },
  { id: '2', name: 'Praça Alencastro', address: 'Av. Mato Grosso, 1050', distance: '0.8 km', lines: ['302', '410'], icon: 'map-marker' },
  { id: '3', name: 'Shopping Goiabeiras', address: 'Av. Historiador Rubens de Mendonça, 2033', distance: '3.1 km', lines: ['215', '608'], icon: 'map-marker' },
  { id: '4', name: 'UFMT', address: 'Av. Fernando Corrêa da Costa, 2367', distance: '5.6 km', lines: ['302', '450', '215'], icon: 'map-marker' },
  { id: '5', name: 'Parque Mãe Bonifácia', address: 'Av. Miguel Sutil, s/n', distance: '4.2 km', lines: ['410', '608'], icon: 'map-marker' },
];

export const options = {
  headerShown: false
};

export default function Search() {
  const navigation = useNavigation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('lines');
  const [recentSearches, setRecentSearches] = useState(['Terminal Central', 'UFMT', 'Linha 302']);
  const [activeAnimation, setActiveAnimation] = useState(false);

  // Refs e animações
  const searchInputRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateAnim = useRef(new Animated.Value(0)).current;
  
  // Dado filtrado com base na busca
  const filteredData = React.useMemo(() => {
    const data = searchType === 'lines' ? MOCK_BUS_LINES : MOCK_BUS_STOPS;
    
    if (!searchQuery) return data;
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    return data.filter(item => {
      if (searchType === 'lines') {
        return (
          item.number.toLowerCase().includes(lowerCaseQuery) ||
          item.name.toLowerCase().includes(lowerCaseQuery)
        );
      } else {
        return (
          item.name.toLowerCase().includes(lowerCaseQuery) ||
          item.address.toLowerCase().includes(lowerCaseQuery)
        );
      }
    });
  }, [searchQuery, searchType]);

  // Funções de busca
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.length > 0 && !activeAnimation) {
      animateSearch(true);
    } else if (text.length === 0 && activeAnimation) {
      animateSearch(false);
    }
  };

  const animateSearch = (active) => {
    setActiveAnimation(active);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: active ? 0 : 1,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(translateAnim, {
        toValue: active ? -20 : 0,
        duration: 200,
        useNativeDriver: true
      })
    ]).start();
  };

  const clearSearch = () => {
    setSearchQuery('');
    animateSearch(false);
    Keyboard.dismiss();
  };

  const addToRecentSearches = (term) => {
    if (!recentSearches.includes(term)) {
      setRecentSearches(prev => [term, ...prev].slice(0, 5));
    }
  };

  const handleItemPress = (item) => {
    const term = searchType === 'lines' ? `${item.number} - ${item.name}` : item.name;
    addToRecentSearches(term);
    
    if (searchType === 'lines') {
      router.push('LineDetails');
    } else {
      // Navegar para detalhes do ponto quando implementado
      router.push('RideDetails');
    }
  };
  
  const handleRecentSearchPress = (term) => {
    setSearchQuery(term);
    animateSearch(true);
  };

  const renderSearchResult = ({ item, index }) => {
    const isLinesSearch = searchType === 'lines';
    
    return (
      <Animatable.View 
        animation="fadeInUp"
        duration={300}
        delay={index * 50}
        style={{ marginBottom: 12 }}
      >
        <TouchableOpacity 
          className="flex-row rounded-2xl p-4 shadow-sm"
          style={{ 
            backgroundColor: theme.card,
            borderColor: theme.border, 
            borderWidth: 1 
          }}
          onPress={() => handleItemPress(item)}
          activeOpacity={0.7}
        >
          {/* Ícone e informações principais */}
          <View className="flex-row flex-1 items-center">
            <View className="w-12 h-12 rounded-full items-center justify-center mr-4" 
              style={{ backgroundColor: `${theme.primary}15` }}>
              <FontAwesome name={item.icon} size={20} color={theme.primary} />
            </View>
            
            <View className="flex-1">
              <View className="flex-row items-center">
                {isLinesSearch && (
                  <View className="px-2.5 py-1 rounded-full mr-2" 
                    style={{ backgroundColor: theme.primaryLight }}>
                    <Text className="font-bold text-xs" style={{ color: theme.primary }}>
                      {item.number}
                    </Text>
                  </View>
                )}
                <Text className="font-bold text-base" 
                  style={{ color: theme.text, flex: 1 }}>
                  {isLinesSearch ? item.name : item.name}
                </Text>
              </View>
              
              <Text className="text-sm mt-1" style={{ color: theme.textSecondary }}>
                {isLinesSearch ? item.company : item.address}
              </Text>
              
              {/* Informações adicionais */}
              {!isLinesSearch && item.lines && (
                <View className="flex-row mt-2">
                  {item.lines.slice(0, 3).map((line, i) => (
                    <View 
                      key={i} 
                      className="px-2 py-0.5 rounded-full mr-1" 
                      style={{ backgroundColor: `${theme.primary}15` }}
                    >
                      <Text className="text-xs" style={{ color: theme.primary }}>{line}</Text>
                    </View>
                  ))}
                  {item.lines.length > 3 && (
                    <Text className="text-xs ml-1" style={{ color: theme.textSecondary }}>
                      +{item.lines.length - 3}
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>
          
          {/* Distância e chegada */}
          <View className="ml-2 items-end justify-center">
            <Text className="font-bold" style={{ color: theme.primary }}>
              {item.distance}
            </Text>
            {isLinesSearch && (
              <Text className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                {item.arrival}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  const renderRecentItem = ({ item, index }) => (
    <Animatable.View
      animation="fadeIn" 
      duration={300}
      delay={index * 100}
    >
      <TouchableOpacity 
        className="flex-row items-center py-3.5 border-b"
        style={{ borderColor: theme.border }}
        onPress={() => handleRecentSearchPress(item)}
        activeOpacity={0.7}
      >
        <View className="w-8 h-8 items-center justify-center rounded-full mr-3" 
          style={{ backgroundColor: `${theme.primary}10` }}>
          <FontAwesome name="history" size={14} color={theme.primary} />
        </View>
        <Text style={{ color: theme.textSecondary, flex: 1 }}>{item}</Text>
        <FontAwesome name="chevron-right" size={14} color={theme.border} />
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
      {/* Header animado */}
      <Animatable.View 
        animation="fadeIn" 
        duration={300}
        className="px-4 pt-4 pb-2"
      >
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full mr-4"
            style={{ backgroundColor: theme.card }}
          >
            <FontAwesome name="arrow-left" size={18} color={theme.text} />
          </TouchableOpacity>
          <Text className="text-2xl font-bold" style={{ color: theme.text }}>
            {searchType === 'lines' ? 'Buscar Linhas' : 'Buscar Pontos'}
          </Text>
        </View>
        
        {/* Barra de pesquisa */}
        <View className="flex-row items-center rounded-xl p-2 shadow-sm mb-2"
          style={{ 
            backgroundColor: theme.card,
            borderColor: theme.border, 
            borderWidth: 1 
          }}>
          <FontAwesome name="search" size={18} color={theme.textSecondary} className="mx-2" />
          <TextInput
            ref={searchInputRef}
            className="flex-1 py-2 px-2 text-base"
            placeholder={`Buscar ${searchType === 'lines' ? 'linhas de ônibus' : 'pontos de ônibus'}...`}
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
            returnKeyType="search"
            style={{ color: theme.text }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={clearSearch}
              className="w-8 h-8 items-center justify-center rounded-full"
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <FontAwesome name="times-circle" size={18} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </Animatable.View>
      
      {/* Seletor de tipo de busca */}
      <View className="flex-row mx-4 mb-4">
        <TouchableOpacity 
          className={`py-2 px-4 rounded-full mr-3 ${searchType === 'lines' ? '' : 'bg-transparent'}`}
          style={searchType === 'lines' ? { 
            backgroundColor: theme.card,
            borderColor: theme.border, 
            borderWidth: 1,
            shadowColor: isDarkMode ? "#000" : "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: isDarkMode ? 0.3 : 0.1,
            shadowRadius: 1,
            elevation: 1,
          } : {}}
          onPress={() => setSearchType('lines')}
        >
          <Text style={{ 
            color: searchType === 'lines' ? theme.primary : theme.textSecondary,
            fontWeight: searchType === 'lines' ? 'bold' : 'normal'
          }}>
            Linhas
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className={`py-2 px-4 rounded-full ${searchType === 'stops' ? '' : 'bg-transparent'}`}
          style={searchType === 'stops' ? { 
            backgroundColor: theme.card,
            borderColor: theme.border, 
            borderWidth: 1,
            shadowColor: isDarkMode ? "#000" : "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: isDarkMode ? 0.3 : 0.1,
            shadowRadius: 1,
            elevation: 1,
          } : {}}
          onPress={() => setSearchType('stops')}
        >
          <Text style={{ 
            color: searchType === 'stops' ? theme.primary : theme.textSecondary,
            fontWeight: searchType === 'stops' ? 'bold' : 'normal'
          }}>
            Pontos
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Conteúdo principal */}
      <View className="flex-1 px-4">
        {/* Exibe buscas recentes quando não há query */}
        {searchQuery.length === 0 ? (
          <Animated.View style={{ 
            opacity: fadeAnim,
            transform: [{ translateY: translateAnim }]
          }}>
            <Animatable.View 
              animation="fadeIn" 
              duration={400}
            >
              <Text className="text-xl font-bold mb-4" style={{ color: theme.text }}>
                Buscas recentes
              </Text>
              
              <FlatList
                data={recentSearches}
                renderItem={renderRecentItem}
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={false}
                ListEmptyComponent={
                  <View className="items-center py-8">
                    <FontAwesome name="search" size={32} color={theme.border} />
                    <Text className="mt-3 text-center" style={{ color: theme.textSecondary }}>
                      Nenhuma busca recente
                    </Text>
                  </View>
                }
                ListFooterComponent={
                  recentSearches.length > 0 ? (
                    <TouchableOpacity 
                      className="py-3 items-center mt-2"
                      onPress={() => setRecentSearches([])}
                    >
                      <Text style={{ color: theme.primary }}>Limpar buscas recentes</Text>
                    </TouchableOpacity>
                  ) : null
                }
              />
            </Animatable.View>
          </Animated.View>
        ) : (
          <FlatList
            data={filteredData}
            renderItem={renderSearchResult}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Animatable.View 
                animation="fadeIn"
                className="items-center justify-center py-12"
              >
                <FontAwesome name="search" size={40} color={theme.border} />
                <Text className="mt-4 text-center" style={{ color: theme.textSecondary }}>
                  Nenhum resultado encontrado para{'\n'}"{searchQuery}"
                </Text>
              </Animatable.View>
            }
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </View>
  );
}