import LoginForm from '../components/auth/LoginForm';
import logo from '../assets/logo.png';

const Login = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-5xl">
        {/* Mobile header with logo and text side by side */}
        <div className="md:hidden mb-8 flex items-center gap-4 bg-white rounded-xl p-4 shadow-md">
          <img 
            src={logo} 
            alt="SStashed Logo" 
            className="h-16 w-16 object-contain shrink-0 select-none pointer-events-none"
            draggable="false"
          />
          <div>
            <h1 className="text-xl font-bold text-slate-800">SStashed</h1>
            <p className="text-sm text-slate-600">Marketplace for Rural Artisans</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Logo Section - Desktop only, on the left */}
          <div className="hidden md:flex flex-col items-center justify-center">
            <img 
              src={logo} 
              alt="SStashed Logo" 
              className="h-48 w-auto object-contain drop-shadow-lg select-none pointer-events-none"
              draggable="false"
            />
            <div className="text-center mt-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">SStashed</h1>
              <p className="text-slate-600 text-lg">Marketplace for Rural Artisans</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;