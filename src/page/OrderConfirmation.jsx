import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Download, Share2, Printer, Mail, Clock, Truck, Shield, Copy, MessageCircle, ExternalLink, Package, CreditCard } from 'lucide-react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { usePrice } from '../hooks/usePrice';
import { useLocation, useNavigate } from 'react-router-dom';
import { getPaymentMethod, formatPaymentSteps } from '../data/payments';
import { useTranslation } from '../hooks/useTranslation';
import { sendOrderEmail, initEmailJS } from '../services/emailService';

const OrderConfirmation = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [emailStatus, setEmailStatus] = useState({ sent: false, error: null });

  // Initialiser EmailJS au chargement
  useEffect(() => {
    initEmailJS();
  }, []);

  // Fonction de génération de code de commande
  const generateOrderCode = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `ORD-${timestamp}${random}`;
  };

  // Récupération des données de commande
  useEffect(() => {
    // Essayer de récupérer depuis location.state
    if (location.state?.order) {
      setOrderData(location.state.order);
    } else {
      // Fallback vers localStorage si location.state n'existe pas
      try {
        const savedOrder = localStorage.getItem('lastOrder');
        if (savedOrder) {
          setOrderData(JSON.parse(savedOrder));
        } else {
          // Rediriger vers la page d'accueil si aucune commande n'est trouvée
          console.warn('Aucune commande trouvée');
          navigate('/');
        }
      } catch (err) {
        console.error('Erreur lors de la récupération de la commande', err);
        navigate('/');
      }
    }
  }, [location.state, navigate]);

  // Scroll vers le haut au chargement de la page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Si les données ne sont pas encore chargées, afficher un loader
  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t.orderConfirmation.loading}</p>
        </div>
      </div>
    );
  }

  // Construire l'objet order à partir des données reçues
  const order = {
    number: orderData.orderNumber,
    date: orderData.date,
    status: orderData.status || t.orderConfirmation.awaitingPayment,
    items: orderData.items.map((item, index) => ({
      id: index + 1,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      taxType: 'ttc'
    })),
    shipping: {
      method: orderData.shippingAddress?.country ? `Livraison internationale` : "Transport Standard",
      cost: orderData.totals?.shipping || 0,
      delivery: "7-15 jours",
      address: `${orderData.shippingAddress?.address || ''}, ${orderData.shippingAddress?.city || ''}, ${orderData.shippingAddress?.country || ''}`
    },
    customer: {
      name: orderData.billingAddress?.name || `${orderData.billingAddress?.firstName} ${orderData.billingAddress?.lastName}`,
      email: orderData.contact?.email || orderData.billingAddress?.email || '',
      phone: orderData.contact?.phone || orderData.billingAddress?.phone || ''
    },
    subtotal: orderData.totals?.subtotal || 0,
    shippingCost: orderData.totals?.shipping || 0,
    tax: orderData.totals?.tax || 0,
    total: orderData.totals?.total || orderData.total || 0
  };

  const { format: formatPrice } = usePrice();
  
  // Récupérer la méthode de paiement sélectionnée
  const paymentMethodId = orderData.paymentMethod || 'orange';
  const currentPayment = getPaymentMethod(paymentMethodId);
  
  // Formater les étapes avec les vraies données
  const paymentSteps = currentPayment ? formatPaymentSteps(
    paymentMethodId, 
    order.number, 
    formatPrice(order.total).replace(/\s/g, ' ')
  ) : [];

  const handleScreenshotUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Vérifier que c'est une image
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image valide');
        return;
      }
      
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image trop volumineuse. Max: 5MB');
        return;
      }
      
      setScreenshot(URL.createObjectURL(file));
      setScreenshotFile(file);
      setIsUploaded(true);
    }
  };

  const handleConfirmPayment = async () => {
    setIsSubmitting(true);
    setEmailStatus({ sent: false, error: null });
    
    try {
      // Envoyer l'email avec les données de commande et la capture
      const result = await sendOrderEmail(orderData, screenshotFile);
      
      if (result.success) {
        console.log('✅ Email envoyé avec succès!');
        setEmailStatus({ sent: true, error: null });
        setIsConfirmed(true);
      } else {
        console.error('❌ Erreur envoi email:', result.error);
        setEmailStatus({ sent: false, error: 'Erreur lors de l\'envoi' });
        // On confirme quand même la commande
        setIsConfirmed(true);
      }
    } catch (error) {
      console.error('❌ Erreur inattendue:', error);
      setEmailStatus({ sent: false, error: 'Erreur inattendue' });
      setIsConfirmed(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-24">
      <Header/>
      <div className="max-w-8xl mx-auto px-4 pt-5">
        {/* En-tête de confirmation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mb-4 shadow-lg">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            {isConfirmed ? 'Commande Confirmée avec Succès !' : 'Commande Enregistrée avec Succès !'}
          </h1>
          <p className="text-gray-600 text-lg">
            {isConfirmed 
              ? 'Votre commande a été enregistrée. Nous la traiterons dès réception de votre paiement.'
              : 'Veuillez confirmer votre paiement en envoyant la capture d\'écran de votre transaction.'
            }
          </p>
        </motion.div>

        <AnimatePresence>
          {isConfirmed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-lg border border-green-200 p-8 mb-8 hover:shadow-xl transition-shadow"
            >
              <div className="text-center">
                {/* Instructions pour récupération */}
                <div className="bg-blue-50 rounded-xl p-6 mb-6 text-left">
                  <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center space-x-2">
                    <MessageCircle className="w-6 h-6" />
                    <span>{t.orderConfirmation.pickupTitle}</span>
                  </h3>
                  
                  <div className="space-y-4">
                    <p className="text-blue-800">
                      <strong>{t.orderConfirmation.contactRepresentative}</strong> {t.orderConfirmation.contactDesc} :
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* WhatsApp */}
                      <button
                        onClick={() => {
                          // Ouvre le widget Tawk.to (ou le charge si nécessaire)
                          if (window.Tawk_API && typeof window.Tawk_API.maximize === 'function') {
                            try { window.Tawk_API.maximize(); } catch (e) {}
                          } else {
                            // Charger le script Tawk si il n'est pas encore présent
                            if (!window.Tawk_API) {
                              window.Tawk_API = window.Tawk_API || {};
                              window.Tawk_LoadStart = new Date();
                              const s1 = document.createElement('script');
                              s1.async = true;
                              s1.src = 'https://embed.tawk.to/6963b526d00da4197cacc860/1jemnn8j9';
                              s1.charset = 'UTF-8';
                              s1.setAttribute('crossorigin', '*');
                              const s0 = document.getElementsByTagName('script')[0];
                              s0.parentNode.insertBefore(s1, s0);
                              s1.onload = () => {
                                try { window.Tawk_API.maximize && window.Tawk_API.maximize(); } catch (e) {}
                              };
                            }
                          }
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg transition-colors flex items-center justify-center space-x-3"
                      >
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                          <span className="text-green-500 text-lg">💬</span>
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">WhatsApp</div>
                          <div className="text-sm opacity-90">+ 8 78 89 88 89</div>
                        </div>
                        <MessageCircle className="w-4 h-4" />
                      </button>

                      {/* Telegram */}
                      <a
                        href="https://t.me/chinatradehub"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg transition-colors flex items-center justify-center space-x-3"
                      >
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                          <span className="text-blue-500 text-lg">✈️</span>
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">Telegram</div>
                          <div className="text-sm opacity-90">@SinoTrade</div>
                        </div>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <p className="text-sm text-blue-800 text-center">
                        <strong>{t.orderConfirmation.important} :</strong> {t.orderConfirmation.presentOrderNumber} <br />
                        <span className="font-mono text-blue-900">{order.number}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Prochaines étapes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">{t.orderConfirmation.preparation}</h4>
                    <p className="text-sm text-gray-600">{t.orderConfirmation.preparationTime}</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Truck className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">{t.orderConfirmation.expedition}</h4>
                    <p className="text-sm text-gray-600">{t.orderConfirmation.expeditionTime}</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <MessageCircle className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">{t.orderConfirmation.deliveryContact}</h4>
                    <p className="text-sm text-gray-600">{t.orderConfirmation.contactUs}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 justify-center">
                  <button 
                    onClick={() => navigate('/')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center space-x-2 shadow-lg hover:shadow-xl"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Retour à l'Accueil</span>
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center space-x-2">
                    <Mail className="w-5 h-5" />
                    <span>{t.orderConfirmation.emailReceipt}</span>
                  </button>
                  <button className="border border-gray-300 hover:border-gray-400 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors flex items-center space-x-2">
                    <Printer className="w-5 h-5" />
                    <span>{t.orderConfirmation.print}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {!isConfirmed && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Colonne gauche - Instructions de paiement */}
            <div className="space-y-6">
              {/* Numéro de commande */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">{t.orderConfirmation.orderSummary}</h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => copyToClipboard(order.number)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {order.number}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>{t.orderConfirmation.date}: {order.date}</div>
                    <div className="flex items-center justify-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{t.orderConfirmation.status}: {order.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions de paiement */}
              {currentPayment && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        {currentPayment.icon === 'card' ? (
                          <CreditCard className="w-5 h-5 text-white" />
                        ) : (
                          <span className="text-white font-bold text-sm">{currentPayment.icon}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-900">
                          {t.orderConfirmation.paymentMethod}: {currentPayment.name}
                        </h2>
                        <p className="text-xs text-gray-600">{currentPayment.description}</p>
                      </div>
                    </div>
                    
                    {/* Logos des moyens de paiement */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {currentPayment.logos.map((logo, index) => (
                        <div 
                          key={index}
                          className="h-10 px-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center"
                        >
                          <img 
                            src={logo} 
                            alt={`${currentPayment.name} logo ${index + 1}`}
                            className="h-8 max-w-[80px] object-contain"
                            onError={(e) => {
                              console.error(`Erreur de chargement de l'image: ${logo}`);
                              e.target.parentElement.style.display = 'none';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {/* Détails du bénéficiaire */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-1">{t.checkout.paymentMethod}</div>
                        <div className="font-semibold text-gray-900">{currentPayment.details.name}</div>
                        <div className="text-lg font-bold text-blue-600 mt-2">
                          {currentPayment.details.value}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{currentPayment.details.type}</div>
                      </div>
                    </div>

                    {/* Étapes de paiement */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900 mb-4">{t.orderConfirmation.paymentInstructions}:</h3>
                      {paymentSteps.map((step, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-gray-700 leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>

                    {/* Montant à payer */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                      <div className="text-center">
                        <div className="text-sm text-yellow-800 mb-1">{t.cart.total}</div>
                        <div className="text-2xl font-bold text-yellow-900">
                          {formatPrice(order.total)}
                        </div>
                        <div className="text-sm text-yellow-700 mt-1">
                          {t.orderConfirmation.orderNumber}: {order.number}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload de capture */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {t.orderConfirmation.confirmPayment}
                    </h2>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="text-center">
                    {!isUploaded ? (
                      <>
                        <div className="mb-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Download className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-600 mb-4">
                            {t.orderConfirmation.screenshotDesc}
                          </p>
                        </div>
                        
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleScreenshotUpload}
                            className="hidden"
                          />
                          <div className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors inline-block">
                            {t.orderConfirmation.uploadScreenshot}
                          </div>
                        </label>
                      </>
                    ) : (
                      <>
                        <div className="mb-4">
                          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
                          <p className="text-green-600 font-semibold mb-2">
                            {t.orderConfirmation.uploaded}
                          </p>
                          <p className="text-gray-600">
                            {t.orderConfirmation.confirmPayment}
                          </p>
                        </div>
                        <div className="max-w-xs mx-auto mb-4">
                          <img
                            src={screenshot}
                            alt="Capture de paiement"
                            className="w-full h-auto rounded-lg border border-gray-200"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Bouton de confirmation */}
                  {isUploaded && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={handleConfirmPayment}
                      disabled={isSubmitting}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 mt-4"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>{t.orderConfirmation.uploading}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span>{t.orderConfirmation.confirmPayment}</span>
                        </>
                      )}
                    </motion.button>
                  )}

                  {/* Notification de statut d'envoi */}
                  {emailStatus.sent && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <p className="text-sm text-green-800 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        <strong>✅ Email envoyé avec succès !</strong> Vous recevrez la commande dans votre boîte email.
                      </p>
                    </motion.div>
                  )}
                  
                  {emailStatus.error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                    >
                      <p className="text-sm text-yellow-800">
                        ⚠️ <strong>Commande confirmée</strong> mais l'email n'a pas pu être envoyé. Nous vous contacterons prochainement.
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Colonne droite - Détails de la commande */}
            <div className="space-y-6">
              {/* Récapitulatif de commande */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {t.orderConfirmation.orderDetails}
                    </h2>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Articles */}
                  <div className="space-y-4 mb-6">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex space-x-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 line-clamp-2">
                            {item.name}
                          </h4>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-sm text-gray-600">
                              {item.quantity} × {formatPrice(item.price)}
                            </span>
                            <span className="font-medium">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t.cart.subtotal}</span>
                      <span>{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t.cart.shipping}</span>
                      <span>{formatPrice(order.shippingCost)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t.cart.taxes}</span>
                      <span>{formatPrice(order.tax)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>{t.cart.total}</span>
                      <span className="text-green-600">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations importantes */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md p-6 border border-blue-100">
                <h3 className="font-semibold text-blue-900 mb-4 flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <span>{t.orderConfirmation.paymentInfo}</span>
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• {t.orderConfirmation.copyOrderNumber}</li>
                  <li>• {t.orderConfirmation.delivery}</li>
                  <li>• WhatsApp 24/7</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
            {/* Espacement avant le footer */}
      <div className="h-24"></div>
        <Footer />
     
    </div>
  );
};

export default OrderConfirmation;