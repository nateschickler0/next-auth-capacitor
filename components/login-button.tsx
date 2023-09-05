import {useRouter} from "next/router";
import {loginWithCredentials, loginWithGithub} from "../utils/helper";
import styles from "./login-button.module.css";

export default function LoginButton() {
    const router = useRouter();
    const callback = () => {
        router.reload();
    };

    return (
        <><button
            className={styles.buttonPrimary}
            onClick={() => loginWithCredentials(callback)}
        >
            Login with Credentials
        </button><button
            className={styles.buttonPrimary}
            onClick={() => loginWithGithub(callback)}
        >
            Login with Github
        </button></>

    );
}
