export const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) return `https://ui-avatars.com/api/?name=User&background=random`;
  
  if (avatarPath.startsWith("http")) return avatarPath;
  
  const baseUrl = import.meta.env.VITE_API_BASE_URL 
    ? import.meta.env.VITE_API_BASE_URL.replace("/api", "") 
    : `${window.location.protocol}//${window.location.hostname}:5000`;
    
  return `${baseUrl}${avatarPath}`;
};
