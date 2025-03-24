type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: any
  headers?: Record<string, string>
  token?: string | null
}

export async function fetchAPI<T = any>(
  endpoint: string,
  { method = "GET", body, headers = {}, token }: FetchOptions = {},
): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `/api${endpoint}`

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  }

  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`
  }

  const options: RequestInit = {
    method,
    headers: requestHeaders,
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  const response = await fetch(url, options)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "請求失敗")
  }

  return data
}

// 卡牌 API
export const cardsAPI = {
  getCards: (params?: Record<string, string>, token?: string) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ""
    return fetchAPI(`/cards${queryString}`, { token })
  },
  getCard: (id: string, token?: string) => {
    return fetchAPI(`/cards/${id}`, { token })
  },
  createCard: (cardData: any, token: string) => {
    return fetchAPI("/cards", { method: "POST", body: cardData, token })
  },
  updateCard: (id: string, cardData: any, token: string) => {
    return fetchAPI(`/cards/${id}`, { method: "PUT", body: cardData, token })
  },
  deleteCard: (id: string, token: string) => {
    return fetchAPI(`/cards/${id}`, { method: "DELETE", token })
  },
}

// 牌組 API
export const decksAPI = {
  getDecks: (params?: Record<string, string>, token?: string) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ""
    return fetchAPI(`/decks${queryString}`, { token })
  },
  getDeck: (id: string, token?: string) => {
    return fetchAPI(`/decks/${id}`, { token })
  },
  createDeck: (deckData: any, token: string) => {
    return fetchAPI("/decks", { method: "POST", body: deckData, token })
  },
  updateDeck: (id: string, deckData: any, token: string) => {
    return fetchAPI(`/decks/${id}`, { method: "PUT", body: deckData, token })
  },
  deleteDeck: (id: string, token: string) => {
    return fetchAPI(`/decks/${id}`, { method: "DELETE", token })
  },
  likeDeck: (id: string, action: "like" | "unlike", token: string) => {
    return fetchAPI(`/decks/${id}/like`, { method: "POST", body: { action }, token })
  },
}

// 活動 API
export const eventsAPI = {
  getEvents: (params?: Record<string, string>, token?: string) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ""
    return fetchAPI(`/events${queryString}`, { token })
  },
  getEvent: (id: string, token?: string) => {
    return fetchAPI(`/events/${id}`, { token })
  },
  createEvent: (eventData: any, token: string) => {
    return fetchAPI("/events", { method: "POST", body: eventData, token })
  },
  updateEvent: (id: string, eventData: any, token: string) => {
    return fetchAPI(`/events/${id}`, { method: "PUT", body: eventData, token })
  },
  deleteEvent: (id: string, token: string) => {
    return fetchAPI(`/events/${id}`, { method: "DELETE", token })
  },
  registerEvent: (id: string, token: string) => {
    return fetchAPI(`/events/${id}/register`, { method: "POST", token })
  },
}

// 用戶 API
export const usersAPI = {
  getUser: (id: string, token?: string) => {
    return fetchAPI(`/users/${id}`, { token })
  },
  updateUser: (id: string, userData: any, token: string) => {
    return fetchAPI(`/users/${id}`, { method: "PUT", body: userData, token })
  },
  followUser: (id: string, action: "follow" | "unfollow", token: string) => {
    return fetchAPI(`/users/${id}/follow`, { method: "POST", body: { action }, token })
  },
  getUserDecks: (id: string, token?: string) => {
    return fetchAPI(`/users/${id}/decks`, { token })
  },
  getUserFavoriteCards: (id: string, token?: string) => {
    return fetchAPI(`/users/${id}/favorite-cards`, { token })
  },
}

// 論壇 API
export const forumAPI = {
  getPosts: (params?: Record<string, string>, token?: string) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ""
    return fetchAPI(`/forum${queryString}`, { token })
  },
  getPost: (id: string, token?: string) => {
    return fetchAPI(`/forum/${id}`, { token })
  },
  createPost: (postData: any, token: string) => {
    return fetchAPI("/forum", { method: "POST", body: postData, token })
  },
  updatePost: (id: string, postData: any, token: string) => {
    return fetchAPI(`/forum/${id}`, { method: "PUT", body: postData, token })
  },
  deletePost: (id: string, token: string) => {
    return fetchAPI(`/forum/${id}`, { method: "DELETE", token })
  },
  likePost: (id: string, action: "like" | "unlike", token: string) => {
    return fetchAPI(`/forum/${id}/like`, { method: "POST", body: { action }, token })
  },
  getComments: (postId: string, token?: string) => {
    return fetchAPI(`/forum/${postId}/comments`, { token })
  },
  addComment: (postId: string, content: string, token: string) => {
    return fetchAPI(`/forum/${postId}/comments`, { method: "POST", body: { content }, token })
  },
}

