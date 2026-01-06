import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Image as ImageIcon, Send, Package, MessageCircle, ShoppingBag, Globe, Truck, Shield, Clock, Star, TrendingUp, Users } from 'lucide-react';
import Header from '../Components/Header';
import Hero from '../Components/Hero';
import Categories from '../Components/Categories';
import Products from '../Components/Products';
import Services from '../Components/Services';
import Footer from '../Components/Footer';
import ContactModal from '../Components/ContactModal';
import Cart from './Cart';
import Checkout from './Checkout';
import OrderConfirmation from './OrderConfirmation';




function Home () {
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      
      {/* Section Bienvenue et Explication des Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* En-tête de la section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 px-6 py-2 rounded-full text-sm font-semibold mb-4"
            >
              ✨ Bienvenue chez SinoTrade
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Votre Partenaire d'Importation<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                Directe depuis la Chine
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Nous facilitons l'accès aux produits chinois de qualité avec des prix imbattables. 
              Profitez d'une expérience d'achat simplifiée et sécurisée.
            </p>
          </motion.div>

          {/* Grille des services */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Sourcing Direct",
                description: "Accès direct aux fabricants chinois pour les meilleurs prix sans intermédiaires",
                color: "from-blue-500 to-cyan-500",
                bgColor: "bg-blue-50",
                delay: 0.1
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Paiement Sécurisé",
                description: "Transactions 100% sécurisées avec garantie satisfait ou remboursé",
                color: "from-green-500 to-emerald-500",
                bgColor: "bg-green-50",
                delay: 0.2
              },
              {
                icon: <Truck className="w-8 h-8" />,
                title: "Livraison Rapide",
                description: "Expédition mondiale sous 7-15 jours avec suivi en temps réel",
                color: "from-purple-500 to-pink-500",
                bgColor: "bg-purple-50",
                delay: 0.3
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: "Qualité Garantie",
                description: "Produits vérifiés et testés par nos experts qualité avant expédition",
                color: "from-yellow-500 to-orange-500",
                bgColor: "bg-yellow-50",
                delay: 0.4
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Support 24/7",
                description: "Équipe multilingue disponible à tout moment pour vous assister",
                color: "from-indigo-500 to-blue-500",
                bgColor: "bg-indigo-50",
                delay: 0.5
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Prix Compétitifs",
                description: "Économisez jusqu'à 70% par rapport aux prix du marché local",
                color: "from-red-500 to-pink-500",
                bgColor: "bg-red-50",
                delay: 0.6
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: service.delay, duration: 0.5 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className={`${service.bgColor} rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100`}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Section statistiques */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 shadow-2xl"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "50K+", label: "Produits", icon: <ShoppingBag className="w-6 h-6" /> },
                { number: "10K+", label: "Clients Satisfaits", icon: <Users className="w-6 h-6" /> },
                { number: "99%", label: "Taux de Satisfaction", icon: <Star className="w-6 h-6" /> },
                { number: "24/7", label: "Support Client", icon: <Clock className="w-6 h-6" /> }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  className="text-center text-white"
                >
                  <div className="flex justify-center mb-3">
                    {stat.icon}
                  </div>
                  <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                  <div className="text-white/90 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      <Products />
      
      {/* Section Demande de Produit Spécifique */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Partie gauche - Texte */}
              <div className="p-8 lg:p-12">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    🔍 Service Personnalisé
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Vous cherchez un produit spécifique ?
                  </h2>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    Écrivez et envoyez-nous le nom ou l'image du produit que vous souhaitez commander depuis la Chine.
                  </p>
                  
                  {/* Avantages */}
                  <div className="space-y-4 mb-8">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Search className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Recherche facilitée</h3>
                        <p className="text-sm text-gray-600">Envoyez le nom ou une photo du produit</p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Sourcing direct</h3>
                        <p className="text-sm text-gray-600">Nous trouvons les meilleurs fournisseurs en Chine</p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Réponse rapide</h3>
                        <p className="text-sm text-gray-600">Devis sous 24h maximum</p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Bouton Contactez */}
                  <motion.button
                    onClick={() => setShowContactModal(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3 group"
                  >
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    <span className="text-lg">Contactez-nous</span>
                  </motion.button>
                </motion.div>
              </div>

              {/* Partie droite - Illustration */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="relative h-full min-h-[400px] bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8 lg:p-12 flex items-center justify-center"
              >
                <div className="relative z-10 text-center">
                  <motion.div
                    animate={{ 
                      y: [0, -20, 0],
                      rotate: [0, 5, 0, -5, 0]
                    }}
                    transition={{ 
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="mb-8"
                  >
                    <div className="w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center mx-auto">
                      <ImageIcon className="w-16 h-16 text-purple-600" />
                    </div>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Envoyez une image
                  </h3>
                  <p className="text-white/90 text-lg">
                    Nous identifions le produit<br />et vous proposons le meilleur prix
                  </p>
                </div>

                {/* Décorations */}
                <div className="absolute top-10 right-10 w-20 h-20 bg-white/20 rounded-full blur-xl" />
                <div className="absolute bottom-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <Services />
      <Footer />

      {/* Contact Modal */}
      <ContactModal 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)} 
      />
    </div>
  );
}

export default Home ;