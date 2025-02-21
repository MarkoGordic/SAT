import React, { useState } from "react";
import BackgroundLayout from "../components/layouts/BackgroundLayout";
import { BACKGROUND } from "../constants/backgrounds";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../global/AxiosInstance";
import { INDEX_NUMBER_REGEX } from "../constants/regex";
import Copyright from "../components/Copyright";
import FormButton from "../components/FormButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

type Student = {
    firstName: string,
    lastName: string,
    index: string
};

const StudentLogin: React.FC = () => {
    const { t } = useTranslation();

    const [index, setIndex] = useState("");
    const [indexValid, setIndexValid] = useState(false);

    const [student, setStudent] = useState<Student>();

    const [loginLoading, setLoginLoading] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);

    const SubmitLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoginLoading(true);
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
            setLoginLoading(false);
            setIndex("");

            // TODO: delete
            let student = {
                firstName: "Sara",
                lastName: "Poparic",
                index: "RA100-2024"
            }
            setStudent(student);
        }
    }

    const HandleIndexInputChange = (index: string) => {
        setIndex(index);
        setIndexValid(INDEX_NUMBER_REGEX.test(index));
    }

    const HandleLogout = () => {
        // TODO
        setLogoutLoading(true);
        localStorage.removeItem("token");   
        ResetForm();
        setLogoutLoading(false);
    }

    const ResetForm = () => {
        setIndex("");
        setIndexValid(false);
        setStudent(undefined);
    }

    return (
        <BackgroundLayout color={BACKGROUND.BLUE}>
            <div className="flex flex-col h-full items-center justify-center text-center text-base">
                <div>
                    <img className="w-32 mx-auto" src="/img/logo.png" />

                    <p className="mt-2 text-6xl text-white font-medium tracking-[0.2em]">
                        {t("sat")}
                    </p>

                    {student ? (
                        <div className="lg:w-3/5 w-4/5 mt-8 mx-auto text-white font-thin">
                            <div className="text-light-grey">
                                {t("student.login.loggedAs")}
                            </div>
                            <div className="mt-1 text-2xl font-bold">
                                {student.firstName} {student.lastName} - {student.index}
                            </div>

                            <div className="relative lg:w-1/2 w-full h-4 mt-5 mx-auto rounded-full overflow-hidden">
                                <div className="loading-bar absolute inset-0" ></div>
                            </div>  

                            <div className="mt-5 text-lg">
                                {t("student.login.pleaseWait")}
                            </div>

                            <FormButton 
                                title={t("student.login.logOut")}
                                isLoading={logoutLoading}
                                handleClick={HandleLogout}
                                className="mt-5 lg:w-1/3"
                            />   

                            <p className="mt-10 mx-auto">
                                {t("student.login.cheatingWarning")}
                            </p>
                        </div>
                    ) : (
                        <div className="flex-1">
                            <form onSubmit={SubmitLogin} method="post" className="w-80 text-left mx-auto mt-16">
                                <label className="text-white uppercase tracking-[0.2em]" htmlFor="index">
                                    {t("student.login.indexLabel")}
                                </label>
                                <div className="flex flex-row w-full h-10 mt-1 px-3 border-[1.5px] rounded-md bg-light-black border-light-grey text-white lowercase focus-within:border-blue">
                                    <input
                                        type="text"
                                        name="index"
                                        placeholder={t("student.login.index")}
                                        value={index}
                                        onChange={(e) => HandleIndexInputChange(e.target.value)}
                                        className="w-full bg-transparent outline-none"
                                    />
                                    <FontAwesomeIcon 
                                        icon={faCheckCircle}                        
                                        className={`align-middle my-auto ${indexValid ? `text-green` : `text-white`}`}    
                                    />
                                </div>

                                <FormButton 
                                    title={t("login.login")} 
                                    isLoading={loginLoading}
                                    disabled={!indexValid}
                                    className="mt-8"
                                />    
                            </form>

                            <p className="mt-24 text-white">
                                {t("student.login.warning")}
                            </p>
                        </div>
                    )}       
                </div>      

                <Copyright />

            </div>

            
        </BackgroundLayout>
    );
}

export default StudentLogin;