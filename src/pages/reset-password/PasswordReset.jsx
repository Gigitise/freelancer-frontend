import React from "react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const PasswordReset = () => {
  const navigate = useNavigate();
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSession, setEmailSession] = useState(
    sessionStorage.getItem("email-session")
  );
  const emailRef = useRef();

  const sendResendEmail = async (email) => {
    try {
      setSendingEmail(true);
      const passwordResetUrl = `${
        import.meta.env.VITE_API_URL
      }/reset-password/`;
      const resetPasswordLink = await fetch(passwordResetUrl, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (resetPasswordLink.ok) {
        toast.success("Reset link sent to your email");
        const msg = await resetPasswordLink.json();
        console.log(msg);
        setEmailSession(email);
        sessionStorage.setItem("email-session", email);
      } else {
        const status = resetPasswordLink.status;
        console.log(status);
        if (status === 404) {
          toast.error("No user with the provided email");
        } else {
          toast.error("Error sending reset link");
        }
      }
    } catch (error) {
      toast.error("Error resetting password");
    } finally {
      setSendingEmail(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;

    sendResendEmail(email);
  };

  return (
    <div className="antialiased min-h-screen flex flex-col justify-center py-12 bg-[#374151] sm:px-6 lg:px-8 px-6   ">
      <div className="max-w-lg mx-auto my-10 bg-[#404c5e] p-8 rounded-xl shadow shadow-slate-300">
        <h1 className="text-2xl font-medium text-slate-200">
          Reset your Gigitise password
        </h1>
        <p className="text-slate-200 mt-3">
          {" "}
          We {emailSession ? "sent" : "will send"} a reset link to
          {emailSession ? (
            <>
              <span style={{ color: "#7fc2f5" }}>
                {" "}
                {sessionStorage.getItem("email-session")}{" "}
              </span>
              <br />
              <span>Use the link in your inbox to reset your password</span>
            </>
          ) : (
            <span> your email</span>
          )}{" "}
        </p>
        <form onSubmit={resetPassword} className="my-10">
          <div className="flex flex-col space-y-5">
            <label
              for="input-6"
              class="block text-sm font-medium  text-gray-100"
            >
              Email :
            </label>
            <div class="relative mt-0  ">
              <input
                required
                defaultValue={
                  emailSession && sessionStorage.getItem("email-session")
                }
                readOnly={false}
                type="email"
                id="email"
                className="block w-full h-10 pl-8 pr-3 mt-1 text-sm text-gray-200  bg-slate-400 border focus:outline-none rounded shadow-sm focus:border-blue-500"
                ref={emailRef}
                placeholder="user@xyz.com"
              />
              <span class="absolute inset-y-0 left-0 flex items-center justify-center ml-2 text-slate-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-4 h-4 text-blue-600 pointer-events-none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
              </span>
            </div>
            {sendingEmail ? (
              <button
                className="w-full py-3 font-medium text-white bg-[#0360d1] hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center"
                onClick={() => resetPassword()}
              >
                <svg
                  aria-hidden="true"
                  role="status"
                  class="inline w-4 h-4 me-3 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
                Loading...
              </button>
            ) : emailSession ? (
              <button
                className="w-full py-3 font-medium text-white bg-blue-500 hover:bg-accent rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center"
                onClick={() => resetPassword()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                  />
                </svg>
                <span>Resend Link</span>
              </button>
            ) : (
              <button
                className="w-full py-3 font-medium text-white bg-[#0360d1] hover:bg-[#7fc2f5] rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center"
                onClick={() => resetPassword()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                  />
                </svg>
                <span>Reset password</span>
              </button>
            )}
            <a
              href="/"
              className="w-full py-3 font-medium text-white bg-accent hover:bg-[#7fc2f5] rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                />
              </svg>

              <span> back </span>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
