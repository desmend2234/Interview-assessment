import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface Comment {
  id: number;
  name: string;
  body: string;
  userId?: number; // 可選，用於判斷是否為當前用戶的評論
}

interface CommentListProps {
  comments: Comment[];
  loggedInUserId: number; // 當前登入用戶的 ID
  onDeleteClick: (commentId: number) => void; // 刪除評論的回調函數
}

function CommentList({
  comments,
  loggedInUserId,
  onDeleteClick,
}: CommentListProps) {
  return (
    <ul className='space-y-6'>
      {comments.map((comment) => (
        <li
          key={comment.id}
          className='p-5 border rounded-lg bg-gray-50 hover:bg-gray-100 transition'
        >
          <div className='flex flex-col md:flex-row md:items-start gap-5'>
            <div className='text-gray-500 md:w-[60px] shrink-0'>
              <span className='text-sm'>#{comment.id}</span>
            </div>
            <div className='flex-1 space-y-3'>
              <div className='flex items-center gap-2 text-gray-500'>
                <span className='font-medium text-gray-700'>
                  {comment.name}
                </span>
              </div>
              <p className='text-gray-600 break-words leading-relaxed'>
                {comment.body}
              </p>
            </div>
            {comment.userId === loggedInUserId && (
              <div className='flex justify-end md:justify-start md:pt-1 shrink-0'>
                <Button
                  color='error'
                  onClick={() => onDeleteClick(comment.id)}
                  size='small'
                  variant='outlined'
                  startIcon={<DeleteIcon />}
                  fullWidth
                  className='md:w-auto'
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default CommentList;
