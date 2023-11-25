import { Outlet } from "react-router-dom"
import DashHeader from "./DashHeader"
import DashFooter from "./DashFooter"

export default function Layout() {
    return (
        <>
            <DashHeader />
            <div className="dash-layout-container">
                <Outlet />
            </div>
            <DashFooter />
        </>
    )
}