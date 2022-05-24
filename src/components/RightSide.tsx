import {
  addDoc,
  collection,
  doc,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useRef, useState, memo } from "react";
import { db } from "../core/firebaseConfig";
import { Message as MessageType } from "../core/types";
import Message from "./Message";
import { motion } from "framer-motion";
import whatsappLogo from "../assets/whatsapp logo.png";
type Props = {
  chatRoomId: string;
  userId?: string;
  setOpen: (b: boolean) => void;
};

export default memo(function RightSide({ chatRoomId, userId, setOpen }: Props) {
  const [selectedMessage, setSelectedMessage] = useState("");
  const [messages, setMessages] = useState<MessageType[]>();
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState<string>("");
  const dummyRef = useRef<HTMLDivElement>(null);
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim() !== "") {
      setLoading(true);
      addDoc(collection(db, "messages"), {
        chatId: chatRoomId,
        message: newMessage,
        sender: userId,
        type: "text",
        createdAt: serverTimestamp(),
      }).then((docRef) => {
        updateDoc(doc(db, "messages", docRef.id), {
          messageId: docRef.id,
        }).then(() => {
          updateDoc(doc(db, "chats", chatRoomId), {
            updatedAt: serverTimestamp(),
            lastMessage: newMessage,
          }).finally(() => {
            setLoading(false);
            setNewMessage("");
          });
        });
      });
      dummyRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  };
  useEffect(() => {
    if (chatRoomId) {
      const q = query(
        collection(db, "messages"),
        where("chatId", "==", chatRoomId),
        orderBy("createdAt")
      );
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot: QuerySnapshot<DocumentData>) => {
          const messages: MessageType[] = [];
          querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
            messages.push(doc.data() as MessageType);
          });
          setMessages(messages);
        }
      );
      return unsubscribe;
    }
  }, [chatRoomId]);
  if (!chatRoomId) {
    return (
      <div className="bg-gray-100 col-span-7 md:col-span-4 xl:col-span-5 h-screen">
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
              src={whatsappLogo}
              className="h-10 w-10 rounded-full pointer-events-none object-contain"
              alt="whatsapp"
            />
          </div>
          <p className="text-white font-semibold">WhatsApp</p>
        </div>
      </div>
    );
  }
  return (
    <div className="col-span-7 md:col-span-4 xl:col-span-5  bg-gray-100 flex-col h-screen flex justify-between">
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
            src={whatsappLogo}
            className="h-10 w-10 rounded-full pointer-events-none object-contain"
            alt="whatsapp"
          />
        </div>
        <p className="text-white font-semibold">WhatsApp</p>
      </div>
      <div className="flex flex-col overflow-auto scrollbar-none px-5 py-4 ">
        {messages?.map((message) => (
          <Message
            key={message.messageId || -1}
            text={message.message}
            sender={message.sender === userId}
            createdAt={message.createdAt}
            selectedMessage={selectedMessage}
            messageId={message.messageId || "-1"}
            setSelectedMessage={() => setSelectedMessage(message.messageId)}
          />
        ))}
        <div className="py-4" ref={dummyRef} />
      </div>
      <div className="sticky bottom-0 px-5 pb-4">
        <form
          onSubmit={submitHandler}
          className="px-4 shadow-md py-2 w-full bg-gray-50 flex border-2 border-green rounded-xl"
        >
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="outline-none px-4 py-2 flex-1 bg-transparent font-medium"
            placeholder="Enter a Message"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green  text-white px-2 py-2 rounded-md active:scale-95 transition "
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
});
