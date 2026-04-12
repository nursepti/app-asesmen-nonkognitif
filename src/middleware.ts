import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
 import { routeAccessMap } from './lib/settings';

// 1. Definisikan matcher secara dinamis dari settings
const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]), // Perbaikan typo: matcher
  allowedRoles: routeAccessMap[route],   // Perbaikan typo: allowedRoles
}));

export default clerkMiddleware(async (auth, req) => {
  // 2. Ambil data auth dan metadata role
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  // 3. Loop setiap matcher untuk mengecek proteksi halaman
  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(req)) {
      // Jika user tidak punya role yang sesuai, arahkan ke home atau hal lain
      if (!role || !allowedRoles.includes(role)) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};


// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
// import { routeAccessMap } from './lib/settings';

// const matchers = Object.keys(routeAccessMap).map((route) => ({
//   mactcher : createRouteMatcher([route]),
//   alloweddRoles: routeAccessMap[route],
// }));

// console.log(matchers);

// export default clerkMiddleware(async (auth, req) => {
  
//   const { sessionClaims } = await auth();

//   console.log(sessionClaims)

// });

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// };