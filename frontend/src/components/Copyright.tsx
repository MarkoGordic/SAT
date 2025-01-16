import { useTranslation } from "react-i18next";

const Copyright: React.FC = () => {
    const { t } = useTranslation();

    return (
        <footer className="absolute bottom-6 w-full text-center">
            <p className="text-grey">
                {t("copyright")}
            </p>
        </footer>
    )
}

export default Copyright;