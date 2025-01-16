import React, { useState } from "react";
import BackgroundLayout from "../components/layouts/BackgroundLayout";
import { BACKGROUND } from "../constants/backgrounds";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";
import { axiosInstance } from "../global/AxiosInstance";
import { INDEX_NUMBER_REGEX } from "../constants/regex";
import Copyright from "../components/Copyright";

const StudentLogin: React.FC = () => {
    const { t } = useTranslation();

    const [index, setIndex] = useState("");
    const [indexValid, setIndexValid] = useState(true);

    const [isLoading, setIsLoading] = useState(false);

    const SubmitLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const response = await axiosInstance.post("/auth/login", { index });
            const token = response.data.token;
            localStorage.setItem("token", token);
            alert("Successful login");  // TODO: navigate to home page
        } catch(error: any) {
            if(error?.status === 401) {
                alert("Wrong credentials"); // TODO: add custom message (toast)
            } else {
                console.log("Error: ", error);
            }
        } finally {
            setIsLoading(false);
            setIndex("");
        }
    }

    const HandleIndexInputChange = (index: string) => {
        setIndex(index);
        setIndexValid(INDEX_NUMBER_REGEX.test(index));
    }

    return (
        <BackgroundLayout color={BACKGROUND.BLUE}>
            <div className="flex flex-col h-full items-center justify-center text-center text-base">
                <img className="mt-44 mx-auto w-40" src="/img/logo.png" />

                <p className="mt-4 text-7xl text-white font-medium tracking-[0.2em]">
                    {t("sat")}
                </p>

                <form onSubmit={SubmitLogin} method="post" className="w-80 text-left mx-auto mt-16">
                    <label className="text-white uppercase tracking-[0.2em]" htmlFor="index">
                        {t("student.login.indexLabel")}
                    </label>
                    <input
                        type="text"
                        name="index"
                        placeholder={t("student.login.index")}
                        value={index}
                        onChange={(e) => HandleIndexInputChange(e.target.value)}
                        className={`w-full h-10 mt-1 px-3 outline-none border-[1.5px] rounded-md bg-light-black uppercase 
                            ${indexValid ? `border-light-grey text-white` : `border-red text-red`}`}
                    />

                    <button
                        type="submit"
                        id="login-button"
                        className="w-full h-10 mt-8 outline-none border-none rounded-lg bg-blue uppercase text-white tracking-widest cursor-pointer "
                    >
                        {isLoading ? (
                            <FontAwesomeIcon icon={faSpinner} spin />
                        ) :
                            t("login.login")
                        }
                    </button>
                </form>

                <p className="mt-24 mb-48 text-white">
                    {t("student.login.warning")}
                </p>

                <Copyright />

            </div>

            
        </BackgroundLayout>
    );
}

export default StudentLogin;