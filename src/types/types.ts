export interface SavedMovie {
  id: string;
  title: string;
  count: string;
  date: string;
  status: string;
  stars: string;
}

export interface Offer {
  movieId: string;
  week: string;
  period: string;
  content: string;
  methods: { text: string; highlighted: boolean }[];
  image: string;
}

export interface LocationData {
  id: string;
  location: string;
  input_count: number;
  type: string;
}

export interface MovieRating {
  [id: string]: number;
}
