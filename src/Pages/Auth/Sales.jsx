import React, { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Calendar, CheckCircle, Minus, Package, Plus, ShoppingCart, Trash2, User, X } from 'lucide-react'
import { getInventoryItems } from '../../API/inventoryApi'
import { countSalesPos, makeSalesPos } from '../../API/salesPosApi'
import './Css/Sales.css'
import calendar from '../../assets/calendar.png'
import Container1 from '../../assets/Container (6).png'
import Container2 from '../../assets/Container (7).png'
import Container3 from '../../assets/Container (8).png'
import Container4 from '../../assets/Button.png'

const getArrayPayload = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.sales)) return payload.sales
  if (Array.isArray(payload?.salesData)) return payload.salesData
  if (Array.isArray(payload?.history)) return payload.history
  if (Array.isArray(payload?.products)) return payload.products
  if (Array.isArray(payload?.items)) return payload.items
  return []
}

const getProductId = (product) => product?._id ?? product?.id ?? product?.productId ?? product?.productDetails?.productId ?? ''
const getProductName = (product) => product?.productName ?? product?.name ?? product?.title ?? 'Unnamed Product'
const getProductPrice = (product) => Number(product?.unitPrice ?? product?.price ?? product?.sellingPrice ?? product?.amount ?? 0)
const getProductStock = (product) => Number(product?.availableStock ?? product?.quantity ?? product?.stock ?? 0)

const normalizeProduct = (product) => ({
  id: getProductId(product),
  name: getProductName(product),
  price: getProductPrice(product),
  stock: getProductStock(product),
})

const normalizeSale = (sale) => {
  const product = sale?.product ?? sale?.productDetails ?? sale?.item ?? {}
  const name = sale?.productName ?? sale?.name ?? product?.productName ?? product?.name ?? 'Product'
  const qty = Number(sale?.quantity ?? sale?.qty ?? sale?.totalQuantity ?? 0)
  const price = Number(sale?.unitPrice ?? sale?.price ?? product?.unitPrice ?? product?.price ?? 0)
  const total = Number(sale?.total ?? sale?.totalAmount ?? sale?.amount ?? price * qty)
  const user = sale?.user?.name ?? sale?.cashier?.name ?? sale?.createdBy?.name ?? sale?.processedBy ?? 'Admin User'
  const dateValue = sale?.createdAt ?? sale?.date ?? sale?.updatedAt ?? ''
  const date = dateValue ? new Date(dateValue).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' }) : '-'

  return {
    id: sale?._id ?? sale?.id ?? `${name}-${date}`,
    name,
    qty,
    price,
    total,
    user,
    date,
  }
}

