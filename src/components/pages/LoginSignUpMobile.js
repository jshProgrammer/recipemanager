import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../subcomponents/LoginForm";

export default function LogInSignUpMobile() {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  //close navigation bar when showing LogInSignUpMobile
  useEffect(() => {
    const navbarCollapse = document.getElementById('navbarNav');
    const navbarToggler = document.querySelector('.navbar-toggler');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      navbarCollapse.classList.remove('show');
      if (navbarToggler) {
        navbarToggler.classList.add('collapsed');
        navbarToggler.setAttribute('aria-expanded', 'false');
      }
    }
  }, []);

  
  return (
    <div className="container py-4 main-content">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="mt-2 mb-4 d-flex justify-content-center segmented-control">
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
              
              <LoginForm 
                isSignUp={isSignUp} 
                setIsSignUp={setIsSignUp} 
                onSuccess={() => navigate("/")} 
              />
              
              <div className="text-center mt-3">
                <button 
                  className="btn btn-link" 
                  onClick={() => navigate("/")}
                >
                  ← Back to home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}