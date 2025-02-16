import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, TextInput } from "@gravity-ui/uikit";
import { Checkbox } from "@gravity-ui/uikit";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as Cross } from "../img/plus.svg";
import Cookies from "js-cookie";
import { useLoginMutation } from "../hooks/mutations/login-user";

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [data, setData] = useState({
    email: "",
    password: "",
    rememberMe: !!Cookies.get("refresh"),
    code: "",
  });
  const [errors, setErrors] = useState({
    emailError: "",
    passwordError: "",
    code: "",
  });

  const userLoginMutation = useLoginMutation({
    onSuccess: (data) => {
      Cookies.set("access", data?.access as string, { expires: 1 / 3 });
      data?.refresh && Cookies.set("refresh", data?.refresh as string, { expires: 7 });
      Cookies.set("name", data?.user?.firstname as string, { expires: 7 });
      data?.user?.lastname && Cookies.set("lastname", data?.user?.lastname as string, { expires: 7 });
      data?.user?.email && Cookies.set("email", data?.user?.email as string, { expires: 7 });
      navigate("/");
    },
    onError: (error) => {
      setError(error?.response?.data?.message);
    },
  });

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>, id?: string, value?: string | number) => {
    setData((prev) => ({ ...prev, [id || e.target.id]: value || e.target.value }));
  };

  const formHandler = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    let errCounter = 0;
    setError("");

    setErrors({
      emailError: "",
      passwordError: "",
      code: "",
    });

    if (!data.email || data.email.length < 3) {
      errCounter++;
      setErrors((prev) => ({ ...prev, emailError: t("log_reg.phone_err") }));
    }
    if (!data.password || data.password.trim().length < 6) {
      errCounter++;
      setErrors((prev) => ({ ...prev, passwordError: t("log_reg.pas_err") }));
    }

    if (errCounter > 0) return;

    const mutationObj = {} as any;
    mutationObj["email"] = data.email;
    mutationObj["password"] = data.password;
    mutationObj["remember_me"] = data.rememberMe;

    userLoginMutation.mutate(mutationObj);
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      <form
        onSubmit={formHandler}
        className="bg-white p-8 flex flex-col gap-6 rounded-3xl w-[440px] absolute inset-0 m-auto h-fit"
      >
        <h1 className="text-xl font-semibold">{t("log_reg.login")}</h1>

        {error && (
          <div className="p-4 flex gap-3 bg-[#FF003D26] rounded-md">
            <div className="flex items-center justify-center h-fit w-fit bg-errorred rounded-full p-1">
              <Cross className="fill-white h-4 w-4 rotate-45 shrink-0" />
            </div>
            <p className="text-tr font-normal text-icongray">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <p className="text-ft font-normal text-textgrey">{t("log_reg.email")}</p>
          <TextInput
            id="email"
            value={data.email}
            onChange={inputHandler}
            type="email"
            size="xl"
            errorMessage={errors.emailError}
            validationState={errors.emailError ? "invalid" : undefined}
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-ft font-normal text-textgrey">{t("log_reg.password")}</p>
          <TextInput
            id="password"
            value={data.password}
            onChange={inputHandler}
            type="password"
            size="xl"
            errorMessage={errors.passwordError}
            validationState={errors.passwordError ? "invalid" : undefined}
          />

          <div className="w-full flex justify-between items-center">
            <div className="flex gap-1 items-center mt-1">
              <Checkbox
                checked={data.rememberMe}
                onChange={() => setData((prev) => ({ ...prev, rememberMe: !data.rememberMe }))}
                className="w-[14px] h-[14px]"
              />
              <p className="font-normal text-tr text-black">{t("log_reg.remember_me")}</p>
            </div>

            <Link to={"/recoverpassword"} className="text-linkblue font-normal text-tr">
              {t("log_reg.forgot_password")}
            </Link>
          </div>
        </div>

        <Button type="submit" view="action" size="l">
          {t("log_reg.enter")}
        </Button>

        <p className="text-center text-ft text-black font-normal">
          {t("log_reg.no_acc")}
          <Link className="text-center text-ft text-linkblue font-semibold ml-1" to={"/registration"}>
            {t("log_reg.registration")}
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
