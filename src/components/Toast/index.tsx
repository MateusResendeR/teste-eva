import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  setMessage: (message: string) => void;
}

const Toast = ({ message, type, setMessage }: ToastProps) => {

    useEffect(() => {
        const timeoutId = setTimeout(() => {
          setMessage('');
        }, 2000);
    
        return () => {
          clearTimeout(timeoutId);
        };
      }, [message]);


  return (
    <div
      className={`fixed top-4 right-4 z-50 ${type === 'success' ? 'bg-green-100' : 'bg-red-100'} text-${type === 'success' ? 'green' : 'red'}-700 py-2 px-4 rounded-lg shadow-md ${message ? 'visible' : 'hidden'}`}
      onClick={() => setMessage('')}
    >
      <span className="text-sm">{message}</span>
      <button className="ml-2 text-lg" onClick={() => setMessage('')}>
        &times;
      </button>
    </div>
  );
};

export default Toast;
