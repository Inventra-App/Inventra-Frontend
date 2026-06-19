import React, { useState, useEffect } from 'react'
import { ClipboardList, ShoppingCart, Truck, Package, User, Calendar, ChevronDown, Filter } from 'lucide-react'
import './Css/ActivityLog.css'
import { getActivityLogs } from '../../API/inventoryApi'

const ITEMS_PER_PAGE = 10

const filterOptions = [
  { label: 'All Activities', value: 'all' },
  { label: 'Sales', value: 'sale' },
  { label: 'Goods Received', value: 'receiving' },
  { label: 'Products Created', value: 'inventory' },
  { label: 'Stock Update', value: 'stock' },
]

const getModuleType = (module = '') => {
  const m = module.toUpperCase()
  if (m.includes('SALE') || m.includes('POS')) return 'sale'
  if (m.includes('STOCK') || m.includes('BATCH') || m.includes('RECEIV')) return 'receiving'
  return 'inventory'
}

const getIcon = (type) => {
  if (type === 'sale') return <ShoppingCart size={18} />
  if (type === 'receiving') return <Truck size={18} />
  return <Package size={18} />
}

const getIconClass = (type) => {
  if (type === 'sale') return 'activity-icon-green'
  if (type === 'receiving') return 'activity-icon-purple'
  return 'activity-icon-blue'
}

const getTagClass = (type) => {
  if (type === 'sale') return 'activity-tag-green'
  if (type === 'receiving') return 'activity-tag-purple'
  return 'activity-tag-blue'
}

const getTagLabel = (type) => {
  if (type === 'sale') return 'Sale'
  if (type === 'receiving') return 'Receiving'
  return 'Inventory'
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

const ActivityLog = () => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true)
      try {
        const res = await getActivityLogs()
        const list = Array.isArray(res?.data) ? res.data : []
        setActivities(list.map((item) => ({
         id: item._id,
         type: getModuleType(item.module),
         label: item.action || item.title || 'Activity',
         desc: item.description || '-',
         user: item.user || 'System',
         date: formatDate(item.createdAt),
         amount: item.amount > 0 ? `+₦${Number(item.amount).toLocaleString()}` : null,
         module: item.module,
         })))
      } catch (err) {
        console.error('Activity log fetch error:', err)
        setActivities([])
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [])

  const filtered = filter === 'all' ? activities : activities.filter((a) => a.type === filter)

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const salesCount = activities.filter((a) => a.type === 'sale').length
  const receivingCount = activities.filter((a) => a.type === 'receiving').length
  const inventoryCount = activities.filter((a) => a.type === 'inventory').length

  const statCards = [
    { label: 'Total Activities', value: activities.length, icon: <ClipboardList size={20} />, color: 'blue' },
    { label: 'Sales', value: salesCount, icon: <ShoppingCart size={20} />, color: 'green' },
    { label: 'Goods Received', value: receivingCount, icon: <Truck size={20} />, color: 'purple' },
    { label: 'Products Created', value: inventoryCount, icon: <Package size={20} />, color: 'pink' },
    { label: 'Inventory Updates', value: 0, icon: <Package size={20} />, color: 'orange' },
  ]

  const getFilterLabel = () => {
    const option = filterOptions.find((o) => o.value === filter)
    return `${option?.label} (${filter === 'all' ? activities.length : filtered.length})`
  }

  return (
    <div className="activity-page">
      <div className="activity-top">
        <h2 className="activity-title">Activity</h2>
        <p className="activity-sub">Track all actions and maintain accountability</p>
      </div>

      <div className="activity-stats">
        {statCards.map((card, index) => (
          <div key={index} className="activity-stat-card">
            <div className={`activity-stat-icon activity-stat-${card.color}`}>{card.icon}</div>
            <div>
              <p className="activity-stat-label">{card.label}</p>
              <h3 className="activity-stat-value">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="activity-filter-bar">
        <div className="activity-filter-left">
          <span className="activity-filter-icon"><Filter size={16} /></span>
          <span className="activity-filter-label">Filter by Action:</span>
        </div>
        <div className="activity-dropdown-wrapper">
          <button className="activity-dropdown-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
            {getFilterLabel()} <ChevronDown size={16} />
          </button>
          {dropdownOpen && (
            <div className="activity-dropdown-menu">
              {filterOptions.map((option) => (
                <div
                  key={option.value}
                  className={`activity-dropdown-item ${filter === option.value ? 'activity-dropdown-active' : ''}`}
                  onClick={() => { setFilter(option.value); setDropdownOpen(false); setCurrentPage(1) }}
                >
                  {option.label} ({option.value === 'all' ? activities.length : activities.filter((a) => a.type === option.value).length})
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="activity-timeline-card">
        <h3 className="activity-timeline-title">Activity Timeline</h3>

        {loading ? (
          <p className="activity-loading">Loading activity logs...</p>
        ) : filtered.length === 0 ? (
          <p className="activity-loading">No activities found.</p>
        ) : (
          <div className="activity-list">
            {paginated.map((item, index) => (
              <div key={item.id || index} className="activity-item">
                <div className={`activity-icon-wrap ${getIconClass(item.type)}`}>
                  {getIcon(item.type)}
                </div>
                <div className="activity-item-body">
                  <div className="activity-item-top">
                    <span className="activity-item-label">{item.label}</span>
                    <span className={`activity-tag ${getTagClass(item.type)}`}>{getTagLabel(item.type)}</span>
                  </div>
                  <p className="activity-item-desc">{item.desc}</p>
                  <div className="activity-item-meta">
                    <div className="activity-meta-user">
                      <User size={13} />
                      <span>{item.user}</span>
                    </div>
                    <div className="activity-meta-date">
                      <Calendar size={13} />
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>
                {item.amount && <span className="activity-amount">{item.amount}</span>}
              </div>
            ))}
          </div>
        )}

        <div className="activity-footer">
          <p>Showing {filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} actions</p>
          <div className="activity-pagination">
            <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button key={page} className={currentPage === page ? 'active' : ''} onClick={() => setCurrentPage(page)}>
                {page}
              </button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>›</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivityLog