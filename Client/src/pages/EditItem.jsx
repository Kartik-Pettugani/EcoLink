import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getItemById, updateItem } from '../../apiCalls/itemCalls';

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    type: 'giveaway',
    images: [],
    tags: '',
    pickupInstructions: '',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      coordinates: { lat: 0, lng: 0 }
    },
    environmentalImpact: {
      estimatedWeight: 1
    }
  });

  useEffect(() => {
    const load = async () => {
      try {
        const item = await getItemById(id);
        setFormData({
          title: item.title || '',
          description: item.description || '',
          category: item.category || '',
          condition: item.condition || '',
          type: item.type || 'giveaway',
          images: item.images || [],
          tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''),
          pickupInstructions: item.pickupInstructions || '',
          location: {
            address: item.location?.address || '',
            city: item.location?.city || '',
            state: item.location?.state || '',
            zipCode: item.location?.zipCode || '',
            coordinates: item.location?.coordinates || { lat: 0, lng: 0 }
          },
          environmentalImpact: {
            estimatedWeight: item.environmentalImpact?.estimatedWeight ?? 1
          }
        });
      } catch (e) {
        setMessage('Unable to load item.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    if (!formData.title || !formData.description || !formData.category || !formData.condition) {
      setMessage('Please fill in all required fields.');
      setSaving(false);
      return;
    }
    if (!formData.location.address || !formData.location.city || !formData.location.state || !formData.location.zipCode) {
      setMessage('Please complete your address.');
      setSaving(false);
      return;
    }

    try {
      const tagsArray = String(formData.tags).split(',').map(t => t.trim()).filter(Boolean);
      const payload = { ...formData, tags: tagsArray };
      await updateItem(id, payload);
      setMessage('Item updated successfully!');
      setTimeout(() => navigate(`/item/${id}`), 1200);
    } catch (error) {
      const server = error.response?.data;
      if (server?.message === 'Validation Error' && server.errors) {
        const details = Object.entries(server.errors).map(([k, v]) => `${k}: ${v}`).join(' | ');
        setMessage(`Validation Error: ${details}`);
      } else {
        setMessage(server?.message || 'Error updating item. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const categories = [
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

  const conditions = [
    { value: 'excellent', label: 'Excellent - Like new' },
    { value: 'good', label: 'Good - Minor wear' },
    { value: 'fair', label: 'Fair - Some wear' },
    { value: 'poor', label: 'Poor - Significant wear' }
  ];

  const types = [
    { value: 'giveaway', label: 'Giveaway - Free' },
    { value: 'exchange', label: 'Exchange - Trade for something' },
    { value: 'request', label: 'Request - Looking for this item' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-(--bg) flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--bg)">
      <div className="container-app py-8 max-w-3xl">
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-(--fg) mb-6">Edit Item</h2>
          {message && (
            <div className={`mb-6 p-4 rounded-md ${
              message.includes('Error') || message.includes('Validation')
              ? 'bg-red-50 border border-red-200 text-red-600'
              : 'bg-green-50 border border-green-200 text-green-600'
            }`}>
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-(--fg)">Basic Information</h3>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-(--fg)">Title *</label>
                <input id="title" name="title" type="text" className="mt-1 input" value={formData.title} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-(--fg)">Description *</label>
                <textarea id="description" name="description" rows={4} className="mt-1 textarea" value={formData.description} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-(--fg)">Category *</label>
                  <select id="category" name="category" className="mt-1 select" value={formData.category} onChange={handleChange}>
                    <option value="">Select a category</option>
                    {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="condition" className="block text-sm font-medium text-(--fg)">Condition *</label>
                  <select id="condition" name="condition" className="mt-1 select" value={formData.condition} onChange={handleChange}>
                    <option value="">Select condition</option>
                    {conditions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-(--fg)">Type</label>
                <select id="type" name="type" className="mt-1 select" value={formData.type} onChange={handleChange}>
                  {types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-(--fg)">Location</h3>
              </div>
              <div>
                <label htmlFor="location.address" className="block text-sm font-medium text-(--fg)">Address *</label>
                <input id="location.address" name="location.address" type="text" className="mt-1 input" value={formData.location.address} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="location.city" className="block text-sm font-medium text-(--fg)">City *</label>
                  <input id="location.city" name="location.city" type="text" className="mt-1 input" value={formData.location.city} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="location.state" className="block text-sm font-medium text-(--fg)">State</label>
                  <input id="location.state" name="location.state" type="text" className="mt-1 input" value={formData.location.state} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="location.zipCode" className="block text-sm font-medium text-(--fg)">ZIP Code</label>
                  <input id="location.zipCode" name="location.zipCode" type="text" className="mt-1 input" value={formData.location.zipCode} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-(--fg)">Additional Details</h3>
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-(--fg)">Tags (comma-separated)</label>
                <input id="tags" name="tags" type="text" className="mt-1 input" value={formData.tags} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="environmentalImpact.estimatedWeight" className="block text-sm font-medium text-(--fg)">Estimated Weight (kg)</label>
                <input id="environmentalImpact.estimatedWeight" name="environmentalImpact.estimatedWeight" type="number" min="0.1" step="0.1" className="mt-1 input" value={formData.environmentalImpact.estimatedWeight} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="pickupInstructions" className="block text-sm font-medium text-(--fg)">Pickup Instructions</label>
                <textarea id="pickupInstructions" name="pickupInstructions" rows={3} className="mt-1 textarea" value={formData.pickupInstructions} onChange={handleChange} />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button type="button" className="btn btn-outline" onClick={() => navigate(`/item/${id}`)}>Cancel</button>
              <button type="submit" className="btn btn-primary disabled:opacity-50" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditItem;
