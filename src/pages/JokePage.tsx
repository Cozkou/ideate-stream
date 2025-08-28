import { Link } from 'react-router-dom';

const JokePage = () => {
  return (
    <div className="bg-white min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <p className="text-black text-lg leading-relaxed">
          Stop trying to break our waitlist, just sign up. =)
          <br /><br />
          <Link to="/" className="text-blue-600 underline">
            Go back home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default JokePage;