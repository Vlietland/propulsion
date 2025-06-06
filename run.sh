#!/bin/bash

#set -e
run_tests=false
open_browser=false
start_server=true
mode="dev"  # default to development mode

for arg in "$@"; do
  case $arg in
    test)
      run_tests=true
      shift
      ;;
    browser)
      open_browser=true
      shift
      ;;
    preview)
      mode="preview"
      shift
      ;;
    *)
      # Ignore unknown args or handle them if needed
      ;;
  esac
done

# Run tests if requested
if [ "$run_tests" = true ]; then
  echo "🧪 Running tests..."
  npx vitest run --reporter verbose
  test_status=$?

  if [ $test_status -ne 0 ]; then
    echo "❌ Tests failed."
    exit 1
  else
    echo "✅ Tests passed."
    if [ "$open_browser" = false ]; then
        exit 0
    fi
  fi
fi

if [ "$start_server" = true ]; then
  if [ "$mode" = "preview" ]; then
    # Preview mode (production build)
    echo "📦 Building the project..."
    npm run build
    
    echo "🌐 Checking for existing preview server on port 4173..."
    existing_pid=$(lsof -t -i:4173 2>/dev/null)
    
    if [ -n "$existing_pid" ]; then
      echo "🛑 Killing existing server on port 4173 (PID $existing_pid)..."
      kill "$existing_pid" || true
      sleep 2
    fi

    echo "🚀 Starting preview server..."
    if [ "$open_browser" = true ]; then
      npm run preview -- --open
    else
      npm run preview
    fi
    
  else
    # Development mode
    echo "🌐 Checking for existing dev server on port 5173..."
    existing_pid=$(lsof -t -i:5173 2>/dev/null)
    
    if [ -n "$existing_pid" ]; then
      echo "🛑 Killing existing server on port 5173 (PID $existing_pid)..."
      kill "$existing_pid" || true
      sleep 2
    fi

    echo "🚀 Starting development server..."
    if [ "$open_browser" = true ]; then
      npm run dev -- --open
    else
      npm run dev
    fi
  fi
fi