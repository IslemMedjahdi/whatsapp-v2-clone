import React from "react";

type Props = {
  submitHandler: (e: React.FormEvent<HTMLFormElement>) => void;
  setNewMessage: (s: string) => void;
  loading: boolean;
  newMessage: string;
};

export default function MessageForm({
  submitHandler,
  setNewMessage,
  loading,
  newMessage,
}: Props) {
  return (
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
  );
}
