import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface Post {
  id: number;
  title: string;
  body: string;
}

interface Comment {
  id: number;
  name: string;
  body: string;
  userId?: number;
}

// 模擬登入用戶 ID
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

  async function getPost() {
    try {
      const res = await axios.get(
        `https://jsonplaceholder.typicode.com/posts/${id}`
      );
      setPost(res.data);
    } finally {
      setIsLoading(false);
    }
  }
  async function getComments() {
    const res = await axios.get(
      `https://jsonplaceholder.typicode.com/posts/${id}/comments`
    );
    // 為每條評論添加遞增的 userId
    const commentsWithUsers = res.data.map(
      (comment: Comment, index: number) => ({
        ...comment,
        userId: index, // 從 0 開始遞增
      })
    );

    setComments(commentsWithUsers);
  }

  async function handleDeleteComment() {
    if (!commentToDelete) return;
    setIsDeleting(true);
    try {
      await axios.delete(
        `https://jsonplaceholder.typicode.com/comments/${commentToDelete}`
      );
      setComments(comments.filter((comment) => comment.id !== commentToDelete));
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    } catch (err) {
      console.error('刪除評論失敗:', err);
    } finally {
      setIsDeleting(false);
    }
  }

  function openDeleteDialog(commentId: number) {
    setCommentToDelete(commentId);
    setDeleteDialogOpen(true);
  }

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

  if (!post) return <div>找不到文章</div>;

  return (
    <div className='max-w-2xl mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-4'>{post.title}</h1>
      <p className='text-gray-600 mb-6'>{post.body}</p>

      <Button variant='outlined' onClick={() => navigate('/')} className='mb-6'>
        返回
      </Button>

      <h2 className='text-xl font-semibold mb-4'>💬 評論</h2>
      <ul className='space-y-4'>
        {comments.map((comment) => (
          <li key={comment.id} className='p-4 border rounded shadow-md'>
            <div className='flex justify-between items-start'>
              <div>
                <strong className='block'>{comment.name}</strong>
                <p className='text-gray-700'>{comment.body}</p>
              </div>
              {comment.userId === LOGGED_IN_USER_ID && (
                <Button
                  color='error'
                  onClick={() => openDeleteDialog(comment.id)}
                  size='small'
                  variant='outlined'
                  startIcon={<DeleteIcon />}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  刪除
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>確認刪除</DialogTitle>
        <DialogContent>確定要刪除這條評論嗎？此操作無法復原。</DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={isDeleting}
          >
            取消
          </Button>
          <Button
            onClick={handleDeleteComment}
            color='error'
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} /> : null}
            autoFocus
          >
            {isDeleting ? '刪除中...' : '刪除'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PostDetails;
