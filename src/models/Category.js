export default class Category {
  constructor(
    id = '',
    description = '',
    categoryCode = '',
    idCategoryMoodle = '',
    platform = null,
    status = ''
  ) {
    this.id = id
    this.description = description
    this.categoryCode = categoryCode
    this.idCategoryMoodle = idCategoryMoodle
    this.platform = platform
    this.status = status
  }
}
