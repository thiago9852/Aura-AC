const fs = require('fs');

function replaceInFile(path, replaces) {
    if (!fs.existsSync(path)) {
        console.error('Not found: ' + path);
        return;
    }
    let content = fs.readFileSync(path, 'utf8');
    let original = content;
    for (const [search, replace] of replaces) {
        content = content.split(search).join(replace);
    }
    if (content !== original) {
        fs.writeFileSync(path, content, 'utf8');
        console.log('Updated ' + path);
    }
}

replaceInFile('App.tsx', [
    ["import Header from './src/components/Header';", "import Header from './src/components/ui/Header';"],
    ["import Sidebar from './src/components/Sidebar';", "import Sidebar from './src/components/ui/Sidebar';"],
    ["import SymbolGrid from './src/components/SymbolGrid';", "import HomeScreen from './src/screens/HomeScreen';"],
    ["import CategoryManager from './src/components/category/CategoryManager';", "import CategoryManager from './src/screens/CategoryManager';"],
    ["import AgendaScreen from './src/components/agenda/AgendaScreen';", "import AgendaScreen from './src/screens/AgendaScreen';"],
    ["import LoginScreen from './src/components/LoginScreen';", "import LoginScreen from './src/screens/LoginScreen';"],
    ["import SentenceBar from './src/components/SentenceBar';", "import SentenceBar from './src/components/ui/SentenceBar';"],
    ["<SymbolGrid />", "<HomeScreen />"]
]);

replaceInFile('src/screens/HomeScreen.tsx', [
    ["import SymbolCard from './SymbolCard';", "import SymbolCard from '../components/ui/SymbolCard';"],
    ["import SymbolActionModal from './category/SymbolActionModal';", "import SymbolActionModal from '../components/modals/SymbolActionModal';"]
]);

replaceInFile('src/screens/AgendaScreen.tsx', [
    ["import { useAAC } from '../../context/AACContext';", "import { useAAC } from '../context/AACContext';"],
    ["import CreateAgendaModal from './CreateAgendaModal';", "import CreateAgendaModal from '../components/modals/CreateAgendaModal';"]
]);

replaceInFile('src/screens/CategoryManager.tsx', [
    ["import { useAAC } from '../../context/AACContext';", "import { useAAC } from '../context/AACContext';"],
    ["import CreateCategoryModal from './CreateCategoryModal';", "import CreateCategoryModal from '../components/modals/CreateCategoryModal';"],
    ["import { Category } from '../../types';", "import { Category } from '../types';"]
]);

replaceInFile('src/components/ui/Header.tsx', [
    ["import { useAAC } from '../context/AACContext';", "import { useAAC } from '../../context/AACContext';"],
    ["import SettingsModal from './SettingsModal';", "import SettingsModal from '../modals/SettingsModal';"]
]);

replaceInFile('src/components/ui/Sidebar.tsx', [
    ["import { useAAC } from '../context/AACContext';", "import { useAAC } from '../../context/AACContext';"]
]);

replaceInFile('src/components/ui/SentenceBar.tsx', [
    ["import { useAAC } from '../context/AACContext';", "import { useAAC } from '../../context/AACContext';"]
]);

replaceInFile('src/components/ui/SymbolCard.tsx', [
    ["import { useAAC } from '../context/AACContext';", "import { useAAC } from '../../context/AACContext';"]
]);

replaceInFile('src/components/modals/SettingsModal.tsx', [
    ["import { useAAC } from '../context/AACContext';", "import { useAAC } from '../../context/AACContext';"]
]);

// Cleanup CreateSymbolModal if it has any wrong path
replaceInFile('src/components/modals/CreateSymbolModal.tsx', [
    ["import { useAAC } from '../../context/AACContext';", "import { useAAC } from '../../context/AACContext';"]
]);
