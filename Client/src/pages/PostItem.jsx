import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Upload, Tag, Package, AlertCircle, CheckCircle } from 'lucide-react';
import { createItem } from '../../apiCalls/itemCalls';
import { uploadImages } from '../../apiCalls/uploadCalls';

const PostItem = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    type: 'giveaway',
    images: [],
    imageFiles: [], // Store actual file objects
    tags: '',
    pickupInstructions: '',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: ''
    },
    environmentalImpact: {
      estimatedWeight: 1
    }
  });

  useEffect(() => {
    if (userData?.location) {
      setFormData(prev => ({
        ...prev,
        location: userData.location
      }));
    }
  }, [userData]);

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
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls],
      imageFiles: [...prev.imageFiles, ...files]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imageFiles: prev.imageFiles.filter((_, i) => i !== index)
    }));
  };

  const getCurrentLocation = () => {
    setMessage('Location services coming soon! Please enter your address manually.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validation
    if (!formData.title || !formData.description || !formData.category || !formData.condition) {
      setMessage('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    if (!formData.location.address || !formData.location.city) {
      setMessage('Please provide your location.');
      setLoading(false);
      return;
    }
      // Ensure other required location fields and numeric coordinates
      if (!formData.location.state || !formData.location.zipCode) {
        setMessage('Please complete your address (state and ZIP code).');
        setLoading(false);
        return;
      }
      const lat = parseFloat(formData.location.coordinates.lat);
      const lng = parseFloat(formData.location.coordinates.lng);
      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        setMessage('Please provide valid numeric coordinates for your location.');
        setLoading(false);
        return;
      }

    try {
      // Upload images first if any
      let uploadedImageUrls = [];
      if (formData.imageFiles.length > 0) {
        try {
          const uploadResponse = await uploadImages(formData.imageFiles);
          uploadedImageUrls = uploadResponse.images.map(img => img.url);
        } catch (uploadError) {
          setMessage('Error uploading images. Please try again.');
          setLoading(false);
          return;
        }
      }

      // Convert tags string to array
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const itemData = {
        ...formData,
        images: uploadedImageUrls, // Use uploaded URLs instead of local URLs
        tags: tagsArray
      };

      // Remove imageFiles from the data sent to server
      delete itemData.imageFiles;

      const newItem = await createItem(itemData);
      
      // Update user's environmental impact
      if (newItem.environmentalImpact) {
        // This would typically be handled by the backend
        // For now, we'll just show success
      }
      
      setMessage('Item posted successfully!');
      setTimeout(() => {
        navigate('/home');
      }, 2000);
      
    } catch (error) {
        const serverData = error.response?.data;
        if (serverData?.message === 'Validation Error' && serverData.errors) {
          // Combine validation errors into a single message
          const details = Object.entries(serverData.errors).map(([k, v]) => `${k}: ${v}`).join(' | ');
          setMessage(`Validation Error: ${details}`);
        } else {
          setMessage(serverData?.message || 'Error posting item. Please try again.');
        }
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-(--bg)">
      <div className="container-app py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="card p-8"
        >
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-2xl blur opacity-75"></div>
              <div className="relative bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 rounded-2xl">
                <Package className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-(--fg) mb-2">
              Share an Item with <span className="gradient-text">EcoLink</span>
            </h1>
            <p className="text-(--muted)">
              Help your community by sharing items you no longer need
            </p>
          </div>
          
          {message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mb-8 p-6 rounded-xl flex items-center gap-3 ${
                message.includes('Error') 
                  ? 'bg-red-50 border border-red-200 text-red-600' 
                  : 'bg-green-50 border border-green-200 text-green-600'
              }`}
            >
              {message.includes('Error') ? (
                <AlertCircle className="h-5 w-5" />
              ) : (
                <CheckCircle className="h-5 w-5" />
              )}
              <span className="font-medium">{message}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-(--fg)">Basic Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="block text-sm font-semibold text-(--fg)">
                    Item Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="input"
                    placeholder="e.g., Vintage Wooden Chair"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="category" className="block text-sm font-semibold text-(--fg)">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="select"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-semibold text-(--fg)">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="textarea"
                  placeholder="Describe the item, its condition, and why you're sharing it..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="condition" className="block text-sm font-semibold text-(--fg)">
                    Condition *
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="select"
                  >
                    <option value="">Select condition</option>
                    {conditions.map(cond => (
                      <option key={cond.value} value={cond.value}>{cond.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="type" className="block text-sm font-semibold text-(--fg)">
                    Exchange Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="select"
                  >
                    {types.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-(--fg)">Location</h2>
                </div>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="btn btn-outline btn-sm"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Use Current Location
                </button>
              </div>

              <div className="space-y-2">
                <label htmlFor="location.address" className="block text-sm font-semibold text-(--fg)">
                  Address *
                </label>
                <input
                  type="text"
                  id="location.address"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter your full address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label htmlFor="location.city" className="block text-sm font-semibold text-(--fg)">
                    City *
                  </label>
                  <input
                    type="text"
                    id="location.city"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleChange}
                    className="input"
                    placeholder="City"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="location.state" className="block text-sm font-semibold text-(--fg)">
                    State
                  </label>
                  <input
                    type="text"
                    id="location.state"
                    name="location.state"
                    value={formData.location.state}
                    onChange={handleChange}
                    className="input"
                    placeholder="State"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="location.zipCode" className="block text-sm font-semibold text-(--fg)">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="location.zipCode"
                    name="location.zipCode"
                    value={formData.location.zipCode}
                    onChange={handleChange}
                    className="input"
                    placeholder="ZIP Code"
                  />
                </div>
              </div>
            </motion.div>

            {/* Additional Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 flex items-center justify-center">
                  <Tag className="h-5 w-5 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-(--fg)">Additional Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="tags" className="block text-sm font-semibold text-(--fg)">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="input"
                    placeholder="vintage, wooden, chair, dining"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="environmentalImpact.estimatedWeight" className="block text-sm font-semibold text-(--fg)">
                    Estimated Weight (kg)
                  </label>
                  <input
                    type="number"
                    id="environmentalImpact.estimatedWeight"
                    name="environmentalImpact.estimatedWeight"
                    value={formData.environmentalImpact.estimatedWeight}
                    onChange={handleChange}
                    min="0.1"
                    step="0.1"
                    className="input"
                    placeholder="1.0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="pickupInstructions" className="block text-sm font-semibold text-(--fg)">
                  Pickup Instructions
                </label>
                <textarea
                  id="pickupInstructions"
                  name="pickupInstructions"
                  rows={3}
                  value={formData.pickupInstructions}
                  onChange={handleChange}
                  className="textarea"
                  placeholder="Any special instructions for pickup..."
                />
              </div>
            </motion.div>

            {/* Image Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-600/10 flex items-center justify-center">
                  <Upload className="h-5 w-5 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-(--fg)">Images</h2>
              </div>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-(--border) rounded-xl p-8 text-center hover:border-emerald-400 transition-colors">
                  <input
                    type="file"
                    id="images"
                    name="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="images"
                    className="cursor-pointer flex flex-col items-center gap-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 flex items-center justify-center">
                      <Upload className="h-8 w-8 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-(--fg) mb-2">
                        Upload Images
                      </p>
                      <p className="text-(--muted)">
                        Click to select images or drag and drop them here
                      </p>
                      <p className="text-sm text-(--muted) mt-1">
                        Up to 5 images (JPG, PNG, GIF)
                      </p>
                    </div>
                  </label>
                </div>

                {/* Image Previews */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-(--border)"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-end gap-4 pt-6 border-t border-(--border)"
            >
              <button
                type="button"
                onClick={() => navigate('/home')}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Posting Item...
                  </div>
                ) : (
                  'Post Item'
                )}
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default PostItem;
