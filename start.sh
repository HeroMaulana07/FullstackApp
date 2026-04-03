#!/bin/bash

# 🎨 Colors for better UX
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting setup for my-auth-app...${NC}\n"

# 🔍 Check prerequisites
if ! command -v node &> /dev/null; then
  echo -e "${RED}❌ Node.js not found. Please install Node.js first.${NC}"
  exit 1
fi

if ! command -v npm &> /dev/null; then
  echo -e "${RED}❌ npm not found. Please install npm first.${NC}"
  exit 1
fi

# 📦 Step 1: Setup .env files from templates
echo -e "${BLUE}📋 Setting up environment files...${NC}"

# Server .env
if [ -f "server/.env.example" ] && [ ! -f "server/.env" ]; then
  cp server/.env.example server/.env
  echo -e "${GREEN}✅ server/.env created from template${NC}"
elif [ -f "server/.env" ]; then
  echo -e "${GREEN}✅ server/.env already exists (skipped)${NC}"
else
  echo -e "${RED}⚠️  server/.env.example not found. Please create it manually.${NC}"
fi

# Client .env
if [ -f "client/.env.example" ] && [ ! -f "client/.env" ]; then
  cp client/.env.example client/.env
  echo -e "${GREEN}✅ client/.env created from template${NC}"
elif [ -f "client/.env" ]; then
  echo -e "${GREEN}✅ client/.env already exists (skipped)${NC}"
else
  echo -e "${RED}⚠️  client/.env.example not found. Please create it manually.${NC}"
fi

echo ""

# 📦 Step 2: Install backend dependencies
echo -e "${BLUE}📦 Installing server dependencies...${NC}"
cd server
npm install
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Server dependencies installed${NC}"
else
  echo -e "${RED}❌ Failed to install server dependencies${NC}"
  exit 1
fi
cd ..

echo ""

# 📦 Step 3: Install frontend dependencies
echo -e "${BLUE}📦 Installing client dependencies...${NC}"
cd client
npm install
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Client dependencies installed${NC}"
else
  echo -e "${RED}❌ Failed to install client dependencies${NC}"
  exit 1
fi
cd ..

echo ""

# 🎉 Done!
echo -e "${GREEN}🎉 Setup completed successfully!${NC}\n"
echo -e "${BLUE}💡 Next steps:${NC}"
echo -e "  1. Edit ${GREEN}server/.env${NC} with your MongoDB URI & JWT secret"
echo -e "  2. Edit ${GREEN}client/.env${NC} with your API URL (optional for dev)"
echo -e "  3. Start backend:  ${GREEN}cd server && npm run dev${NC}"
echo -e "  4. Start frontend: ${GREEN}cd client && npm run dev${NC}"
echo -e "  5. Open http://localhost:5173 in your browser\n"