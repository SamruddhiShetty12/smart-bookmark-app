"use client";

import { useState, useEffect } from "react";
import { supabase } from "../supabase"; // make sure this path is correct

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

  // Check for logged-in user on mount
  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      if (data.session?.user) fetchBookmarks(data.session.user.id);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) fetchBookmarks(session.user.id);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Login with Google
  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin, // redirect back after login
      },
    });
    if (error) console.log("Login error:", error.message);
  };

  // Logout
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.log("Logout error:", error.message);
    setUser(null);
    setBookmarks([]);
  };

  // Fetch bookmarks for user
  const fetchBookmarks = async (userId: string) => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId);
    if (error) console.log("Fetch error:", error.message);
    else setBookmarks(data ?? []);
  };

  // Add a bookmark
  const addBookmark = async () => {
    if (!title || !url || !user) return;
    const { data, error } = await supabase.from("bookmarks").insert([
      {
        user_id: user.id,
        title,
        url,
      },
    ]);
    if (error) console.log("Insert error:", error.message);
    else {
      setBookmarks([...bookmarks, ...data]);
      setTitle("");
      setUrl("");
    }
  };

  // Delete a bookmark
  const deleteBookmark = async (id: number) => {
    const { error } = await supabase.from("bookmarks").delete().eq("id", id);
    if (error) console.log("Delete error:", error.message);
    else setBookmarks(bookmarks.filter((b) => b.id !== id));
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>📑 Smart Bookmark App</h1>
      {!user ? (
        <button onClick={loginWithGoogle}>Login with Google</button>
      ) : (
        <>
          <p>Welcome, {user.email}</p>
          <button onClick={logout}>Logout</button>

          <h2>Add Bookmark</h2>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button onClick={addBookmark}>Add</button>

          <h2>Your Bookmarks:</h2>
          <ul>
            {bookmarks.map((b) => (
              <li key={b.id}>
                {b.title} - {b.url}{" "}
                <button onClick={() => deleteBookmark(b.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
