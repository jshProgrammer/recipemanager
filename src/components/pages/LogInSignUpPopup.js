import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../features/authentication.js';
import '../../styles/LogInSignUp.css';
import LoginForm from '../subcomponents/LoginForm.js';

const LogInSignUpPopup = ({ isOpen, onClose, onLogin }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && isOpen) {
      navigate("/login");
      onClose();
    }
  }, [isMobile, isOpen, navigate, onClose]);

  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    if (isOpen && !isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isMobile]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen || isMobile) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
     <div
      className="position-fixed h-100 w-100 d-flex align-items-center justify-content-end"
      style={{
        zIndex: 9999,
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        
      }}
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-5 shadow-lg position-relative"
        style={{
          zIndex: 10000,
          maxWidth: '480px',
          width: '100%',
          marginRight: "50px",
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          borderTopLeftRadius: '2rem',
          borderBottomLeftRadius: '2rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          
        }}
        onClick={e => e.stopPropagation()}
      >
          
          <div class="mt-4 ml-4 mr-4 d-flex justify-content-center segmented-control" >
              <button
              className={`segmented-option ${!isSignUp ? 'active' : ''}`}
              onClick={() => setIsSignUp(false)}
            >
              Log in
            </button>

            <button
              className={`segmented-option ${isSignUp ? 'active' : ''}`}
              onClick={() => setIsSignUp(true)}
            >
              Sign up
            </button>
          </div>            
        
        <LoginForm isSignUp={isSignUp} setIsSignUp={setIsSignUp} on onSuccess={onClose}/>
      </div>
    </div>
    
  );
};

export default LogInSignUpPopup;