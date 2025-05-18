import styles from './WhatIsCoworker.module.css';

function WhatIsCoworker() {
    return (
        <section className={styles.whatIsCoworker}>
            <div className={styles.coworkerInfo}>
                <h2>What is Coworker?</h2>
                <p>Coworker is an online platform for discovering, booking, and accessing coworking spaces around the world.</p>
                <p>With a network of over 25,000 flexible workspaces in 172 countries, Coworker offers month-to-month and enterprise office solutions, search and direct workspace bookings, office broker services for coworking access.</p>
                <a href="#">LEARN MORE ABOUT COWORKER</a>
            </div>

        </section>
    );
}

export default WhatIsCoworker;