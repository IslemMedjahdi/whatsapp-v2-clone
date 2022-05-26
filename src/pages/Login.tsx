import whatsappscreen from "../assets/whatsappscreen.png";
import whatsapplogo from "../assets/whatsapplogo2.png";
import google from "../assets/google.png";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../core/firebaseConfig";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { LoginType } from "../core/types";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState<LoginType>({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    signInWithEmailAndPassword(auth, data.email, data.password)
      .catch((e) => setError(e.code))
      .finally(() => setLoading(false));
  };
  const signInWithGoogleHandler = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((result) => {
      getDoc(doc(db, "users", result.user.uid))
        .then((res) => {
          if (!res.exists()) {
            const userData = {
              fName: result.user.displayName?.split(" ")[0],
              lName: result.user.displayName?.split(" ")[1],
              birthday: null,
              email: result.user.email,
              uid: result.user.uid,
              picture: result.user.photoURL,
              search: [
                result.user.displayName?.split(" ")[0].toLowerCase(),
                result.user.displayName?.split(" ")[1].toLowerCase(),
                result.user.email?.toLowerCase(),
                result.user.displayName,
              ],
            };
            setDoc(doc(db, "users", result.user.uid), userData);
            addDoc(collection(db, "chats"), {
              createdAt: serverTimestamp(),
              lastMessage: "",
              updatedAt: serverTimestamp(),
              userIds: [result.user.uid, "rmbJQucAbjQvll9pV341OB8hxnx2"],
              id: "",
            }).then((docRef) => {
              updateDoc(doc(db, "chats", docRef.id), { id: docRef.id });
              addDoc(collection(db, "messages"), {
                chatId: docRef.id,
                message:
                  "Hello i'm Islem medjahdi, I'm a computer science student in Algeria - Algiers, If you have any questions, let me know and don't forget to check my portfolio : https://islem-medjahdi-portfolio.vercel.app/",
                sender: "rmbJQucAbjQvll9pV341OB8hxnx2",
                type: "text",
                createdAt: serverTimestamp(),
              }).then((docRef) => {
                updateDoc(doc(db, "messages", docRef.id), {
                  messageId: docRef.id,
                });
              });
              updateDoc(doc(db, "chats", docRef.id), {
                updatedAt: serverTimestamp(),
                lastMessage:
                  "Hello i'm Islem medjahdi, I'm a computer science student in Algeria - Algiers, If you have any questions, let me know and don't forget to check my portfolio : https://islem-medjahdi-portfolio.vercel.app/",
              });
            });
          }
        })
        .catch((e) => console.log(e));
    });
  };
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        navigate("/", { replace: true });
      }
    });
    return unsub;
  }, [navigate]);
  return (
    <div className="grid w-full text-gray-900 grid-cols-5 font-jakarta h-screen">
      <form
        onSubmit={submitHandler}
        className="col-span-5 lg:col-span-3 w-full flex items-center flex-col px-20 pt-10 justify-center space-y-5"
      >
        <div>
          <img
            src={whatsapplogo}
            alt="whatsapplogo"
            className="w-52 pointer-events-none"
          />
        </div>
        <div>
          <h1 className="text-gray-900 font-bold text-2xl mt-6">
            Account login
          </h1>
        </div>
        <div className="flex flex-col space-y-1 w-full sm:w-1/2">
          <label className="text-sm text-gray-800">Email</label>
          <input
            className="outline-none border-2 px-2 py-2 focus:border-blue-500"
            name="email"
            onChange={onChange}
          />
        </div>
        <div className="flex flex-col space-y-1 w-full sm:w-1/2">
          <label className="text-sm text-gray-800">Password</label>
          <input
            type={"password"}
            className="outline-none border-2 px-2 py-2 focus:border-blue-500"
            name="password"
            onChange={onChange}
          />
        </div>
        <div className="flex flex-col items-center w-full space-y-2 mt-4 justify-between">
          <button
            disabled={loading}
            type={"submit"}
            className="bg-blue-500 hover:bg-blue-600 active:scale-95 transition font-semibold px-3 py-3 w-full sm:w-1/2 text-sm text-white rounded-md"
          >
            {loading ? "Loading..." : "Login"}
          </button>
          <button
            onClick={signInWithGoogleHandler}
            type={"button"}
            className="bg-gray-600 flex items-center justify-center space-x-3 hover:bg-gray-700  active:scale-95 transition font-semibold px-3 py-3 w-full sm:w-1/2 text-sm text-white rounded-md"
          >
            <img src={google} alt="google" className="w-5 h-5" />
            <p>Sign-In with google</p>
          </button>
        </div>
        {error && (
          <p className=" !mt-1 text-red-500 font-semibold text-sm">{error}</p>
        )}
        <div className="flex mt-5 justify-center items-center space-x-2">
          <p>Don't have an account? </p>
          <Link
            className="text-blue-500 font-medium hover:text-blue-600 transition"
            to={"/signup"}
          >
            signup
          </Link>
        </div>
      </form>
      <div className="bg-green overflow-hidden w-full hidden lg:col-span-2 lg:flex flex-col items-center justify-center">
        <h1 className="font-medium text-white text-lg tracking-wider text-center max-w-md">
          Social media shared today, tomorrow or by location
        </h1>
        <div className="flex w-1/2 items-center justify-center mt-10 relative">
          <div className="w-[30rem] blur-lg h-[30rem] bg-greenlight bg-opacity-25 absolute rounded-full" />
          <img
            src={whatsappscreen}
            alt="whatsappscreen"
            className="w-full object-contain pointer-events-none z-10"
          />
        </div>
      </div>
    </div>
  );
}
