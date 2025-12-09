// src/data/vocab.ts

import {Category} from "../types/types";

export const INITIAL_CATEGORIES: Category[] = [
    {
        id: 'core',
        name: 'Essenciais',
        icon: 'MessageCircle',
        color: 'bg-blue-100 dark:bg-blue-900',
        items: [
            { id: 'yes', label: 'Sim', colorCode: 'green', iconName: 'Check' },
            { id: 'no', label: 'Não', colorCode: 'red', iconName: 'X' },
            { id: 'please', label: 'Por favor', colorCode: 'yellow', iconName: 'Hand' },
            { id: 'thanks', label: 'Obrigado', colorCode: 'yellow', iconName: 'ThumbsUp' },
            { id: 'want', label: 'Eu quero', colorCode: 'blue', iconName: 'MousePointer2' },
            { id: 'help', label: 'Ajuda', colorCode: 'blue', iconName: 'LifeBuoy' },
            { id: 'stop', label: 'Pare', colorCode: 'red', iconName: 'Octagon' },
            { id: 'more', label: 'Mais', colorCode: 'blue', iconName: 'Plus' },
            { id: 'finished', label: 'Acabei', colorCode: 'blue', iconName: 'CheckCircle' },
        ]
    },
    {
    id: 'social',
    name: 'Social',
    icon: 'Users',
    color: 'bg-purple-100 dark:bg-purple-900',
    items: [
      { id: 'hello', label: 'Olá', iconName: 'Hand' },
      { id: 'how_are_you', label: 'Como vai?', iconName: 'HelpCircle' },
      { id: 'name_is', label: 'Meu nome é', iconName: 'User' },
      { id: 'nice_meet', label: 'Prazer em conhecer', iconName: 'Smile' },
      { id: 'goodbye', label: 'Tchau', iconName: 'LogOut' },
      { id: 'chat', label: 'Conversar', iconName: 'MessageSquare' },
      { id: 'joke', label: 'Piada', iconName: 'SmilePlus' },
    ]
  },
  {
    id: 'academic',
    name: 'Acadêmico',
    icon: 'GraduationCap',
    color: 'bg-orange-100 dark:bg-orange-900',
    items: [
      { id: 'dont_understand', label: 'Não entendi', iconName: 'HelpCircle' },
      { id: 'question', label: 'Tenho uma dúvida', iconName: 'Hand' },
      { id: 'repeat', label: 'Repita, por favor', iconName: 'RefreshCw' },
      { id: 'assignment', label: 'Trabalho', iconName: 'FileText' },
      { id: 'presentation', label: 'Apresentação', iconName: 'Projector' },
      { id: 'group', label: 'Grupo', iconName: 'Users' },
      { id: 'research', label: 'Pesquisa', iconName: 'Search' },
      { id: 'deadline', label: 'Prazo', iconName: 'Calendar' },
      { id: 'computer', label: 'Computador', iconName: 'Laptop' },
      { id: 'internet', label: 'Internet', iconName: 'Wifi' },
    ]
  },
  {
    id: 'feelings',
    name: 'Sentimentos',
    icon: 'Heart',
    color: 'bg-red-100 dark:bg-red-900',
    items: [
      { id: 'happy', label: 'Feliz', iconName: 'Smile' },
      { id: 'sad', label: 'Triste', iconName: 'Frown' },
      { id: 'tired', label: 'Cansado', iconName: 'BatteryLow' },
      { id: 'anxious', label: 'Ansioso', iconName: 'Activity' },
      { id: 'angry', label: 'Bravo', iconName: 'Zap' },
      { id: 'confused', label: 'Confuso', iconName: 'HelpCircle' },
      { id: 'bored', label: 'Entediado', iconName: 'Clock' },
    ]
  },
  {
    id: 'places',
    name: 'Lugares',
    icon: 'MapPin',
    color: 'bg-green-100 dark:bg-green-900',
    items: [
      { id: 'home', label: 'Casa', iconName: 'Home' },
      { id: 'university', label: 'Faculdade', iconName: 'Building' },
      { id: 'library', label: 'Biblioteca', iconName: 'BookOpen' },
      { id: 'cafe', label: 'Cafeteria', iconName: 'Coffee' },
      { id: 'bathroom', label: 'Banheiro', iconName: 'Bath' },
      { id: 'outside', label: 'Lá fora', iconName: 'Sun' },
    ]
  }
];