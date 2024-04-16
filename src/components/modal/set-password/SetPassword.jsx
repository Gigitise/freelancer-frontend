import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import LoadingDots from "../../../icons/loading-dots";
import { toast } from "react-hot-toast";

const SetPassword = () => {
  const navigate = useNavigate();
  const { uidb64, token } = useParams();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePassword = () => {
    setVisible(!visible);
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    const password1 = e.target.password1.value;
    const password2 = e.target.password2.value;

    setLoading(true);

    try {
      const passwordResetUrl = `${
        import.meta.env.VITE_API_URL
      }/password-reset-complete/`;

      const resetPassword = await fetch(passwordResetUrl, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password_1: password1,
          password_2: password2,
          uidb64: uidb64,
          token: token,
        }),
      });

      if (resetPassword.ok) {
        toast.success("Password reset successfully");
        sessionStorage.removeItem("email-session");
        navigate("/");
      } else {
        const resErr = await resetPassword.json();
        console.log(resErr);
        const errorMessages = Object.values(resErr).map((error) => error[0]);
        errorMessages.forEach((errorMsg) => toast.error(errorMsg));
        console.log(resErr);
      }
    } catch (error) {
      toast.error("Error resetting your password");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 bg-[#f7fafc] sm:px-6 lg:px-8 px-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-xl leading-9 font-extrabold text-gray-900">
          Let's set your password again
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={submitPassword}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                New password:
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="mt-1 rounded-md shadow-sm">
                  <input
                    name="password"
                    required
                    id="password1"
                    type={visible ? "text" : "password"}
                    placeholder="Password"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                Confirm Password:
              </label>
              <div className="relative">
                <input
                  required
                  id="password2"
                  placeholder="Confirm password"
                  type={visible ? "text" : "password"}
                  name="password"
                  className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-teal-500 placeholder-gray-400"
                />
                <div className="cursor-pointer absolute inset-y-0 right-0 flex items-center px-8 text-gray-600 border-l border-gray-300">
                  {visible ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={togglePassword}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={togglePassword}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <span className="block w-full rounded-md shadow-sm">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                >
                  {loading ? (
                    <LoadingDots color="#7fc2f5" size={16} />
                  ) : (
                    <p>Set Password</p>
                  )}
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
