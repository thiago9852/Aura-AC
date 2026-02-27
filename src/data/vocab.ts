// src/data/vocab.ts
import { Category } from "../types"

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'core',
    name: 'Essenciais',
    icon: 'MessageCircle',
    color: '#dbeafe',
    items: [
      { id: 'more', label: 'Mais', colorCode: 'blue', iconName: 'Plus' },
      { id: 'yes', label: 'Sim', colorCode: 'green', iconName: 'Check' },
      { id: 'want', label: 'Eu quero', colorCode: 'blue', iconName: 'MousePointer2' },
      { id: 'help', label: 'Ajuda', colorCode: 'blue', iconName: 'LifeBuoy' },
      { id: 'please', label: 'Por favor', colorCode: 'yellow', iconName: 'Hand' },
      { id: 'no', label: 'Não', colorCode: 'red', iconName: 'X' },
      { id: 'stop', label: 'Pare', colorCode: 'red', iconName: 'Octagon' },
      { id: 'finished', label: 'Acabei', colorCode: 'blue', iconName: 'CheckCircle' },
      { id: 'thanks', label: 'Obrigado', colorCode: 'yellow', iconName: 'ThumbsUp' },
    ]
  },
  {
    id: 'feelings',
    name: 'Sentimentos',
    icon: 'Heart',
    color: '#dbeafe', 
    items: [
      { id: 'happy', label: 'Feliz', iconName: 'Smile', speechText: 'Estou feliz', colorCode: 'blue' },
      { id: 'sad', label: 'Triste', iconName: 'Frown', speechText: 'Estou triste', colorCode: 'blue' },
      { id: 'tired', label: 'Cansado', iconName: 'BatteryLow', speechText: 'Estou cansado', colorCode: 'blue' },
      { id: 'pain', label: 'Dor', iconName: 'Stethoscope', speechText: 'Estou com dor', colorCode: 'blue' },
    ]
  },
  {
    id: 'people',
    name: 'Pessoas',
    icon: 'Users',
    color: '#fef9c3',
    items: [
      { id: 'me', label: 'Eu', iconName: 'User', speechText: 'Eu', colorCode: 'yellow' },
      { id: 'dad', label: 'Papai', iconName: 'UserCircle', speechText: 'Papai', colorCode: 'yellow' },
      { id: 'mom', label: 'Mamãe', iconName: 'UserCircle', speechText: 'Mamãe', colorCode: 'yellow' },
      { id: 'teacher', label: 'Professor', iconName: 'GraduationCap', speechText: 'Professor', colorCode: 'yellow' },
    ]
  },
  {
    id: 'places',
    name: 'Lugares',
    icon: 'MapPin',
    color: '#f3e8ff',
    items: [
      { id: 'house', label: 'Casa', iconName: 'Home', speechText: 'Casa', colorCode: 'purple' },
      { id: 'school', label: 'Escola', iconName: 'School', speechText: 'Escola', colorCode: 'purple' },
      { id: 'park', label: 'Parque', iconName: 'Trees', speechText: 'Parque', colorCode: 'purple' },
      { id: 'bathroom', label: 'Banheiro', iconName: 'Bath', speechText: 'Quero ir ao banheiro', colorCode: 'purple' },
    ]
  }
];