const TYPES = {
    UsersRepository: Symbol('UsersRepository'),
    UsersService: Symbol('UsersService'),
    // Categories
    CategoriesService: Symbol('CategoriesService'),
    CategoriesRepository: Symbol('CategoriesRepository'),
    // Sub-Categories
    SubCategoriesService: Symbol("SubCategoriesService"),
    SubCategoriesRepository: Symbol('SubCategoriesRepository'),
    // Registable
    Controller: Symbol('Controller'),
};

export default TYPES;