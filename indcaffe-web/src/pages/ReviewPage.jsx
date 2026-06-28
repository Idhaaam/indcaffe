import React, { useState, useEffect } from 'react';
import { Star, Send } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useParams } from 'react-router-dom';
import InternalLayout from '../components/InternalLayout';
import api from '../api';

export default function ReviewPage() {
  const params = useParams();
  // Fallback to query string if useParams doesn't have it
  const urlParams = new URLSearchParams(window.location.search);
  const cafeId = params.cafeId || urlParams.get('cafeId') || 1;

  const [hoverRating, setHoverRating] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [cafeId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/reviews/cafe/${cafeId}`);
      setReviews(response.data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return alert("Pilih rating terlebih dahulu");
    if (!comment.trim()) return alert("Tulis ulasan Anda");

    try {
      await api.post('/reviews', {
        cafeId: parseInt(cafeId),
        rating,
        comment
      });
      setRating(0);
      setComment("");
      // Refresh reviews
      fetchReviews();
    } catch (error) {
      console.error("Error posting review:", error);
      alert("Gagal mengirim ulasan");
    }
  };

  // Calculate rating distribution for the chart
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    if (ratingCounts[r.rating] !== undefined) {
      ratingCounts[r.rating]++;
    }
  });

  const ratingData = [
    { name: '5 Bintang', count: ratingCounts[5] },
    { name: '4 Bintang', count: ratingCounts[4] },
    { name: '3 Bintang', count: ratingCounts[3] },
    { name: '2 Bintang', count: ratingCounts[2] },
    { name: '1 Bintang', count: ratingCounts[1] },
  ];

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <InternalLayout title="Ulasan & Penilaian">
      <div className="review-container" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', alignItems: 'start' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Cafe Profile / Header */}
          <div className="card" style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: 'white', display: 'flex', gap: '20px', alignItems: 'center' }}>
            <img src="https://via.placeholder.com/100?text=Logo" alt="Cafe Logo" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
            <div>
              <h2 style={{ margin: '0 0 5px 0' }}>Cafe / Store #{cafeId}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#f59e0b', fontWeight: 'bold' }}>
                <Star fill="currentColor" size={20} /> {averageRating} <span style={{ color: '#666', fontWeight: 'normal', fontSize: '14px' }}>({reviews.length} Ulasan)</span>
              </div>
            </div>
          </div>

          {/* Leave a Review Form */}
          <div className="card" style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: 'white' }}>
            <h3 style={{ marginTop: 0 }}>Beri Ulasan Anda</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '10px' }}>Rating:</label>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star} 
                      size={28}
                      style={{ cursor: 'pointer', color: (hoverRating || rating) >= star ? '#f59e0b' : '#ddd' }}
                      fill={(hoverRating || rating) >= star ? 'currentColor' : 'none'}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px' }}>Komentar:</label>
                <textarea 
                  className="form-input" 
                  placeholder="Bagaimana pengalaman Anda membeli makanan surplus di sini?" 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{ width: '100%', padding: '10px', boxSizing: 'border-box', minHeight: '100px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                <Send size={16} /> Kirim Ulasan
              </button>
            </form>
          </div>

          {/* Past Reviews List */}
          <div className="card" style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: 'white' }}>
            <h3 style={{ marginTop: 0 }}>Ulasan Pelanggan</h3>
            {loading ? (
              <p>Memuat ulasan...</p>
            ) : reviews.length === 0 ? (
              <p style={{ color: '#666' }}>Belum ada ulasan untuk tempat ini.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {reviews.map((rev, idx) => (
                  <div key={rev.id || idx} style={{ borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <strong style={{ fontSize: '15px' }}>{rev.user || 'Pengguna'}</strong>
                      <span style={{ fontSize: '12px', color: '#999' }}>{rev.date || ''}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '2px', color: '#f59e0b', marginBottom: '10px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < rev.rating ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                    <p style={{ margin: 0, color: '#444', fontSize: '14px', lineHeight: '1.5' }}>{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chart Column */}
        <div className="card" style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: 'white', position: 'sticky', top: '20px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Distribusi Rating</h3>
          <div style={{ height: '250px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={70} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f4f4f5'}} />
                <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </InternalLayout>
  );
}
