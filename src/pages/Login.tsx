// src/pages/Login.tsx
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

const Login = () => {
  const signIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("ログイン失敗:", error);
    }
  };

  return (
    <div className="w-full flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl text-black font-bold mb-4">Chat App</h1>
        <h3 className=" text-gray-500 font-bold mb-4">Sign in with Google</h3>
        <button
          onClick={signIn}
          className="bg-white border px-6 py-3 rounded shadow hover:shadow-lg transition"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="text-black inline-block w-6 h-6 mr-2"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
