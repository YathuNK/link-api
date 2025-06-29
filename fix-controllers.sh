#!/bin/bash

# Script to fix TypeScript bracket notation issues in all controller files

echo "Fixing TypeScript issues in controller files..."

# Fix Place Controller
sed -i '' 's/req\.params\.id/req.params[\x27id\x27] || \x27\x27/g' /Users/yathurshankalanantharasan/Desktop/dump/link/api/src/place/controller.ts

# Fix Relationship Controller  
sed -i '' 's/req\.params\.id/req.params[\x27id\x27] || \x27\x27/g' /Users/yathurshankalanantharasan/Desktop/dump/link/api/src/relationship/controller.ts

# Fix Entity Type Controller
sed -i '' 's/req\.params\.id/req.params[\x27id\x27] || \x27\x27/g' /Users/yathurshankalanantharasan/Desktop/dump/link/api/src/entity-type/controller.ts

# Fix Relationship Type Controller
sed -i '' 's/req\.params\.id/req.params[\x27id\x27] || \x27\x27/g' /Users/yathurshankalanantharasan/Desktop/dump/link/api/src/relationship-type/controller.ts

echo "Fixed all controller files!"
