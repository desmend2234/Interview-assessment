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
  const [isNavigating, setIsNavigating] = useState(false);

  // 初始化時獲取文章和評論資料
  useEffect(() => {
    async function getPost() {
      try {
        const postRes = await axios.get(
          `https://jsonplaceholder.typicode.com/posts/${id}`
        );
        const userRes = await axios.get(
          `https://jsonplaceholder.typicode.com/users/${postRes.data.userId}`
        );
        setPost({
          ...postRes.data,
          user: {
            name: userRes.data.name,
          },
        });
      } catch (err) {
        console.error('Failed to fetch post:', err);
        navigate('/404');
      } finally {
        setIsLoading(false);
      }
    }

    async function getComments() {
      const res = await axios.get(
        `https://jsonplaceholder.typicode.com/posts/${id}/comments`
      );
      const commentsWithUsers = res.data.map(
        (comment: Comment, index: number) => ({
          ...comment,
          userId: index + 1, // 因為 userId 從 1 開始
        })
      );
      setComments(commentsWithUsers);
    }

    getPost();
    getComments();
  }, [id, navigate]);

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

  // 處理返回列表
  const handleBackToList = async () => {
    setIsNavigating(true); // 開始導航
    navigate('/'); // 返回列表
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <CircularProgress />
      </div>
    );
  }

  if (!post) {
    navigate('/404');
    return null;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='w-full md:max-w-2xl mx-auto p-4 md:p-6 bg-white'>
        <div className='space-y-4'>
          <h1 className='text-xl md:text-3xl font-bold break-words'>
            {post.title}
          </h1>
          <div className='flex items-center text-sm md:text-base text-gray-600'>
            <span className='font-medium'>
              <span className='font-semibold'>Name:</span> {post.user?.name}
            </span>
          </div>
          <p className='text-sm md:text-base text-gray-600 break-words'>
            <span className='font-semibold'>Content:</span> {post.body}
          </p>
        </div>

        <div className='my-6'>
          <Button
            variant='outlined'
            onClick={handleBackToList}
            fullWidth
            className='md:w-auto'
            disabled={isNavigating}
            startIcon={isNavigating ? <CircularProgress size={20} /> : null}
          >
            {isNavigating ? 'Loading...' : 'Back to list'}
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

        {/* 刪除評論的對話框 */}
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
