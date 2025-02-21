import { Button } from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Post {
  id: number;
  title: string;
  userId: number;
  user?: {
    name: string;
  };
}

interface PostCardProps {
  posts: Post[];
  page: number;
  postsPerPage: number;
}

function PostCard({ posts, page, postsPerPage }: PostCardProps) {
  const navigate = useNavigate();

  return (
    <div className='block sm:hidden'>
      <div className='space-y-4'>
        {posts.map((post, index) => (
          <div
            key={post.id}
            className='p-4 border rounded-lg bg-white shadow-sm'
          >
            <div className='flex justify-between items-start gap-4 mb-3'>
              <span className='text-gray-500 min-w-[30px]'>
                #{(page - 1) * postsPerPage + index + 1}
              </span>
              <Button
                variant='outlined'
                startIcon={<VisibilityIcon />}
                onClick={() => navigate(`/post/${post.id}`)}
                size='small'
              >
                View
              </Button>
            </div>
            <div className='px-1'>
              <h2 className='font-medium mb-3 break-words leading-6'>
                {post.title}
              </h2>
              <p className='text-sm text-gray-600 flex items-center gap-2'>
                <span className='text-gray-400'>Author:</span>
                <span>{post.user?.name}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostCard;
