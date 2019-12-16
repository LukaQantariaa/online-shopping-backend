const TYPES = {
    UsersRepository: Symbol('UsersRepository'),
    UsersService: Symbol('UsersService'),
    // Categories
    CategoriesService: Symbol('CategoriesService'),
    CategoriesRepository: Symbol('CategoriesRepository'),
    // Sub-Categories
    SubCategoriesService: Symbol("SubCategoriesService"),
    SubCategoriesRepository: Symbol('SubCategoriesRepository'),
    // Products
    ProductsRepository: Symbol('ProductsRepository'),
    ProductsService: Symbol('ProductsService'),
    // Registable
    Controller: Symbol('Controller'),
};

export default TYPES;