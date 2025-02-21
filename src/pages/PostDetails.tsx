import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from '@mui/material';
import CommentList from '../components/CommentList';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  user?: {
    name: string; // 從 users API 獲取的作者資訊
  };
}

interface Comment {
  id: number;
  name: string;
  body: string;
  userId?: number; // 用於判斷評論的刪除權限
}

// 從環境變數獲取模擬的登入用戶 ID
const LOGGED_IN_USER_ID = Number(import.meta.env.VITE_USER_ID) || 1;

function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // 同時獲取文章內容和作者資訊
  async function getPost() {
    try {
      // 使用 Promise.all 同時發送兩個 API 請求，等待兩個請求都完成後，將資料合併
      const [postRes, userRes] = await Promise.all([
        axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`),
        axios.get(`https://jsonplaceholder.typicode.com/users/${id}`),
      ]);
      console.log(postRes.data);
      // 將文章資料和作者資料合併
      setPost({
        ...postRes.data,
        user: {
          name: userRes.data.name,
        },
      });
    } finally {
      setIsLoading(false);
    }
  }

  // 獲取文章的評論列表
  async function getComments() {
    const res = await axios.get(
      `https://jsonplaceholder.typicode.com/posts/${id}/comments`
    );
    // 為每條評論添加模擬的 userId，用於控制刪除權限
    const commentsWithUsers = res.data.map(
      (comment: Comment, index: number) => ({
        ...comment,
        userId: index,
      })
    );
    setComments(commentsWithUsers);
  }

  // 刪除評論的處理函數
  async function handleDeleteComment() {
    if (!commentToDelete) return;
    setIsDeleting(true);
    try {
      // 呼叫刪除 API
      await axios.delete(
        `https://jsonplaceholder.typicode.com/comments/${commentToDelete}`
      );
      // 從列表中移除已刪除的評論
      setComments(comments.filter((comment) => comment.id !== commentToDelete));
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    } catch (err) {
      console.error('Failed to delete comment:', err);
    } finally {
      setIsDeleting(false);
    }
  }

  // 打開刪除確認對話框
  function openDeleteDialog(commentId: number) {
    setCommentToDelete(commentId);
    setDeleteDialogOpen(true);
  }

  // 初始化時獲取文章和評論資料
  useEffect(() => {
    getPost();
    getComments();
  }, []);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <CircularProgress />
      </div>
    );
  }

  if (!post) return <div>Post not found</div>;

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='w-full md:max-w-2xl mx-auto p-4 md:p-6 bg-white'>
        <div className='space-y-4'>
          <h1 className='text-xl md:text-3xl font-bold break-words'>
            {post.title}
          </h1>
          <div className='flex items-center text-sm md:text-base text-gray-600'>
            <span className='font-medium'>Author：{post.user?.name}</span>
          </div>
          <p className='text-sm md:text-base text-gray-600 break-words'>
            {post.body}
          </p>
        </div>

        <div className='my-6'>
          <Button
            variant='outlined'
            onClick={() => navigate('/')}
            fullWidth
            className='md:w-auto'
          >
            Back to list
          </Button>
        </div>

        <div className='mt-8'>
          <h2 className='text-lg md:text-xl font-semibold mb-6'>💬 Comments</h2>
          <CommentList
            comments={comments}
            loggedInUserId={LOGGED_IN_USER_ID}
            onDeleteClick={openDeleteDialog}
          />
        </div>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this comment? This action cannot be
            undone.
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteComment}
              color='error'
              disabled={isDeleting}
              startIcon={isDeleting ? <CircularProgress size={20} /> : null}
              autoFocus
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default PostDetails;
