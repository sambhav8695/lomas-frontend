import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { tokenStore } from "../api/client";
import { userApi } from "../api/user";
import { useAuth } from "../context/AuthContext";
import AstroWheel from "../components/AstroWheel";

export default function OAuthRedirect() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { applyAuthResponse } = useAuth();

  useEffect(() => {
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const requiresBirthDetails = params.get("requiresBirthDetails") === "true";

    if (!accessToken || !refreshToken) {
      navigate("/login", { replace: true });
      return;
    }

    tokenStore.setSession({ accessToken, refreshToken });

    userApi
      .getProfile()
      .then((profile) => {
        applyAuthResponse({ accessToken, refreshToken, user: profile, requiresBirthDetails });
        navigate(requiresBirthDetails ? "/complete-birth-details" : "/chat", { replace: true });
      })
      .catch(() => navigate("/login", { replace: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6">
      <AstroWheel size={200} />
      <p className="text-stone">Reading the stars… signing you in.</p>
    </div>
  );
}
