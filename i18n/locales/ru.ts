export const ru = {
  // Common
  common: {
    save: "Сохранить",
    cancel: "Отмена",
    delete: "Удалить",
    edit: "Редактировать",
    add: "Добавить",
    back: "Назад",
    search: "Поиск",
    loading: "Загрузка...",
    error: "Ошибка",
    success: "Успешно",
    confirm: "Подтвердить",
    close: "Закрыть",
  },

  // Auth
  auth: {
    login: "Вход",
    register: "Регистрация",
    email: "Email",
    password: "Пароль",
    firstName: "Имя",
    lastName: "Фамилия",
    signIn: "Войти",
    signUp: "Зарегистрироваться",
    signOut: "Выйти",
    dontHaveAccount: "Нет аккаунта?",
    haveAccount: "Уже есть аккаунт?",
    signUpPrompt: "Зарегистрироваться",
    signInPrompt: "Войти",
  },

  // Tabs
  tabs: {
    home: "Главная",
    categories: "Категории",
    cart: "Корзина",
    favorites: "Избранное",
    profile: "Профиль",
  },

  // Home
  home: {
    title: "Главная",
    searchPlaceholder: "Поиск товаров...",
    popularProducts: "Популярные товары",
    noProducts: "Товары не найдены",
    errorLoading: "Ошибка загрузки товаров",
  },

  // Products
  products: {
    title: "Товары",
    allProducts: "Все товары",
    searchResults: "Результаты поиска",
    noProducts: "Товары не найдены",
    errorLoading: "Ошибка загрузки товаров",
    addToCart: "В корзину",
    outOfStock: "Нет в наличии",
    selectSize: "Выберите размер",
    selectColor: "Выберите цвет",
    size: "Размер",
    color: "Цвет",
    description: "Описание",
    price: "Цена",
    oldPrice: "Старая цена",
    rating: "Рейтинг",
    reviews: "отзывов",
    inStock: "В наличии",
    filter: "Фильтр",
    sortByPrice: "По цене",
    sortByRating: "По рейтингу",
    sortInStock: "В наличии",
  },

  // Categories
  categories: {
    title: "Категории",
    noCategories: "Категории не найдены",
    errorLoading: "Ошибка загрузки категорий",
    productsCount: "товаров",
  },

  // Cart
  cart: {
    title: "Корзина",
    empty: "Корзина пуста",
    emptySubtext: "Добавьте товары из каталога",
    total: "Итого",
    checkout: "Оформить заказ",
    errorLoading: "Ошибка загрузки корзины",
    remove: "Удалить",
    quantity: "Количество",
  },

  // Favorites
  favorites: {
    title: "Избранное",
    empty: "Нет избранных товаров",
    emptySubtext: "Добавьте товары в избранное, нажав на иконку сердца",
    errorLoading: "Ошибка загрузки избранного",
  },

  // Profile
  profile: {
    title: "Профиль",
    editProfile: "Редактирование профиля",
    myOrders: "Мои заказы",
    addresses: "Адреса доставки",
    settings: "Настройки",
    help: "Помощь и поддержка",
    about: "О приложении",
    logout: "Выйти",
    changePhoto: "Изменить фото",
    avatarUrl: "URL аватара (опционально)",
    noOrders: "У вас пока нет заказов",
    noOrdersSubtext: "Сделайте первый заказ и он появится здесь",
    errorLoadingOrders: "Ошибка загрузки заказов",
    errorLoadingProfile: "Ошибка загрузки профиля",
  },

  // Orders
  orders: {
    title: "Мои заказы",
    orderNumber: "Заказ",
    status: {
      pending: "Ожидает",
      processing: "Обрабатывается",
      shipped: "Отправлен",
      delivered: "Доставлен",
      cancelled: "Отменен",
    },
    paymentMethod: {
      card: "Карта",
      cash: "Наличные",
    },
  },

  // Addresses
  addresses: {
    title: "Адреса доставки",
    addAddress: "Добавить адрес",
    editAddress: "Редактировать адрес",
    noAddresses: "У вас нет сохраненных адресов",
    noAddressesSubtext: "Добавьте адрес для быстрой доставки",
    default: "По умолчанию",
    setDefault: "Установить по умолчанию",
    street: "Улица",
    city: "Город",
    postalCode: "Почтовый индекс",
    country: "Страна",
  },

  // About
  about: {
    title: "О приложении",
    appName: "Sport Equipment",
    version: "Версия",
    description: "Описание",
    descriptionText:
      "Sport Equipment - это современное мобильное приложение для покупки спортивных товаров. Мы предлагаем широкий ассортимент качественной спортивной одежды, обуви, инвентаря и аксессуаров от ведущих производителей.",
    contacts: "Контакты",
    developer: "Разработчик",
    developerText: "Разработано с ❤️ командой Sport Equipment",
    license: "Лицензия",
    licenseText: "© 2024 Sport Equipment. Все права защищены.",
  },

  // Settings
  settings: {
    title: "Настройки",
    language: "Язык",
    languageDescription: "Выберите язык приложения",
    russian: "Русский",
    belarusian: "Беларуская",
    english: "English",
  },

  // Checkout
  checkout: {
    title: "Оформление заказа",
    deliveryAddress: "Адрес доставки",
    paymentMethod: "Способ оплаты",
    comment: "Комментарий",
    commentLabel: "Комментарий к заказу (необязательно)",
    submit: "Оформить заказ",
    placeholders: {
      street: "ул. Ленина, д. 10, кв. 25",
      city: "Москва",
      postalCode: "123456",
      country: "Россия",
      comment: "Дополнительные пожелания к заказу",
    },
    errors: {
      streetRequired: "Укажите улицу",
      cityRequired: "Укажите город",
      postalCodeRequired: "Укажите почтовый индекс",
      countryRequired: "Укажите страну",
    },
    success: {
      title: "Заказ оформлен",
      message: "Ваш заказ успешно создан. Вы можете отслеживать его статус в разделе 'Мои заказы'.",
    },
    error: {
      title: "Ошибка",
      message: "Не удалось оформить заказ. Попробуйте еще раз.",
    },
  },
};

