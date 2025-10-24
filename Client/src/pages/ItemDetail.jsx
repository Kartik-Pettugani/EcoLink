import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getItemById, expressInterest, deleteItem } from '../../apiCalls/itemCalls';

const ItemDetail = () => {
  const { userData } = useSelector((state) => state.user);
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [interestLoading, setInterestLoading] = useState(false);
  const [interestMessage, setInterestMessage] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    setLoading(true);
    setError('');
    
    try {
      const itemData = await getItemById(id);
      setItem(itemData);
    } catch (error) {
      setError('Error loading item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShareItem = async () => {
    const shareUrl = `${window.location.origin}/item/${id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: item?.title || 'EcoLink Item', url: shareUrl });
        setActionMessage('Share sheet opened.');
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setActionMessage('Link copied to clipboard.');
      } else {
        window.prompt('Copy this link:', shareUrl);
        setActionMessage('Link ready to copy.');
      }
    } catch (e) {
      setActionMessage('Unable to share at the moment.');
    } finally {
      setTimeout(() => setActionMessage(''), 2500);
    }
  };

  const handleDeleteItem = async () => {
    if (!isOwner) return;
    const ok = window.confirm('Are you sure you want to delete this item? This action cannot be undone.');
    if (!ok) return;
    try {
      setDeleteLoading(true);
      await deleteItem(id);
      navigate('/browse');
    } catch (e) {
      setActionMessage(e.response?.data?.message || 'Failed to delete item.');
    } finally {
      setDeleteLoading(false);
      setTimeout(() => setActionMessage(''), 2500);
    }
  };

  const handleExpressInterest = async () => {
    if (!userData) {
      navigate('/signin');
      return;
    }

    setInterestLoading(true);
    setInterestMessage('');

    try {
      const updatedItem = await expressInterest(id);
      setItem(updatedItem);
      setInterestMessage('Interest expressed successfully! The owner will be notified.');
    } catch (error) {
      setInterestMessage(error.response?.data?.message || 'Error expressing interest. Please try again.');
    } finally {
      setInterestLoading(false);
    }
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

  const isOwner = userData && item && userData._id === item.owner._id;
  const hasExpressedInterest = userData && item && item.interestedUsers.some(user => user._id === userData._id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">❌</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Item not found</h3>
          <p className="text-gray-600 mb-4">{error || 'The item you\'re looking for doesn\'t exist.'}</p>
          <Link
            to="/browse"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Browse Items
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--bg)">
      {/* Navigation */}

      <div className="container-app py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="card overflow-hidden">
              {/* Image */}
              <div className="h-96 bg-gray-200/50 flex items-center justify-center">
                {item.images && item.images.length > 0 ? (
                  <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-8xl text-gray-400">📦</span>
                )}
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-3xl font-bold text-(--fg)">{item.title}</h1>
                  <div className="flex space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(item.type)}`}>
                      {item.type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(item.condition)}`}>
                      {item.condition}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center text-(--muted) mb-4">
                  <span className="capitalize">📂 {item.category}</span>
                  <span className="mx-2">•</span>
                  <span>📍 {item.location.city}, {item.location.state}</span>
                  <span className="mx-2">•</span>
                  <span>📅 {new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="prose max-w-none mb-6">
                  <p className="text-(--fg) leading-relaxed">{item.description}</p>
                </div>
                
                {item.tags && item.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-(--fg) mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-(--fg) rounded-md text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {item.pickupInstructions && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-(--fg) mb-2">Pickup Instructions</h3>
                    <p className="text-(--fg) bg-gray-50 p-3 rounded-md">{item.pickupInstructions}</p>
                  </div>
                )}
                
                {/* Environmental Impact */}
                {item.environmentalImpact && (
                  <div className="bg-green-50/70 p-4 rounded-lg mb-6">
                    <h3 className="text-sm font-medium text-green-800 mb-3">Environmental Impact</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {item.environmentalImpact.estimatedCo2Saved}kg
                        </div>
                        <div className="text-xs text-green-700">CO₂ Saved</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {item.environmentalImpact.estimatedWasteDiverted}kg
                        </div>
                        <div className="text-xs text-green-700">Waste Diverted</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {item.environmentalImpact.estimatedWeight}kg
                        </div>
                        <div className="text-xs text-green-700">Item Weight</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Owner Info */}
            <div className="card p-6 mb-6 hover-lift">
              <h3 className="text-lg font-semibold text-(--fg) mb-4">Item Owner</h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <h4 className="font-medium text-(--fg)">{item.owner.name}</h4>
                  <p className="text-sm text-(--muted)">@{item.owner.userName}</p>
                  <div className="flex items-center text-yellow-500 text-sm">
                    {'★'.repeat(Math.floor(item.owner.rating || 5))}
                    <span className="ml-1 text-(--muted)">({item.owner.totalRatings || 0})</span>
                  </div>
                </div>
              </div>
              
              {!isOwner && (
                <button onClick={() => navigate(`/messages/${item.owner._id}`)} className="w-full btn btn-outline">
                  Message Owner
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-(--fg) mb-4">Actions</h3>
              
              {interestMessage && (
                <div className={`mb-4 p-3 rounded-md text-sm ${
                  interestMessage.includes('Error') ? 'bg-red-50 border border-red-200 text-red-600' : 'bg-green-50 border border-green-200 text-green-600'
                }`}>
                  {interestMessage}
                </div>
              )}
              {actionMessage && (
                <div className="mb-4 p-3 rounded-md text-sm bg-green-50 border border-green-200 text-green-700">
                  {actionMessage}
                </div>
              )}
              
              {isOwner ? (
                <div className="space-y-3">
                  <button onClick={() => navigate(`/item/${id}/edit`)} className="w-full btn btn-outline">
                    Edit Item
                  </button>
                  <button onClick={handleDeleteItem} disabled={deleteLoading} className="w-full btn btn-outline disabled:opacity-60">
                    Delete Item
                  </button>
                  {item.interestedUsers.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-(--fg) mb-2">
                        Interested Users ({item.interestedUsers.length})
                      </h4>
                      <div className="space-y-2">
                        {item.interestedUsers.map((user) => (
                          <div key={user._id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-xs">👤</span>
                              </div>
                              <span className="text-sm text-(--fg)">{user.name}</span>
                            </div>
                            <button className="text-xs btn btn-primary px-2 py-1 h-7">
                              Select
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {item.status === 'available' ? (
                    <button
                      onClick={handleExpressInterest}
                      disabled={interestLoading || hasExpressedInterest}
                      className={`w-full btn ${hasExpressedInterest ? 'btn-outline opacity-60 cursor-not-allowed' : 'btn-primary'}`}
                    >
                      {interestLoading ? 'Processing...' : hasExpressedInterest ? 'Interest Expressed' : 'Express Interest'}
                    </button>
                  ) : (
                    <div className="text-center py-2 px-4 bg-gray-100 text-(--muted) rounded-md">
                      {item.status === 'pending' ? 'Item is pending' : 
                       item.status === 'taken' ? 'Item has been taken' : 'Item has expired'}
                    </div>
                  )}
                  
                  <button onClick={handleShareItem} className="w-full btn btn-outline">
                    Share Item
                  </button>
                </div>
              )}
            </div>

            {/* Location */}
            <div className="card p-6 mt-6">
              <h3 className="text-lg font-semibold text-(--fg) mb-4">Location</h3>
              <div className="text-sm text-(--muted)">
                <p>{item.location.address}</p>
                <p>{item.location.city}, {item.location.state} {item.location.zipCode}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
