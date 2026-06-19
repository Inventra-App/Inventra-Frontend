import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  ChevronDown,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  User,
  X,
} from "lucide-react";
import { getAllProducts, getInventoryItems, getTotalSalesAmount,  } from "../../API/inventoryApi";
import { countSalesPos, makeSalesPos, getTotalSalesAmountPos } from "../../API/salesPosApi";
import "./Css/Sales.css";
import calendar from "../../assets/calendar.png";
import Container1 from "../../assets/Container (6).png";
import Container2 from "../../assets/Container (7).png";
import Container3 from "../../assets/Container (8).png";
import Container4 from "../../assets/Button.png";

const getArrayPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.sales)) return payload.sales;
  if (Array.isArray(payload?.salesData)) return payload.salesData;
  if (Array.isArray(payload?.history)) return payload.history;
  if (Array.isArray(payload?.products)) return payload.products;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

const Sales = () => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [showEmptyCartPopup, setShowEmptyCartPopup] = useState(false);
  const [showClearCartModal, setShowClearCartModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showSaleSuccess, setShowSaleSuccess] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [products, setProducts] = useState([]);
  const [historyItems] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [salesError, setSalesError] = useState("");
  const [salesToday, setSalesToday] = useState(0);
  const [revenueToday, setRevenueToday] = useState(0);

  const loadSales = async () => {
  try {
    const [salesResponse, revenueResponse] = await Promise.all([
      countSalesPos(),
      getTotalSalesAmountPos(),
    ]);

    console.log("SALES COUNT:", salesResponse);
    console.log("SALES AMOUNT:", revenueResponse);

    setSalesToday(Number(
      salesResponse?.data?.pagination?.totalSales ??
      salesResponse?.pagination?.totalSales ??
      0
    ));

    setRevenueToday(Number(revenueResponse?.data ?? 0));
  } catch (error) {
    console.error("Sales stats fetch error:", error);
    setSalesToday(0);
    setRevenueToday(0);
  }
};
  
    const loadProducts = async () => {
    setLoadingProducts(true);

   try {
    const [productsRes, inventoryRes] = await Promise.all([
      getAllProducts({ _t: Date.now() }),
      getInventoryItems({ _t: Date.now() }),
    ]);

    const productsData = getArrayPayload(productsRes);
    const inventoryData = getArrayPayload(inventoryRes);

    const mappedProducts = productsData
      .map((product) => {
        const inventory =
           inventoryData.find((item) => {
           const productId =
           typeof item.productId === "object"
           ? item.productId?._id
           : item.productId;

          return productId === product._id;
          }) || {};

        return {
          id: product._id,
          name: product.productName || "Unnamed Product",
          price: Number(
            product.price ||
            product.sellingPrice ||
            product.unitPrice ||
            0
          ),
          stock: Number(inventory.availableStock || 0),
          category: product.categoryName || "Uncategorized",
        };
      })
      .reverse();

    console.log("POS PRODUCTS:", mappedProducts);

    setProducts(mappedProducts);
     } catch (error) {
    console.error("POS products fetch error:", error);
    setProducts([]);
     } finally {
    setLoadingProducts(false);
    }
   };
   useEffect(() => {
    const timerId = window.setTimeout(() => {
      loadProducts();
      loadSales();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const itemsInCart = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const selectedProductRecord = useMemo(() => {
    if (selectedProductId)
      return products.find((product) => product.id === selectedProductId);

    const productValue = selectedProduct.trim().toLowerCase();
    return products.find(
      (product) =>
        product.id.toLowerCase() === productValue ||
        product.name.toLowerCase() === productValue,
    );
  }, [products, selectedProduct, selectedProductId]);

  const dropdownProducts = useMemo(() => {
    const searchValue = selectedProduct.trim().toLowerCase();
    if (!searchValue) return products.slice(0, 8);

    return products
      .filter(
        (product) =>
          product.name.toLowerCase().includes(searchValue) ||
          product.category.toLowerCase().includes(searchValue),
      )
      .slice(0, 8);
  }, [products, selectedProduct]);

  const formatNaira = (amount) => {
    return `\u20a6${Number(amount || 0).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const increaseQuantity = (productId) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const reduceQuantity = (productId) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item,
      ),
    );
  };

  const addToCart = () => {
    if (!selectedProductRecord) return;

    setCartItems((currentItems) => {
      const itemAlreadyExists = currentItems.some(
        (item) => item.id === selectedProductRecord.id,
      );

      if (itemAlreadyExists) {
        return currentItems.map((item) =>
          item.id === selectedProductRecord.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...currentItems, { ...selectedProductRecord, quantity: 1 }];
    });
    setSelectedProduct("");
    setSelectedProductId("");
    setIsProductDropdownOpen(false);
    setSalesError("");
  };

  const removeCartItem = (productId) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId),
    );
  };

  const clearCart = () => {
    if (cartItems.length === 0) {
      setShowEmptyCartPopup(true);
      return;
    }

    setShowClearCartModal(true);
  };

  const confirmClearCart = () => {
    setCartItems([]);
    setShowClearCartModal(false);
  };

  const completeSale = () => {
    if (cartItems.length === 0) {
      setShowEmptyCartPopup(true);
      return;
    }

    setSalesError("");
    setShowOrderModal(true);
  };

  const proceedSale = async () => {
  if (cartItems.length === 0 || isSubmitting) return;

  setIsSubmitting(true);
  setSalesError("");

  const payload = {
    paymentMethod: "cash",
    items: cartItems.map((item) => ({
      productId: item.id,
      quantity: Number(item.quantity),
    })),
  };

  console.log(
    "SALE PAYLOAD:",
    JSON.stringify(payload, null, 2)
  );

  try {
    const response = await makeSalesPos(payload);

    console.log("SALE RESPONSE:", response);

    setShowOrderModal(false);
    setCartItems([]);
    setShowSaleSuccess(true);

    await loadSales();
    await loadProducts();

    setTimeout(() => {
      setShowSaleSuccess(false);
    }, 2500);
  } catch (error) {
    console.error("Complete sale error:", error);

    console.log(
      "FAILED PAYLOAD:",
      JSON.stringify(payload, null, 2)
    );

    setSalesError(
      error?.response?.data?.message ||
      "Failed to complete sale. Please try again."
    );
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="sales-page">
      <div className="sales-heading">
        <div>
          <h2>Point of Sale (POS)</h2>
          <p>Process customer purchases</p>
        </div>

        <button
          className="sales-history-btn"
          type="button"
          onClick={() => setShowOrderHistory(!showOrderHistory)}
        >
          <img src={calendar} alt="" />
          <span>
            {showOrderHistory ? "Hide Order History" : "Show Order History"}
          </span>
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
                <button
                  className="sales-history-item"
                  type="button"
                  key={item.id}
                  onClick={() => setSelectedHistory(item)}
                >
                  <strong>{item.name}</strong>
                  <span>
                    Qty: {item.qty} x {formatNaira(item.price)} ={" "}
                    {formatNaira(item.total)}
                  </span>
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
                <div className="sales-product-select">
                  <Search size={18} className="sales-product-search-icon" />
                  <input
                    id="product"
                    type="text"
                    placeholder={
                      loadingProducts
                        ? "Loading products..."
                        : "Search product name"
                    }
                    value={selectedProduct}
                    onFocus={() => setIsProductDropdownOpen(true)}
                    onChange={(event) => {
                      setSelectedProduct(event.target.value);
                      setSelectedProductId("");
                      setIsProductDropdownOpen(true);
                    }}
                    aria-label="Select product"
                  />
                  <button
                    className="sales-product-arrow"
                    type="button"
                    onClick={() =>
                      setIsProductDropdownOpen(!isProductDropdownOpen)
                    }
                    aria-label="Open products"
                  >
                    <ChevronDown size={18} />
                  </button>

                  {isProductDropdownOpen && (
                    <div className="sales-product-menu">
                      {dropdownProducts.length === 0 ? (
                        <p className="sales-product-empty">
                          {loadingProducts
                            ? "Loading products..."
                            : "No product found"}
                        </p>
                      ) : (
                        dropdownProducts.map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            className="sales-product-option"
                            onClick={() => {
                              setSelectedProduct(product.name);
                              setSelectedProductId(product.id);
                              setIsProductDropdownOpen(false);
                            }}
                          >
                            <span>{product.name}</span>
                            <small>
                              {product.category} • {formatNaira(product.price)}{" "}
                              • {product.stock} in stock
                            </small>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <button
                  className="sales-add-cart-btn"
                  type="button"
                  disabled={!selectedProductRecord}
                  onClick={addToCart}
                >
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

                      <div
                        className="sales-quantity-control"
                        aria-label={`${item.name} quantity`}
                      >
                        <button
                          type="button"
                          aria-label="Reduce quantity"
                          onClick={() => reduceQuantity(item.id)}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => increaseQuantity(item.id)}
                        >
                          +
                        </button>
                      </div>

                      <strong className="sales-item-total">
                        {formatNaira(item.price * item.quantity)}
                      </strong>

                      <button
                        className="sales-remove-item"
                        type="button"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => removeCartItem(item.id)}
                      >
                        <img src={Container4} alt="" />
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
                <strong>{itemsInCart}</strong>
              </div>
            </div>

            <div className="sales-summary-total">
              <span>Total</span>
              <strong>{formatNaira(subtotal)}</strong>
            </div>

            {salesError && <p className="sales-error-message">{salesError}</p>}

            <button
              className="sales-complete-btn"
              type="button"
              onClick={completeSale}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Completing..." : "Complete Sale"}
            </button>

            <button
              className="sales-clear-btn"
              type="button"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </aside>
        </section>
      )}

      {showEmptyCartPopup && (
        <div
          className="sales-empty-popup-backdrop"
          onClick={() => setShowEmptyCartPopup(false)}
        >
          <div
            className="sales-empty-popup"
            onClick={(event) => event.stopPropagation()}
          >
            <ShoppingCart size={36} />
            <h3>Your cart is empty!</h3>
            <p>Looks like you haven't added anything to your cart yet</p>
          </div>
        </div>
      )}

      {showClearCartModal && (
        <div
          className="sales-clear-modal-backdrop"
          onClick={() => setShowClearCartModal(false)}
        >
          <div
            className="sales-clear-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sales-clear-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sales-clear-alert-icon">
              <AlertCircle size={22} />
            </div>
            <h3 id="sales-clear-title">Do you want to clear cart?</h3>
            <div className="sales-clear-actions">
              <button
                type="button"
                className="sales-clear-no"
                onClick={() => setShowClearCartModal(false)}
              >
                No
              </button>
              <button
                type="button"
                className="sales-clear-yes"
                onClick={confirmClearCart}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {showOrderModal && cartItems.length > 0 && (
        <div className="sales-order-backdrop">
          <div className="sales-order-modal">
            <div className="sales-order-header">
              <div className="sales-order-title-row">
                <div className="sales-order-icon">{"\u20a6"}</div>
                <div>
                  <h3>Order Confirmation</h3>
                  <p>Review before proceeding</p>
                </div>
              </div>

              <button
                type="button"
                className="sales-order-close"
                onClick={() => setShowOrderModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="sales-order-body">
              <h4>
                ITEMS ({itemsInCart} ITEM{itemsInCart === 1 ? "" : "S"})
              </h4>

              {cartItems.map((item) => (
                <div className="sales-order-item" key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{formatNaira(item.price)} each</span>
                  </div>
                  <div className="sales-order-qty">
                    <button
                      type="button"
                      onClick={() => reduceQuantity(item.id)}
                    >
                      <Minus size={15} />
                    </button>
                    <b>{item.quantity}</b>
                    <button
                      type="button"
                      onClick={() => increaseQuantity(item.id)}
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                  <strong>{formatNaira(item.price * item.quantity)}</strong>
                  <button
                    type="button"
                    className="sales-order-delete"
                    onClick={() => removeCartItem(item.id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}

              <div className="sales-order-total-box">
                <div>
                  <span>Subtotal</span>
                  <strong>{formatNaira(subtotal)}</strong>
                </div>
                <div>
                  <span>Total Qty</span>
                  <strong>
                    {itemsInCart} item{itemsInCart === 1 ? "" : "s"}
                  </strong>
                </div>
                <div>
                  <span>Discount</span>
                  <strong className="sales-order-discount">
                    {formatNaira(0)}
                  </strong>
                </div>
                <div className="sales-order-total-line">
                  <span>Total Amount</span>
                  <strong>{formatNaira(subtotal)}</strong>
                </div>
              </div>

              {salesError && (
                <p className="sales-error-message">{salesError}</p>
              )}
            </div>

            <div className="sales-order-actions">
              <button
                type="button"
                className="sales-order-cancel"
                onClick={() => setShowOrderModal(false)}
              >
                <ArrowLeft size={17} />
                <span>Cancel</span>
              </button>
              <button
                type="button"
                className="sales-order-proceed"
                onClick={proceedSale}
                disabled={isSubmitting}
              >
                <CheckCircle size={17} />
                <span>{isSubmitting ? "Processing..." : "Proceed"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showSaleSuccess && (
        <div className="sales-success-toast">Sales Completed Successfully</div>
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
                <span>
                  <User size={14} /> Processed By
                </span>
                <strong>{selectedHistory.user}</strong>
              </div>
              <div className="sales-detail-info">
                <span>
                  <Calendar size={14} /> Date & Time
                </span>
                <strong>{selectedHistory.date}</strong>
              </div>
            </div>

            <div className="sales-detail-breakdown">
              <h4>PRICE BREAKDOWN</h4>
              <div>
                <span>
                  {selectedHistory.name} x {selectedHistory.qty}
                </span>
                <strong>{formatNaira(selectedHistory.total)}</strong>
              </div>
              <div>
                <span>Discount</span>
                <strong className="sales-detail-green">{formatNaira(0)}</strong>
              </div>
              <div>
                <span>Total Paid</span>
                <strong className="sales-detail-blue">
                  {formatNaira(selectedHistory.total)}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
