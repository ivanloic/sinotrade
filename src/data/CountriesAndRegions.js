const CountriesAndRegions = [
  {
    country: "United States",
    regions: ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]
  },
  {
    country: "Canada",
    regions: ["Alberta","British Columbia","Manitoba","New Brunswick","Newfoundland and Labrador","Nova Scotia","Ontario","Prince Edward Island","Quebec","Saskatchewan"]
  },
  {
    country: "Australia",
    regions: ["Australian Capital Territory","New South Wales","Northern Territory","Queensland","South Australia","Tasmania","Victoria","Western Australia"]
  },
  {
    country: "India",
    regions: ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"]
  },
  {
    country: "United Kingdom",
    regions: ["England","Northern Ireland","Scotland","Wales"]
  },

  // ★★ 10 PRINCIPAUX PAYS D'AMÉRIQUE ★★
  { country: "Brazil", regions: ["São Paulo", "Rio de Janeiro", "Bahia", "Minas Gerais", "Paraná", "Pernambuco", "Santa Catarina", "Goiás", "Ceará", "Amazonas"] },
  { country: "Mexico", regions: ["Mexico City", "Jalisco", "Nuevo León", "Puebla", "Chiapas", "Veracruz", "Yucatán", "Guanajuato", "Oaxaca", "Sonora"] },
  { country: "Argentina", regions: ["Buenos Aires", "Córdoba", "Santa Fe", "Mendoza", "Tucumán", "Entre Ríos", "Misiones", "Salta", "Formosa", "Chubut"] },
  { country: "Chile", regions: ["Santiago", "Valparaíso", "Biobío", "Araucanía", "Antofagasta", "Los Lagos", "Maule", "Atacama", "Tarapacá", "Aysén"] },
  { country: "Colombia", regions: ["Bogotá", "Antioquia", "Valle del Cauca", "Atlántico", "Bolívar", "Caldas", "Cauca", "Santander", "Nariño", "Tolima"] },
  { country: "Peru", regions: ["Lima", "Cusco", "Arequipa", "Piura", "Loreto", "Junín", "Ica", "Ayacucho", "Tacna", "Huanuco"] },
  { country: "Venezuela", regions: ["Distrito Capital", "Zulia", "Carabobo", "Lara", "Miranda", "Anzoátegui", "Bolívar", "Falcón", "Mérida", "Táchira"] },
  { country: "Ecuador", regions: ["Pichincha", "Guayas", "Manabí", "Azuay", "Loja", "El Oro", "Santo Domingo", "Esmeraldas", "Chimborazo", "Cotopaxi"] },
  { country: "Uruguay", regions: ["Montevideo", "Canelones", "Maldonado", "Colonia", "San José", "Rivera", "Salto", "Paysandú", "Durazno", "Flores"] },
  { country: "Panama", regions: ["Panamá", "Colón", "Chiriquí", "Veraguas", "Los Santos", "Herrera", "Coclé", "Darién", "Bocas del Toro", "Guna Yala"] },

  // ★★ 10 PAYS D'EUROPE ★★
  { country: "France", regions: ["Île-de-France","Occitanie","Nouvelle-Aquitaine","Auvergne-Rhône-Alpes","Provence-Alpes-Côte d’Azur","Hauts-de-France","Grand Est","Normandie","Bretagne","Bourgogne-Franche-Comté"] },
  { country: "Germany", regions: ["Bavaria","Berlin","Hamburg","Hesse","Saxony","Saxony-Anhalt","Brandenburg","North Rhine-Westphalia","Baden-Württemberg","Thuringia"] },
  { country: "Spain", regions: ["Catalonia","Andalusia","Madrid","Valencia","Galicia","Basque Country","Murcia","Castilla-La Mancha","Castilla y León","Aragon"] },
  { country: "Italy", regions: ["Lombardy","Lazio","Sicily","Tuscany","Veneto","Emilia-Romagna","Piemonte","Puglia","Campania","Sardinia"] },
  { country: "Portugal", regions: ["Lisbon","Porto","Braga","Coimbra","Faro","Setúbal","Aveiro","Beja","Bragança","Guarda"] },
  { country: "Netherlands", regions: ["North Holland","South Holland","Utrecht","Groningen","Limburg","Zeeland","Drenthe","Friesland","Gelderland","Overijssel"] },
  { country: "Belgium", regions: ["Brussels","Flanders","Wallonia"] },
  { country: "Switzerland", regions: ["Zurich","Geneva","Bern","Vaud","Basel-Stadt","Ticino","Valais","Neuchâtel","Fribourg","Schwyz"] },
  { country: "Sweden", regions: ["Stockholm","Skåne","Västra Götaland","Uppsala","Örebro","Halland","Norrbotten","Södermanland","Värmland","Jämtland"] },
  { country: "Greece", regions: ["Attica","Macedonia","Crete","Thessaly","Peloponnese","Epirus","Aegean Islands","Ionian Islands","Thrace","Central Greece"] },

  // ★★ 13 PAYS D'AFRIQUE ★★
  { country: "Cameroon", regions: ["Centre","Littoral","Ouest","Nord","Extrême-Nord","Sud","Sud-Ouest","Nord-Ouest","Est","Adamaoua"] },
  { country: "Nigeria", regions: ["Lagos","Abuja","Kano","Rivers","Kaduna","Oyo","Edo","Delta","Borno","Plateau"] },
  { country: "South Africa", regions: ["Gauteng","Western Cape","KwaZulu-Natal","Eastern Cape","Free State","Limpopo","Mpumalanga","Northern Cape","North West"] },
  { country: "Morocco", regions: ["Casablanca-Settat","Rabat-Salé-Kénitra","Marrakech-Safi","Fès-Meknès","Souss-Massa","Tanger-Tétouan-Al Hoceima","Oriental","Dakhla-Oued Ed-Dahab","Béni Mellal-Khénifra"] },
  { country: "Ivory Coast", regions: ["Abidjan","Yamoussoukro","Bouaké","San Pedro","Korhogo","Man","Daloa","Gagnoa","Odienné","Bondoukou"] },
  { country: "Ghana", regions: ["Greater Accra","Ashanti","Northern","Central","Eastern","Volta","Brong-Ahafo","Upper East","Upper West","Western"] },
  { country: "Kenya", regions: ["Nairobi","Mombasa","Kisumu","Nakuru","Uasin Gishu","Kiambu","Machakos","Meru","Kakamega","Turkana"] },
  { country: "Senegal", regions: ["Dakar","Thiès","Saint-Louis","Ziguinchor","Kaolack","Tambacounda","Fatick","Louga","Kolda","Diourbel"] },
  { country: "Egypt", regions: ["Cairo","Giza","Alexandria","Luxor","Aswan","Dakahlia","Gharbia","Suez","Qena","Fayoum"] },
  { country: "Ethiopia", regions: ["Addis Ababa","Amhara","Tigray","Oromia","Somali","Harari","Dire Dawa","Benishangul-Gumuz","Afar","SNNPR"] },
  { country: "Tunisia", regions: ["Tunis","Sfax","Sousse","Kairouan","Gabès","Bizerte","Ariana","Gafsa","Monastir","Kasserine"] },
  { country: "Algeria", regions: ["Algiers","Oran","Constantine","Annaba","Tamanrasset","Tlemcen","Tindouf","Ghardaïa","Bejaia","Batna"] },
  { country: "Rwanda", regions: ["Kigali","Eastern Province","Western Province","Northern Province","Southern Province"] },
  // À ajouter dans la section Afrique

