import { Button } from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Post {
  id: number;
  title: string;
  userId: number;
  user?: {
    name: string; // 從 users API 獲取的作者資訊
  };
}

interface PostTableProps {
  posts: Post[]; // 當前頁面的文章列表
  page: number; // 當前頁碼，用於計算序號
  postsPerPage: number; // 每頁顯示數量，用於計算序號
}

function PostTable({ posts, page, postsPerPage }: PostTableProps) {
  const navigate = useNavigate();

  return (
    // 桌面版表格，手機版隱藏
    <div className='hidden sm:block'>
      <table className='w-full border border-gray-300 shadow-md rounded-lg mb-4'>
        {/* 表格標題列 */}
        <thead>
          <tr className='bg-gray-100'>
            <th className='p-3 text-left'>#</th>
            <th className='p-3 text-left'>Title</th>
            <th className='p-3 text-left'>Author</th>
            <th className='p-3 text-right'>Action</th>
          </tr>
        </thead>
        <tbody>
          {/* 文章列表 */}
          {posts.map((post, index) => (
            <tr
              key={post.id}
              className='border-t border-gray-200 hover:bg-gray-50'
            >
              <td className='p-3 text-gray-500 w-[80px]'>
                #{(page - 1) * postsPerPage + index + 1} {/* 計算文章序號 */}
              </td>
              <td className='p-3 break-words leading-6'>{post.title}</td>
              <td className='p-3 text-gray-600 w-[200px]'>{post.user?.name}</td>
              <td className='p-3 text-right w-[120px]'>
                <Button
                  variant='outlined'
                  startIcon={<VisibilityIcon />}
                  onClick={() => navigate(`/post/${post.id}`)}
                  size='small'
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PostTable;
