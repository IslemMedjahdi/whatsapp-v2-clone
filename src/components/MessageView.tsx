import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import emptyProfile from "../assets/empty-profile.png";
import { db } from "../core/firebaseConfig";

type Props = {
  idUser: string;
  lastUpdate: string;
  setSelectedChatRoom: (a: string) => void;
  selectedChatRoom: string;
  chatRoom: string;
  lastMessage: string;
  searchValue: string;
  setOpen: (b: boolean) => void;
};

type User = {
  name: string;
  picture: string;
};

export default function MessageView({
  idUser,
  lastUpdate,
  setSelectedChatRoom,
  selectedChatRoom,
  chatRoom,
  lastMessage,
  searchValue,
  setOpen,
}: Props) {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getDoc(doc(db, "users", idUser))
      .then((res) => {
        setUser({
          name: res.data()?.fName + " " + res.data()?.lName,
          picture: res.data()?.picture,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [idUser]);
  if (!user?.name.includes(searchValue)) {
    return <></>;
  }
  return (
    <div
      onClick={() => {
        setSelectedChatRoom(chatRoom);
        setOpen(false);
      }}
      className={`h-14 w-full mt-2 flex items-center justify-between ${
        selectedChatRoom === chatRoom ? "bg-green bg-opacity-60" : ""
      } hover:bg-green hover:bg-opacity-60 rounded-md px-2 py-1 cursor-pointer transition duration-200`}
    >
      <div className="h-5/6 flex items-center space-x-2">
        <img
          src={user?.picture || emptyProfile}
          alt="profilePicture"
          className="w-10 h-10 rounded-full object-cover "
        />
        <div>
          <p className="font-bold text-gray-800">
            {loading ? "..." : user?.name}
          </p>
          {lastMessage && (
            <p
              className={`${
                selectedChatRoom === chatRoom ? "text-white" : "text-green"
              } whitespace-nowrap truncate text-sm`}
            >
              Last Message: {lastMessage.substring(0, 10)}{" "}
              {lastMessage.length > 10 && "..."}
            </p>
          )}
        </div>
      </div>
      <p className="text-xs font-medium text-gray-800">{lastUpdate}</p>
    </div>
  );
}
