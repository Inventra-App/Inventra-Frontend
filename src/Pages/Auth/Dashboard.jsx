import React, { useState, useEffect, useCallback } from 'react'
import { Package, Activity, ShoppingCart, TrendingDown, Calendar } from 'lucide-react'
import {
  getTotalStockUnits,
  getTotalProductsCount,
  getTotalSalesAmount,
  getInventoryItems,
} from '../../API/inventoryApi'
import './Css/Dashboard.css'

const Dashboard = () => {
  const [totalProducts, setTotalProducts] = useState(null)
  const [totalStockUnits, setTotalStockUnits] = useState(null)
  const [totalSalesAmount, setTotalSalesAmount] = useState(null)
  const [lowStockItems, setLowStockItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const results = await Promise.allSettled([
        getTotalStockUnits().catch(() => null),
        getTotalProductsCount().catch(() => null),
        getTotalSalesAmount().catch(() => null),
        getInventoryItems().catch(() => []),
      ])

      const [tsuRes, tpcRes, tsaRes, invRes] = results

      // Total Stock Units
      const tsu = tsuRes.status === 'fulfilled' && tsuRes.value
        ? (typeof tsuRes.value === 'number'
            ? tsuRes.value
            : tsuRes.value?.totalStockUnits ?? tsuRes.value?.data ?? tsuRes.value?.count ?? null)
        : null
      setTotalStockUnits(tsu)

      // Total Products Count
      const tpc = tpcRes.status === 'fulfilled' && tpcRes.value
        ? (typeof tpcRes.value === 'number'
            ? tpcRes.value
            : tpcRes.value?.totalProducts ?? tpcRes.value?.data ?? tpcRes.value?.count ?? null)
        : null
      setTotalProducts(tpc)

      // Total Sales Amount
      const tsa = tsaRes.status === 'fulfilled' && tsaRes.value
        ? (typeof tsaRes.value === 'number'
            ? tsaRes.value
            : tsaRes.value?.totalSalesAmount ?? tsaRes.value?.data ?? tsaRes.value?.amount ?? null)
        : null
      setTotalSalesAmount(tsa)

      // Low Stock — derive from inventory items
      const items = invRes.status === 'fulfilled' && Array.isArray(invRes.value)
        ? invRes.value
        : invRes.status === 'fulfilled' && invRes.value?.data && Array.isArray(invRes.value.data)
          ? invRes.value.data
          : []

      const lowStock = items
        .filter((p) => {
          const qty = p.availableStock ?? p.quantity ?? p.stock ?? 0
          return qty > 0 && qty <= 10
        })
        .map((p) => ({
          name: p.name ?? p.productName ?? 'Unknown',
          category: p.category ?? '-',
          units: p.availableStock ?? p.quantity ?? p.stock ?? 0,
        }))
      setLowStockItems(lowStock)
    } catch (err) {
      console.error('Dashboard fetch error:', err)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const statCards = [
    {
      label: 'Total Products',
      value: totalProducts !== null ? String(totalProducts) : '0',
      icon: <Package size={22} />,
      color: 'blue',
    },
    {
      label: 'Total Stock Units',
      value: totalStockUnits !== null ? String(totalStockUnits) : '0',
      icon: <Activity size={22} />,
      color: 'green',
    },
    {
      label: 'Sales Today',
      value: totalSalesAmount !== null
        ? `₦${Number(totalSalesAmount).toLocaleString()}`
        : '₦0',
      icon: <ShoppingCart size={22} />,
      color: 'purple',
    },
    {
      label: 'Critical Alerts',
      value: '0',
      sub: 'No critical alerts',
      icon: <TrendingDown size={22} />,
      color: 'red',
    },
  ]

  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="dashboard-welcome">
          <h2>Loading dashboard...</h2>
          <p>Fetching your latest inventory data.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-content">
        <div className="dashboard-welcome">
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button className="inv-btn-filled" onClick={fetchData} style={{ marginTop: 16 }}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-content">
      <div className="dashboard-welcome">
        <h2>Welcome back!</h2>
        <p>Here's what's happening in your supermarket today.</p>
      </div>

      <div className="dashboard-stats">
        {statCards.map((card, index) => (
          <div key={index} className="stat-card">
            <div className="stat-card-left">
              <p className="stat-label">{card.label}</p>
              <h3 className="stat-value">{card.value}</h3>
              {card.sub && <p className="stat-sub">{card.sub}</p>}
            </div>
            <div className={`stat-icon stat-icon-${card.color}`}>{card.icon}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-alerts">
        {/* Low Stock Alerts */}
        <div className="alert-card">
          <div className="alert-card-header">
            <div className="alert-card-title">
              <TrendingDown size={18} className="alert-icon-red" />
              <h4>Low Stock Alerts</h4>
            </div>
            <span className="alert-badge alert-badge-red">{lowStockItems.length}</span>
          </div>
          <div className="alert-list">
            {lowStockItems.length === 0 ? (
              <p className="expiry-meta" style={{ padding: '12px 0', textAlign: 'center' }}>
                All products are well-stocked.
              </p>
            ) : (
              lowStockItems.map((item, index) => (
                <div key={index} className="lowstock-item">
                  <div>
                    <p className="expiry-name">{item.name}</p>
                    <p className="expiry-meta">Category: {item.category}</p>
                  </div>
                  <div className="lowstock-units">
                    <span className="lowstock-count">{item.units}</span>
                    <span className="lowstock-label">units left</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="activity-card">
        <div className="alert-card-header">
          <div className="alert-card-title">
            <Calendar size={18} className="alert-icon-blue" />
            <h4>Recent Activities</h4>
          </div>
        </div>
        <div className="activity-list">
          <div className="activity-item" style={{ justifyContent: 'center', padding: '24px 0' }}>
            <p className="expiry-meta">No recent activities to display.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
