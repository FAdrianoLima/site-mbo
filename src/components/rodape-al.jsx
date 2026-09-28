import Link from "next/link";
import styles from "../styles/RodapeAL.module.css";

export default function RodapeAL() {
  return (
    <footer className={styles.root}>
      <div className={styles.content}>
        <div className={styles.links}>
          <span>Direitos Reservados 2022</span>

          <span className={styles.separator}>|</span>

          <Link href="/docs/politica privacidade.pdf" target="_blank">
            Políticas de Privacidade
          </Link>

          <span className={styles.separator}>|</span>

          <Link href="/docs/termo uso.pdf" target="_blank">
            Termos de Uso
          </Link>

          <span className={styles.separator}>|</span>

          <Link href="/docs/politica-de-cookies.pdf" target="_blank">
            Política de Cookies
          </Link>

          <span className={styles.separator}>|</span>

          <span>Desenvolvido por</span>
        </div>

        <Link
          href="https://agenciaal.com.br/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.logoLink}
        >
          <img src="/agenciaal.png" alt="Agência AL" />
        </Link>
      </div>
    </footer>
  );
}
