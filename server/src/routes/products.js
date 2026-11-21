const express = require('express');
const router = express.Router();
const store = require('../data/store');

// Get all products with search, filter, and sorting
router.get('/', (req, res) => {
  try {
    let products = [...store.getProducts()];
    const { q, category, sort, minPrice, maxPrice } = req.query;

    // Search query
    if (q) {
      const keyword = q.toLowerCase().trim();
      products = products.filter(p =>
        p.title.toLowerCase().includes(keyword) ||
        p.summary.toLowerCase().includes(keyword) ||
        p.description.toLowerCase().includes(keyword) ||
        (p.badge && p.badge.toLowerCase().includes(keyword)) ||
        (p.features && p.features.some(f => f.toLowerCase().includes(keyword)))
      );
    }

    // Category filter
    if (category && category !== 'All') {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Price range filter
    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        products = products.filter(p => p.price >= min);
      }
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        products = products.filter(p => p.price <= max);
      }
    }

    // Sorting
    switch (sort) {
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'featured':
      default:
        // Keep order (seed order or best sellers first)
        break;
    }

    res.json({
      total: products.length,
      products
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get available categories
router.get('/categories', (req, res) => {
  try {
    const categories = store.getCategories();
    res.json({ categories: ['All', ...categories] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get product by ID or Slug
router.get('/:idOrSlug', (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let product = store.getProductById(idOrSlug) || store.getProductBySlug(idOrSlug);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const reviews = store.getReviewsByProductId(product.id);

    res.json({
      product,
      reviews
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
});

module.exports = router;
