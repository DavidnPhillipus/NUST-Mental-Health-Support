import styles from '../styles/LandingPage.module.css'
import heroImage from '../assets/hero.svg'

type LandingPageProps = {
  onOpenLogin(): void
  onOpenRegister(): void
}

export default function LandingPage({ onOpenLogin, onOpenRegister }: LandingPageProps) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>NUST Mental Health</div>
        <nav className={styles.nav}>
          <button type="button" className={styles.link} onClick={onOpenLogin}>
            Login
          </button>
          <button type="button" className={styles.cta} onClick={onOpenRegister}>
            Register
          </button>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.badge}>NUST Mental Wellness</span>
          <h1>Students, counsellors and admins in one supported wellness platform.</h1>
          <p className={styles.heroText}>
            Sign in to track mood, book counselling, review wellbeing resources, and manage support with real Supabase-backed data.
          </p>
          <div className={styles.heroActions}>
            <button type="button" className={styles.primaryButton} onClick={onOpenRegister}>
              Get started
            </button>
            <button type="button" className={styles.secondaryButton} onClick={onOpenLogin}>
              Sign in
            </button>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <img src={heroImage} alt="NUST Mental Health illustration" className={styles.heroImage} />
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.featureItem}>
          <h3>Create tasks</h3>
          <p>Add and organize your tasks quickly with categories and due dates.</p>
        </div>
        <div className={styles.featureItem}>
          <h3>Track progress</h3>
          <p>Monitor your productivity with progress bars and completion stats.</p>
        </div>
      </section>

      <section className={styles.footerCard}>
        <div>
          <h2>Get started with NUST Mental Health</h2>
          <p>
            Sign up today to start tracking wellbeing, booking support, and staying connected with counselling resources.
          </p>
        </div>
        <div className={styles.footerLinks}>
          <button type="button" className={styles.cta} onClick={onOpenRegister}>
            Create account
          </button>
          <button type="button" className={styles.secondaryButton} onClick={onOpenLogin}>
            Login now
          </button>
        </div>
      </section>

      <section className={styles.contactSection}>
        <div className={styles.contactCopy}>
          <h2>Contact Us</h2>
          <p>For support or enquiries, reach out to our team.</p>
        </div>
        <div className={styles.contactDetails}>
          <div>
            <span>Email</span>
            <a href="mailto:support@nustmentalhealth.com">support@nustmentalhealth.com</a>
          </div>
          <div>
            <span>Phone</span>
            <a href="tel:+264824184911">+26482 418 4911</a>
          </div>
        </div>
      </section>
    </div>
  )
}
