import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Modal, Button } from 'react-bootstrap';

const NewsList = () => {
  const [newsList, setNewsList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);

  useEffect(() => {
    fetchNews();
  }, [page]);

  const fetchNews = async () => {
    try {
      const response = await axios.get(`news/?page=${page}`);
      if (response.data.length > 0) {
        setNewsList((prevNews) => [...prevNews, ...response.data]);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const handleLike = async (id) => {
    try {
      await axios.post(`news/${id}/like/`);
      setNewsList(newsList.map((news) =>
        news.id === id ? { ...news, likes: news.likes + 1 } : news
      ));
    } catch (error) {
      console.error('Error liking news:', error);
    }
  };

  const handleDislike = async (id) => {
    try {
      await axios.post(`news/${id}/dislike/`);
      setNewsList(newsList.map((news) =>
        news.id === id ? { ...news, dislikes: news.dislikes + 1 } : news
      ));
    } catch (error) {
      console.error('Error disliking news:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`news/${id}/`);
      setNewsList(newsList.filter((news) => news.id !== id));
      setShowModal(false);  // Close modal after deletion
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  const openDeleteModal = (news) => {
    setNewsToDelete(news);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setNewsToDelete(null);
  };

  return (
    <div>
      <h2>News List</h2>
      <InfiniteScroll
        dataLength={newsList.length}
        next={() => setPage(page + 1)}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        {newsList.map(news => (
          <div key={news.id} className="news-item">
            <h3>{news.title}</h3>
            <p>{news.text}</p>
            {news.images && <img src={`http://localhost:8000${news.images}`} alt={news.title} />}
            <div>Tags: {news.tags.map(tag => tag.name).join(', ')}</div>
            <div>
              <button onClick={() => handleLike(news.id)}>Like ({news.likes})</button>
              <button onClick={() => handleDislike(news.id)}>Dislike ({news.dislikes})</button>
              <button onClick={() => openDeleteModal(news)}>Delete</button>
            </div>
          </div>
        ))}
      </InfiniteScroll>

      {/* Deletion Confirmation Modal */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the news article: <strong>{newsToDelete?.title}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="danger" onClick={() => handleDelete(newsToDelete.id)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NewsList;
