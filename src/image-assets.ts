// Only the 14 reviewed images approved for the public Cloudflare asset host.
export const imageAssets: Record<string, string> = {
  "/projects/addressdox.jpg":
    "https://cyril-assets.eminify.com/portfolio/projects/addressdox-60b902946501.jpg",
  "/projects/celvz.jpg":
    "https://cyril-assets.eminify.com/portfolio/projects/celvz-3d1a734c378f.jpg",
  "/projects/cepay-project.png":
    "https://cyril-assets.eminify.com/portfolio/projects/cepay-project-fecf91e7f9b4.png",
  "/projects/emiwarp.jpg":
    "https://cyril-assets.eminify.com/portfolio/projects/emiwarp-98578378e55c.jpg",
  "/projects/emizeer.jpg":
    "https://cyril-assets.eminify.com/portfolio/projects/emizeer-2b864a860f84.jpg",
  "/projects/hushpalms.jpg":
    "https://cyril-assets.eminify.com/portfolio/projects/hushpalms-4202fde54e9f.jpg",
  "/projects/instantlearn.jpg":
    "https://cyril-assets.eminify.com/portfolio/projects/instantlearn-edebedddb6c3.jpg",
  "/projects/jobhunteer.jpg":
    "https://cyril-assets.eminify.com/portfolio/projects/jobhunteer-39b9a078c0c3.jpg",
  "/projects/koletmoni.jpg":
    "https://cyril-assets.eminify.com/portfolio/projects/koletmoni-88007dcce315.jpg",
  "/projects/puredents.jpg":
    "https://cyril-assets.eminify.com/portfolio/projects/puredents-082ec22d373c.jpg",
  "/projects/qubsurf.jpg":
    "https://cyril-assets.eminify.com/portfolio/projects/qubsurf-ac458f95bcbb.jpg",
  "/projects/ratelline.jpg":
    "https://cyril-assets.eminify.com/portfolio/projects/ratelline-0c28f505a8c6.jpg",
  "/projects/rewapay.jpg":
    "https://cyril-assets.eminify.com/portfolio/projects/rewapay-2bdec82ebd61.jpg",
  "/projects/sellobees.jpg":
    "https://cyril-assets.eminify.com/portfolio/projects/sellobees-1cccb0152ceb.jpg",
};

export function projectImage(localPath: string | undefined) {
  return localPath ? (imageAssets[localPath] ?? localPath) : undefined;
}
