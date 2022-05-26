import { signOut } from "firebase/auth";
import { useEffect, useState, memo, useRef } from "react";
import emptyProfile from "../assets/empty-profile.png";
import { auth, db } from "../core/firebaseConfig";
import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  Timestamp,
  where,
} from "firebase/firestore";
import { chatRoom } from "../core/types";
import MessageView from "./MessageView";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import AddUser from "./AddUser";
import { motion } from "framer-motion";
import { PopupActions } from "reactjs-popup/dist/types";
function timeConverter(UNIX_timestamp: Timestamp): string {
  const a = new Date(UNIX_timestamp.seconds * 1000);
  return (
    a.getHours().toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    }) +
    " : " +
    a.getMinutes().toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    })
  );
}
type Props = {
  picture?: string;
  userId?: string;
  displayName: string;
  selectedChatRoom: string;
  setSelectedChatRoom: (a: string) => void;
  setOpen: (b: boolean) => void;
};

export default memo(function LeftSide({
  picture,
  userId,
  selectedChatRoom,
  setSelectedChatRoom,
  setOpen,
  displayName,
}: Props) {
  const [searchValue, setSearchValue] = useState("");
  const [chatRooms, setChatRooms] = useState<chatRoom[]>();
  const refPopup = useRef<PopupActions>(null);
  useEffect(() => {
    if (userId) {
      const q = query(
        collection(db, "chats"),
        where("userIds", "array-contains", userId),
        orderBy("updatedAt")
      );
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot: QuerySnapshot<DocumentData>) => {
          const chatRooms: chatRoom[] = [];
          querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
            chatRooms.push(doc.data() as chatRoom);
          });
          setChatRooms(chatRooms.reverse());
        }
      );
      return unsubscribe;
    }
  }, [userId]);
  return (
    <motion.div
      initial={{ x: "-100vh" }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
      className="shadow-lg overflow-auto scrollbar-none  border-r-2 px-4 flex-col col-span-7  md:col-span-3 md:flex xl:col-span-2 min-h-screen"
    >
      <div className="sticky bg-white top-0">
        <div className="flex items-center justify-between pt-4 ">
          <div
            onClick={() => {
              setSelectedChatRoom("");
              setOpen(false);
            }}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <img
              src={picture || emptyProfile}
              className="w-12 h-12 rounded-full pointer-events-none object-cover"
              alt="profile"
            />
          </div>
          <p className="font-semibold text-lg">Messages</p>
          <p
            onClick={() => signOut(auth)}
            className="bg-green hover:bg-opacity-50 text-white font-medium px-3 py-2 rounded-lg cursor-pointer active:scale-95 transition"
          >
            Sign out
          </p>
        </div>
        <div>
          <p className="mt-4 indent-2 font-semibold">
            You logged in as
            <span className="text-green hover:underline"> {displayName}</span>
          </p>
        </div>
        <div className="flex  mt-6 items-center justify-between">
          <Popup
            ref={refPopup}
            contentStyle={{ width: "60%", borderRadius: 10 }}
            modal={true}
            trigger={
              <div className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="font-semibold cursor-pointer  text-green">
                  Add a new friend
                </p>
              </div>
            }
          >
            <AddUser
              closePopup={() => refPopup.current?.close()}
              userId={userId || ""}
            />
          </Popup>
        </div>
        <div className="mt-6 flex space-x-2 border-2 items-center bg-white px-3 py-2 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            className="bg-transparent outline-none  w-full"
            placeholder="Search"
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-auto scrollbar-none mt-2">
        {!chatRooms &&
          [1, 2, 3, 4].map((item) => (
            <div
              className="h-14 cursor-pointer w-full mt-2 flex items-center justify-between rounded-md px-2 py-1 bg-gray-100 animate-pulse"
              key={item}
            >
              <div className="h-5/6 flex items-center space-x-2">
                <div className="h-11 w-11 rounded-full bg-gray-300" />
                <div className="flex flex-col justify-between h-full">
                  <div className="h-4 w-32 rounded-sm bg-gray-300" />
                  <div className="h-4 w-48 rounded-sm bg-gray-300" />
                </div>
              </div>
              <div className="h-4 w-14 rounded-sm bg-gray-300" />
            </div>
          ))}
        {chatRooms?.map((item: chatRoom) => (
          <MessageView
            setOpen={setOpen}
            selectedChatRoom={selectedChatRoom}
            setSelectedChatRoom={setSelectedChatRoom}
            chatRoom={item.id}
            key={item.id}
            idUser={
              item.userIds[0] !== userId ? item.userIds[0] : item.userIds[1]
            }
            lastUpdate={(item.updatedAt && timeConverter(item.updatedAt)) || ""}
            lastMessage={item.lastMessage}
            searchValue={searchValue.trim()}
          />
        ))}
      </div>
    </motion.div>
  );
});
