import { useEffect } from "react";
import {
  Package,
  Eye,
  Pencil,
  PackagePlus,
  ArrowRightLeft,
} from "lucide-react";

const InventoryTable = ({
  data,
  onView,
  getStatusClass,
  activeMenuProduct,
  setActiveMenuProduct,
  setShowRecordStock,
  setManageProduct,
}) => {
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".manage-menu-container")) {
        setActiveMenuProduct(null);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [setActiveMenuProduct]);

  if (!Array.isArray(data)) return null;
  if (data.length === 0) {
    return <div className="inv-empty-state">No products found</div>;
  }

  return (
    <>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>PRODUCT</th>
            <th>CATEGORY</th>
            <th>AVAILABLE STOCK</th>
            <th>BACKROOM STOCK</th>
            <th>TOTAL INVENTORY</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {data.map((product) => (
            <tr key={product._id || product.id || product.batch || Math.random()}>
              <td>
                <div className="inv-product-cell">
                  <div className="inv-product-icon">
                    <Package size={18} />
                  </div>
                  <div>
                    <p className="inv-product-name">{product.name}</p>
                    <p className="inv-product-id">{product.batch}</p>
                  </div>
                </div>
              </td>

              <td>
                <span className="inv-category-tag">{product.category}</span>
              </td>

              <td>
                {" "}
                <span className="inv-quantity-reserved">
                  {" "}
                  {product.availableStock}{" "}
                </span>{" "}
              </td>
              <td>
                {" "}
                <span className="inv-quantity-reserved">
                  {" "}
                  {product.reservedStock}{" "}
                </span>{" "}
              </td>
              <td>
                {" "}
                <span className="inv-quantity">{product.totalStock}</span>{" "}
              </td>

              <td>
                <span
                  className={`inv-status ${getStatusClass(product.status)}`}
                >
                  {product.status}
                </span>
              </td>

              <td>
                <div className="inv-actions-cell">
                  <button
                    className="inv-view-btn"
                    onClick={() => onView(product)}
                  >
                    <Eye size={14} /> View
                  </button>

                  <div className="manage-menu-container">
                    <button
                      className="inv-manage-btn"
                      onClick={(e) => {
                        e.stopPropagation();

                        setActiveMenuProduct((prev) =>
                          prev === product._id ? null : product._id,
                        );
                      }}
                    >
                      <Pencil size={14} /> Manage Stock
                    </button>

                    {activeMenuProduct === product._id && (
                      <div className="manage-dropdown">
                        <button
                          className="btn-restock"
                          onClick={() => {
                            setShowRecordStock(product);
                            setActiveMenuProduct(null);
                          }}
                        >
                          <PackagePlus size={16} />
                          Restock Product
                        </button>

                        <button
                          className="btn-move"
                          onClick={() => {
                            setManageProduct(product);
                            setActiveMenuProduct(null);
                          }}
                        >
                          <ArrowRightLeft size={16} />
                          Move Product
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="inv-mobile-cards">
        {data.map((product) => (
          <div key={product._id || product.id || product.batch || Math.random()} className="inv-mobile-card">

            <div className="inv-mobile-card-top">
              <div className="inv-mobile-card-product">
                <div className="inv-product-icon">
                  <Package size={18} />
                </div>

                <div>
                  <p className="inv-mobile-card-name">{product.name}</p>
                  <p className="inv-mobile-card-batch">{product.batch}</p>
                </div>
              </div>

              <span className="inv-category-tag">{product.category}</span>
            </div>

            <div className="inv-mobile-card-grid">
              <div className="inv-mobile-card-item">
                <label>AVAILABLE STOCK</label>
                <span>{product.availableStock}</span>
              </div>

              <div className="inv-mobile-card-item">
                <label>BACKROOM STOCK</label>
                <span className="inv-quantity-reserved">
                  {product.reservedStock}
                </span>
              </div>

              <div className="inv-mobile-card-item">
                <label>TOTAL INVENTORY</label>
                <span>{product.totalStock}</span>
              </div>

              <div className="inv-mobile-card-item">
                <label>STATUS</label>
                <span
                  className={`inv-status ${getStatusClass(product.status)}`}
                >
                  {product.status}
                </span>
              </div>
            </div>

            <div className="inv-mobile-card-actions">
              <button className="inv-view-btn" onClick={() => onView(product)}>
                <Eye size={13} /> View
              </button>

              <div className="manage-menu-container">
                <button
                  className="inv-manage-btn"
                  onClick={(e) => {
                    e.stopPropagation();

                    setActiveMenuProduct((prev) =>
                      prev === product._id ? null : product._id,
                    );
                  }}
                >
                  <Pencil size={13} /> Manage
                </button>

                {activeMenuProduct === product._id && (
                  <div className="manage-dropdown">
                    <button
                      className="btn-restock"
                      onClick={() => {
                        setShowRecordStock(product);
                        setActiveMenuProduct(null);
                      }}
                    >
                      <PackagePlus size={16} />
                      Restock Product
                    </button>

                    <button
                      className="btn-move"
                      onClick={() => {
                        setManageProduct(product);
                        setActiveMenuProduct(null);
                      }}
                    >
                      <ArrowRightLeft size={16} />
                      Move Product
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default InventoryTable;
