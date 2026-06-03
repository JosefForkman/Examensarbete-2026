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

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.locale("sv");

type props = {
    id: number;
    title: string;
    imageUrl: string | null;
    publicationDate: string;
};

function Card(postItem: props) {
    const [isVavorite, setIsVavorite] = useState(false);

    const toggleFavorite = () => {
        setIsVavorite((pre) => !pre);
    };
    return (
        <div className={styles.card}>
            {postItem.imageUrl ? (
                <Image
                    width={240}
                    height={240}
                    src={postItem.imageUrl}
                    alt=""
                />
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
                <h2>{postItem.title}</h2>
                <div className={styles.buttonAndDate}>
                    <Button Variant="Text" text="Se kanal" />
                    <span>{dayjs().to(dayjs(postItem.publicationDate))}</span>
                </div>
            </div>
        </div>
    );
}

export default Card;
