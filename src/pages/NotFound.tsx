import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon } from '@mui/icons-material';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='text-center p-8 bg-white rounded-lg shadow-sm max-w-md w-full mx-4'>
        <div className='mb-8'>
          <h1 className='text-8xl font-bold text-primary mb-4'>404</h1>
          <div className='w-16 h-1 bg-primary mx-auto mb-8' />
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>
            Page Not Found
          </h2>
          <p className='text-gray-600'>
            The page you are looking for might have been removed or is
            temporarily unavailable.
          </p>
        </div>
        <Button
          variant='contained'
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
          size='large'
          fullWidth
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}

export default NotFound;
