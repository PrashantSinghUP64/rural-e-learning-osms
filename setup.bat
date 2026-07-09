@echo 
echo 🚀 Setting up Rural E-Learning Platform...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js (v16 or higher) first.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version
echo ✅ npm version:
npm --version

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    copy config.env.example .env
    echo ⚠️  Please edit backend\.env with your configuration
)

REM Create uploads directory
if not exist uploads mkdir uploads

cd ..

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
call npm install

cd ..

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Start MongoDB: mongod
echo 2. Edit backend\.env with your configuration
echo 3. Start backend: cd backend ^&^& npm run dev
echo 4. Start frontend: cd frontend ^&^& npm start
echo.
echo 🌐 Access the application:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:4000
echo.
echo 📚 For more information, see README.md
pause


























