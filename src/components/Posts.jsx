   import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL;

function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    fetch(`${API}/posts`)
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then((data) => setPosts(data))
      .catch(() => setError("Backend se connect nahi ho paya"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (thumbnail) formData.append("thumbnail", thumbnail);

    const res = await fetch(`${API}/posts`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Post nahi bana");
    const newPost = await res.json();
    setPosts([newPost, ...posts]);
    setTitle("");
    setContent("");
    setThumbnail(null);
    e.target.reset();
  } catch (err) {
    setError(err.message);
  }
};

  const handleDelete = async (id) => {
  try {
    const res = await fetch(`${API}/posts/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Delete nahi hua");
    setPosts(posts.filter((p) => p._id !== id));
  } catch (err) {
    setError(err.message);
  }
};

  if (loading) return <p>Loading...</p>;

  return (
    <section style={{ color: "white", padding: "1rem" }}>
      <h2>Posts</h2>

      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          required
        />
        <input
        type="file"
        accept="image/*"
        onChange={(e) => setThumbnail(e.target.files[0])}
        />
        <button type="submit">Add Post</button>
      </form>

      {error && <p>{error}</p>}

      {posts.map((p) => (
        <div key={p._id}>
          {p.thumbnail && (
            <img src={p.thumbnail} alt={p.title} style={{ width: "150px" }} />
          )}
          <h3>{p.title}</h3>
          <p>{p.content}</p>
          <button onClick={() => handleDelete(p._id)}>Delete</button>
        </div>
      ))}
    </section>
  );
}

export default Posts;