{ 
  country: "Democratic Republic of Congo",
  regions: ["Kinshasa", "Lubumbashi", "Goma", "Kisangani", "Mbuji-Mayi", "Matadi", "Kananga", "Bukavu", "Kolwezi", "Bunia"]
},

{ 
  country: "Burkina Faso",
  regions: ["Ouagadougou", "Bobo-Dioulasso", "Koudougou", "Ouahigouya", "Fada N'gourma", "Tenkodogo", "Banfora", "Dédougou", "Gaoua", "Kaya"]
},

{ 
  country: "Benin",
  regions: ["Cotonou", "Porto-Novo", "Parakou", "Abomey", "Allada", "Natitingou", "Bohicon", "Djougou", "Ouidah", "Lokossa"]
},


  // ★★ 5 PAYS D'ASIE ★★
  { country: "China", regions: ["Beijing","Shanghai","Guangdong","Sichuan","Zhejiang","Yunnan","Hubei","Jiangsu","Shanxi","Anhui"] },
  { country: "Japan", regions: ["Tokyo","Osaka","Hokkaido","Fukuoka","Nagoya","Kyoto","Okinawa","Hiroshima","Sendai","Kanagawa"] },
  { country: "South Korea", regions: ["Seoul","Busan","Incheon","Daegu","Daejeon","Gwangju","Ulsan","Jeju","Suwon","Changwon"] },
  { country: "Indonesia", regions: ["Jakarta","Bali","Java","Sumatra","Kalimantan","Sulawesi","Papua","Yogyakarta","Riau","Aceh"] },
  { country: "Saudi Arabia", regions: ["Riyadh","Mecca","Medina","Jeddah","Eastern Province","Tabuk","Najran","Qassim","Asir","Hail"] },
];

export default CountriesAndRegions;
