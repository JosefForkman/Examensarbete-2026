"use client";
import Image from "next/image";
import styles from "./Card.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBookmark as faBookmarkSolid,
    faRss,
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import Button from "../Button";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/sv";
import { useState } from "react";
import { FragmentOf, readFragment } from "gql.tada";
import { cardFragment } from "@/gql/query/PostItem";
import Link from "next/link";

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.locale("sv");

type props = {
    postItem: FragmentOf<typeof cardFragment>;
};

export default function Card({ postItem }: props) {
    const [isVavorite, setIsVavorite] = useState(false);

    const data = readFragment(cardFragment, postItem);

    const slugName = data.name.replaceAll(" ", "-");

    const toggleFavorite = () => {
        setIsVavorite((pre) => !pre);
    };

    return (
        <div className={styles.card}>
            {data.imageUrl ? (
                <Image width={240} height={240} src={data.imageUrl} alt="" />
            ) : (
                <div className={styles.missingImage}>
                    <FontAwesomeIcon icon={faRss} size="10x" />
                </div>
            )}
            <Button
                className={styles.bookMark}
                Icon={isVavorite ? faBookmarkSolid : faBookmarkRegular}
                Variant="IconOnly"
                onClick={toggleFavorite}
            />
            <div className={styles.body}>
                <h2>{data.name}</h2>
                <div className={styles.buttonAndDate}>
                    <Link className="Button" href={`Podd/${slugName}`}>
                        Se kanal
                    </Link>
                    <span>{dayjs().to(dayjs(data.createdAt))}</span>
                </div>
            </div>
        </div>
    );
}
