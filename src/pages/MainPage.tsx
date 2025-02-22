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
    name: string; // 從 users API 獲取的作者資訊
  };
}

interface User {
  id: number;
  name: string;
}

function MainPage() {
  // 狀態管理
  const [posts, setPosts] = useState<Post[]>([]); // 所有文章列表
  const [isLoading, setIsLoading] = useState(false); // 更新按鈕的載入狀態
  const [page, setPage] = useState(1); // 當前頁碼
  const postsPerPage = 10; // 每頁顯示的文章數量

  // 獲取所有文章和作者資訊
  async function getAllPosts() {
    setIsLoading(true);
    try {
      // 同時發送兩個請求以提高效能
      const [postsRes, usersRes] = await Promise.all([
        axios.get('https://jsonplaceholder.typicode.com/posts'),
        axios.get('https://jsonplaceholder.typicode.com/users'),
      ]);

      // 將作者資訊合併到文章中
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

  // 初始化時獲取資料
  useEffect(() => {
    getAllPosts();
  }, []);

  // 處理分頁變更
  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) =>
    setPage(newPage);

  // 計算當前頁面要顯示的文章
  const currentPosts = posts.slice(
    (page - 1) * postsPerPage, // 從第0篇開始
    page * postsPerPage
  );

  // 計算總頁數
  const pageCount = Math.ceil(posts.length / postsPerPage);

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='w-full md:max-w-[1600px] mx-auto p-4 md:p-6 bg-white'>
        {/* 標題和更新按鈕 */}
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

        {/* 手機版卡片視圖 */}
        <PostCard
          posts={currentPosts}
          page={page}
          postsPerPage={postsPerPage}
        />

        {/* 桌面版表格視圖 */}
        <PostTable
          posts={currentPosts}
          page={page}
          postsPerPage={postsPerPage}
        />

        {/* 分頁控制 */}
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
