import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Pagination } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import PostTable from '../components/PostTable';
import PostCard from '../components/PostCard';

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
      console.error('Failed to fetch posts:', err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getAllPosts();
  }, []);

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) =>
    setPage(newPage);

  const currentPosts = posts.slice(
    (page - 1) * postsPerPage,
    page * postsPerPage
  );

  const pageCount = Math.ceil(posts.length / postsPerPage);

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='w-full md:max-w-[1600px] mx-auto p-4 md:p-6 bg-white'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
          <h1 className='text-xl md:text-2xl font-bold'>📜 Posts</h1>
          <Button
            variant='contained'
            startIcon={<RefreshIcon />}
            onClick={getAllPosts}
            disabled={isLoading}
            size='small'
            sx={{
              width: { xs: '120px', sm: '120px' },
              position: 'relative',
              top: { xs: '0', sm: '24px' },
              left: { xs: '0', sm: '20px' },
              margin: { xs: '0 auto', sm: '0' },
              '&:hover': {
                left: { xs: '0', sm: '26px' },
              },
            }}
          >
            {isLoading ? 'Loading' : 'Update'}
          </Button>
        </div>

        <PostCard
          posts={currentPosts}
          page={page}
          postsPerPage={postsPerPage}
        />
        <PostTable
          posts={currentPosts}
          page={page}
          postsPerPage={postsPerPage}
        />

        <div className='flex justify-center mt-6'>
          <Pagination
            count={pageCount}
            page={page}
            onChange={handlePageChange}
            color='primary'
            showFirstButton
            showLastButton
            size='small'
            className='md:size-medium'
          />
        </div>
      </div>
    </div>
  );
}

export default MainPage;
