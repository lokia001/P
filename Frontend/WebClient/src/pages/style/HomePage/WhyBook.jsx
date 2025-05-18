import styles from './WhyBook.module.css';
import validatedIcon from '../../../assets/react.svg'; // Đường dẫn đến icon dấu tích
import trustedIcon from '../../../assets/react.svg';

function WhyBook() {
    return (
        <section className={styles.whyBook}>
            <h2 className={styles.whyBookTitle}>Why Book On Coworker</h2>
            <div className={styles.whyBookContainer}>
                <div className={styles.whyBookItem}>
                    <div className={styles.iconContainer}>
                        <img src={validatedIcon} alt="Validated Spaces" className={styles.whyBookIcon} />
                    </div>
                    <h3 className={styles.itemTitle}>Validated Spaces</h3>
                    <p className={styles.itemDescription}>
                        Over 25,000 spaces and meeting rooms, with more than 300 new spaces joining each month.
                    </p>
                </div>
                <div className={styles.whyBookItem}>
                    <div className={styles.iconContainer}>
                        <img src={trustedIcon} alt="Trusted" className={styles.whyBookIcon} />
                    </div>
                    <h3 className={styles.itemTitle}>Trusted</h3>
                    <p className={styles.itemDescription}>
                        For Entrepreneurs to Fortune 500 companies, Coworker has over 6 million users.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default WhyBook;