import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import BackgroundLayout from "../components/layouts/BackgroundLayout";
import { BACKGROUND } from "../constants/backgrounds";

const NotFound = () => {    
    const { t } = useTranslation();

    return (
        <BackgroundLayout color={BACKGROUND.RED}>
            <div className="flex flex-col h-full items-center justify-center text-base text-center text-white">
                <h1 className="text-4xl text-red">
                    {t("notFound.pageNotFound")}
                </h1>
                <div className="mt-3 text-grey">
                    {t("notFound.notFoundDescription")}
                </div>
                <Link 
                    to="/"
                    className="mt-3 px-1 border-b-[1px] border-grey text-grey cursor-pointer hover:border-white hover:text-white transform transition duration-300"
                >
                    <FontAwesomeIcon icon={faHome} className="align-middle hover:text-white" />
                    <span className="ml-2 align-middle font-extrabold">
                        {t("notFound.backToHome")}
                    </span>
                </Link>
            </div>
        </BackgroundLayout>
    )
}

export default NotFound;