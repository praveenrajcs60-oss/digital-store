const express = require('express');
const router = express.Router();
const store = require('../data/store');
const { authenticate } = require('../middleware/auth');

// Add a review for a product
router.post('/', authenticate, (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ error: 'Product ID, rating (1-5), and comment are required' });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const product = store.getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user has an order containing this product
    const userOrders = store.getOrdersByUserId(req.user.id);
    const verifiedPurchase = userOrders.some(
      order => order.status === 'completed' && order.items.some(item => item.productId === productId)
    );

    const newReview = {
      id: `rev_${Date.now()}`,
      productId,
      userId: req.user.id,
      userName: req.user.name,
      userRole: verifiedPurchase ? 'Verified Buyer' : 'Customer',
      rating: numRating,
      comment: comment.trim(),
      verifiedPurchase,
      createdAt: new Date().toISOString()
    };

    store.addReview(newReview);

    res.status(201).json({
      message: 'Review submitted successfully',
      review: newReview
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

module.exports = router;
