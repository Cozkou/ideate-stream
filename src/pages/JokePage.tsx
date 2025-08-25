import { Link } from 'react-router-dom';

const JokePage = () => {
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              {/* Left side content can be added here if needed */}
            </div>
            <div className="flex items-center">
              <Link 
                to="/waitlist"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-block"
              >
                Join Waitlist
              </Link>
            </div>
          </div>
        </div>
        
        {/* COMPT Logo positioned to extend downward from header */}
        <div className="absolute -bottom-8 left-0 p-4">
          <Link to="/">
            <img src="/COMPT.png" alt="COMPT Logo" className="h-20 sm:h-25 cursor-pointer" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <h1 
          className="text-4xl md:text-6xl text-center text-foreground"
          style={{ fontFamily: 'Comic Sans MS, cursive, sans-serif' }}
        >
          stop trying to break our waitlist, just sign up. =)
        </h1>
      </div>
    </div>
  );
};

export default JokePage;