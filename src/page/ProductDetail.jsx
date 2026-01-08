import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Share2, Truck, Shield, Check, Star, ArrowLeft, Minus, Plus, ChevronLeft, ChevronRight, MessageCircle, Package } from 'lucide-react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import ContactModal from '../Components/ContactModal';
import { useCart } from '../context/CartContext';
import { usePrice } from '../hooks/usePrice';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { vetement_homme } from '../data/vetement_homme';
import { vetement_femme } from '../data/vetement_femme';
import { chaussure } from '../data/chaussure';
import { sacs } from '../data/sacs';
import { bijoux_accessoires } from '../data/bijoux_accessoires';
import { telephone_accessoires } from '../data/telephone_accessoires';

const ProductDetail = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const navigate = useNavigate();
  const [selectedBrands, setSelectedBrands] = useState([])
  const [allBrandsSelected, setAllBrandsSelected] = useState(false)
  const [selectedColors, setSelectedColors] = useState([])
  const [selectedSize, setSelectedSize] = useState(null)
  // for clothing (non-shoe) allow selecting multiple sizes
  const [selectedSizes, setSelectedSizes] = useState([])
  const [sizeMap, setSizeMap] = useState({})
  const [showContactModal, setShowContactModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const location = useLocation();
  const { category, id } = useParams(); // Récupérer depuis l'URL
  
  console.log('📍 useParams:', { category, id });
  
  // Support à la fois URL params et location.state
  const incomingId = id ? parseInt(id) : (location?.state?.productId ?? null)
  const incomingCategory = category || location?.state?.category || null
  const incomingGender = location?.state?.productGender ?? null
  const incomingProductType = location?.state?.productType ?? null // 'shoe' pour chaussures
  const incomingShoeType = location?.state?.shoeType ?? null // 'homme', 'femme', 'enfant'

  // product state
  const [product, setProduct] = useState(null);

  const { addItem } = useCart();

  // refs for thumbnail scrolling/visibility
  const thumbsRef = useRef([]);
  const thumbsContainerRef = useRef(null);

  // Fonction pour afficher le toast
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // When navigated with a productId, try to load it from the appropriate dataset
  useEffect(() => {
    if (!incomingId) return;
    try {
      const normalizedId = incomingId?.toString();
      console.log('🔍 Recherche produit - ID:', normalizedId, 'Category:', incomingCategory, 'Gender:', incomingGender, 'Type:', incomingProductType);
      
      // Sélectionner le bon dataset selon le type de produit ou la catégorie URL
      let datasets = [];
      
      // Priorité à la catégorie depuis l'URL (depuis l'autocomplétion)
      if (incomingCategory === 'shoes' || incomingCategory === 'chaussure') {
        datasets = [chaussure];
      } else if (incomingCategory === 'men' || incomingCategory === 'homme') {
        datasets = [vetement_homme];
      } else if (incomingCategory === 'women' || incomingCategory === 'femme') {
        datasets = [vetement_femme];
      } else if (incomingCategory === 'bags' || incomingCategory === 'sacs' || incomingGender === 'sacs') {
        // Pour les sacs
        datasets = [sacs];
      } else if (incomingCategory === 'jewelry' || incomingCategory === 'bijoux') {
        // Pour les bijoux
        datasets = [bijoux_accessoires];
      } else if (incomingCategory === 'telephone_accessoires') {
        // Pour les téléphones et accessoires
        datasets = [telephone_accessoires];
      } else if (incomingProductType === 'shoe') {
        // Pour les chaussures, utiliser uniquement le dataset chaussure
        datasets = [chaussure];
      } else {
        // Pour les vêtements
        datasets = incomingGender === 'women'
          ? [vetement_femme, vetement_homme]
          : incomingGender === 'men'
            ? [vetement_homme, vetement_femme]
            : [vetement_homme, vetement_femme, chaussure]; // Chercher partout si pas de catégorie
      }

      console.log('📦 Datasets à rechercher:', datasets.length, 'dataset(s)');
      
      let found = null;
      for (const dataSet of datasets) {
        found = dataSet.find(p => p.id?.toString() === normalizedId);
        if (found) {
          console.log('✅ Produit trouvé:', found.name, 'ID:', found.id, 'Catégorie:', found.category);
          break;
        }
      }
      
      if (!found) {
        console.log('❌ Produit non trouvé avec ID:', normalizedId);
      }

      if (found) {
        const normalized = {
          id: found.id,
          name: found.name || found.title || 'Produit',
          category: found.category || found.subCategory || (
            incomingProductType === 'shoe' ? 'Chaussures' : 
            incomingCategory === 'jewelry' ? 'Bijoux' :
            incomingCategory === 'bags' ? 'Sacs' :
            incomingCategory === 'telephone_accessoires' ? 'Téléphones & Accessoires' : 'Vêtements'
          ),
          price: found.price || found.cost || 0,
          originalPrice: found.originalPrice || found.price || found.cost || 0,
          minOrder: found.minOrder || found.min || 1,
          taxType: found.taxType || 'ttc',
          rating: found.rating || 4.0,
          reviews: found.reviews || 0,
          stock: found.stock || 0,
          sold: found.sold || 0,
          shipping: found.shipping || '',
          warranty: found.warranty || '12 mois',
          badge: found.badge || null,
          images: found.images || (found.image ? [found.image] : ['/placeholder-product.jpg']),
          specifications: found.specifications || (incomingProductType === 'shoe' ? {
            'Type': found.shoeType === 'homme' ? 'Chaussures Homme' : found.shoeType === 'femme' ? 'Chaussures Femme' : 'Chaussures Enfant',
            'Marque': found.brand || 'Various',
            'Catégorie': found.category || 'Chaussures',
            'Pointures': found.sizes ? `${found.sizes[0]} - ${found.sizes[found.sizes.length - 1]}` : 'Multiples',
            'Couleurs': found.colors ? found.colors.join(', ') : 'Variées'
          } : {}),
          description: found.description || (found.features ? found.features.join(' • ') : 
            incomingProductType === 'shoe' 
              ? `Découvrez ces chaussures de qualité supérieure. Confort et style garantis. Disponibles en plusieurs pointures et couleurs.`
              : `Produit de qualité premium. Découvrez cet article exceptionnel.`),
          features: found.features || [],
          colors: found.colors || [],
          sizes: found.sizes || [],
          clothbrands: found.clothbrands || found.clothBrands || found.shoebrands || [],
          shoeType: found.shoeType || incomingShoeType || null, // homme, femme, enfant
          productType: incomingProductType || 'clothing'
        };
        setProduct(normalized);
        return;
      }
    } catch (e) {
      console.warn('Failed to load product by id', incomingId, e)
    }
    // Si aucun produit n'est trouvé, rediriger vers l'accueil
    if (!incomingId) {
      console.log('⚠️ Aucun ID de produit fourni, redirection vers l\'accueil');
      navigate('/');
    }
  }, [incomingId, incomingCategory, incomingGender, incomingProductType, incomingShoeType, navigate]);

  // Produits similaires - Dynamiques basés sur le dataset réel
  const similarProducts = (() => {
    if (!product) return [];
    
    let sourceDataset = [];
    
    // Déterminer le dataset source
    if (incomingProductType === 'shoe' || incomingCategory === 'chaussure') {
      sourceDataset = chaussure;
    } else if (incomingCategory === 'bags' || incomingGender === 'sacs') {
      sourceDataset = sacs;
    } else if (incomingCategory === 'jewelry') {
      sourceDataset = bijoux_accessoires;
    } else if (incomingCategory === 'telephone_accessoires') {
      sourceDataset = telephone_accessoires;
    } else if (incomingGender === 'men' || incomingCategory === 'men') {
      sourceDataset = vetement_homme;
    } else if (incomingGender === 'women' || incomingCategory === 'women') {
      sourceDataset = vetement_femme;
    } else {
      // Mélanger tous les datasets
      sourceDataset = [...vetement_homme, ...vetement_femme, ...chaussure, ...sacs, ...bijoux_accessoires, ...telephone_accessoires];
    }
    
    // Filtrer pour exclure le produit actuel et obtenir 4 produits aléatoires
    const filtered = sourceDataset
      .filter(p => p.id !== product.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
    
    return filtered;
  })();

  const { format: formatPrice } = usePrice();

  // Helper pour déterminer la catégorie d'un produit
  const getProductCategory = (prod) => {
    // Vérifier dans quel dataset se trouve le produit
    if (telephone_accessoires.find(p => p.id === prod.id)) return 'telephone_accessoires';
    if (chaussure.find(p => p.id === prod.id)) return 'chaussure';
    if (sacs.find(p => p.id === prod.id)) return 'sacs';
    if (bijoux_accessoires.find(p => p.id === prod.id)) return 'bijoux';
    if (vetement_homme.find(p => p.id === prod.id)) return 'homme';
    if (vetement_femme.find(p => p.id === prod.id)) return 'femme';
    return 'homme'; // Par défaut
  };

  // Helpers to convert color names (often in French) to CSS color values (hex)
  const colorNameToHexMap = {
    'noir': '#000000',
    'blanc': '#ffffff',
    'rouge': '#ff3b30',
    'bleu': '#007aff',
    'vert': '#34c759',
    'jaune': '#ffcc00',
    'gris': '#9ca3af',
    'marron': '#8B4513',
    'rose': '#ff2d95',
    'violet': '#800080',
    'beige': '#f5f5dc',
    'orange': '#ff9500',
    'kaki': '#78866b',
    'brown': '#8B4513'
  };

  const toHex = (col) => {
    if (!col) return null;
    const s = String(col).trim();
    // If already a hex or rgb/rgba value, return as-is
    if (s.startsWith('#') || s.startsWith('rgb')) return s;
    const lower = s.toLowerCase();
    if (colorNameToHexMap[lower]) return colorNameToHexMap[lower];
    // try using the string as a CSS color keyword (browser will resolve it) — fallback to null
    return lower;
  };

  // Basic luminance check for hex colors to choose icon color
  const isLightColor = (hexLike) => {
    if (!hexLike) return false;
    let hex = hexLike;
    // if rgb(...) try to estimate (very basic)
    if (hex.startsWith('rgb')) {
      const nums = hex.match(/\d+/g);
      if (!nums) return false;
      const r = +nums[0], g = +nums[1], b = +nums[2];
      const lum = (0.299*r + 0.587*g + 0.114*b) / 255;
      return lum > 0.75;
    }
    if (!hex.startsWith('#')) {
      // unknown keyword — assume dark
      return false;
    }
    // normalize #RGB to #RRGGBB
    if (hex.length === 4) {
      hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    const lum = (0.299*r + 0.587*g + 0.114*b) / 255;
    return lum > 0.75;
  };

  const calculateDiscount = () => {
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  };

  const totalPrice = product?.price ? product.price * quantity : 0;

  // derive if product is shoe
  const isShoe = (product?.category && /shoe|chauss|chaussure|sneaker/i.test(product.category)) || (product?.name && /shoe|chauss|chaussure|sneaker/i.test(product.name))

  // initialize brands selection if product has clothbrands
  useEffect(() => {
    if (product?.clothbrands && Array.isArray(product.clothbrands)) {
      setSelectedBrands([])
      setAllBrandsSelected(false)
    }
  }, [product?.id])

  // Ensure quantity starts at product.minOrder when a product is loaded/changed
  useEffect(() => {
    const min = product?.minOrder || 1;
    setQuantity(min);
  }, [product?.id]);

  // build a simulated size->color availability map for shoes (if not provided) - Ancien système
  useEffect(() => {
    if (!product) return;
    // Ce useEffect est pour l'ancien système de chaussures (basé sur isShoe)
    // Les nouvelles chaussures utilisent product.productType === 'shoe'
    if (!isShoe || product.productType === 'shoe') return
    const colors = product.colors && product.colors.length ? product.colors : ['Noir']
    // default shoe sizes (EU)
    const defaultSizes = [36,37,38,39,40,41,42,43,44,45]
    const map = {}
    colors.forEach((c, idx) => {
      // create a pseudo-random subset based on color index so it's stable per render
      const start = idx % (defaultSizes.length - 4)
      const count = 5 + (idx % 3) // between 5 and 7 sizes
      map[c] = defaultSizes.slice(start, Math.min(start + count, defaultSizes.length))
    })
    setSizeMap(map)
    // set default selected color(s)/size: select first color by default
    setSelectedColors([colors[0]])
    setSelectedSize(map[colors[0]] ? map[colors[0]][0] : null)
  }, [product?.id, isShoe])

  // Initialiser selectedSizes pour les nouvelles chaussures
  useEffect(() => {
    if (!product) return;
    if (product.productType === 'shoe') {
      // Pour les nouvelles chaussures, on réinitialise selectedSizes
      setSelectedSizes([]);
      setSelectedSize(null);
    }
  }, [product?.id, product?.productType]);

  // for non-shoe products, pick a default size when product changes
  useEffect(() => {
    if (!product) return;
    // for non-shoe products we clear single-size (used for shoes) and reset multi-selection
    if (isShoe || product.productType === 'shoe') return;
    if (product.sizes && product.sizes.length) {
      setSelectedSize(null);
      setSelectedSizes([]);
    } else {
      setSelectedSize(null);
      setSelectedSizes([]);
    }
  }, [product?.id, isShoe]);

  // Scroll to top when component mounts or product changes
  useEffect(() => {
    if (!product) return;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [product?.id]);

  // when selectedImage changes ensure its thumbnail is visible in the horizontal list
  useEffect(() => {
    if (!product || !thumbsRef.current) return;
    const el = thumbsRef.current[selectedImage];
    if (el && typeof el.scrollIntoView === 'function') {
      try {
        el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      } catch (e) {
        // fallback: set scrollLeft on container
        if (thumbsContainerRef.current) {
          const container = thumbsContainerRef.current;
          const left = el.offsetLeft - (container.offsetWidth / 2) + (el.offsetWidth / 2);
          container.scrollTo({ left, behavior: 'smooth' });
        }
      }
    }
  }, [selectedImage, product?.images?.length, product]);

  // Afficher un message de chargement si le produit n'est pas encore chargé
  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement du produit...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <nav className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-1 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>
            {/* <span>/</span>
            <span>{product.category}</span> */}
            <span>/</span>
            <span className="text-gray-900 truncate">{product.name}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galerie d'images */}
          <div className="space-y-4">
              {/* Image principale - slider */}
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <AnimatePresence initial={false} mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={product.images[selectedImage]}
                    alt={`${product.name} - vue ${selectedImage + 1}`}
                    className="w-full h-full object-cover absolute inset-0"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(e, info) => {
                      if (info.offset.x > 50) {
                        // swipe right -> previous
                        setSelectedImage((i) => (i - 1 + product.images.length) % product.images.length);
                      } else if (info.offset.x < -50) {
                        // swipe left -> next
                        setSelectedImage((i) => (i + 1) % product.images.length);
                      }
                    }}
                  />
                </AnimatePresence>

                {/* Prev / Next buttons */}
                <button
                  aria-label="Image précédente"
                  onClick={() => setSelectedImage((i) => (i - 1 + product.images.length) % product.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  aria-label="Image suivante"
                  onClick={() => setSelectedImage((i) => (i + 1) % product.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Dots inside the main image frame (center bottom) */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-3 flex items-center space-x-2 bg-black/40 px-3 py-1 rounded">
                  {product.images.map((_, idx) => (
                    <button
                      key={idx}
                      aria-label={`Aller à l'image ${idx + 1}`}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-2 h-2 rounded-full ${selectedImage === idx ? 'bg-white' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </div>

            {/* Miniatures + pagination */}
            <div className="mt-3">
              {/* Thumbnails horizontal inside a relative container so dots can be placed inside */}
              <div ref={thumbsContainerRef} className="relative">
                <div className="flex gap-3 overflow-hidden flex-nowrap">
                  {product.images.map((image, index) => (
                    <button
                      ref={(el) => (thumbsRef.current[index] = el)}
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-black' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Vue ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                {/* (dots moved to main image frame) */}
              </div>
            </div>
          </div>

          {/* Informations produit */}
          <div className="space-y-6">
            {/* En-tête */}
            <div>
              {/* Badge type de chaussure */}
              {product.shoeType && (
                <div className="mb-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                    product.shoeType === 'homme' ? 'bg-blue-100 text-blue-700' :
                    product.shoeType === 'femme' ? 'bg-pink-100 text-pink-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {product.shoeType === 'homme' ? '👨 Chaussures Homme' : 
                     product.shoeType === 'femme' ? '👩 Chaussures Femme' : 
                     '👶 Chaussures Enfant'}
                  </span>
                </div>
              )}
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                {product.name}
              </h1>
            </div>

            {/* Prix */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-xl line-through text-gray-400">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                      -{calculateDiscount()}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Informations importantes */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Commande minimum:</span>
                <span className="font-medium">
                  {product.minOrder} {product.minOrder > 1 ? 'unités' : 'unité'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Fiscalité:</span>
                <span className={`font-medium ${
                  product.taxType === 'ttc' ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {product.taxType === 'ttc' ? 'TTC (Transport inclus)' : 'HT (Hors transport)'}
                </span>
              </div>

              {/* Message Groupage */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="col-span-2 mt-2"
              >
                <button
                  onClick={() => setShowContactModal(true)}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
                >
                  <Package className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Pour participer à un groupage, veuillez nous contacter</span>
                  <MessageCircle className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </div>

            {/* Multimarque */}
            {product.clothbrands && Array.isArray(product.clothbrands) && product.clothbrands.length > 0 && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">
                    {product.productType === 'shoe' ? 'Marques de chaussures disponibles' : 'Marques disponibles'}
                  </h4>
                  <button
                    onClick={() => {
                      if (allBrandsSelected) {
                        setSelectedBrands([])
                        setAllBrandsSelected(false)
                      } else {
                        setSelectedBrands(product.clothbrands.slice())
                        setAllBrandsSelected(true)
                      }
                    }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {allBrandsSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {product.clothbrands.map((b) => {
                    const checked = selectedBrands.includes(b)
                    return (
                      <label key={b} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedBrands(prev => {
                                const next = [...prev, b]
                                if (next.length === product.clothbrands.length) setAllBrandsSelected(true)
                                return next
                              })
                            } else {
                              setSelectedBrands(prev => prev.filter(x => x !== b))
                              setAllBrandsSelected(false)
                            }
                          }}
                          className="cursor-pointer"
                        />
                        <span className="text-sm">{b}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Couleurs */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-900">Couleur</label>
                <div className="flex items-center space-x-2 mt-2">
                  {product.colors.map((c) => {
                    const hex = toHex(c);
                    const checked = selectedColors.includes(c);
                    return (
                      <button
                        key={c}
                        onClick={() => {
                          setSelectedColors(prev => {
                            const exists = prev.includes(c);
                            let next;
                            if (exists) {
                              next = prev.filter(x => x !== c);
                            } else {
                              next = [...prev, c];
                            }
                            // if this is the first selection (prev was empty) and shoe, set default size
                            if (!exists && next.length === 1 && isShoe && sizeMap[c] && sizeMap[c].length) {
                              setSelectedSize(sizeMap[c][0]);
                            }
                            // if we removed the last selected color, clear size selection
                            if (exists && next.length === 0) {
                              setSelectedSize(null);
                            }
                            return next;
                          })
                        }}
                        className={`w-9 h-9 rounded-full border-2 flex items-center justify-center ${checked ? 'ring-2 ring-offset-1 ring-blue-500' : ''}`}
                        title={c}
                        style={{ backgroundColor: hex || undefined }}
                      >
                        <span className="sr-only">{c}</span>
                        {/* show a check when selected, adapt color for contrast */}
                        {checked && (
                          <Check className={`w-4 h-4 ${isLightColor(hex) ? 'text-black' : 'text-white'}`} />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Pointures pour chaussures - Sélection multiple */}
            {product.productType === 'shoe' && product.sizes && product.sizes.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <span>Pointures disponibles (sélection multiple)</span>
                    {product.shoeType && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white">
                        {product.shoeType === 'homme' ? '👨 Homme (39-46)' : 
                         product.shoeType === 'femme' ? '👩 Femme (35-42)' : 
                         '👶 Enfant (24-38)'}
                      </span>
                    )}
                  </label>
                  {selectedSizes.length > 0 && (
                    <button
                      onClick={() => setSelectedSizes([])}
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      Tout désélectionner
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.sizes.map(size => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() => {
                          setSelectedSizes(prev => {
                            if (prev.includes(size)) {
                              return prev.filter(s => s !== size);
                            } else {
                              return [...prev, size];
                            }
                          });
                        }}
                        className={`px-4 py-2 border-2 rounded-lg font-semibold transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105' 
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                        }`}
                      >
                        {size}
                        {isSelected && (
                          <Check className="inline-block w-4 h-4 ml-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
                {selectedSizes.length === 0 && (
                  <p className="text-sm text-orange-600 mt-2">⚠️ Veuillez sélectionner au moins une pointure</p>
                )}
                {selectedSizes.length > 0 && (
                  <div className="mt-3 p-2 bg-white rounded border border-blue-300">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">{selectedSizes.length}</span> pointure{selectedSizes.length > 1 ? 's' : ''} sélectionnée{selectedSizes.length > 1 ? 's' : ''}: 
                      <span className="ml-2 font-medium text-blue-700">
                        {selectedSizes.sort((a, b) => Number(a) - Number(b)).join(', ')}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Tailles pour chaussures (ancien système - liées à la couleur) */}
            {isShoe && !product.productType && selectedColors.length > 0 && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-900">Tailles disponibles ({selectedColors[0]})</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(sizeMap[selectedColors[0]] || []).map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1 border rounded ${selectedSize === size ? 'bg-blue-600 text-white' : 'bg-white'} `}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tailles pour vêtements (non-chaussures) */}
            {!isShoe && product.sizes && product.sizes.length > 0 && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-900">Tailles</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.sizes.map(size => {
                    const checked = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() => {
                          setSelectedSizes(prev => {
                            if (prev.includes(size)) return prev.filter(s => s !== size);
                            return [...prev, size];
                          })
                        }}
                        className={`px-3 py-1 border rounded ${checked ? 'bg-blue-600 text-white' : 'bg-white'}`}
                        aria-pressed={checked}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quantité */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-900">
                Quantité:
              </label>
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(product.minOrder, quantity - 1))}
                    className={`p-3 transition-colors ${quantity <= (product?.minOrder || 1) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                    disabled={quantity <= (product?.minOrder || 1)}
                    aria-label="Diminuer la quantité"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 min-w-12 text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  Minimum: {product.minOrder} unité{product.minOrder > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Prix total */}
            <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full ${product.taxType === 'ttc' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                {product.taxType === 'ttc' 
                  ? 'Prix TTC - Transport inclus' 
                  : 'Prix HT - Transport non inclus'
                }
              </p>
            </div>

            {/* Spécifications: affichage spécial pour les téléphones */}
            {(
              // Condition: produit dans dataset telephone_accessoires ou spécifications présentes
              (getProductCategory(product) === 'telephone_accessoires') || (product.specifications && Object.keys(product.specifications).length > 0)
            ) && (
              <div className="mt-6 p-6 bg-white rounded-lg border border-gray-200">
                <h4 className="text-lg font-semibold mb-4">Spécifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.specifications && Object.keys(product.specifications).length > 0 ? (
                    Object.entries(product.specifications).map(([k, v]) => (
                      <div key={k} className="flex flex-col">
                        <span className="text-sm text-gray-500">{k}</span>
                        <span className="font-medium text-gray-800">{String(v)}</span>
                      </div>
                    ))
                  ) : (
                    // Fallback: utiliser features si pas de spécifications structurées
                    product.features && product.features.length > 0 ? (
                      product.features.map((f, idx) => (
                        <div key={idx} className="flex flex-col">
                          <span className="font-medium text-gray-800">{f}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-600">Aucune spécification disponible pour ce produit.</p>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Actions - Boutons améliorés */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
              <button
                onClick={() => {
                  // Validation pour les chaussures
                  if (product.productType === 'shoe' && selectedSizes.length === 0) {
                    showToast('⚠️ Veuillez sélectionner au moins une pointure', 'warning');
                    return;
                  }
                  
                  // Validation pour les vêtements non-chaussures
                  if (!product.productType && !isShoe && selectedSizes.length === 0 && product.sizes && product.sizes.length > 0) {
                    showToast('⚠️ Veuillez sélectionner au moins une taille', 'warning');
                    return;
                  }
                  
                  const options = {
                    brands: selectedBrands,
                    colors: selectedColors,
                    sizes: selectedSizes // Toujours utiliser selectedSizes (tableau)
                  };
                  const payload = {
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.images && product.images[0],
                    quantity,
                    minOrder: product.minOrder,
                    taxType: product.taxType,
                    options
                  };
                  addItem(payload);
                  // quick UX feedback
                  showToast('✅ Produit ajouté au panier avec succès !', 'success');
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-[1.02]"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Ajouter au panier</span>
              </button>
              {/* Handler pour Acheter maintenant : ajoute au panier puis redirige vers la page de checkout */}
              <button
                onClick={() => {
                  // Validation pour les chaussures
                  if (product.productType === 'shoe' && selectedSizes.length === 0) {
                    showToast('⚠️ Veuillez sélectionner au moins une pointure', 'warning');
                    return;
                  }
                  // Validation pour les vêtements non-chaussures
                  if (!product.productType && !isShoe && selectedSizes.length === 0 && product.sizes && product.sizes.length > 0) {
                    showToast('⚠️ Veuillez sélectionner au moins une taille', 'warning');
                    return;
                  }

                  const options = {
                    brands: selectedBrands,
                    colors: selectedColors,
                    sizes: selectedSizes
                  };

                  const payload = {
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.images && product.images[0],
                    quantity,
                    minOrder: product.minOrder,
                    taxType: product.taxType,
                    options
                  };

                  // Ajouter au panier puis rediriger vers Checkout
                  addItem(payload);
                  showToast('✅ Produit ajouté. Redirection vers le paiement...', 'success');
                  // Petit délai pour montrer le toast puis rediriger
                  setTimeout(() => {
                    navigate('/Checkout');
                  }, 500);
                }}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-[1.02]"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Achetez et payez</span>
              </button>
            </div>

            {/* Actions secondaires */}
            <div className="flex space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Heart className="w-5 h-5" />
                <span>Ajouter aux favoris</span>
              </button>
              
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Share2 className="w-5 h-5" />
                <span>Partager</span>
              </button>
            </div>
          </div>
        </div>

        {/* Produits similaires */}
        {similarProducts.length > 0 && (
          <div className="mt-16 border-t border-gray-200 pt-16">
            {/* Message Groupage */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-blue-200 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
                    📦 Option Groupage Disponible
                  </h4>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Le groupage vous permet de commander une seule pièce de ce produit au lieu de la quantité minimale habituelle. 
                    <span className="font-semibold text-blue-600"> Économisez et commandez exactement ce dont vous avez besoin !</span>
                  </p>
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg group"
                  >
                    <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Contactez-nous pour plus d'informations</span>
                  </button>
                </div>
              </div>
            </motion.div>
            
            <h3 className="text-2xl font-semibold mb-8">Produits similaires</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {similarProducts.map((similarProduct) => (
                <motion.div
                  key={similarProduct.id}
                  whileHover={{ y: -4 }}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => {
                    // Déterminer la catégorie du produit similaire
                    const category = getProductCategory(similarProduct);
                    navigate(`/product/${category}/${similarProduct.id}`);
                  }}
                >
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={similarProduct.image}
                      alt={similarProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-2 sm:p-3 md:p-4">
                    <h4 className="font-medium text-gray-900 mb-1 sm:mb-2 line-clamp-2 text-xs sm:text-sm md:text-base">
                      {similarProduct.name}
                    </h4>
                    
                    <div className="flex items-center space-x-1 sm:space-x-2 mb-2 sm:mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-2 h-2 sm:w-3 sm:h-3 ${
                              i < Math.floor(similarProduct.rating || 4)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <div className="flex items-center space-x-1 sm:space-x-2 flex-wrap">
                        <span className="font-bold text-gray-900 text-sm sm:text-base md:text-lg">
                          {formatPrice(similarProduct.price)}
                        </span>
                        {similarProduct.originalPrice > similarProduct.price && (
                          <span className="text-xs sm:text-sm line-through text-gray-400">
                            {formatPrice(similarProduct.originalPrice)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm text-gray-600 gap-1">
                        <span className="truncate">Min: {similarProduct.minOrder}</span>
                        <span className={similarProduct.taxType === 'ttc' ? 'text-green-600' : 'text-orange-600'}>
                          {similarProduct.taxType === 'ttc' ? 'TTC' : 'HT'}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
      
      {/* Contact Modal */}
      <ContactModal 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)} 
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed top-8 right-8 z-[9999] max-w-md"
          >
            <div className={`
              ${toast.type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 
                toast.type === 'warning' ? 'bg-gradient-to-r from-orange-500 to-amber-600' : 
                'bg-gradient-to-r from-red-500 to-rose-600'}
              text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 backdrop-blur-sm
            `}>
              <div className="flex-shrink-0">
                {toast.type === 'success' ? (
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-lg">{toast.message}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;