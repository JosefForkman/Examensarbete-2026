import {
    FlipProp,
    IconProp,
    SizeProp,
} from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

type ButtonParams = ButtonHTMLAttributes<HTMLButtonElement> &
    (
        | {
              Variant: "Text";
              text: string;
          }
        | {
              Variant: "TextWithIcon";
              Icon: IconProp;
              Size?: SizeProp | undefined;
              flip?: boolean | FlipProp | undefined;
              text: string;
          }
        | {
              Variant: "IconOnly";
              Icon: IconProp;
              Size?: SizeProp | undefined;
              flip?: boolean | FlipProp | undefined;
          }
    );

function Button(props: ButtonParams) {
    const { Variant } = props;

    if (Variant === "Text") {
        const { text, className, ...rest } = props;
        return (
            <button className={`${styles.button} ${className || ""}`} {...rest}>
                {text}
            </button>
        );
    }

    if (Variant === "TextWithIcon") {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { Icon, Size, text, flip, className, Variant, ...rest } = props;
        return (
            <button
                className={`${styles.button} ${styles.withIcon} ${
                    className || ""
                }`}
                {...rest}>
                <FontAwesomeIcon icon={Icon} size={Size} flip={flip} />
                {text}
            </button>
        );
    }

    if (Variant === "IconOnly") {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { Icon, Size, flip, className, Variant, ...rest } = props;
        return (
            <button
                className={`${styles.button} ${styles.noBorder} ${
                    className || ""
                }`}
                {...rest}>
                <FontAwesomeIcon icon={Icon} size={Size} flip={flip} />
            </button>
        );
    }
}

export default Button;
