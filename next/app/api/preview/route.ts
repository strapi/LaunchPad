// import { NextResponse } from 'next/server';

// import fetchContentType from '@/lib/strapi/fetchContentType';
// import spreadStrapiData from '@/lib/strapi/spreadStrapiData';

// export async function GET(request: Request) {
//   // Parse the request URL to access query parameters
//   const { searchParams } = new URL(request.url);

//   // Get the 'slug' parameter
//   const slug = searchParams.get('slug');
//   const type = searchParams.get('type');
//   const secret = searchParams.get('secret');

//   // Check if the provided secret matches the environment variable
//   if (secret !== process.env.STRAPI_PREVIEW_SECRET) {
//     return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
//   }

//   if (!type) {
//     return NextResponse.json({ message: 'Invalid type' }, { status: 401 })
//   }

//   // Construct the query string for the API call
//   const params = `${slug
//     ? `filters[slug][$eq]=${slug}&status=draft`
//     : '?status=draft'
//     }`

//   let data = await fetchContentType(type, params, false)

//   if (slug) {
//     data = spreadStrapiData(data)[0]
//   } else {
//     data = spreadStrapiData(data)
//   }
  
//   if (!data) {
//     return NextResponse.json({ message: 'Invalid slug' }, { status: 401 })
//   }

//   return NextResponse.json({ message: 'Hello, API!' });
// }