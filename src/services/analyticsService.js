class AnalyticsService {
  constructor() {
    this.baseURL = '/api/analytics';
  }

  async sendEvents(events) {
    const response = await fetch(`${this.baseURL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ events }),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to send analytics events');
    }

    return response.json();
  }

  async getStats(timeRange = '30d') {
    const response = await fetch(`${this.baseURL}/stats?range=${timeRange}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch analytics stats');
    }

    return response.json();
  }
}

export const analyticsService = new AnalyticsService();