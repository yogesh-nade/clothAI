// Design Clothing Page - AI-powered custom clothing design tool
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const DesignClothing = () => {
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();
  
  // Form state for product creation
  const [form, setForm] = useState({
    prompt: '',      // AI image generation prompt
    title: '',       // Product title
    description: '', // Product description
    price: ''        // Product price
  });
  
  // UI state management
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [product, setProduct] = useState(null);

  // Redirect non-authenticated users to login
  useEffect(() => {
    if (!user) {
      toast.error('Please login to access the designer.');
      navigate('/login');
    }
  }, [user, navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit form and start AI image generation process
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setImage(null);
    setProduct(null);
    try {
      // Step 1: Start image generation
      const startRes = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/products/start-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: form.prompt })
      });
      const startData = await startRes.json();
      if (!startData.success || !startData.taskId) {
        toast.error(startData.message || 'Failed to start image generation.');
        setLoading(false);
        return;
      }
      // Step 2: Poll for completion
      let productData = null;
      for (let i = 0; i < 10; i++) {
        await new Promise(r => setTimeout(r, 3000));
        const completeRes = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/products/complete-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskId: startData.taskId,
            title: form.title,
            description: form.description,
            price: Number(form.price)
          })
        });
        const completeData = await completeRes.json();
        if (completeData.success && completeData.product) {
          productData = completeData.product;
          break;
        }
        if (completeData.message && completeData.message.includes('failed')) {
          toast.error(completeData.message);
          setLoading(false);
          return;
        }
      }
      if (productData) {
        toast.success('Design generated and saved!');
        setProduct(productData);
        setImage(`${import.meta.env.VITE_SERVER_URL}${productData.image}`);
      } else {
        toast.error('Image generation timed out. Please try again.');
      }
    } catch (err) {
      toast.error('Error generating image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h2 className="text-2xl font-bold mb-6">AI Clothing Designer</h2>
      <form className="w-full max-w-md space-y-4 bg-white/10 p-6 rounded-xl shadow-lg" onSubmit={handleSubmit}>
        <input
          type="text"
          name="prompt"
          placeholder="Describe your clothing design..."
          className="w-full p-3 rounded-lg border"
          value={form.prompt}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="w-full p-3 rounded-lg border"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full p-3 rounded-lg border"
          value={form.description}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          className="w-full p-3 rounded-lg border"
          value={form.price}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-lg"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate & Save'}
        </button>
      </form>
      {image && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Generated Design:</h3>
          <img src={image} alt={product?.title} className="w-64 h-64 object-contain rounded-xl border" />
          <div className="mt-2 text-center">
            <strong>{product?.title}</strong>
            <p>{product?.description}</p>
            <p className="font-bold text-green-600">${product?.price}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignClothing;
