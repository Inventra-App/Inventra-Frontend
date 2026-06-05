import React, { useMemo, useState } from 'react'
import {
  Trash2,} from 'lucide-react'
import './Css/Sales.css'
import calendar from '../../assets/calendar.png'
import Container1 from '../../assets/Container (6).png'
import Container2 from '../../assets/Container (7).png'
import Container3 from '../../assets/Container (8).png'
import Container4 from '../../assets/Button.png'
const products = [
  {
    id: 1,
    name: 'Fresh Milk',
    price: 250,
    quantity: 1,
  },
]

const formatNaira = (amount) => `\u20a6${amount.toLocaleString('en-NG', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})}`

const Sales = () => {
  const [cartItems, setCartItems] = useState(products)
  const [selectedProduct, setSelectedProduct] = useState('')

  const subtotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems]
  )

  const updateQuantity = (itemId, action) => {
    setCartItems((items) =>
      items.map((item) => {
        if (item.id !== itemId) return item

        const nextQuantity =
          action === 'increase'
            ? item.quantity + 1
            : Math.max(1, item.quantity - 1)

        return { ...item, quantity: nextQuantity }
      })
    )
  }

  const removeCartItem = (itemId) => {
    setCartItems((items) => items.filter((item) => item.id !== itemId))
  }

  const clearCart = () => {
    setCartItems([])
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
            <strong>{cartItems.reduce((total, item) => total + item.quantity, 0)}</strong>
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
              <button type="button" disabled={!selectedProduct.trim()}>
                Add to Cart
              </button>
            </div>
          </form>

          <div className="sales-panel sales-cart-panel">
            <h3>Cart Items</h3>

            <div className="sales-cart-list">
              {cartItems.length === 0 ? (
                <p className="sales-empty-cart">No items in cart</p>
              ) : (
                cartItems.map((item) => (
                  <div className="sales-cart-item" key={item.id}>
                    <div className="sales-cart-product">
                      <strong>{item.name}</strong>
                      <span>{formatNaira(item.price)} each</span>
                    </div>

                    <div className="sales-quantity-control" aria-label={`${item.name} quantity`}>
                      <button
                        type="button"
                        aria-label="Reduce quantity"
                        onClick={() => updateQuantity(item.id, 'decrease')}>-</button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => updateQuantity(item.id, 'increase')}>+</button>
                    </div>

                    <strong className="sales-item-total">
                      {formatNaira(item.price * item.quantity)}
                    </strong>

                    <button
                      className="sales-remove-item"
                      type="button"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => removeCartItem(item.id)}
                    ><img src={Container4} alt="" />
                    </button>
                  </div>
                ))
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
              <strong>{cartItems.reduce((total, item) => total + item.quantity, 0)}</strong>
            </div>
          </div>

          <div className="sales-summary-total">
            <span>Total</span>
            <strong>{formatNaira(subtotal)}</strong>
          </div>

          <button className="sales-complete-btn" type="button" disabled={!cartItems.length}>
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
