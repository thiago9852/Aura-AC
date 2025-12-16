// src/data/vocab.ts

import { Category } from "../types"

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'core',
    name: 'Essenciais',
    icon: 'MessageCircle',
    color: '#dbeafe',
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
];