import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, User, Calendar, Share2, Heart } from 'lucide-react';
import { getItems, expressInterest } from '../../apiCalls/itemCalls';

const BrowseItems = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});
  
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    city: '',
    state: '',
    search: '',
    page: 1
  });

  const [interestLoadingId, setInterestLoadingId] = useState(null);
  const [interestedIds, setInterestedIds] = useState(new Set());
  const [shareLoadingId, setShareLoadingId] = useState(null);
  const [sharedIds, setSharedIds] = useState(new Set());

  useEffect(() => {
    loadItems();
  }, [filters]);

  const loadItems = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await getItems(filters);
      setItems(response.items);
      setPagination(response.pagination);
    } catch (error) {
      setError('Error loading items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (itemId, title) => {
    const shareUrl = `${window.location.origin}/item/${itemId}`;
    try {
      setShareLoadingId(itemId);
      if (navigator.share) {
        await navigator.share({ title: title || 'EcoLink Item', url: shareUrl });
        setSharedIds(prev => new Set(prev).add(itemId));
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setSharedIds(prev => new Set(prev).add(itemId));
      } else {
        window.prompt('Copy this link:', shareUrl);
      }
    } catch (e) {
      // ignore
    } finally {
      setShareLoadingId(null);
      setTimeout(() => {
        setSharedIds(prev => {
          const clone = new Set(prev);
          clone.delete(itemId);
          return clone;
        });
      }, 2000);
    }
  };

  const handleInterested = async (itemId) => {
    if (!userData) {
      navigate('/signin');
      return;
    }
    if (interestLoadingId) return;
    setInterestLoadingId(itemId);
    try {
      await expressInterest(itemId);
      setInterestedIds(prev => new Set(prev).add(itemId));
    } catch (err) {
      // Handle interest error silently
    } finally {
      setInterestLoadingId(null);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'giveaway': return 'text-green-600 bg-green-100';
      case 'exchange': return 'text-blue-600 bg-blue-100';
      case 'request': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'books', label: 'Books' },
    { value: 'home', label: 'Home & Garden' },
    { value: 'sports', label: 'Sports & Recreation' },
    { value: 'toys', label: 'Toys & Games' },
    { value: 'tools', label: 'Tools' },
    { value: 'other', label: 'Other' }
  ];

  const types = [
    { value: '', label: 'All Types' },
    { value: 'giveaway', label: 'Giveaway' },
    { value: 'exchange', label: 'Exchange' },
    { value: 'request', label: 'Request' }
  ];

  return (
    <div className="min-h-screen bg-(--bg)">
      <div className="container-app py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover <span className="gradient-text">Items</span>
            </h1>
            <p className="text-xl text-(--muted) max-w-3xl mx-auto">
              Find amazing items shared by your community. Every discovery helps build a more sustainable future.
            </p>
          </div>
        </motion.div>

        {/* Enhanced Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card p-8 mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 flex items-center justify-center">
              <Filter className="h-5 w-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-(--fg)">Search & Filter</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label htmlFor="search" className="block text-sm font-semibold text-(--fg)">
                <Search className="inline h-4 w-4 mr-2" />
                Search Items
              </label>
              <input
                type="text"
                id="search"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input"
                placeholder="What are you looking for?"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-semibold text-(--fg)">
                Category
              </label>
              <select
                id="category"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="select"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="type" className="block text-sm font-semibold text-(--fg)">
                Type
              </label>
              <select
                id="type"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="select"
              >
                {types.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="city" className="block text-sm font-semibold text-(--fg)">
                <MapPin className="inline h-4 w-4 mr-2" />
                Location
              </label>
              <input
                type="text"
                id="city"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="input"
                placeholder="Enter city..."
              />
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl mb-8"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 text-sm">⚠️</span>
              </div>
              {error}
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600"></div>
              <p className="text-(--muted) font-medium">Discovering amazing items...</p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-8">
              <span className="text-6xl">📦</span>
            </div>
            <h3 className="text-2xl font-bold text-(--fg) mb-4">No items found</h3>
            <p className="text-(--muted) mb-8 max-w-md mx-auto">
              Try adjusting your filters or check back later for new items in your area.
            </p>
            <button
              onClick={() => setFilters({ category: '', type: '', city: '', state: '', search: '', page: 1 })}
              className="btn btn-outline"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <>
            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {items.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group card overflow-hidden hover-lift relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    {/* Image (first image if available) */}
                      <div className="h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-6xl">📦</span>
                        )}
                        <div className="absolute top-4 right-4 flex gap-2">
                          <span className={`badge ${getTypeColor(item.type).includes('green') ? 'badge-success' : getTypeColor(item.type).includes('blue') ? 'badge' : 'badge-warning'}`}>
                            {item.type}
                          </span>
                        </div>
                      </div>
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-(--fg) line-clamp-2 group-hover:text-(--brand) transition-colors">
                          {item.title}
                        </h3>
                      </div>
                      
                      <p className="text-(--muted) text-sm mb-4 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className={`badge ${getConditionColor(item.condition).includes('green') ? 'badge-success' : getConditionColor(item.condition).includes('blue') ? 'badge' : 'badge-warning'}`}>
                          {item.condition}
                        </span>
                        <span className="text-sm text-(--muted) capitalize font-medium">
                          {item.category}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center text-sm text-(--muted)">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{item.location.city}, {item.location.state}</span>
                        </div>
                        <div className="flex items-center text-sm text-(--muted)">
                          <User className="h-4 w-4 mr-2" />
                          <span>{item.owner.name}</span>
                        </div>
                        <div className="flex items-center text-sm text-(--muted)">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {item.environmentalImpact && (
                        <div className="p-4 rounded-xl mb-6 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200">
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-600">🌱</span>
                              <span className="font-semibold text-emerald-800">{item.environmentalImpact.estimatedCo2Saved}kg CO₂</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-600">♻️</span>
                              <span className="font-semibold text-emerald-800">{item.environmentalImpact.estimatedWasteDiverted}kg waste</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-3">
                        <Link
                          to={`/item/${item._id}`}
                          className="flex-1 btn btn-primary text-center"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleInterested(item._id)}
                          disabled={interestLoadingId === item._id || interestedIds.has(item._id)}
                          className="btn btn-outline p-3 disabled:opacity-60 disabled:cursor-not-allowed"
                          title="Express Interest"
                        >
                          <Heart className={`h-4 w-4 ${interestedIds.has(item._id) ? 'fill-red-500 text-red-500' : ''}`} />
                        </button>
                        <button
                          onClick={() => handleShare(item._id, item.title)}
                          disabled={shareLoadingId === item._id}
                          className="btn btn-outline p-3 disabled:opacity-60 disabled:cursor-not-allowed"
                          title="Share Item"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Enhanced Pagination */}
            {pagination.totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex justify-center items-center gap-4"
              >
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex items-center gap-2">
                  <span className="px-4 py-2 text-(--fg) font-medium">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                </div>
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BrowseItems;
