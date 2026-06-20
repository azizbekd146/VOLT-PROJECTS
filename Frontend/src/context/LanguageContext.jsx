import React, { createContext, useState, useContext } from "react";

const LanguageContext = createContext();

const translations = {
  uz: {
    // Login & Register
    titleLogin: "Tizimga kirish",
    titleRegister: "Yangi akkaunt yaratish",
    descLogin: "Xush kelibsiz! Davom etish uchun ma'lumotlarni kiriting",
    descRegister: "Barcha imkoniyatlardan foydalanish uchun ro'yxatdan o'ting",
    labelName: "Ism va familiya",
    placeholderName: "To'liq ismingizni kiriting",
    labelEmail: "Elektron pochta",
    labelPassword: "Parol",
    rememberMe: "Meni eslab qol",
    forgotPassword: "Parolni unutdingizmi?",
    btnWait: "Kutib turing...",
    btnRegister: "Ro'yxatdan o'tish",
    btnLogin: "Kirish",
    switchHaveAccount: "Akkauntingiz bormi? ",
    switchNoAccount: "Akkauntingiz yo'qmi? ",
    linkLogin: "Tizimga kiring",
    linkRegister: "Yangi qo'shish (Ro'yxatdan o'tish)",

    // Home Page
    navCatalog: "Katalog",
    navBrands: "Brendlar",
    navReviews: "Sharhlar",
    heroTitle: "Elektromobillar uchun ehtiyot qismlar",
    heroDesc:
      "Barcha turdagi elektromobillar uchun sifatli va kafolatlangan ehtiyot qismlarni bizdan topasiz.",
    heroBtn: "Katalogga o'tish",
    brandsTitle: "Premium Elektromobil Brendlari",
    brandsDesc:
      "Sizning avtomobilingiz uchun eng ishonchli va yuqori sifatli ehtiyot qismlar. O'z modelingizni tanlang.",

    // Admin Dashboard
    adminTitle: "VOLTADMIN",
    adminProducts: "Mahsulotlar",
    adminOrders: "Buyurtmalar",
    adminAIAssistant: "AI Yordamchi",
    adminAITitle: "Sun'iy Intellekt Tahlili",
    adminAIDesc: "Do'koningiz savdosi va mahsulotlari bo'yicha aqlli maslahatlar",
    adminAIGenerate: "Do'konni tahlil qilish",
    adminAILoading: "AI ma'lumotlarni o'rganmoqda...",
    adminAIPlaceholder: "Biznesingiz haqida savol bering...",
    adminAIAsk: "Yuborish",
    adminAIThinking: "AI o'ylamoqda...",
    adminAccount: "Statistika",
    adminAccountTitle: "Statistika",
    adminAccountDesc: "Tizimdagi umumiy tushumlar va statistika",
    adminTotalBalance: "Umumiy tushum (Balans)",
    adminTotalOrders: "Jami buyurtmalar soni",
    adminLogout: "Chiqish",
    adminProductTitle: "Mahsulotlar",
    adminProductDesc: "Barcha ehtiyot qismlarni boshqarish",
    adminAddNew: "Yangi qo'shish",
    tableProduct: "Mahsulot",
    tableBrand: "Brend",
    tablePrice: "Narx",
    tableStatus: "Status",
    tableActions: "Amallar",

    // Modals
    modalAddTitle: "Yangi Mahsulot Qo'shish",
    modalLabelName: "Mahsulot Nomi",
    modalLabelBrand: "Brend",
    modalLabelModel: "Model",
    modalLabelPrice: "Narx",
    modalLabelPart: "Part Number",
    modalLabelImage: "Rasm URL",
    modalLabelStatus: "Status",
    modalLabelNamePlaceholder: "Misol: Tog'li Blok Dvigatel",
    modalLabelBrandPlaceholder: "BYD, Tesla",
    modalLabelModelPlaceholder: "Han EV",
    modalLabelPricePlaceholder: "50000",
    modalLabelPartPlaceholder: "PN-001",
    modalLabelImagePlaceholder: "https://example.com/image.jpg",
    searchPlaceholder: "Qidirish...",
    modalBtnAdd: "Qo'shish",
    modalBtnCancel: "Bekor qilish",

    // Delete Modal
    deleteTitle: "Mahsulotni o'chirish",
    deleteDesc:
      "Rostdan ham ushbu mahsulotni o'chirib tashlamoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.",
    deleteBtnYes: "Ha, o'chirish",
    deleteBtnNo: "Yo'q, qolsin",
    statusInStock: "Omborda",
    statusLowStock: "Kam qolgan",
    statusOutOfStock: "Omborda yo'q",
    productNameAndPriceRequired: "Mahsulot nomi va narxi kiritilishi shart!",
    noOrdersYet: "Hozircha buyurtmalar yo'q",
    noOrdersDesc:
      "Foydalanuvchilar xaridni amalga oshirganda, ularning barcha buyurtmalari shu yerda paydo bo'ladi.",
    brandCarRange: "Masofa",
    brandCarRangeUnit: " km",
    brandCarAcceleration: "Tezlanish (0-100)",
    brandCarAccelerationUnit: "s",
    reviewTitle: "Mijozlar fikri va baholari",
    reviewDesc: "Bizning xizmatlarimiz va mahsulotlarimiz haqida mijozlarimiz nima deydi?",
    reviewNoReviews: "Hozircha fikrlar yo'q. Birinchi bo'lib fikr qoldiring!",
    reviewFormTitle: "Fikr qoldirish",
    reviewLabelName: "Ismingiz",
    reviewPlaceholderName: "Ismingizni kiriting",
    reviewLabelRating: "Baholash",
    reviewLabelComment: "Fikringiz",
    reviewPlaceholderComment: "Mahsulot yoki xizmat haqida o'z fikringizni yozing...",
    reviewBtnSubmit: "Fikrni yuborish",
    footerShop: "Do'kon",
    footerSupport: "Qo'llab-quvvatlash",
    footerShopLinks: [
      "Batareya va Quvvat",
      "Tormoz va Osma",
      "Motorlar va Transmissiya",
      "Zaryadlash",
    ],
    footerSupportLinks: [
      "Buyurtmani kuzatish",
      "Moslik qo'llanmasi",
      "Qaytarish",
      "Biz bilan bog'lanish",
    ],
    footerNewsletterTitle: "Yangiliklardan xabardor bo'ling",
    footerNewsletterDesc: "Yangi ehtiyot qismlar va chegirmalar haqida xabarnomalar.",
    footerNewsletterSubscribed: "Obuna bo'ldingiz — rahmat! Xat pochtangizga yuborildi.",
    footerNewsletterAlert:
      ' manziliga xat yuborildi:\n\n"Sizga ishonchli battery va akkumlyatorlar kerakmi?"',
    footerCopyright: "Barcha huquqlar himoyalangan.",
    footerBuiltFor: "EV aftermarket uchun qurilgan.",
    footerVerifiedFitment: "Tasdiqlangan moslik",
    footerDispatch: "48 soat ichida jo'natish",

    // Profile Page
    profileTitle: "Shaxsiy kabinet",
    profileOrders: "Mening buyurtmalarim",
    profileAddresses: "Saqlangan manzillar",
    profileSettings: "Sozlamalar",
    profileLogout: "Tizimdan chiqish",
    orderId: "Buyurtma ID",
    orderDate: "Sana",
    orderTotal: "Summa",
    statusnew: "Yangi",
    statusready: "Yo'lda",
    statuscompleted: "Yetkazilgan",
    statuscancelled: "Bekor qilingan",
    btnCancelOrder: "Bekor qilish",
    addressHome: "Uy manzili",
    addressWork: "Ish manzili",
    noOrders: "Sizda hozircha buyurtmalar yo'q",

    // Afzalliklar (Advantages)
    advTitle: "Nima uchun aynan biz?",
    advDesc: "Bozordagi boshqa do'konlardan asosiy ustunlik va texnologik farqlarimiz.",
    adv1Title: "AI (Sun'iy Intellekt) Tahlili",
    adv1Desc: "Tizimimiz savdolarni AI orqali tahlil qilib, mijozlarga eng kerakli ehtiyot qismlarni uzluksiz yetkazib beradi.",
    adv2Title: "100% Shaffof Sifat",
    adv2Desc: "Bizda yashirincha 'padelka' sotilmaydi. Har bir mahsulotning 'Original' yoki 'Nusxa' ekanligi ochiq-oydin ko'rsatiladi.",
    adv3Title: "Dinamik Aqlli Katalog",
    adv3Desc: "Bitta avtomobil ostida Fara, Batareya kabi ehtiyot qismlarni o'zgaruvchi narxlarda tezkor va qulay xarid qilish.",
    adv4Title: "Tezkor Telegram & Kuzatuv",
    adv4Desc: "Buyurtmangizni har bir qadamini (Yangi, Yo'lda) jonli kuzatish va Telegram orqali tezkor xabarnomalar qabul qilish.",

    // EV Brands data (moved from BrandsSection.jsx)
    evBrands: [
      {
        name: "BYD",
        desc: "Build Your Dreams",
        car: {
          model: "BYD Han EV",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ33egDiIqIPEg39V5u7QS-7ljmuExoeMRPHDxfXjmYoXBcuPpZlNxD72k&s=10",
          description:
            "Aerodinamik dizayn va yuqori unumdorlikka ega premium elektr sedan. Zamonaviy 'Blade Battery' orqali eng yuqori xavfsizlik ta'minlanadi.",
          range: "715",
          acceleration: "3.9",
        },
      },
      {
        name: "Tesla",
        desc: "Electric Revolution",
        car: {
          model: "Tesla Model S Plaid",
          image:
            "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=1200",
          description:
            "Dunyodagi eng tezkor seriyali elektromobillardan biri. Mutlaqo yangi darajadagi avtopilot va futuristik interyer.",
          range: "600",
          acceleration: "2.1",
        },
      },
      {
        name: "Zeekr",
        desc: "Premium EV",
        car: {
          model: "Zeekr 001",
          image: "https://zeekr-cars.uz/img/001-new-colors/001_new_white.jpg",
          description:
            "Sport va lyuksni o'zida mujassam etgan xetchbek. Pnevmatik osma (suspension) tufayli har qanday yo'lda mukammal qulaylik.",
          range: "700",
          acceleration: "3.8",
        },
      },
      {
        name: "Li Auto",
        desc: "Smart Premium",
        car: {
          model: "Li L9",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ03NJghHnOuAQcdwBhb6mdmgbRHkvm8NrnsyZzUViUDmrxNkUY7dpeY-T&s=10",
          description:
            "Katta va aqlli oilaviy krossover. EREV (masofa uzaytirgich) tizimi yordamida zaryadlashdagi muammolarni to'liq bartaraf etadi.",
          range: "1315",
          acceleration: "5.3",
        },
      },
      {
        name: "NIO",
        desc: "Blue Sky Coming",
        car: {
          model: "NIO ET7",
          image: "https://www.greenncap.com/wp-content/uploads/nio-et7-2022-0094.png",
          description:
            "Avtonom boshqaruvning yangi davri (Aquila super-sezing). Batareyani 5 daqiqada stansiyada almashtirish imkoniyati.",
          range: "1000",
          acceleration: "3.8",
        },
      },
      {
        name: "Xpeng",
        desc: "Future Mobility",
        car: {
          model: "Xpeng P7",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqzmXl0cW2RLPFVvBkRZ7HvkgcsgADEOZJraKORzwxpwuW0F46XCzMV-4&s=10",
          description:
            "Zamonaviy intellektual yordamchi tizimlar va mukammal aerodinamikaga ega bo'lgan sport sedan.",
          range: "706",
          acceleration: "4.3",
        },
      },
      {
        name: "Leapmotor",
        desc: "Intelligent Driving",
        car: {
          model: "Leapmotor C16",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQucNgca4nqy-pLP1USmtQdyDM-aWRtxVOZ0kG1HHu91r6-52374TJLLlja&s=10",
          description:
            "Kuchli texnologiyalar va hamyonbop narx. O'z sinfidagi eng ilg'or avtonom haydash funksiyalari.",
          range: "650",
          acceleration: "7.9",
        },
      },
      {
        name: "Deepal",
        desc: "Next Gen EV",
        car: {
          model: "Deepal S07",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwSCNM5tbshjMT_h8CwBtH7ao4jtR0AUEYNZaKM6qLM_flRBdaNztx43I&s=10",
          description:
            "Changan kompaniyasining futuristik va yoshlarbop elektromobili. O'ta qulay interyer va AR-HUD proyeksiya.",
          range: "1200",
          acceleration: "5.9",
        },
      },
    ],
  },
  en: {
    titleLogin: "Sign In",
    titleRegister: "Create New Account",
    descLogin: "Welcome back! Please enter your details",
    descRegister: "Sign up to access all features",
    labelName: "Full Name",
    placeholderName: "Enter your full name",
    labelEmail: "Email Address",
    labelPassword: "Password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    btnWait: "Please wait...",
    btnRegister: "Register",
    btnLogin: "Login",
    switchHaveAccount: "Already have an account? ",
    switchNoAccount: "Don't have an account? ",
    linkLogin: "Sign In",
    linkRegister: "Add New (Register)",
    navCatalog: "Catalog",
    navBrands: "Brands",
    navReviews: "Reviews",
    heroTitle: "Spare Parts for Electric Vehicles",
    heroDesc:
      "Find high-quality and guaranteed spare parts for all types of electric vehicles with us.",
    heroBtn: "Browse Catalog",
    brandsTitle: "Premium EV Brands",
    brandsDesc: "Reliable and high-quality spare parts for your car. Choose your model.",
    adminTitle: "VOLTADMIN",
    adminProducts: "Products",
    adminOrders: "Orders",
    adminAIAssistant: "AI Assistant",
    adminAITitle: "AI Store Analysis",
    adminAIDesc: "Smart recommendations based on your store's sales and products",
    adminAIGenerate: "Analyze Store",
    adminAILoading: "AI is analyzing data...",
    adminAIPlaceholder: "Ask a question about your business...",
    adminAIAsk: "Send",
    adminAIThinking: "AI is thinking...",
    adminAccount: "Statistics",
    adminAccountTitle: "Statistics",
    adminAccountDesc: "Total revenues and statistics in the system",
    adminTotalBalance: "Total Balance",
    adminTotalOrders: "Total Orders",
    adminLogout: "Logout",
    adminProductTitle: "Products",
    adminProductDesc: "Manage all spare parts",
    adminAddNew: "Add New",
    tableProduct: "Product",
    tableBrand: "Brand",
    tablePrice: "Price",
    tableStatus: "Status",
    tableActions: "Actions",
    modalAddTitle: "Add New Product",
    modalLabelName: "Product Name",
    modalLabelBrand: "Brand",
    modalLabelModel: "Model",
    modalLabelPrice: "Price",
    modalLabelPart: "Part Number",
    modalLabelImage: "Image URL",
    modalLabelStatus: "Status",
    modalLabelNamePlaceholder: "Example: Mountain Block Engine",
    modalLabelBrandPlaceholder: "BYD, Tesla",
    modalLabelModelPlaceholder: "Han EV",
    modalLabelPricePlaceholder: "50000",
    modalLabelPartPlaceholder: "PN-001",
    modalLabelImagePlaceholder: "https://example.com/image.jpg",
    searchPlaceholder: "Search...",
    modalBtnAdd: "Add",
    modalBtnCancel: "Cancel",
    deleteTitle: "Delete Product",
    deleteDesc: "Are you sure you want to delete this product? This action cannot be undone.",
    deleteBtnYes: "Yes, Delete",
    deleteBtnNo: "No, Keep it",
    statusInStock: "In Stock",
    statusLowStock: "Low Stock",
    statusOutOfStock: "Out of Stock",
    productNameAndPriceRequired: "Product name and price are required!",
    noOrdersYet: "No orders yet",
    noOrdersDesc: "When users make a purchase, all their orders will appear here.",
    brandCarRange: "Range",
    brandCarRangeUnit: " km",
    brandCarAcceleration: "Acceleration (0-100)",
    brandCarAccelerationUnit: "s",
    reviewTitle: "Customer Feedback and Ratings",
    reviewDesc: "What do our customers say about our services and products?",
    reviewNoReviews: "No reviews yet. Be the first to leave a review!",
    reviewFormTitle: "Leave a Review",
    reviewLabelName: "Your Name",
    reviewPlaceholderName: "Enter your name",
    reviewLabelRating: "Rating",
    reviewLabelComment: "Your Feedback",
    reviewPlaceholderComment: "Write your feedback about the product or service...",
    reviewBtnSubmit: "Submit Review",
    footerShop: "Shop",
    footerSupport: "Support",
    footerShopLinks: ["Battery & Power", "Brakes & Suspension", "Motors & Drivetrain", "Charging"],
    footerSupportLinks: ["Track an order", "Fitment guide", "Returns", "Contact us"],
    footerNewsletterTitle: "Stay informed",
    footerNewsletterDesc: "Notifications about new spare parts and discounts.",
    footerNewsletterSubscribed:
      "You've subscribed — thank you! An email has been sent to your inbox.",
    footerNewsletterAlert:
      ' an email has been sent to:\n\n"Do you need reliable batteries and accumulators?"',
    footerCopyright: "All rights reserved.",
    footerBuiltFor: "Built for the EV aftermarket.",
    footerVerifiedFitment: "Verified fitment",
    footerDispatch: "48-hour dispatch",

    // Profile Page
    profileTitle: "My Profile",
    profileOrders: "My Orders",
    profileAddresses: "Saved Addresses",
    profileSettings: "Settings",
    profileLogout: "Logout",
    orderId: "Order ID",
    orderDate: "Date",
    orderTotal: "Total",
    statusnew: "New",
    statusready: "On the way",
    statuscompleted: "Delivered",
    statuscancelled: "Cancelled",
    btnCancelOrder: "Cancel Order",
    addressHome: "Home Address",
    addressWork: "Work Address",
    noOrders: "You have no orders yet",

    // Advantages
    advTitle: "Why Choose Us?",
    advDesc: "Our main competitive advantages and technological differences from other stores in the market.",
    adv1Title: "AI-Powered Analytics",
    adv1Desc: "Our system analyzes sales via AI to ensure the continuous delivery of the most needed spare parts to our customers.",
    adv2Title: "100% Transparent Quality",
    adv2Desc: "No hidden replicas here. Every product is explicitly labeled as 'Original', 'Aftermarket', or 'Replica'.",
    adv3Title: "Dynamic Smart Catalog",
    adv3Desc: "Quickly select and purchase parts like Headlights or Batteries under one car model with dynamic pricing.",
    adv4Title: "Live Tracking & Telegram",
    adv4Desc: "Track every step of your order live and receive instant notifications directly through Telegram.",

    // EV Brands data
    evBrands: [
      {
        name: "BYD",
        desc: "Build Your Dreams",
        car: {
          model: "BYD Han EV",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ33egDiIqIPEg39V5u7QS-7ljmuExoeMRPHDxfXjmYoXBcuPpZlNxD72k&s=10",
          description:
            "Premium electric sedan with aerodynamic design and high performance. Top-tier safety ensured by modern 'Blade Battery'.",
          range: "715",
          acceleration: "3.9",
        },
      },
      {
        name: "Tesla",
        desc: "Electric Revolution",
        car: {
          model: "Tesla Model S Plaid",
          image:
            "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=1200",
          description:
            "One of the fastest production electric vehicles in the world. Next-level autopilot and futuristic interior.",
          range: "600",
          acceleration: "2.1",
        },
      },
      {
        name: "Zeekr",
        desc: "Premium EV",
        car: {
          model: "Zeekr 001",
          image: "https://zeekr-cars.uz/img/001-new-colors/001_new_white.jpg",
          description:
            "A hatchback combining sportiness and luxury. Excellent comfort on any road thanks to pneumatic suspension.",
          range: "700",
          acceleration: "3.8",
        },
      },
      {
        name: "Li Auto",
        desc: "Smart Premium",
        car: {
          model: "Li L9",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ03NJghHnOuAQcdwBhb6mdmgbRHkvm8NrnsyZzUViUDmrxNkUY7dpeY-T&s=10",
          description:
            "Large and smart family crossover. Fully eliminates charging issues with its EREV (range extender) system.",
          range: "1315",
          acceleration: "5.3",
        },
      },
      {
        name: "NIO",
        desc: "Blue Sky Coming",
        car: {
          model: "NIO ET7",
          image: "https://www.greenncap.com/wp-content/uploads/nio-et7-2022-0094.png",
          description:
            "New era of autonomous driving (Aquila super-sensing). Battery swap capability in 5 minutes at a station.",
          range: "1000",
          acceleration: "3.8",
        },
      },
      {
        name: "Xpeng",
        desc: "Future Mobility",
        car: {
          model: "Xpeng P7",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqzmXl0cW2RLPFVvBkRZ7HvkgcsgADEOZJraKORzwxpwuW0F46XCzMV-4&s=10",
          description:
            "Sport sedan with advanced intelligent assistance systems and excellent aerodynamics.",
          range: "706",
          acceleration: "4.3",
        },
      },
      {
        name: "Leapmotor",
        desc: "Intelligent Driving",
        car: {
          model: "Leapmotor C16",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQucNgca4nqy-pLP1USmtQdyDM-aWRtxVOZ0kG1HHu91r6-52374TJLLlja&s=10",
          description:
            "Powerful technology and affordable price. Most advanced autonomous driving features in its class.",
          range: "650",
          acceleration: "7.9",
        },
      },
      {
        name: "Deepal",
        desc: "Next Gen EV",
        car: {
          model: "Deepal S07",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwSCNM5tbshjMT_h8CwBtH7ao4jtR0AUEYNZaKM6qLM_flRBdaNztx43I&s=10",
          description:
            "Changan's futuristic and youth-oriented electric vehicle. Ultra-comfortable interior and AR-HUD projection.",
          range: "1200",
          acceleration: "5.9",
        },
      },
    ],
  },
  ru: {
    titleLogin: "Вход в систему",
    titleRegister: "Создать новый аккаунт",
    descLogin: "Добро пожаловать! Введите свои данные",
    descRegister: "Зарегистрируйтесь для доступа ко всем функциям",
    labelName: "Имя и фамилия",
    placeholderName: "Введите ваше полное имя",
    labelEmail: "Электронная почта",
    labelPassword: "Пароль",
    rememberMe: "Запомнить меня",
    forgotPassword: "Забыли пароль?",
    btnWait: "Пожалуйста, подождите...",
    btnRegister: "Регистрация",
    btnLogin: "Войти",
    switchHaveAccount: "У вас уже есть аккаунт? ",
    switchNoAccount: "Нет аккаунта? ",
    linkLogin: "Войти",
    linkRegister: "Добавить новый (Регистрация)",
    navCatalog: "Каталог",
    navBrands: "Бренды",
    navReviews: "Отзывы",
    heroTitle: "Запчасти для электромобилей",
    heroDesc:
      "Найдите у нас качественные и гарантированные запчасти для всех типов электромобилей.",
    heroBtn: "Перейти в каталог",
    brandsTitle: "Премиум бренды электромобилей",
    brandsDesc: "Надежные и качественные запчасти для вашего автомобиля. Выберите свою модель.",
    adminTitle: "VOLTADMIN",
    adminProducts: "Продукты",
    adminOrders: "Заказы",
    adminAIAssistant: "ИИ Помощник",
    adminAITitle: "Анализ ИИ",
    adminAIDesc: "Умные рекомендации на основе продаж и продуктов вашего магазина",
    adminAIGenerate: "Анализировать магазин",
    adminAILoading: "ИИ анализирует данные...",
    adminAIPlaceholder: "Задайте вопрос о вашем бизнесе...",
    adminAIAsk: "Отправить",
    adminAIThinking: "ИИ думает...",
    adminAccount: "Статистика",
    adminAccountTitle: "Статистика",
    adminAccountDesc: "Общие доходы и статистика в системе",
    adminTotalBalance: "Общий баланс",
    adminTotalOrders: "Всего заказов",
    adminLogout: "Выйти",
    adminProductTitle: "Продукты",
    adminProductDesc: "Управление всеми запчастями",
    adminAddNew: "Добавить новый",
    tableProduct: "Продукт",
    tableBrand: "Бренд",
    tablePrice: "Цена",
    tableStatus: "Статус",
    tableActions: "Действия",
    modalAddTitle: "Добавить новый продукт",
    modalLabelName: "Название продукта",
    modalLabelBrand: "Бренд",
    modalLabelModel: "Модель",
    modalLabelPrice: "Цена",
    modalLabelPart: "Артикул",
    modalLabelImage: "URL изображения",
    modalLabelStatus: "Статус",
    modalLabelNamePlaceholder: "Пример: Горный Блок Двигателя",
    modalLabelBrandPlaceholder: "BYD, Tesla",
    modalLabelModelPlaceholder: "Han EV",
    modalLabelPricePlaceholder: "50000",
    modalLabelPartPlaceholder: "PN-001",
    modalLabelImagePlaceholder: "https://example.com/image.jpg",
    searchPlaceholder: "Поиск...",
    modalBtnAdd: "Добавить",
    modalBtnCancel: "Отмена",
    deleteTitle: "Удалить продукт",
    deleteDesc: "Вы уверены, что хотите удалить этот продукт? Это действие нельзя отменить.",
    deleteBtnYes: "Да, удалить",
    deleteBtnNo: "Нет, оставить",
    statusInStock: "В наличии",
    statusLowStock: "Мало на складе",
    statusOutOfStock: "Нет в наличии",
    productNameAndPriceRequired: "Название и цена продукта обязательны!",
    noOrdersYet: "Заказов пока нет",
    noOrdersDesc: "Когда пользователи совершат покупку, все их заказы появятся здесь.",
    brandCarRange: "Запас хода",
    brandCarRangeUnit: " км",
    brandCarAcceleration: "Разгон (0-100)",
    brandCarAccelerationUnit: "с",
    reviewTitle: "Отзывы и оценки клиентов",
    reviewDesc: "Что говорят наши клиенты о наших услугах и продуктах?",
    reviewNoReviews: "Отзывов пока нет. Оставьте первый отзыв!",
    reviewFormTitle: "Оставить отзыв",
    reviewLabelName: "Ваше имя",
    reviewPlaceholderName: "Введите ваше имя",
    reviewLabelRating: "Оценка",
    reviewLabelComment: "Ваш отзыв",
    reviewPlaceholderComment: "Напишите свой отзыв о товаре или услуге...",
    reviewBtnSubmit: "Отправить отзыв",
    footerShop: "Магазин",
    footerSupport: "Поддержка",
    footerShopLinks: [
      "Аккумуляторы и питание",
      "Тормоза и подвеска",
      "Двигатели и трансмиссия",
      "Зарядка",
    ],
    footerSupportLinks: [
      "Отследить заказ",
      "Руководство по установке",
      "Возврат",
      "Связаться с нами",
    ],
    footerNewsletterTitle: "Будьте в курсе новостей",
    footerNewsletterDesc: "Уведомления о новых запчастях и скидках.",
    footerNewsletterSubscribed: "Вы подписались — спасибо! Письмо отправлено на ваш почтовый ящик.",
    footerNewsletterAlert: ' письмо отправлено на адрес:\n\n"Вам нужны надежные аккумуляторы?"',
    footerCopyright: "Все права защищены.",
    footerBuiltFor: "Создано для вторичного рынка электромобилей.",
    footerVerifiedFitment: "Проверенная совместимость",
    footerDispatch: "Отправка в течение 48 часов",

    // Profile Page
    profileTitle: "Мой профиль",
    profileOrders: "Мои заказы",
    profileAddresses: "Сохраненные адреса",
    profileSettings: "Настройки",
    profileLogout: "Выйти",
    orderId: "ID Заказа",
    orderDate: "Дата",
    orderTotal: "Сумма",
    statusnew: "Новый",
    statusready: "В пути",
    statuscompleted: "Доставлен",
    statuscancelled: "Отменен",
    btnCancelOrder: "Отменить заказ",
    addressHome: "Домашний адрес",
    addressWork: "Рабочий адрес",
    noOrders: "У вас пока нет заказов",

    // Преимущества (Advantages)
    advTitle: "Почему именно мы?",
    advDesc: "Наши главные конкурентные преимущества и технологические отличия на рынке.",
    adv1Title: "ИИ Аналитика",
    adv1Desc: "Наша система анализирует продажи с помощью ИИ, обеспечивая бесперебойную поставку запчастей.",
    adv2Title: "100% Прозрачное Качество",
    adv2Desc: "Никаких скрытых подделок. Статус 'Оригинал', 'Аналог' или 'Копия' четко указан для каждого продукта.",
    adv3Title: "Динамичный Смарт Каталог",
    adv3Desc: "Быстрый выбор деталей, таких как фары или батареи, для одной модели авто с динамическим ценообразованием.",
    adv4Title: "Живое Отслеживание и Telegram",
    adv4Desc: "Отслеживайте каждый этап вашего заказа в реальном времени и получайте уведомления в Telegram.",

    // EV Brands data
    evBrands: [
      {
        name: "BYD",
        desc: "Build Your Dreams",
        car: {
          model: "BYD Han EV",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ33egDiIqIPEg39V5u7QS-7ljmuExoeMRPHDxfXjmYoXBcuPpZlNxD72k&s=10",
          description:
            "Премиальный электрический седан с аэродинамическим дизайном и высокой производительностью. Максимальная безопасность обеспечивается современной батареей 'Blade Battery'.",
          range: "715",
          acceleration: "3.9",
        },
      },
      {
        name: "Tesla",
        desc: "Electric Revolution",
        car: {
          model: "Tesla Model S Plaid",
          image:
            "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=1200",
          description:
            "Один из самых быстрых серийных электромобилей в мире. Автопилот нового уровня и футуристический интерьер.",
          range: "600",
          acceleration: "2.1",
        },
      },
      {
        name: "Zeekr",
        desc: "Premium EV",
        car: {
          model: "Zeekr 001",
          image: "https://zeekr-cars.uz/img/001-new-colors/001_new_white.jpg",
          description:
            "Хэтчбек, сочетающий спортивность и роскошь. Отличный комфорт на любой дороге благодаря пневматической подвеске.",
          range: "700",
          acceleration: "3.8",
        },
      },
      {
        name: "Li Auto",
        desc: "Smart Premium",
        car: {
          model: "Li L9",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ03NJghHnOuAQcdwBhb6mdmgbRHkvm8NrnsyZzUViUDmrxNkUY7dpeY-T&s=10",
          description:
            "Большой и умный семейный кроссовер. Полностью устраняет проблемы с зарядкой благодаря системе EREV (увеличитель запаса хода).",
          range: "1315",
          acceleration: "5.3",
        },
      },
      {
        name: "NIO",
        desc: "Blue Sky Coming",
        car: {
          model: "NIO ET7",
          image: "https://www.greenncap.com/wp-content/uploads/nio-et7-2022-0094.png",
          description:
            "Новая эра автономного вождения (суперчувствительность Aquila). Возможность замены батареи за 5 минут на станции.",
          range: "1000",
          acceleration: "3.8",
        },
      },
      {
        name: "Xpeng",
        desc: "Future Mobility",
        car: {
          model: "Xpeng P7",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqzmXl0cW2RLPFVvBkRZ7HvkgcsgADEOZJraKORzwxpwuW0F46XCzMV-4&s=10",
          description:
            "Спортивный седан с передовыми интеллектуальными системами помощи и отличной аэродинамикой.",
          range: "706",
          acceleration: "4.3",
        },
      },
      {
        name: "Leapmotor",
        desc: "Intelligent Driving",
        car: {
          model: "Leapmotor C16",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQucNgca4nqy-pLP1USmtQdyDM-aWRtxVOZ0kG1HHu91r6-52374TJLLlja&s=10",
          description:
            "Мощные технологии и доступная цена. Самые передовые функции автономного вождения в своем классе.",
          range: "650",
          acceleration: "7.9",
        },
      },
      {
        name: "Deepal",
        desc: "Next Gen EV",
        car: {
          model: "Deepal S07",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwSCNM5tbshjMT_h8CwBtH7ao4jtR0AUEYNZaKM6qLM_flRBdaNztx43I&s=10",
          description:
            "Футуристический и ориентированный на молодежь электромобиль от компании Changan. Ультракомфортный интерьер и проекция AR-HUD.",
          range: "1200",
          acceleration: "5.9",
        },
      },
    ],
  },
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "uz");

  const switchLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  const t = (key) => {
    if (!translations[lang] || !translations[lang][key]) return key;
    return translations[lang][key];
  };

  return (
    <LanguageContext.Provider value={{ lang, switchLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
