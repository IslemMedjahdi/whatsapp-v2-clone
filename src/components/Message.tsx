import { Timestamp } from "firebase/firestore";

type Props = {
  text: string;
  sender: boolean;
  createdAt: Timestamp;
  selectedMessage: string;
  messageId: string;
  setSelectedMessage: () => void;
  isFirstMessage: boolean;
  isLastMessage: boolean;
};

function timeConverter(UNIX_timestamp: Timestamp) {
  var a = new Date(UNIX_timestamp.seconds * 1000);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return (
    a.getDate() +
    " " +
    months[a.getMonth()] +
    " " +
    a.getFullYear() +
    " " +
    a.getHours() +
    ":" +
    a.getMinutes()
  );
}
export default function Message({
  text,
  sender,
  createdAt,
  selectedMessage,
  messageId,
  setSelectedMessage,
  isLastMessage,
  isFirstMessage,
}: Props) {
  if (sender)
    return (
      <div className="self-end my-1 flex flex-col items-end">
        <div
          onClick={setSelectedMessage}
          className={`bg-green cursor-pointer shadow-md px-3 py-2 rounded-l-2xl ${
            isLastMessage ? "rounded-br-2xl " : ""
          } ${
            isFirstMessage ? "rounded-tr-2xl " : ""
          }  flex items-center justify-center`}
        >
          <p className="text-white">{text}</p>
        </div>
        {selectedMessage === messageId && (
          <p className="text-xs font-medium mt-1">{timeConverter(createdAt)}</p>
        )}
      </div>
    );
  return (
    <div className="self-start my-1 flex flex-col items-start">
      <div
        onClick={setSelectedMessage}
        className={`bg-white cursor-pointer  ${
          isLastMessage ? "rounded-bl-2xl " : ""
        } ${
          isFirstMessage ? "rounded-tl-2xl " : ""
        }  shadow-md px-3 py-2 rounded-r-2xl  flex items-center justify-center`}
      >
        <p className="text-green">{text}</p>
      </div>
      {selectedMessage === messageId && (
        <p className="text-xs font-medium mt-1">{timeConverter(createdAt)}</p>
      )}
    </div>
  );
}