const Sales = () => {
  const [selectedProduct, setSelectedProduct] = useState('')
  const [cartItem, setCartItem] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [showEmptyCartPopup, setShowEmptyCartPopup] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showSaleSuccess, setShowSaleSuccess] = useState(false)
  const [showOrderHistory, setShowOrderHistory] = useState(false)
  const [selectedHistory, setSelectedHistory] = useState(null)
  const [products, setProducts] = useState([])
  const [historyItems, setHistoryItems] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [salesError, setSalesError] = useState('')

  const loadSales = async () => {
    try {
      const response = await countSalesPos()
      setHistoryItems(getArrayPayload(response).map(normalizeSale))
    } catch (error) {
      console.error('Sales history fetch error:', error)
      setHistoryItems([])
    }
  }

  useEffect(() => {
    const loadProducts = async () => {
      setLoadingProducts(true)
      try {
        const response = await getInventoryItems()
        setProducts(getArrayPayload(response).map(normalizeProduct).filter((product) => product.id))
      } catch (error) {
        console.error('POS products fetch error:', error)
        setProducts([])
      } finally {
        setLoadingProducts(false)
      }
    }

    const timerId = window.setTimeout(() => {
      loadProducts()
      loadSales()
    }, 0)

    return () => window.clearTimeout(timerId)
  }, [])

  const salesToday = historyItems.length
  const revenueToday = historyItems.reduce((sum, item) => sum + item.total, 0)
  const subtotal = cartItem ? cartItem.price * quantity : 0
  const itemsInCart = cartItem ? quantity : 0

  const selectedProductRecord = useMemo(() => {
    const productValue = selectedProduct.trim().toLowerCase()
    return products.find((product) => (
      product.id.toLowerCase() === productValue || product.name.toLowerCase() === productValue
    ))
  }, [products, selectedProduct])

  const formatNaira = (amount) => {
    return `\u20a6${Number(amount || 0).toLocaleString('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  const increaseQuantity = () => {
    setQuantity((currentQuantity) => currentQuantity + 1)
  }

  const reduceQuantity = () => {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1))
  }

  const addToCart = () => {
    if (!selectedProductRecord) return

    setCartItem(selectedProductRecord)
    setQuantity(1)
    setSelectedProduct('')
    setSalesError('')
  }

  const removeCartItem = () => {
    setCartItem(null)
  }

  const clearCart = () => {
    setCartItem(null)
    setShowEmptyCartPopup(true)
  }

  const completeSale = () => {
    if (!cartItem) {
      setShowEmptyCartPopup(true)
      return
    }

    setSalesError('')
    setShowOrderModal(true)
  }

  const proceedSale = async () => {
    if (!cartItem || isSubmitting) return

    setIsSubmitting(true)
    setSalesError('')

    try {
      await makeSalesPos({
        id: cartItem.id,
        quantity,
      })

      setShowOrderModal(false)
      setCartItem(null)
      setQuantity(1)
      setShowSaleSuccess(true)
      loadSales()

      setTimeout(() => {
        setShowSaleSuccess(false)
      }, 2500)
    } catch (error) {
      console.error('Complete sale error:', error)
      setSalesError(error?.response?.data?.message || 'Failed to complete sale. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
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
            {historyItems.length === 0 ? (
              <p className="sales-empty-cart">No sales history to display</p>
            ) : (
              historyItems.map((item) => (
                <button className="sales-history-item" type="button" key={item.id} onClick={() => setSelectedHistory(item)}>
                  <strong>{item.name}</strong>
                  <span>Qty: {item.qty} x {formatNaira(item.price)} = {formatNaira(item.total)}</span>
                  <small>
                    <User size={13} />
                    {item.user}
                    <Calendar size={13} />
                    {item.date}
                  </small>
                </button>
              ))
            )}
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
                  list="sales-products"
                  placeholder={loadingProducts ? 'Loading products...' : 'Search product name'}
                  value={selectedProduct}
                  onChange={(event) => setSelectedProduct(event.target.value)}
                  aria-label="Select product"
                />
                <datalist id="sales-products">
                  {products.map((product) => (
                    <option key={product.id} value={product.name} />
                  ))}
                </datalist>

                <button type="button" disabled={!selectedProductRecord} onClick={addToCart}>
                  Add to Cart
                </button>
              </div>
            </form>

            <div className="sales-panel sales-cart-panel">
              <h3>Cart Items</h3>

              <div className="sales-cart-list">
                {!cartItem ? (
                  <p className="sales-empty-cart">No items in cart</p>
                ) : (
                  <div className="sales-cart-item">
                    <div className="sales-cart-product">
                      <strong>{cartItem.name}</strong>
                      <span>{formatNaira(cartItem.price)} each</span>
                    </div>

                    <div className="sales-quantity-control" aria-label={`${cartItem.name} quantity`}>
                      <button type="button" aria-label="Reduce quantity" onClick={reduceQuantity}>
                        -
                      </button>
                      <span>{quantity}</span>
                      <button type="button" aria-label="Increase quantity" onClick={increaseQuantity}>
                        +
                      </button>
                    </div>

                    <strong className="sales-item-total">
                      {formatNaira(cartItem.price * quantity)}
                    </strong>

                    <button
                      className="sales-remove-item"
                      type="button"
                      aria-label={`Remove ${cartItem.name}`}
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

            {salesError && <p className="sales-error-message">{salesError}</p>}

            <button className="sales-complete-btn" type="button" onClick={completeSale} disabled={isSubmitting}>
              {isSubmitting ? 'Completing...' : 'Complete Sale'}
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

      {showOrderModal && cartItem && (
        <div className="sales-order-backdrop">
          <div className="sales-order-modal">
            <div className="sales-order-header">
              <div className="sales-order-title-row">
                <div className="sales-order-icon">{'\u20a6'}</div>
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
              <h4>ITEMS ({quantity} PRODUCT{quantity === 1 ? '' : 'S'})</h4>

              <div className="sales-order-item">
                <div>
                  <strong>{cartItem.name}</strong>
                  <span>{formatNaira(cartItem.price)} each</span>
                </div>
                <div className="sales-order-qty">
                  <button type="button" onClick={reduceQuantity}><Minus size={15} /></button>
                  <b>{quantity}</b>
                  <button type="button" onClick={increaseQuantity}><Plus size={15} /></button>
                </div>
                <strong>{formatNaira(subtotal)}</strong>
                <button type="button" className="sales-order-delete" onClick={removeCartItem}><Trash2 size={15} /></button>
              </div>

              <div className="sales-order-total-box">
                <div>
                  <span>Subtotal</span>
                  <strong>{formatNaira(subtotal)}</strong>
                </div>
                <div>
                  <span>Total Qty</span>
                  <strong>{quantity} item{quantity === 1 ? '' : 's'}</strong>
                </div>
                <div>
                  <span>Discount</span>
                  <strong className="sales-order-discount">{formatNaira(0)}</strong>
                </div>
                <div className="sales-order-total-line">
                  <span>Total Amount</span>
                  <strong>{formatNaira(subtotal)}</strong>
                </div>
              </div>

              {salesError && <p className="sales-error-message">{salesError}</p>}
            </div>

            <div className="sales-order-actions">
              <button type="button" className="sales-order-cancel" onClick={() => setShowOrderModal(false)}>
                <ArrowLeft size={17} />
                <span>Cancel</span>
              </button>
              <button type="button" className="sales-order-proceed" onClick={proceedSale} disabled={isSubmitting}>
                <CheckCircle size={17} />
                <span>{isSubmitting ? 'Processing...' : 'Proceed'}</span>
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
                  <span># {selectedHistory.id}</span>
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
                  <strong>{selectedHistory.name}</strong>
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
                <strong>{selectedHistory.date}</strong>
              </div>
            </div>

            <div className="sales-detail-breakdown">
              <h4>PRICE BREAKDOWN</h4>
              <div>
                <span>{selectedHistory.name} x {selectedHistory.qty}</span>
                <strong>{formatNaira(selectedHistory.total)}</strong>
              </div>
              <div>
                <span>Discount</span>
                <strong className="sales-detail-green">{formatNaira(0)}</strong>
              </div>
              <div>
                <span>Total Paid</span>
                <strong className="sales-detail-blue">{formatNaira(selectedHistory.total)}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sales
