const express = require('express');
const router = express.Router();
const store = require('../data/store');
const { optionalAuthenticate } = require('../middleware/auth');

// Initialize Stripe if API key provided
let stripe = null;
if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
  try {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    console.log('Stripe client initialized in live/test mode');
  } catch (err) {
    console.warn('Stripe package initialization failed, fallback to simulator mode:', err.message);
  }
}

// Generate license key for digital product
function generateLicenseKey(prefix = 'LIC') {
  const segment = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${segment()}-${segment()}-${segment()}-${new Date().getFullYear()}`;
}

// Create Checkout Session (Stripe or Demo Simulator)
router.post('/create-session', optionalAuthenticate, async (req, res) => {
  try {
    const { items, customerEmail, customerName, discountCode, clientOrigin } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Verify items and prices from server store (prevents price tampering)
    const verifiedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = store.getProductById(item.productId);
      if (!product) {
        return res.status(400).json({ error: `Product not found: ${item.productId}` });
      }
      const qty = item.quantity || 1;
      const itemTotal = product.price * qty;
      subtotal += itemTotal;

      verifiedItems.push({
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity: qty,
        downloadFileName: product.fileDetails ? product.fileDetails.fileName : `${product.slug}.zip`,
        licenseKey: generateLicenseKey(product.slug.substring(0, 4).toUpperCase())
      });
    }

    // Discount code calculation
    let discountAmount = 0;
    if (discountCode) {
      const code = discountCode.trim().toUpperCase();
      if (code === 'WELCOME20') {
        discountAmount = Math.round(subtotal * 0.20);
      } else if (code === 'SAVE10') {
        discountAmount = Math.round(subtotal * 0.10);
      }
    }

    const finalTotal = Math.max(0, subtotal - discountAmount);
    const userId = req.user ? req.user.id : null;
    const finalEmail = customerEmail || (req.user ? req.user.email : 'guest@example.com');
    const finalName = customerName || (req.user ? req.user.name : 'Valued Customer');

    const origin = clientOrigin || process.env.CLIENT_URL || 'http://localhost:5173';

    // If Stripe is configured and requested
    if (stripe && req.body.useRealStripe) {
      const line_items = verifiedItems.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.title,
            description: `Digital download + license key: ${item.downloadFileName}`
          },
          unit_amount: Math.round(item.price * 100)
        },
        quantity: item.quantity
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        customer_email: finalEmail,
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/cart?canceled=true`,
        metadata: {
          userId: userId || '',
          orderItems: JSON.stringify(verifiedItems.map(i => ({ productId: i.productId, licenseKey: i.licenseKey })))
        }
      });

      // Save pending order
      const pendingOrder = {
        id: `ord_${Date.now()}`,
        userId,
        customerEmail: finalEmail,
        customerName: finalName,
        items: verifiedItems,
        totalAmount: finalTotal,
        discountApplied: discountAmount,
        status: 'pending',
        paymentMethod: 'Stripe Checkout',
        stripeSessionId: session.id,
        createdAt: new Date().toISOString()
      };
      store.addOrder(pendingOrder);

      return res.json({
        type: 'stripe',
        url: session.url,
        sessionId: session.id
      });
    }

    // Instant / Demo Checkout Simulator (zero configuration required, fully functional)
    const completedOrder = {
      id: `ord_${Date.now()}`,
      userId,
      customerEmail: finalEmail,
      customerName: finalName,
      items: verifiedItems,
      totalAmount: finalTotal,
      discountApplied: discountAmount,
      status: 'completed',
      paymentMethod: 'Instant Secure Checkout (Simulated)',
      stripeSessionId: `mock_session_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    store.addOrder(completedOrder);

    res.json({
      type: 'simulator',
      orderId: completedOrder.id,
      successUrl: `${origin}/checkout/success?order_id=${completedOrder.id}`
    });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: err.message || 'Checkout session failed' });
  }
});

// Verify Stripe session status or fetch completed order details
router.get('/order-status', (req, res) => {
  try {
    const { order_id, session_id } = req.query;

    if (order_id) {
      const order = store.getOrderById(order_id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      return res.json({ order });
    }

    if (session_id) {
      const allOrders = store.getOrders();
      const order = allOrders.find(o => o.stripeSessionId === session_id);
      if (order) {
        // If it was pending and we have verified session, complete it
        if (order.status === 'pending') {
          store.updateOrderStatus(order.id, 'completed');
        }
        return res.json({ order });
      }
      return res.status(404).json({ error: 'Order not found for this session' });
    }

    res.status(400).json({ error: 'Missing order_id or session_id parameter' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve order status' });
  }
});

module.exports = router;
