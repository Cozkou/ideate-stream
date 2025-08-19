#!/bin/bash

echo "🚀 Setting up Ideate Stream Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm detected"

# Navigate to backend directory
cd "$(dirname "$0")"

echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Creating .env file template..."
    cat > .env << EOF
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration  
PORT=3001
NODE_ENV=development

# Session Configuration
SESSION_SECRET=your_session_secret_here
EOF
    echo "📝 Created .env file. Please update it with your OpenAI API key."
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit the .env file and add your OpenAI API key"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Test the server at http://localhost:3001/health"
echo ""
echo "For more information, see the README.md file."
