const express = require('express');
const router = express.Router();
const store = require('../data/store');
const { authenticate, optionalAuthenticate } = require('../middleware/auth');

// Get all orders for the current user
router.get('/my-orders', authenticate, (req, res) => {
  try {
    const orders = store.getOrdersByUserId(req.user.id);
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your orders' });
  }
});

// Secure download endpoint for purchased digital goods
router.get('/download/:productId', optionalAuthenticate, (req, res) => {
  try {
    const { productId } = req.params;
    const { orderId } = req.query;

    const product = store.getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product file not found' });
    }

    // Verify ownership: either authenticated user owns it or orderId matches
    let authorized = false;

    if (req.user) {
      const userOrders = store.getOrdersByUserId(req.user.id);
      authorized = userOrders.some(
        o => o.status === 'completed' && o.items.some(i => i.productId === productId)
      );
    }

    if (!authorized && orderId) {
      const order = store.getOrderById(orderId);
      if (order && order.status === 'completed') {
        authorized = order.items.some(i => i.productId === productId);
      }
    }

    if (!authorized) {
      return res.status(403).json({
        error: 'Access denied. You have not purchased this digital asset or your session expired.'
      });
    }

    // Generate simulated download file payload with meaningful content
    const fileName = product.fileDetails ? product.fileDetails.fileName : `${product.slug}.zip`;
    const licenseText = `=====================================================
DIGITAL ASSET DELIVERY & LICENSE CERTIFICATE
=====================================================
Product: ${product.title}
Version: ${product.fileDetails ? product.fileDetails.version : '1.0.0'}
License: ${product.fileDetails ? product.fileDetails.licenseType : 'Standard License'}
Delivered to: ${req.user ? req.user.email : 'Customer'}
Date: ${new Date().toUTCString()}

Thank you for your purchase from our digital store!
This package includes the complete source files, documentation, and asset bundles.
`;

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(Buffer.from(licenseText, 'utf-8'));
  } catch (err) {
    res.status(500).json({ error: 'Download failed' });
  }
});

module.exports = router;
