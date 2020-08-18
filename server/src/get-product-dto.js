class GetProductDTO {
  constructor({
    id,
    name,
    category,
    price,
    base_price,
    discount_rate,
    sold_count,
    stock_count,
    coupang_productId,
    thumbnail_src,
    is_liked,
  }) {
    this.id = id
    this.name = name
    this.category = category
    this.price = price
    this.basePrice = base_price
    this.discountRate = discount_rate
    this.soldCount = sold_count
    this.stockCount = stock_count
    this.coupangProductId = coupang_productId
    this.thumbnailSrc = thumbnail_src
    this.isLiked = is_liked === 'true'
  }
}

module.exports = { GetProductDTO }
