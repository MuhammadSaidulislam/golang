import React, { ReactNode, useEffect } from "react";
import Header from "../LeftSide/Header";
import LeftSide from "../LeftSide/LeftSide";


interface Props {
    children?: ReactNode
}
const Layout = ({ children, ...props }: Props) => {
    const [collapsed, setCollapsed] = React.useState(false);
    const handleValueChange = (value: any) => {
        setCollapsed(!collapsed)
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <>
            <div className="d-flex">
                <div>
                    <LeftSide collapsed={collapsed} setCollapsed={setCollapsed} />
                </div>
                <div style={{ width: "100%" }}>
                    <Header onValueChange={handleValueChange} />
                    <div {...props}>{children}</div>
                </div>
            </div>
        </>
    )
}

export default Layout