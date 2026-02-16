"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase.js";
import "./globals.css";

interface Bookmark {
  id: number;
  title: string;
  url: string;
}

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  // Check session on load
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        fetchBookmarks(data.session.user.id);
      }
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) fetchBookmarks(session.user.id);
        else setBookmarks([]); // clear bookmarks on logout
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) console.log("Login error:", error.message);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.log("Logout error:", error.message);
    setUser(null);
    setBookmarks([]);
  };

  const fetchBookmarks = async (userId: string) => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId);
    if (error) console.log("Fetch error:", error.message);
    else setBookmarks(data ?? []);
  };

  const addBookmark = async () => {
    const userId = user?.id || "test-user";
    const { data, error } = await supabase
      .from("bookmarks")
      .insert([{ user_id: userId, title, url }])
      .select();
    if (error) return console.log("Insert error:", error.message);
    setBookmarks([...bookmarks, ...(data ?? [])]);
    setTitle("");
    setUrl("");
  };
  const deleteBookmark = async (id: number | string) => {
    if (!user) return;

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) console.log("Delete error:", error.message);
    else setBookmarks(bookmarks.filter((b) => b.id !== id));
  };

  return (
    <div className="container">
      <h1 className="app-title">📑 Smart Bookmark App</h1>
      {!user ? (
        <div className="login-center">
          <button className="btn login-btn" onClick={loginWithGoogle}>
            Login with Google
          </button>
        </div>
      ) : (
        <>
          <p className="welcome-text">Welcome, {user.email}</p>

          <div className="add-section">
            <h2>Add Bookmark</h2>
            <input
              className="input-field"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="input-field"
              placeholder="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button className="btn add-btn" onClick={addBookmark}>
              Add
            </button>
          </div>

          <h2>Your Bookmarks:</h2>
          <ul className="bookmark-list">
            {bookmarks.map((b) => (
              <li key={b.id} className="bookmark-item">
                <span>
                  {b.title} - {b.url}
                </span>
                <button
                  className="btn delete-btn"
                  onClick={() => deleteBookmark(b.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <button className="btn logout-btn" onClick={logout}>
            Logout
          </button>
        </>
      )}
    </div>
  );
}
