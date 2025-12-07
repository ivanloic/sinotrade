/**
 * Script de test pour le système multilingue
 * Ce fichier peut être importé dans votre console pour tester les traductions
 */

import { translations } from '../data/translations';

// Test 1: Vérifier que toutes les clés FR ont une correspondance EN
export const testTranslationKeys = () => {
  const frKeys = JSON.stringify(translations.fr);
  const enKeys = JSON.stringify(translations.en);
  
  console.log('🧪 Test des clés de traduction...');
  
  const checkKeys = (obj1, obj2, path = '') => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    keys1.forEach(key => {
      const fullPath = path ? `${path}.${key}` : key;
      
      if (!keys2.includes(key)) {
        console.error(`❌ Clé manquante en EN: ${fullPath}`);
        return;
      }
      
      if (typeof obj1[key] === 'object' && obj1[key] !== null) {
        checkKeys(obj1[key], obj2[key], fullPath);
      }
    });
  };
  
  checkKeys(translations.fr, translations.en);
  checkKeys(translations.en, translations.fr);
  
  console.log('✅ Test des clés terminé !');
};

// Test 2: Afficher toutes les traductions disponibles
export const showAllTranslations = () => {
  console.log('📚 Traductions disponibles:');
  console.log('FR:', translations.fr);
  console.log('EN:', translations.en);
};

// Test 3: Comparer une section spécifique
export const compareSection = (section) => {
  console.log(`🔍 Comparaison de la section: ${section}`);
  console.log('FR:', translations.fr[section]);
  console.log('EN:', translations.en[section]);
};

// Test 4: Vérifier le nombre total de traductions
export const countTranslations = () => {
  const countKeys = (obj) => {
    let count = 0;
    for (let key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        count += countKeys(obj[key]);
      } else {
        count++;
      }
    }
    return count;
  };
  
  const frCount = countKeys(translations.fr);
  const enCount = countKeys(translations.en);
  
  console.log(`📊 Nombre de traductions:`);
  console.log(`   Français: ${frCount}`);
  console.log(`   Anglais: ${enCount}`);
  
  if (frCount === enCount) {
    console.log('✅ Les deux langues ont le même nombre de traductions');
  } else {
    console.warn('⚠️ Différence de nombre de traductions détectée');
  }
};

// Exécuter tous les tests
export const runAllTests = () => {
  console.log('🚀 Lancement des tests du système multilingue...\n');
  testTranslationKeys();
  console.log('');
  countTranslations();
  console.log('\n✨ Tests terminés !');
};

// Pour utiliser dans la console:
// import { runAllTests } from './src/scripts/testTranslations.js';
// runAllTests();
