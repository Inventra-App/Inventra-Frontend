import React, { useState } from 'react'
import { ArrowLeft, Calendar, CheckCircle, Minus, Package, Plus, ShoppingCart, Trash2, User, X } from 'lucide-react'
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
  const [showEmptyCartPopup, setShowEmptyCartPopup] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showSaleSuccess, setShowSaleSuccess] = useState(false)
  const [showOrderHistory, setShowOrderHistory] = useState(false)
  const [selectedHistory, setSelectedHistory] = useState(null)

  const productName = 'Fresh Milk'
  const productPrice = 250
  const subtotal = showCartItem ? productPrice * quantity : 0
  const itemsInCart = showCartItem ? quantity : 0
  const salesToday = showOrderHistory ? 2 : 0
  const revenueToday = showOrderHistory ? 810 : 0
  const historyItems = [
    { name: 'Yogurt', qty: 2, price: 180, total: 360, user: 'Admin User', date: 'May 23, 2026 13:03' },
    { name: 'White Bread', qty: 3, price: 150, total: 450, user: 'Admin User', date: 'May 23, 2026 13:03' },
    { name: 'Fresh Milk', qty: 5, price: 250, total: 1250, user: 'Jane Cashier', date: 'May 20, 2026 10:15' },
    { name: 'White Bread', qty: 2, price: 150, total: 300, user: 'Admin User', date: 'May 19, 2026 09:28' },
  ]

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
    setShowEmptyCartPopup(true)
  }

  const completeSale = () => {
    if (!showCartItem) {
      setShowEmptyCartPopup(true)
      return
    }

    setShowOrderModal(true)
  }

  const proceedSale = () => {
    setShowOrderModal(false)
    setShowCartItem(false)
    setShowSaleSuccess(true)

    setTimeout(() => {
      setShowSaleSuccess(false)
    }, 2500)
  }

  return (
    <div className="sales-page">
      <div className="sales-heading">
        <div>
          <h2>Point of Sale (POS)</h2>
          <p>Process customer purchases</p>
        </div>

        <button className="sales-history-btn" type="button" onClick={() => setShowOrderHistory(!showOrderHistory)}>
          <img src={calendar} alt="" />
          <span>{showOrderHistory ? 'Hide Order History' : 'Show Order History'}</span>
        </button>
      </div>

      <section className="sales-metrics">
        <article className="sales-metric-card">
          <div className="sales-metric-icon sales-metric-green">
            <img src={Container1} alt="" />
          </div>
          <div>
            <p>Sales Today</p>
            <strong>{salesToday}</strong>
          </div>
        </article>

        <article className="sales-metric-card">
          <div className="sales-metric-icon sales-metric-blue">
            <img src={Container2} alt="" />
          </div>
          <div>
            <p>Revenue Today</p>
            <strong>{formatNaira(revenueToday)}</strong>
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

      {showOrderHistory ? (
        <section className="sales-panel sales-history-panel">
          <h3>Sales History</h3>

          <div className="sales-history-list">
            {historyItems.map((item) => (
              <button className="sales-history-item" type="button" key={`${item.name}-${item.date}`} onClick={() => setSelectedHistory(item)}>
                <strong>{item.name}</strong>
                <span>Qty: {item.qty} × {formatNaira(item.price)} = {formatNaira(item.total)}</span>
                <small>
                  <User size={13} />
                  {item.user}
                  <Calendar size={13} />
                  {item.date}
                </small>
              </button>
            ))}
          </div>
        </section>
      ) : (
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

            <button className="sales-complete-btn" type="button" onClick={completeSale}>
              Complete Sale
            </button>

            <button className="sales-clear-btn" type="button" onClick={clearCart}>
              Clear Cart
            </button>
          </aside>
        </section>
      )}

      {showEmptyCartPopup && (
        <div className="sales-empty-popup-backdrop" onClick={() => setShowEmptyCartPopup(false)}>
          <div className="sales-empty-popup" onClick={(event) => event.stopPropagation()}>
            <ShoppingCart size={36} />
            <h3>Your cart is empty!</h3>
            <p>Looks like you haven't added anything to your cart yet</p>
          </div>
        </div>
      )}

      {showOrderModal && (
        <div className="sales-order-backdrop">
          <div className="sales-order-modal">
            <div className="sales-order-header">
              <div className="sales-order-title-row">
                <div className="sales-order-icon">₦</div>
                <div>
                  <h3>Order Confirmation</h3>
                  <p>Review before proceeding</p>
                </div>
              </div>

              <button type="button" className="sales-order-close" onClick={() => setShowOrderModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="sales-order-body">
              <h4>ITEMS (5 PRODUCTS)</h4>

              <div className="sales-order-item">
                <div>
                  <strong>Fresh Milk</strong>
                  <span>₦250.00 each</span>
                </div>
                <div className="sales-order-qty">
                  <button type="button"><Minus size={15} /></button>
                  <b>2</b>
                  <button type="button"><Plus size={15} /></button>
                </div>
                <strong>₦500.00</strong>
                <button type="button" className="sales-order-delete"><Trash2 size={15} /></button>
              </div>

              <div className="sales-order-item">
                <div>
                  <strong>White Bread</strong>
                  <span>₦150.00 each</span>
                </div>
                <div className="sales-order-qty">
                  <button type="button"><Minus size={15} /></button>
                  <b>2</b>
                  <button type="button"><Plus size={15} /></button>
                </div>
                <strong>₦300.00</strong>
                <button type="button" className="sales-order-delete"><Trash2 size={15} /></button>
              </div>

              <div className="sales-order-item">
                <div>
                  <strong>Yogurt</strong>
                  <span>₦180.00 each</span>
                </div>
                <div className="sales-order-qty">
                  <button type="button"><Minus size={15} /></button>
                  <b>1</b>
                  <button type="button"><Plus size={15} /></button>
                </div>
                <strong>₦180.00</strong>
                <button type="button" className="sales-order-delete"><Trash2 size={15} /></button>
              </div>

              <div className="sales-order-total-box">
                <div>
                  <span>Subtotal</span>
                  <strong>₦1830.00</strong>
                </div>
                <div>
                  <span>Total Qty</span>
                  <strong>7 items</strong>
                </div>
                <div>
                  <span>Discount</span>
                  <strong className="sales-order-discount">₦0.00</strong>
                </div>
                <div className="sales-order-total-line">
                  <span>Total Amount</span>
                  <strong>₦1830.00</strong>
                </div>
              </div>
            </div>

            <div className="sales-order-actions">
              <button type="button" className="sales-order-cancel" onClick={() => setShowOrderModal(false)}>
                <ArrowLeft size={17} />
                <span>Cancel</span>
              </button>
              <button type="button" className="sales-order-proceed" onClick={proceedSale}>
                <CheckCircle size={17} />
                <span>Proceed</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showSaleSuccess && (
        <div className="sales-success-toast">
          Sales Completed Successfully
        </div>
      )}

      {selectedHistory && (
        <div className="sales-detail-backdrop">
          <div className="sales-detail-modal">
            <div className="sales-detail-header">
              <div className="sales-detail-title">
                <div className="sales-detail-icon">
                  <Package size={20} />
                </div>
                <div>
                  <h3>{selectedHistory.name}</h3>
                  <span># 29-NDKT4QBF9</span>
                  <small>Completed</small>
                </div>
              </div>

              <button type="button" onClick={() => setSelectedHistory(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="sales-detail-amount">
              <span>TOTAL AMOUNT</span>
              <strong>{formatNaira(selectedHistory.total)}</strong>
            </div>

            <div className="sales-detail-section">
              <h4>TRANSACTION DETAILS</h4>
              <div className="sales-detail-grid">
                <div>
                  <span>Product Name</span>
                  <strong>Orange Juice</strong>
                </div>
                <div>
                  <span>Unit Price</span>
                  <strong>{formatNaira(selectedHistory.price)}</strong>
                </div>
                <div>
                  <span>Quantity Sold</span>
                  <strong>{selectedHistory.qty} units</strong>
                </div>
                <div>
                  <span>Subtotal</span>
                  <strong>{formatNaira(selectedHistory.total)}</strong>
                </div>
              </div>
            </div>

            <div className="sales-detail-info-row">
              <div className="sales-detail-info">
                <span><User size={14} /> Processed By</span>
                <strong>{selectedHistory.user}</strong>
              </div>
              <div className="sales-detail-info">
                <span><Calendar size={14} /> Date & Time</span>
                <strong>May 23, 2026</strong>
                <small>13:06 PM</small>
              </div>
            </div>

            <div className="sales-detail-breakdown">
              <h4>PRICE BREAKDOWN</h4>
              <div>
                <span>Orange Juice × 3</span>
                <strong>{formatNaira(1050)}</strong>
              </div>
              <div>
                <span>Discount</span>
                <strong className="sales-detail-green">{formatNaira(0)}</strong>
              </div>
              <div>
                <span>Total Paid</span>
                <strong className="sales-detail-blue">{formatNaira(1050)}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sales
