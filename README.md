# Quick-AWS-Demo-Frontend

A Next.js application for uploading PDFs to AWS S3 and displaying processing results from a FastAPI backend.

## Features

- PDF file upload to AWS S3
- Display processing results from backend
- Responsive UI with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm or yarn
- AWS account with S3 bucket
- FastAPI backend running

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file based on `.env.local.example` and fill in your AWS credentials and configuration.

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
# or
yarn build
```

## Project Structure

- `src/app/page.tsx` - Home page with PDF upload functionality
- `src/app/results/page.tsx` - Results page showing processing status
- `src/utils/s3.ts` - Utility for S3 file uploads
- `src/utils/api.ts` - API client for communicating with the backend

## Environment Variables

- `NEXT_PUBLIC_AWS_REGION` - AWS region for S3 bucket
- `NEXT_PUBLIC_AWS_ACCESS_KEY_ID` - AWS access key ID
- `NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY` - AWS secret access key
- `NEXT_PUBLIC_S3_BUCKET_NAME` - S3 bucket name for file uploads
- `NEXT_PUBLIC_API_URL` - URL of the FastAPI backend