import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ButtonProps {
    title: string;
    isLoading: boolean;
    className?: string;
}

const FormButton: React.FC<ButtonProps> = ({ title, isLoading, className }) => {

    return (
        <button 
            type="submit" 
            id="button" 
            className={`${className} w-full h-10 mt-16 mb-5 uppercase cursor-pointer outline-none border-none rounded-lg bg-blue text-white tracking-widest
             hover:bg-dark-blue transform transition duration-300`}
        >
            {isLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
            ) : 
                title
            }
        </button>
    )
}

export default FormButton;