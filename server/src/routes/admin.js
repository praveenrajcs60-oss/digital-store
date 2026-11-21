const express = require('express');
const router = express.Router();
const store = require('../data/store');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Protect all admin routes with auth and admin role check
router.use(authenticate, requireAdmin);

// Dashboard overview metrics
router.get('/stats', (req, res) => {
  try {
    const products = store.getProducts();
    const orders = store.getOrders();
    const users = store.getUsers().filter(u => u.role !== 'admin');

    const totalRevenue = orders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const completedOrders = orders.filter(o => o.status === 'completed').length;

    res.json({
      metrics: {
        totalRevenue,
        totalOrders: orders.length,
        completedOrders,
        totalProducts: products.length,
        totalCustomers: users.length
      },
      recentOrders: orders.slice(0, 5)
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

// Get all orders (admin view)
router.get('/orders', (req, res) => {
  try {
    const orders = store.getOrders();
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Create new digital product
router.post('/products', (req, res) => {
  try {
    const {
      title,
      category,
      price,
      originalPrice,
      summary,
      description,
      features,
      fileName,
      format,
      badge,
      image
    } = req.body;

    if (!title || !price || !category) {
      return res.status(400).json({ error: 'Title, price, and category are required' });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newProduct = {
      id: `prod_${Date.now()}`,
      title: title.trim(),
      slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
      category: category.trim(),
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      rating: 5.0,
      reviewCount: 0,
      badge: badge || 'New',
      summary: summary || '',
      description: description || '',
      features: Array.isArray(features) ? features : (features ? features.split('\n').filter(Boolean) : []),
      fileDetails: {
        fileName: fileName || `${slug}.zip`,
        fileSize: '12.0 MB',
        format: format || 'ZIP Archive',
        version: 'v1.0.0',
        licenseType: 'Commercial License'
      },
      image: image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString()
    };

    store.addProduct(newProduct);
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product
router.put('/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const existing = store.getProductById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updates = { ...req.body };
    if (updates.price) updates.price = parseFloat(updates.price);
    if (updates.originalPrice) updates.originalPrice = parseFloat(updates.originalPrice);

    const updated = store.updateProduct(id, updates);
    res.json({ message: 'Product updated successfully', product: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const success = store.deleteProduct(id);
    if (!success) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
