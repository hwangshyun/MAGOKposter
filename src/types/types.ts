export interface SavedMovie {
  id: string;
  title: string;
  count: string;
  date: string;
  status: string;
}

export interface Offer {
  movieId: string;
  week: string;
  period: string;
  content: string;
  methods: { text: string; highlighted: boolean }[];
  image: string;
}
