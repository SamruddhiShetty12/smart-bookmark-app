This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
link:https://smart-bookmark-app-six-theta.vercel.app/
Problems Faced & Solutions

1. **Supabase Insert/Select Issues**  
   - **Problem:** Initially, bookmarks added in the frontend were not appearing, or deletions were not reflected due to RLS policies.  
   - **Solution:** Enabled Row-Level Security (RLS) in Supabase and created proper policies:
     - `allow_insert_all` for `INSERT`
     - `allow_read_all` for `SELECT`
     - `allow_delete_for_user` for `DELETE` with `auth.uid() = user_id`.

2. **OAuth Redirect & Next.js Compatibility**  
   - **Problem:** Google OAuth login caused errors in Next.js due to outdated `redirectTo` usage.  
   - **Solution:** Updated `supabase.auth.signInWithOAuth` to use the current `options: { redirectTo: window.location.origin }`.

3. **State Not Updating After Add/Delete**  
   - **Problem:** Added bookmarks didn’t appear immediately, and deleted bookmarks reappeared on refresh.  
   - **Solution:** Used `.select()` after `.insert()` to get the inserted row and updated React state properly. For delete, ensured `user_id` check before deletion.

4. **Styling Issues**  
   - **Problem:** Buttons like “Login with Google” and “Logout” were plain and not visually separated.  
   - **Solution:** Added `className`s and matching CSS in `globals.css`, including centering the login button when user is not logged in.

5. **Vercel Deployment Issues**  
   - **Problem:** Build failed due to missing environment variables and module paths.  
   - **Solution:** Added `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, ensured correct import paths, and pushed a clean commit to GitHub before deploying to Vercel.








