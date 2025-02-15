import { Button, TextInput } from "@gravity-ui/uikit";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as Cross } from "../img/plus.svg";
import { useSignUpMutation } from "../hooks/mutations/registerUser";
import Cookies from "js-cookie";

const RegistrationPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const subdomain = window.location.href.split(".")[0];
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (subdomain.includes("sys")) navigate("/login");
  }, [subdomain, navigate]);

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>, id?: string) => {
    setData((prev) => ({ ...prev, [id || e.target.id]: e.target.value }));
  };

  const signUpMutation = useSignUpMutation({
    onSuccess: (data) => {
      setData({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
      });
      Cookies.set("access", data?.access, { expires: 0.25 });
      data?.refresh && Cookies.set("refresh", data?.refresh, { expires: 7 });
      Cookies.set("name", data?.user?.firstname as string, { expires: 7 });
      data?.user?.lastname && Cookies.set("lastname", data?.user?.lastname as string, { expires: 7 });
      data?.user?.email && Cookies.set("email", data?.user?.email as string, { expires: 7 });
    },
    onError: (error) => {
      setError(error?.response?.data?.message || t("def_err"));
    },
  });

  const formHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let errCounter = 0;

    setErrors({ firstname: "", lastname: "", email: "", password: "" });

    if (!data.password || data.password.trim().length < 6) {
      errCounter++;
      setErrors((prev) => ({ ...prev, password: t("log_reg.pas_err") }));
    }

    if (!data.firstname.trim()) {
      errCounter++;
      setErrors((prev) => ({ ...prev, name: t("log_reg.name_err") }));
    }

    if (!data.lastname.trim()) {
      errCounter++;
      setErrors((prev) => ({ ...prev, surname: t("log_reg.last_err") }));
    }

    if (errCounter > 0) return;
    signUpMutation.mutate(data);
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      {step === 1 && (
        <form
          onSubmit={(e) => formHandler(e)}
          className="bg-white p-8 flex flex-col gap-6 rounded-3xl w-[440px] absolute inset-0 m-auto h-fit"
        >
          <h1 className="text-xl font-semibold">{t("log_reg.registration")}</h1>

          {error && (
            <div className="p-4 flex gap-3 bg-[#FF003D26] rounded-md">
              <div className="flex items-center justify-center h-fit w-fit bg-errorred rounded-full p-1">
                <Cross className="fill-white h-4 w-4 rotate-45 shrink-0" />
              </div>
              <p className="text-tr font-normal text-icongray">{error}</p>
            </div>
          )}

          <div className="flex gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-tr font-normal text-textgrey">{t("log_reg.name")}</p>
              <TextInput
                id="firstname"
                value={data.firstname}
                onChange={inputHandler}
                error={errors?.firstname}
                validationState={errors?.firstname ? "invalid" : undefined}
                type="text"
                size="xl"
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-tr font-normal text-textgrey">{t("log_reg.surname")}</p>
              <TextInput
                id="lastname"
                value={data.lastname}
                onChange={inputHandler}
                error={errors?.lastname}
                validationState={errors?.lastname ? "invalid" : undefined}
                type="text"
                size="xl"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 h-[70px]">
            <p className="text-ft font-normal text-textgrey">{t("log_reg.email")}</p>

            <TextInput
              id="email"
              value={data.email}
              onChange={inputHandler}
              error={errors?.email}
              validationState={errors?.email ? "invalid" : undefined}
              type="text"
              size="xl"
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-base font-normal text-textgrey">{t("log_reg.password")}</p>
            <TextInput
              id="password"
              value={data.password}
              onChange={inputHandler}
              error={errors?.password}
              validationState={errors?.password ? "invalid" : undefined}
              type="password"
              size="xl"
            />
          </div>

          <Button type="submit" view="action" size="l">
            {t("log_reg.continue")}
          </Button>

          <p className="text-center text-[15px] text-black font-normal">
            {t("log_reg.have_account")}
            <Link className="text-center text-[15px] text-linkblue font-semibold ml-1" to={"/login"}>
              {t("log_reg.entrance")}
            </Link>
          </p>
        </form>
      )}
    </div>
  );
};

export default RegistrationPage;
