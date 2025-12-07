import { useState, useEffect, useRef } from 'react';
import { Search, TrendingUp, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ContactModal from './ContactModal';
import { vetement_enfant } from '../data/vetement_enfant';
import { chaussure } from '../data/chaussure';
import { vetement_homme } from '../data/vetement_homme';
import { vetement_femme } from '../data/vetement_femme';
import { bijoux_accessoires } from '../data/bijoux_accessoires';
import { sacs } from '../data/sacs';
import { telephone_accessoires } from '../data/telephone_accessoires';
import { usePrice } from '../hooks/usePrice';

const SearchAutocomplete = ({ placeholder, className, isMobile = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showContactModal, setShowContactModal] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const { format: formatPrice } = usePrice();

  // Combiner tous les produits avec leur catégorie
  const allProducts = [
    ...chaussure.map(p => ({ ...p, category: 'chaussure', categoryName: 'Chaussures', categoryPath: '/shoes' })),
    ...vetement_homme.map(p => ({ ...p, category: 'homme', categoryName: 'Vêtements Homme', categoryPath: '/clothing' })),
    ...vetement_femme.map(p => ({ ...p, category: 'femme', categoryName: 'Vêtements Femme', categoryPath: '/clothing' })),
    ...vetement_enfant.map(p => ({ ...p, category: 'enfant', categoryName: 'Vêtements Enfant', categoryPath: '/clothing' })),
    ...bijoux_accessoires.map(p => ({ ...p, category: 'bijoux', categoryName: 'Bijoux & Accessoires', categoryPath: '/bijou' })),
    ...sacs.map(p => ({ ...p, category: 'sacs', categoryName: 'Sacs', categoryPath: '/bags' })),
    ...telephone_accessoires.map(p => ({ ...p, category: 'telephone_accessoires', categoryName: 'Téléphones & Accessoires', categoryPath: '/phone' }))
  ];

  // Recherche en temps réel
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const searchLower = searchQuery.toLowerCase().trim();
    
    // Rechercher dans les produits
    let results = allProducts.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(searchLower);
      const brandMatch = product.brand?.toLowerCase().includes(searchLower);
      const categoryMatch = product.categoryName.toLowerCase().includes(searchLower);
      
      return nameMatch || brandMatch || categoryMatch;
    });

    // Limiter à 3 résultats max
    results = results.slice(0, 3);

    setSuggestions(results);
    setIsOpen(true); // Toujours ouvrir le dropdown si la recherche a au moins 2 caractères
    setSelectedIndex(-1);
  }, [searchQuery]);

  // Fermer au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigation au clavier
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        handleSubmit(e);
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
      // Navigation vers le produit sélectionné
      const product = suggestions[selectedIndex];
      navigate(`/product/${product.category}/${product.id}`);
    } else if (searchQuery.trim()) {
      // Navigation vers la page de recherche
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
    
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.category}/${product.id}`);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleViewAll = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative w-full group">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className={`w-full ${
            isMobile 
              ? 'pl-5 pr-14 py-3.5' 
              : 'px-5 py-3.5'
          } bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white placeholder-white/60 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white/20 transition-all duration-300`}
        />
        
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSuggestions([]);
              setIsOpen(false);
            }}
            className={`absolute ${
              isMobile ? 'right-12' : 'right-20'
            } top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white transition-colors`}
          >
            <X size={18} />
          </button>
        )}
        
        <button 
          type="submit"
          className={`absolute ${
            isMobile ? 'right-2' : 'right-2'
          } top-1/2 -translate-y-1/2 ${
            isMobile ? 'p-2' : 'px-6 py-2'
          } bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/50`}
        >
          <Search size={isMobile ? 18 : 20} />
        </button>
      </form>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-w-2xl"
          >
            {/* Liste des produits suggérés */}
            <div className="max-h-96 overflow-y-auto">
              {suggestions.map((product, index) => (
                <motion.div
                  key={`${product.category}-${product.id}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleProductClick(product)}
                  className={`flex items-center gap-4 p-4 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 ${
                    selectedIndex === index ? 'bg-blue-50' : ''
                  }`}
                >
                  {/* Image du produit */}
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/64?text=Product';
                      }}
                    />
                  </div>

                  {/* Informations du produit */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate mb-1">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded text-xs font-medium">
                        {product.categoryName}
                      </span>
                      {product.brand && (
                        <span className="text-xs">• {product.brand}</span>
                      )}
                    </div>
                  </div>

                  {/* Prix */}
                  <div className="flex-shrink-0 text-right">
                    <p className="text-lg font-bold text-green-600">
                      {formatPrice(product.price)}
                    </p>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <p className="text-xs text-gray-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer - Voir tous les résultats */}
            <div className="border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleViewAll}
                className="w-full px-4 py-3 text-center text-blue-600 hover:text-blue-700 font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Search size={18} />
                <span>Voir tous les résultats pour "{searchQuery}"</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message si aucun résultat */}
      <AnimatePresence>
        {isOpen && searchQuery.trim().length >= 2 && suggestions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 z-50 text-center"
          >
            <Search size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-800 font-bold text-lg mb-2">
              Aucun produit trouvé pour votre recherche
            </p>
            <p className="text-gray-600 text-sm mb-4">
              Le produit que vous recherchez n'est pas encore disponible dans notre catalogue.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
              <p className="text-blue-800 text-sm font-medium">
                💬 Contactez-nous pour passer commande de votre produit !
              </p>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                setShowContactModal(true);
              }}
              className="mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300"
            >
              Nous Contacter
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Contact */}
      <ContactModal 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)} 
      />
    </div>
  );
};

export default SearchAutocomplete;
