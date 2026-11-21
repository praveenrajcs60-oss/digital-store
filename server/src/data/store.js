const fs = require('fs');
const path = require('path');
const {
  initialCategories,
  initialUsers,
  initialProducts,
  initialReviews,
  initialOrders
} = require('./seedData');

const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

class Store {
  constructor() {
    this.data = {
      categories: [...initialCategories],
      users: [...initialUsers],
      products: [...initialProducts],
      reviews: [...initialReviews],
      orders: [...initialOrders]
    };
    this.init();
  }

  init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed && parsed.products && parsed.users) {
          this.data = parsed;
          return;
        }
      }
      this.save();
    } catch (err) {
      console.warn('Could not read persistent store file, using in-memory store:', err.message);
    }
  }

  save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.warn('Could not persist data to file:', err.message);
    }
  }

  // --- Users ---
  getUsers() {
    return this.data.users;
  }

  getUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  getUserByEmail(email) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  addUser(user) {
    this.data.users.push(user);
    this.save();
    return user;
  }

  // --- Products ---
  getProducts() {
    return this.data.products;
  }

  getProductById(id) {
    return this.data.products.find(p => p.id === id);
  }

  getProductBySlug(slug) {
    return this.data.products.find(p => p.slug === slug);
  }

  addProduct(product) {
    this.data.products.unshift(product);
    this.save();
    return product;
  }

  updateProduct(id, updates) {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = { ...this.data.products[idx], ...updates };
    this.save();
    return this.data.products[idx];
  }

  deleteProduct(id) {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.data.products.splice(idx, 1);
    this.save();
    return true;
  }

  // --- Categories ---
  getCategories() {
    return this.data.categories;
  }

  // --- Reviews ---
  getReviewsByProductId(productId) {
    return this.data.reviews.filter(r => r.productId === productId);
  }

  addReview(review) {
    this.data.reviews.unshift(review);
    // recalculate product rating & review count
    const productReviews = this.getReviewsByProductId(review.productId);
    const avgRating = Number(
      (productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length).toFixed(1)
    );
    this.updateProduct(review.productId, {
      rating: avgRating,
      reviewCount: productReviews.length
    });
    this.save();
    return review;
  }

  // --- Orders ---
  getOrders() {
    return this.data.orders;
  }

  getOrderById(id) {
    return this.data.orders.find(o => o.id === id);
  }

  getOrdersByUserId(userId) {
    return this.data.orders.filter(o => o.userId === userId);
  }

  getOrdersByCustomerEmail(email) {
    return this.data.orders.filter(o => o.customerEmail.toLowerCase() === email.toLowerCase());
  }

  addOrder(order) {
    this.data.orders.unshift(order);
    this.save();
    return order;
  }

  updateOrderStatus(orderId, status) {
    const order = this.getOrderById(orderId);
    if (order) {
      order.status = status;
      this.save();
    }
    return order;
  }
}

const store = new Store();
module.exports = store;
