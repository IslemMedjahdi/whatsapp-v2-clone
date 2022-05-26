import google from "../assets/google.png";
import whatsappscreen from "../assets/whatsappscreen.png";
import whatsapplogo from "../assets/whatsapplogo2.png";
import { useEffect, useRef, useState } from "react";
import { Calendar } from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import { Link, useNavigate } from "react-router-dom";
import { db, auth } from "../core/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { BirthdayDate, SignUpType } from "../core/types";

export default function Signup() {
  const navigate = useNavigate();
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SignUpType>({
    fName: "",
    lName: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthday: { day: 5, month: 6, year: 2002 },
  });
  useEffect(() => {
    document.addEventListener("click", (e) => {
      if (!calendarRef.current?.contains(e.target as Node)) {
        setOpenCalendar(false);
      }
    });
    return document.removeEventListener("click", (e) => {
      if (!calendarRef.current?.contains(e.target as Node)) {
        setOpenCalendar(false);
      }
    });
  }, []);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };
  const dateChangeHandler = (date: BirthdayDate) => {
    setData({ ...data, birthday: date });
    setOpenCalendar(false);
  };
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { fName, lName, email, password, confirmPassword, birthday } = data;
    if (fName.trim() === "") {
      setError("First name can not be empty");
      setLoading(false);
    } else if (lName.trim() === "") {
      setLoading(false);
      setError("Last name can not be empty");
    } else if (password !== confirmPassword) {
      setError("Password missmatch");
      setLoading(false);
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((user) => {
          const userData = {
            fName,
            lName,
            birthday,
            email,
            uid: user.user.uid,
            picture: "",
            search: [
              lName.toLowerCase(),
              fName.toLowerCase(),
              email.toLowerCase(),
              fName.toLowerCase() + " " + lName.toLowerCase(),
            ],
          };
          setDoc(doc(db, "users", user.user.uid), userData);
          addDoc(collection(db, "chats"), {
            createdAt: serverTimestamp(),
            lastMessage: "",
            updatedAt: serverTimestamp(),
            userIds: [user.user.uid, "rmbJQucAbjQvll9pV341OB8hxnx2"],
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
              message:
                "Hello i'm Islem medjahdi, I'm a computer science student in Algeria - Algiers, If you have any questions, let me know and don't forget to check my portfolio : https://islem-medjahdi-portfolio.vercel.app/",
            });
          });
        })
        .catch((e) => setError(e.code))
        .finally(() => setLoading(false));
    }
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
      <div className="bg-green hidden lg:flex overflow-hidden w-full col-span-2 flex-col items-center justify-center">
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
      <div className="col-span-5 lg:col-span-3 px-20 py-10">
        <div>
          <img
            src={whatsapplogo}
            alt="whatsapplogo"
            className="w-28 pointer-events-none"
          />
        </div>
        <form onSubmit={submitHandler}>
          <h1 className="text-gray-900 font-bold text-xl mt-6">
            Create account
          </h1>
          <div className="flex items-center flex-col sm:flex-row w-full space-y-2 sm:space-y-0 sm:space-x-10 mt-4 justify-between">
            <div className="flex flex-col space-y-1  w-full sm:w-1/2">
              <label className="text-sm text-gray-800">First name</label>
              <input
                className="outline-none  border-2 px-2 py-2 focus:border-blue-500"
                name="fName"
                onChange={onChange}
              />
            </div>
            <div className="flex flex-col space-y-1 w-full sm:w-1/2">
              <label className="text-sm text-gray-800">Last name</label>
              <input
                className="outline-none border-2 px-2 py-2 focus:border-blue-500"
                name="lName"
                onChange={onChange}
              />
            </div>
          </div>
          <div className="flex items-center flex-col sm:flex-row w-full space-y-2 sm:space-y-0 sm:space-x-10 mt-4 justify-between">
            <div className="flex flex-col space-y-1 w-full sm:w-1/2">
              <label className="text-sm text-gray-800">Email</label>
              <input
                type={"email"}
                className="outline-none border-2 px-2 py-2 focus:border-blue-500"
                name="email"
                onChange={onChange}
              />
            </div>
            <div className="flex flex-col space-y-1 w-full sm:w-1/2">
              <label className="text-sm text-gray-800">
                Date of birth (MM/DD/YY)
              </label>
              <div className="outline-none flex items-center justify-between border-2 px-2 py-2">
                {`${data.birthday.day} / ${data.birthday.month} / ${data.birthday.year} `}
                <div className="relative" ref={calendarRef}>
                  <svg
                    onClick={() => setOpenCalendar((prevState) => !prevState)}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-300 cursor-pointer"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {openCalendar && (
                    <div className="absolute -right-20 sm:right-10 -top-52">
                      <Calendar
                        maximumDate={{ year: 2008, month: 12, day: 31 }}
                        minimumDate={{ year: 1950, month: 1, day: 1 }}
                        colorPrimary="#128C7E"
                        value={data.birthday}
                        onChange={dateChangeHandler}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center flex-col sm:flex-row w-full space-y-2 sm:space-y-0 sm:space-x-10 mt-4 justify-between">
            <div className="flex flex-col space-y-1 w-full sm:w-1/2">
              <label className="text-sm text-gray-800">Password</label>
              <input
                type={"password"}
                className="outline-none border-2 px-2 py-2 focus:border-blue-500"
                name="password"
                onChange={onChange}
              />
            </div>
            <div className="flex flex-col space-y-1 w-full sm:w-1/2">
              <label className="text-sm text-gray-800">Confirm Password</label>
              <input
                type={"password"}
                className="outline-none border-2 px-2 py-2 focus:border-blue-500"
                name="confirmPassword"
                onChange={onChange}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 w-full sm:space-x-10 mt-4 justify-between">
            <button
              disabled={loading}
              type={"submit"}
              className="bg-blue-500 hover:bg-blue-600 w-full active:scale-95 transition font-semibold px-3 py-3 sm:w-1/2 text-sm text-white rounded-md"
            >
              {loading ? "Loading..." : "Create account"}
            </button>
            <button
              onClick={() => navigate("/login")}
              disabled={loading}
              type={"button"}
              className="bg-gray-600 flex items-center w-full justify-center space-x-3 hover:bg-gray-700  active:scale-95 transition font-semibold px-3 py-3 sm:w-1/2 text-sm text-white rounded-md"
            >
              <img src={google} alt="google" className="w-5 h-5" />
              <p>Sign-in with google</p>
            </button>
          </div>
          {error && (
            <p className="mt-1 text-red-500 font-semibold text-sm">{error}</p>
          )}
        </form>
        <div className="flex mt-5 justify-center whitespace-nowrap items-center  space-x-2">
          <p>You already have an account? </p>
          <Link
            className="text-blue-500 font-medium whitespace-nowrap hover:text-blue-600 transition"
            to={"/login"}
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
