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
            <nav
                aria-label="Main navigation"
                className={`${navOpen ? style.open : ""}`}>
                <ul>
                    <li className={isPathActive("/")}>
                        <Link href="/">
                            <FontAwesomeIcon icon={faHome} size="xl" />
                            <span className={style.label}>Hem</span>
                        </Link>
                    </li>
                    <li className={isPathActive("/explore")}>
                        <Link href="/explore">
                            <FontAwesomeIcon icon={faCompass} size="xl" />
                            <span className={style.label}>Utforska</span>
                        </Link>
                    </li>
                    <li className={isPathActive("/library")}>
                        <Link href="/library">
                            <FontAwesomeIcon icon={faBookmark} size="xl" />
                            <span className={style.label}>Bibliotek</span>
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
                            <span className={style.label}>Logga in</span>
                        </Link>
                    </li>
                    <li className={isPathActive("/settings")}>
                        <Link href="/settings">
                            <FontAwesomeIcon icon={faCog} size="xl" />
                            <span className={style.label}>Inställningar</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default Nav;
