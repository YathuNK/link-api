#!/usr/bin/env bash

# Link API Test Script
# This script tests all the main API endpoints

BASE_URL="http://localhost:3000/api"

echo "🧪 Testing Link API Endpoints"
echo "================================"

# Test health endpoint
echo "📊 Testing Health Check..."
curl -s "$BASE_URL/../health" | jq '.'
echo ""

# Test Places API
echo "📍 Testing Places API..."
curl -s "$BASE_URL/places" | jq '.data[0:2]'
echo ""

# Test Entity Types API
echo "🏷️  Testing Entity Types API..."
curl -s "$BASE_URL/entity-types" | jq '.data'
echo ""

# Test Relationship Types API
echo "🔗 Testing Relationship Types API..."
curl -s "$BASE_URL/relationship-types" | jq '.data'
echo ""

# Test Persons API
echo "👤 Testing Persons API..."
curl -s "$BASE_URL/persons" | jq '.data[0:2]'
echo ""

# Test Entities API
echo "🏢 Testing Entities API..."
curl -s "$BASE_URL/entities" | jq '.data'
echo ""

# Test Relationships API
echo "🔗 Testing Relationships API..."
curl -s "$BASE_URL/relationships" | jq '.data[0:2]'
echo ""

# Test Search API
echo "🔍 Testing Search API..."
curl -s "$BASE_URL/search?q=Yathurshan" | jq '.results'
echo ""

echo "✅ All tests completed!"
echo "💡 Tip: Use 'jq' for better JSON formatting: curl ... | jq '.'"
