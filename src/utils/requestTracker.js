// In-memory request tracker
// For production, consider using Redis or a database
class RequestTracker {
  constructor() {
    this.requests = new Map();
  }

  create(requestId, data) {
    this.requests.set(requestId, {
      requestId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data
    });
  }

  update(requestId, updates) {
    const existing = this.requests.get(requestId);
    if (existing) {
      this.requests.set(requestId, {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString()
      });
    }
  }

  get(requestId) {
    return this.requests.get(requestId);
  }

  delete(requestId) {
    this.requests.delete(requestId);
  }

  // Clean up old requests (older than 24 hours)
  cleanup() {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    for (const [requestId, data] of this.requests.entries()) {
      if (new Date(data.createdAt) < oneDayAgo) {
        this.requests.delete(requestId);
      }
    }
  }
}

module.exports = new RequestTracker();
