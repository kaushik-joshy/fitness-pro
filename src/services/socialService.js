import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, limit, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import { db } from './firebase';

const POSTS_COLLECTION = 'posts';
const COMMENTS_COLLECTION = 'comments';

export const socialService = {
  // Create a new post
  async createPost(userId, userName, content) {
    try {
      const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
        userId,
        userName,
        content,
        likes: [],
        likesCount: 0,
        createdAt: new Date().toISOString(),
      });
      return { id: docRef.id };
    } catch (error) {
      console.error('Error creating post: ', error);
      return { error: error.message };
    }
  },

  // Get recent posts
  async getFeed() {
    try {
      const q = query(
        collection(db, POSTS_COLLECTION), 
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      
      const querySnapshot = await getDocs(q);
      const posts = [];
      querySnapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
      });
      return { data: posts };
    } catch (error) {
      console.error('Error fetching feed: ', error);
      return { error: error.message };
    }
  },

  // Like or unlike a post
  async toggleLike(postId, userId, isLiked) {
    try {
      const postRef = doc(db, POSTS_COLLECTION, postId);
      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(userId),
          likesCount: increment(-1)
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(userId),
          likesCount: increment(1)
        });
      }
      return { success: true };
    } catch (error) {
      console.error('Error toggling like: ', error);
      return { error: error.message };
    }
  }
};
