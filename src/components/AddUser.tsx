import EmojiPicker from "emoji-picker-react";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDocs,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useState } from "react";
import emptyProfile from "../assets/empty-profile.png";
import { db } from "../core/firebaseConfig";

type TypeSearchResult = {
  fName: string;
  lName: string;
  picture: string;
  uid: string;
  email: string;
};

type Props = {
  userId: string;
  closePopup: () => void;
};

export default function AddUser({ userId, closePopup }: Props) {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<TypeSearchResult[]>();
  const [loading, setLoading] = useState(false);
  const addHandler = (uid: string) => {
    const q = query(
      collection(db, "chats"),
      where("userIds", "in", [
        [userId, uid],
        [uid, userId],
      ])
    );
    getDocs(q).then((querySnapshot: QuerySnapshot<DocumentData>) => {
      if (querySnapshot.empty) {
        addDoc(collection(db, "chats"), {
          createdAt: serverTimestamp(),
          lastMessage: "",
          updatedAt: serverTimestamp(),
          userIds: [userId, uid],
          id: "",
        }).then((docRef) => {
          updateDoc(doc(db, "chats", docRef.id), { id: docRef.id });
          closePopup();
        });
      } else {
        closePopup();
      }
    });
  };
  const searchHandler = () => {
    setLoading(true);
    const q = query(
      collection(db, "users"),
      where("search", "array-contains", search.toLowerCase())
    );
    getDocs(q)
      .then((querySnapshot: QuerySnapshot<DocumentData>) => {
        const searchResult: TypeSearchResult[] = [];
        querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          searchResult.push({
            email: doc.data().email,
            fName: doc.data().fName,
            lName: doc.data().lName,
            picture: doc.data().picture,
            uid: doc.data().uid,
          });
        });
        setSearchResult(searchResult);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className="flex h-96 flex-col space-y-1 font-jakarta items-center">
      <div className="self-start p-2">
        <p className="text-green text-center">
          Keep in contact with your friends!
        </p>
      </div>
      <form className="w-full flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 flex items-center">
        <div className="flex space-x-2 border-2 w-full items-center bg-white px-3 py-2 rounded-lg">
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
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none  w-full"
            placeholder="Search"
          />
        </div>
        <button
          disabled={loading}
          onClick={searchHandler}
          className="bg-green hover:bg-opacity-50 text-white font-medium px-3 py-2 rounded-lg cursor-pointer active:scale-95 transition"
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </form>
      <div className="flex overflow-auto  scrollbar-none py-6 justify-center items-center flex-wrap gap-x-4 gap-y-2">
        {searchResult?.map((user) => (
          <div
            key={user.uid}
            className="flex  hover:bg-gray-200 px-2 py-2 rounded-md  items-center space-x-2"
          >
            <div>
              <img
                src={user.picture || emptyProfile}
                alt="userpic"
                className="h-10 w-10 rounded-full object-cover"
              />
            </div>
            <div>
              <p className="font-semibold">
                {user.fName} {user.lName}
              </p>
              <p className="text-xs font-medium text-gray-500">{user.email}</p>
            </div>
            <div
              onClick={() => addHandler(user.uid)}
              className="cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green hover:text-green hover:bg-opacity-60 transition"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
