export interface Artist {
  id: Number
}

export interface Check {
  artist: Artist | null
  authenticated: Boolean
}

