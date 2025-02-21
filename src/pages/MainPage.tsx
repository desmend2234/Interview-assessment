import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Pagination } from '@mui/material';
import {
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

interface Post {
  id: number;
  title: string;
  userId: number;
  user?: {
    name: string;
  };
}

interface User {
  id: number;
  name: string;
}

function MainPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const postsPerPage = 10;

  async function getAllPosts() {
    setIsLoading(true);
    try {
      const [postsRes, usersRes] = await Promise.all([
        axios.get('https://jsonplaceholder.typicode.com/posts'),
        axios.get('https://jsonplaceholder.typicode.com/users'),
      ]);

      const users = usersRes.data;
      const postsWithUsers = postsRes.data.map((post: Post) => ({
        ...post,
        user: users.find((user: User) => user.id === post.userId),
      }));

      setPosts(postsWithUsers);
    } catch (err) {
      console.error('獲取文章失敗:', err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getAllPosts();
  }, []);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    newPage: number
  ) => setPage(newPage);

  const currentPosts = posts.slice(
    (page - 1) * postsPerPage,
    page * postsPerPage
  );

  const pageCount = Math.ceil(posts.length / postsPerPage);

  return (
    <div className='max-w-[1600px] mx-auto p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>📜 貼文列表</h1>
        <Button
          variant='contained'
          startIcon={<RefreshIcon />}
          onClick={getAllPosts}
          disabled={isLoading}
        >
          {isLoading ? '更新中...' : '更新'}
        </Button>
      </div>

      <table className='w-full border border-gray-300 shadow-md rounded-lg mb-4'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='p-3 text-left'>#</th>
            <th className='p-3 text-left'>標題</th>
            <th className='p-3 text-left'>作者</th>
            <th className='p-3 text-right'>動作</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((post, index) => (
            <tr
              key={post.id}
              className='border-t border-gray-200 hover:bg-gray-50'
            >
              <td className='p-3'>{(page - 1) * postsPerPage + index + 1}</td>
              <td className='p-3'>{post.title}</td>
              <td className='p-3'>{post.user?.name}</td>
              <td className='p-3 text-right'>
                <Button
                  variant='outlined'
                  startIcon={<VisibilityIcon />}
                  onClick={() => navigate(`/post/${post.id}`)}
                  size='small'
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  查看詳情
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className='flex justify-center mt-4'>
        <Pagination
          count={pageCount}
          page={page}
          onChange={handlePageChange}
          color='primary'
          showFirstButton
          showLastButton
        />
      </div>
    </div>
  );
}

export default MainPage;
