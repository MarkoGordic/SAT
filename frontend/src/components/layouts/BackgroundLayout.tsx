import React from "react";
import { BACKGROUND as BACKGROUND } from "../../constants/backgrounds";

type LayoutProps = {
    children:JSX.Element | JSX.Element[];
    color: BACKGROUND;
}

const BackgroundLayout: React.FC<LayoutProps> = ({ children, color }) => {

    return (
        <div className="relative h-screen w-full bg-black">
            <div className={`${color === BACKGROUND.RED ? `red` 
                : color === BACKGROUND.WHITE ? `white` 
                : `blue`}-background`}
            >
                { children }
            </div>            
        </div>
    )
}

export default BackgroundLayout;