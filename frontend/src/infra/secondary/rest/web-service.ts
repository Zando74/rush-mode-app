class WebService {
  private baseUrl: string;
  private xApiKey: string;

  constructor(baseUrl: string, xApiKey: string) {
    this.baseUrl = baseUrl;
    this.xApiKey = xApiKey;
  }

  async get(
    endpoint: string,
    params?: Record<string, string>
  ): Promise<Response> {
    const response = await fetch(
      `${this.baseUrl}${endpoint}?` +
        (params ? `${new URLSearchParams(params).toString()}` : ""),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.xApiKey,
        },
      }
    );

    return response;
  }
}

export default WebService;
