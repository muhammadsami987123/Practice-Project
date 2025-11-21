import React from 'react';
import Navbar from '@theme-original/Navbar';
import AuthButton from '@site/src/components/AuthButton';
import styles from './styles.module.css';

export default function NavbarWrapper(props) {
    return (
        <>
            <Navbar {...props} />
            <div className={styles.authButtonContainer}>
                <AuthButton />
            </div>
        </>
    );
}
