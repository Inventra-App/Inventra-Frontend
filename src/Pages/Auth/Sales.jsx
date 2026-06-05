import React, { useState } from 'react'
import './Css/Sales.css'
import calendar from '../../assets/calendar.png'
import Container1 from '../../assets/Container (6).png'
import Container2 from '../../assets/Container (7).png'
import Container3 from '../../assets/Container (8).png'
import Container4 from '../../assets/Button.png'

const Sales = () => {
  const [selectedProduct, setSelectedProduct] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [showCartItem, setShowCartItem] = useState(true)

  const productName = 'Fresh Milk'
  const productPrice = 250
  const subtotal = showCartItem ? productPrice * quantity : 0
  const itemsInCart = showCartItem ? quantity : 0

  const formatNaira = (amount) => {
    return `\u20a6${amount.toLocaleString('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const reduceQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const addToCart = () => {
    setShowCartItem(true)
    setQuantity(1)
    setSelectedProduct('')
  }

  const removeCartItem = () => {
    setShowCartItem(false)
  }

  const clearCart = () => {
    setShowCartItem(false)
  }

  return (
    <div className="sales-page">
      <div className="sales-heading">
        <div>
          <h2>Point of Sale (POS)</h2>
          <p>Process customer purchases</p>
        </div>

        <button className="sales-history-btn" type="button">
          <img src={calendar} alt="" />
          <span>Show Order History</span>
        </button>
      </div>

      <section className="sales-metrics">
        <article className="sales-metric-card">
          <div className="sales-metric-icon sales-metric-green">
            <img src={Container1} alt="" />
          </div>
          <div>
            <p>Sales Today</p>
            <strong>0</strong>
          </div>
        </article>

        <article className="sales-metric-card">
          <div className="sales-metric-icon sales-metric-blue">
            <img src={Container2} alt="" />
          </div>
          <div>
            <p>Revenue Today</p>
            <strong>{formatNaira(0)}</strong>
          </div>
        </article>

        <article className="sales-metric-card">
          <div className="sales-metric-icon sales-metric-purple">
            <img src={Container3} alt="" />
          </div>
          <div>
            <p>Items in Cart</p>
            <strong>{itemsInCart}</strong>
          </div>
        </article>
      </section>

      <section className="sales-workspace">
        <div className="sales-left-column">
          <form className="sales-panel sales-product-form">
            <label htmlFor="product">Select Product</label>

            <div className="sales-product-row">
              <input
                id="product"
                type="text"
                value={selectedProduct}
                onChange={(event) => setSelectedProduct(event.target.value)}
                aria-label="Select product"
              />

              <button type="button" disabled={!selectedProduct.trim()} onClick={addToCart}>
                Add to Cart
              </button>
            </div>
          </form>

          <div className="sales-panel sales-cart-panel">
            <h3>Cart Items</h3>

            <div className="sales-cart-list">
              {!showCartItem ? (
                <p className="sales-empty-cart">No items in cart</p>
              ) : (
                <div className="sales-cart-item">
                  <div className="sales-cart-product">
                    <strong>{productName}</strong>
                    <span>{formatNaira(productPrice)} each</span>
                  </div>

                  <div className="sales-quantity-control" aria-label={`${productName} quantity`}>
                    <button type="button" aria-label="Reduce quantity" onClick={reduceQuantity}>
                      -
                    </button>
                    <span>{quantity}</span>
                    <button type="button" aria-label="Increase quantity" onClick={increaseQuantity}>
                      +
                    </button>
                  </div>

                  <strong className="sales-item-total">
                    {formatNaira(productPrice * quantity)}
                  </strong>

                  <button
                    className="sales-remove-item"
                    type="button"
                    aria-label={`Remove ${productName}`}
                    onClick={removeCartItem}
                  >
                    <img src={Container4} alt="" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="sales-panel sales-summary">
          <h3>Order Summary</h3>

          <div className="sales-summary-lines">
            <div>
              <span>Subtotal</span>
              <strong>{formatNaira(subtotal)}</strong>
            </div>

            <div>
              <span>Items</span>
              <strong>{itemsInCart}</strong>
            </div>
          </div>

          <div className="sales-summary-total">
            <span>Total</span>
            <strong>{formatNaira(subtotal)}</strong>
          </div>

          <button className="sales-complete-btn" type="button" disabled={!showCartItem}>
            Complete Sale
          </button>

          <button className="sales-clear-btn" type="button" onClick={clearCart}>
            Clear Cart
          </button>
        </aside>
      </section>
    </div>
  )
}

export default Sales
