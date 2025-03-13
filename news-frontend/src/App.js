import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchNews = async () => {
    if (!hasMore) return;

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/news/?page=${page}`);
      const newsData = response.data.results ? response.data.results : response.data;

      if (newsData.length === 0) {
        setHasMore(false);
      } else {
        setNewsList((prevNews) => [...prevNews, ...newsData]);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, [page]);

  const handleLike = async (newsId, user) => {
    try {
      await axios.post(`http://localhost:8000/api/news/${newsId}/like/`, { user });

      setNewsList((prevNews) =>
        prevNews.map((news) =>
          news.id === newsId ? { ...news, likes_count: news.likes_count + 1 } : news
        )
      );
    } catch (error) {
      console.error("Error liking news:", error);
    }
  };

  const handleDislike = async (newsId, user) => {
    try {
      await axios.delete(`http://localhost:8000/api/news/${newsId}/dislike/`, { data: { user } });

      setNewsList((prevNews) =>
        prevNews.map((news) =>
          news.id === newsId ? { ...news, likes_count: Math.max(0, news.likes_count - 1) } : news
        )
      );
    } catch (error) {
      console.error("Error disliking news:", error);
    }
  };

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">📰 Latest News</h1>
      <div className="row">
        {newsList.map((news) => (
          <div key={news.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">{news.title}</h5>
                <p className="card-text">{news.text}</p>
                <div className="mb-2">
                  {news.tags &&
                    news.tags.map((tag) => (
                      <span key={tag.id} className="badge bg-primary me-1">
                        {tag.name}
                      </span>
                    ))}
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleLike(news.id, "user1")}
                  >
                    👍 Like {news.likes_count}
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDislike(news.id, "user1")}
                  >
                    👎 Dislike
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading && <p className="text-center mt-3">🔄 Loading...</p>}
      {!hasMore && <p className="text-center text-muted mt-3">🚀 No more news to load</p>}
    </div>
  );
}

export default App;
