import Header from "./Header/Header";

import "./Layout.scss";

type LayoutProps = {
    children: React.ReactNode
}

export default function Layout(props: Readonly<LayoutProps>) {
    return (<main className="main-container">
        <Header />
        {props.children}
    </main>)
}