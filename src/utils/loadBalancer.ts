// Load balancing utility for handling high-volume user registration
export class LoadBalancer {
  private requestQueues: Map<string, any[]> = new Map();
  private activeRequests: Map<string, number> = new Map();
  private maxConcurrentRequests: number = 50;
  private queueMaxSize: number = 1000;

  constructor(maxConcurrent: number = 50) {
    this.maxConcurrentRequests = maxConcurrent;
  }

  // Add request to queue with priority
  async enqueueRequest(
    key: string, 
    requestFn: () => Promise<any>, 
    priority: 'high' | 'medium' | 'low' = 'medium'
  ): Promise<any> {
    if (!this.requestQueues.has(key)) {
      this.requestQueues.set(key, []);
      this.activeRequests.set(key, 0);
    }

    const queue = this.requestQueues.get(key)!;
    
    // Check queue size limit
    if (queue.length >= this.queueMaxSize) {
      throw new Error('Request queue is full. Please try again later.');
    }

    return new Promise((resolve, reject) => {
      const request = {
        fn: requestFn,
        resolve,
        reject,
        priority,
        timestamp: Date.now()
      };

      // Insert based on priority
      if (priority === 'high') {
        queue.unshift(request);
      } else {
        queue.push(request);
      }

      this.processQueue(key);
    });
  }

  // Process queued requests
  private async processQueue(key: string) {
    const queue = this.requestQueues.get(key);
    const activeCount = this.activeRequests.get(key) || 0;

    if (!queue || queue.length === 0 || activeCount >= this.maxConcurrentRequests) {
      return;
    }

    const request = queue.shift();
    if (!request) return;

    this.activeRequests.set(key, activeCount + 1);

    try {
      const result = await request.fn();
      request.resolve(result);
    } catch (error) {
      request.reject(error);
    } finally {
      this.activeRequests.set(key, (this.activeRequests.get(key) || 1) - 1);
      
      // Process next request in queue
      setTimeout(() => this.processQueue(key), 10);
    }
  }

  // Get queue status
  getQueueStatus(key: string) {
    return {
      queueLength: this.requestQueues.get(key)?.length || 0,
      activeRequests: this.activeRequests.get(key) || 0,
      maxConcurrent: this.maxConcurrentRequests
    };
  }

  // Clear queue for a specific key
  clearQueue(key: string) {
    const queue = this.requestQueues.get(key);
    if (queue) {
      queue.forEach(request => 
        request.reject(new Error('Request cancelled'))
      );
      queue.length = 0;
    }
  }
}

// Global load balancer instance
export const globalLoadBalancer = new LoadBalancer(100); // Increased for high volume

// Rate limiter for API endpoints
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  // Check if request is allowed
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(
      timestamp => now - timestamp < this.windowMs
    );

    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    return true;
  }

  // Get remaining requests
  getRemainingRequests(identifier: string): number {
    const requests = this.requests.get(identifier) || [];
    const now = Date.now();
    const validRequests = requests.filter(
      timestamp => now - timestamp < this.windowMs
    );
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }

  // Reset requests for identifier
  reset(identifier: string) {
    this.requests.delete(identifier);
  }
}

// Global rate limiter instances
export const registrationRateLimiter = new RateLimiter(10, 60000); // 10 registrations per minute
export const apiRateLimiter = new RateLimiter(1000, 60000); // 1000 API calls per minute