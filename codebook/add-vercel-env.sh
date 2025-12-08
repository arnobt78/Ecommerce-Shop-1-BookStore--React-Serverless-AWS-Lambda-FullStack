#!/bin/bash

# Add Missing Environment Variables to Vercel
# Run this script from the codebook directory
# Make sure you're logged into Vercel CLI: vercel login

echo "🚀 Adding missing environment variables to Vercel..."
echo ""

# Critical - QR Code Generation
echo "Adding REACT_APP_BASE_URL..."
vercel env add REACT_APP_BASE_URL production preview development <<< "https://codebook-aws.vercel.app"

# Critical - API Endpoint
echo "Adding REACT_APP_LAMBDA_API_URL..."
vercel env add REACT_APP_LAMBDA_API_URL production preview development <<< "https://d4vvkswb4a.execute-api.eu-north-1.amazonaws.com"

# Payment Service
echo "Adding REACT_APP_STRIPE_PUB_KEY..."
vercel env add REACT_APP_STRIPE_PUB_KEY production preview development <<< "pk_test_51PxHnCJVFBSIpdSDZSoSMcvdVcqAdO6tCNbxSRElWx6FINtJ3r2vLQT7bneHcrugaC3L2j3WkxbY180HlgGF4Ffm00HecLun2u"

# Image Service - Cloudinary
echo "Adding REACT_APP_CLOUDINARY_CLOUD_NAME..."
vercel env add REACT_APP_CLOUDINARY_CLOUD_NAME production preview development <<< "dstnkgg1p"

echo "Adding REACT_APP_CLOUDINARY_UPLOAD_PRESET..."
vercel env add REACT_APP_CLOUDINARY_UPLOAD_PRESET production preview development <<< "codebook_products"

echo "Adding REACT_APP_IMAGE_SERVICE..."
vercel env add REACT_APP_IMAGE_SERVICE production preview development <<< "cloudinary"

echo ""
echo "✅ All environment variables added successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Verify variables in Vercel dashboard: Settings → Environment Variables"
echo "2. Redeploy your project (or push to git for auto-deploy)"
echo "3. Test QR codes - they should now use production URLs"

