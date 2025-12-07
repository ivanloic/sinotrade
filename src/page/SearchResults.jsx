import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, X, ShoppingCart, Heart, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTranslations } from '../data/translations';
import { useLanguage } from '../context/LanguageContext';
import { usePrice } from '../hooks/usePrice';
import { chaussure } from '../data/chaussure';
import { vetement_homme } from '../data/vetement_homme';
import { vetement_femme } from '../data/vetement_femme';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = useTranslations(language);
  const { addToCart } = useCart();
  const { format: formatPrice } = usePrice();

  // Récupérer le terme de recherche depuis l'URL
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';

  const [searchTerm, setSearchTerm] = useState(query);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');

  // Combiner tous les produits
  const allProducts = [
    ...chaussure.map(p => ({ ...p, category: 'shoes' })),
    ...vetement_homme.map(p => ({ ...p, category: 'men' })),
    ...vetement_femme.map(p => ({ ...p, category: 'women' }))
  ];

  // Fonction de recherche
  const searchProducts = (term) => {
    if (!term.trim()) {
      setFilteredProducts([]);
      return;
    }

    const searchLower = term.toLowerCase();
    let results = allProducts.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(searchLower);
      const brandMatch = product.brand?.toLowerCase().includes(searchLower);
      const categoryMatch = product.category?.toLowerCase().includes(searchLower);
      
      return nameMatch || brandMatch || categoryMatch;
    });

    // Filtrer par catégorie
    if (selectedCategory !== 'all') {
      results = results.filter(p => p.category === selectedCategory);
    }

    // Filtrer par prix
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      results = results.filter(p => {
        if (max) {
          return p.price >= min && p.price <= max;
        }
        return p.price >= min;
      });
    }

    // Trier
    switch (sortBy) {
      case 'price-asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // relevance
        break;
    }

    setFilteredProducts(results);
  };

  // Rechercher quand les paramètres changent
  useEffect(() => {
    searchProducts(searchTerm);
  }, [searchTerm, selectedCategory, priceRange, sortBy]);

  // Mettre à jour quand l'URL change
  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setPriceRange('all');
    setSortBy('relevance');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Barre de recherche */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <form onSubmit={handleSearch} className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t.header?.searchPlaceholder || 'Rechercher des produits...'}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {t.common?.search || 'Rechercher'}
              </button>
            </form>

            {/* Résultats et bouton retour */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>{t.common?.back || 'Retour'}</span>
              </button>
              <p className="text-gray-600">
                <span className="font-bold text-blue-600">{filteredProducts.length}</span> {t.common?.results || 'résultat(s)'} {searchTerm && `pour "${searchTerm}"`}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filtres et Tri */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-4 flex-1">
              {/* Catégorie */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="all">{t.common?.allCategories || 'Toutes catégories'}</option>
                <option value="shoes">{t.categories?.shoes || 'Chaussures'}</option>
                <option value="men">{t.categories?.menClothing || 'Vêtements Homme'}</option>
                <option value="women">{t.categories?.womenClothing || 'Vêtements Femme'}</option>
              </select>

              {/* Prix */}
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="all">{t.common?.allPrices || 'Tous les prix'}</option>
                <option value="0-2000">0 - 2000 XAF</option>
                <option value="2000-5000">2000 - 5000 XAF</option>
                <option value="5000-10000">5000 - 10000 XAF</option>
                <option value="10000-99999">10000+ XAF</option>
              </select>

              {/* Tri */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="relevance">{t.common?.relevance || 'Pertinence'}</option>
                <option value="price-asc">{t.common?.priceLowToHigh || 'Prix croissant'}</option>
                <option value="price-desc">{t.common?.priceHighToLow || 'Prix décroissant'}</option>
                <option value="name">{t.common?.name || 'Nom'}</option>
              </select>

              {(selectedCategory !== 'all' || priceRange !== 'all' || sortBy !== 'relevance') && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X size={18} />
                  <span>{t.common?.clearFilters || 'Effacer filtres'}</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Résultats */}
        {filteredProducts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={`${product.category}-${product.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                onClick={() => navigate(`/product/${product.category}/${product.id}`)}
              >
                <div className="relative overflow-hidden aspect-square">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.originalPrice && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Ajouter aux favoris
                    }}
                    className="absolute top-2 left-2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    <Heart size={18} className="text-red-500" />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">{product.brand}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-blue-600">{formatPrice(product.price)}</p>
                      {product.originalPrice && (
                        <p className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          ...product,
                          selectedColor: product.colors?.[0],
                          selectedSize: product.sizes?.[0]
                        });
                      }}
                      className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <Search size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {t.common?.noResults || 'Aucun résultat trouvé'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? `Aucun produit ne correspond à "${searchTerm}"`
                : 'Entrez un terme de recherche pour trouver des produits'
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  navigate('/search');
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                {t.common?.clearSearch || 'Effacer la recherche'}
              </button>
            )}
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SearchResults;
