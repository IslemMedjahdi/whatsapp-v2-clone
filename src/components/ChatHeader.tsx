type Props = {
  setOpen: (b: boolean) => void;
  email: string;
  lName: string;
  fName: string;
  picture: string;
};

export default function ChatHeader({
  setOpen,
  email,
  lName,
  fName,
  picture,
}: Props) {
  return (
    <div className="flex space-x-2 px-2 py-7 shadow-md  shadow-stone-400 items-center bg-green w-full h-10 sticky top-0">
      <div
        onClick={() => setOpen(true)}
        className="cursor-pointer mr-5 md:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-white"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="flex items-center">
        <img
          src={picture}
          className="h-10 w-10 rounded-full pointer-events-none object-cover"
          alt="whatsapp"
        />
      </div>
      <div>
        <p className="text-white font-semibold">{fName + " " + lName}</p>
        <p className="text-white text-xs font-medium">{email}</p>
      </div>
    </div>
  );
}
