// src/pages/VerifyEmail.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEmailVerification } from "../hooks/mutations/verify-email";
import Cookies from "js-cookie";

const VerifyEmail: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const userLoginMutation = useEmailVerification({
    onSuccess: (data) => {
      setStatus("success");
      Cookies.set("access", data?.access as string, { expires: 1 / 3 });
      Cookies.set("name", data?.user?.firstname as string, { expires: 7 });
      data?.refresh && Cookies.set("refresh", data?.refresh as string, { expires: 7 });
      data?.user?.lastname && Cookies.set("lastname", data?.user?.lastname as string, { expires: 7 });
      data?.user?.email && Cookies.set("email", data?.user?.email as string, { expires: 7 });
      navigate("/");
    },
    onError: (error) => {
      setError(error?.response?.data?.message);
    },
  });

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    } else {
      setStatus("pending");
      userLoginMutation.mutate({ token });
    }
  }, [token, navigate]);

  return (
    <div className="h-full flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 shadow-md max-w-sm text-center">
        {status === "pending" && <p>Verifying your email…</p>}
        {status === "success" && (
          <>
            <h2 className="text-xl font-semibold mb-2">Email Verified!</h2>
            <p className="text-gray-600">You’ll be redirected to login shortly.</p>
          </>
        )}
        {status === "error" && (
          <>
            <h2 className="text-xl font-semibold mb-2 text-red-600">Verification Failed</h2>
            <p className="text-gray-600">This link may be invalid or expired.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
