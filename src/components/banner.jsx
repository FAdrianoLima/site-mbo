import Link from "next/link";
import styles from "../styles/Banner.module.css";

function Banner() {
  return (
    <section className={styles.background}>
      <div className={styles.overlay}></div>

      <div className={styles.interno}>
        <div className={styles.box}>
          <span className={styles.tag}>NOVIDADE</span>

          <h1>Em breve</h1>

          <p>Estamos preparando algo novo para você.</p>

          <span className={styles.subtitulo}>
            Aguarde. Em breve teremos novidades.
          </span>
        </div>
      </div>
    </section>
  );
}

export default Banner;
