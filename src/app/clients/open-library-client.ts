const OL_URL = "http://openlibrary.org"

export const OpenLibrary = {
    getTrendingBooks: async () => {
      const response = await fetch(`${OL_URL}/trending/daily.json?page=1`);
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to fetch trending books list");
      }
    },
    getBookById: async (olid: string) => {
        const response = await fetch(`${OL_URL}${olid}.json`);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch book data");
        }
      },
      getAuthorData: async (authorKey: string) => {
        const response = await fetch(`${OL_URL}${authorKey}.json`);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch author data");
        }
      },
  };
  