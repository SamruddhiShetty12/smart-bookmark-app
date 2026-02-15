"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  // Check session on load & listen for auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchBookmarks(session.user.id);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) fetchBookmarks(session.user.id);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // Login with Google
  async function loginWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      redirectTo: window.location.origin, // redirect back to home after login
    });
    if (error) console.log("Login error:", error.message);
  }

  // Logout
  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) console.log("Logout error:", error.message);
    setUser(null);
    setBookmarks([]);
  }

  // Fetch bookmarks for logged-in user
  async function fetchBookmarks(userId: string) {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId);

    if (error) console.log("Fetch error:", error.message);
    else if (data) setBookmarks(data);
  }

  // Add a new bookmark
  async function addBookmark() {
    if (!user) return;
    const title = prompt("Enter title");
    const url = prompt("Enter URL");
    if (!title || !url) return;

    const { data, error } = await supabase
      .from("bookmarks")
      .insert([{ title, url, user_id: user.id }]);

    if (error) console.log("Insert error:", error.message);
    else if (data) setBookmarks((prev) => [...prev, ...data]);
  }

  // Delete a bookmark
  async function deleteBookmark(id: number) {
    const { error } = await supabase.from("bookmarks").delete().eq("id", id);

    if (error) console.log("Delete error:", error.message);
    else setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <div className="home-container">
      {!user && (
        <button className="login-btn" onClick={loginWithGoogle}>
          Login with Google
        </button>
      )}

      {user && (
        <>
          <div className="user-bar">
            <p>Welcome, {user.email}</p>
            <div>
              <button onClick={logout}>Logout</button>
              <button onClick={addBookmark}>Add Bookmark</button>
            </div>
          </div>

          <h2>Your Bookmarks:</h2>
          {bookmarks.length === 0 && <p>No bookmarks yet</p>}

          <div className="bookmark-list">
            {bookmarks.map((b) => (
              <div className="bookmark-card" key={b.id}>
                <h3>{b.title}</h3>
                <a href={b.url} target="_blank" rel="noreferrer">
                  {b.url}
                </a>
                <button
                  className="delete-btn"
                  onClick={() => deleteBookmark(b.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
