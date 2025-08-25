import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const JokePage = () => {
  return (
    <div className="bg-background min-h-screen">
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h1 
          className="text-4xl md:text-6xl text-center text-foreground mb-8"
          style={{ fontFamily: 'Comic Sans MS, cursive, sans-serif' }}
        >
          stop trying to break our waitlist, just sign up. =)
        </h1>
        
        <Link 
          to="/"
          className="flex items-center text-foreground hover:text-foreground/80 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
};

export default JokePage;