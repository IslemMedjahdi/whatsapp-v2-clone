import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../core/firebaseConfig";
import LeftSide from "../components/LeftSide";
import { doc, getDoc } from "firebase/firestore";
import { User } from "../core/types";
import RightSide from "../components/RightSide";

export default function Home() {
  const [selectedChatRoom, setSelectedChatRoom] = useState<string>("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    window.addEventListener("resize", () => setWindowWidth(window.innerWidth));
    return () =>
      window.removeEventListener("resize", () =>
        setWindowWidth(window.innerWidth)
      );
  }, []);
  const [user, setUser] = useState<User>();
  const [openChat, setOpenChat] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        getDoc(doc(db, "users", currentUser.uid)).then((res) => {
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            birthday: res.data()?.birthday,
            fName: res.data()?.fName,
            lName: res.data()?.lName,
            picture: res.data()?.picture,
          });
        });
      } else {
        navigate("/login", { replace: true });
      }
    });
    return unsub;
  }, [navigate]);
  return (
    <div className="grid overflow-auto grid-cols-7 font-jakarta h-screen">
      {(openChat || windowWidth > 768) && (
        <LeftSide
          setOpen={setOpenChat}
          selectedChatRoom={selectedChatRoom}
          setSelectedChatRoom={setSelectedChatRoom}
          picture={user?.picture}
          userId={user?.uid}
          displayName={(user?.fName || "____") + " " + (user?.lName || "____")}
        />
      )}
      {(!openChat || windowWidth > 768) && (
        <RightSide
          setOpen={setOpenChat}
          userId={user?.uid}
          chatRoomId={selectedChatRoom}
          picture={user?.picture}
          fName={user?.fName || "____"}
          lName={user?.lName || "____"}
        />
      )}
    </div>
  );
}
