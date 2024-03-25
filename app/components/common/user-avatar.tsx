
export interface AppUser {
  id: string;
  fname: string;
  lname: string;
  email: string;
  imageUrl?: string;
}

export default function UserAvatar({ appUser }: { appUser: AppUser }) {
  const initials = appUser.fname.charAt(0) + appUser.lname.charAt(0);
  return (
    <>
      {
        appUser.imageUrl ? (
          <img
            src={appUser.imageUrl}
            alt={appUser.fname}
            className="rounded-full w-8 h-8"
          />
        ) : (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-500">
            <span className="text-xs font-medium leading-none text-white">
              {initials}
            </span>
          </span>
        )
      }
    </>
  );
}