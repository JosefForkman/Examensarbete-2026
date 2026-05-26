"use client";
import {
    faBookmark,
    faCog,
    faCompass,
    faHome,
    faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import style from "./Nav.module.css";
import { usePathname } from "next/navigation";
import { useState } from "react";

function Nav() {
    const pathName = usePathname();
    const [navOpen, setNavOpen] = useState(false);

    const isPathActive = (path: string) =>
        pathName === path ? style.active : undefined;

    return (
        <aside className={`${style.nav} bg-charcoal-blue`}>
            <button
                className={`${style.hamburgerButton} ${navOpen ? style.open : ""}`}
                aria-label="Toggle navigation"
                aria-expanded={navOpen}
                onClick={() => setNavOpen(!navOpen)}>
                <span className={style.hamburger}></span>
                <span className={style.hamburger}></span>
                <span className={style.hamburger}></span>
            </button>
            <nav aria-label="Main navigation" className={`${navOpen ? style.open : ""}`}>
                <ul>
                    <li className={isPathActive("/")}>
                        <Link href="/">
                            <FontAwesomeIcon icon={faHome} size="xl" />
                            Hem
                        </Link>
                    </li>
                    <li className={isPathActive("/explore")}>
                        <Link href="/explore">
                            <FontAwesomeIcon icon={faCompass} size="xl" />
                            Utforska
                        </Link>
                    </li>
                    <li className={isPathActive("/library")}>
                        <Link href="/library">
                            <FontAwesomeIcon icon={faBookmark} size="xl" />
                            Bibliotek
                        </Link>
                    </li>
                </ul>

                <ul>
                    <li className={isPathActive("/login")}>
                        <Link href="/login">
                            <FontAwesomeIcon
                                icon={faRightToBracket}
                                size="xl"
                            />
                            Logga in
                        </Link>
                    </li>
                    <li className={isPathActive("/settings")}>
                        <Link href="/settings">
                            <FontAwesomeIcon icon={faCog} size="xl" />
                            Inställningar
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default Nav;
