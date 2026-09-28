import Menu from "../components/menu";
import Rodape from "../components/rodape";
import Whats from "../components/whats";
import styles from "../styles/Blog.module.css";
import Carousel from "react-material-ui-carousel";
import { Paper, Button } from "@mui/material";
import Link from "next/link";

import RodapeAL from "../components/rodape-al";

export default function Blog() {
  return (
    <>
      <Menu />
      <section className={styles.backgroundimg}>
        <div className={styles.interno}></div>
      </section>

      <section style={{ marginTop: "0px" }} className={styles.background}>
        <div className={styles.interno}>
          <p style={{ fontSize: "36 px" }}>
            <h3
              style={{
                fontWeight: "600",
                fontSize: "64px",
                color: "#db9600",
                lineHeight: "84px",
              }}
            >
              Fique por dentro
            </h3>
            <p>Confira as últimas matérias e se mantenha atualizado!</p>
          </p>
        </div>
      </section>

      <section style={{ marginTop: "-130px" }} className={styles.background}>
        <Link href="/blog01">
          <div className={styles.interno2}>
            <img src="/static/images/blog/blog-01.png" />

            <p style={{ marginLeft: "2rem", cursor: "pointer" }}>
              <h4>22 / Agosto / 2023</h4>
              <h2 style={{ color: "#01030e" }}>
                Entenda de uma vez por todas o que é e como funciona um centro
                logístico
              </h2>
              <p>
                O centro logístico, também conhecido como polo logístico ou
                parque industrial, é um dos elementos mais importantes...
              </p>
            </p>
          </div>
        </Link>
      </section>

      {/*
      <section style={{ marginTop: "-100px" }} className={styles.background}>
        <div className={styles.interno}>
          <Link href="/blog01">
          <div className={styles.blog}>
            <img
            src="/static/images/blog/blog-01.png"
            />
            <span>
              <h2>XXXXXXXXXXXXX</h2>
              <p>XXXXXXXXXXXXXXXXXXXXXXXXXXXXX</p>
          </span>
          </div>
          </Link>

          <Link href="/blog01">
          <div className={styles.blog}>
            <img
            src="/static/images/blog/blog-01.png"
            />
            <span>
            <h2>XXXXXXXXXXXXX</h2>
              <p>XXXXXXXXXXXXXXXXXXXXXXXXXXXXX</p>
          </span>
          </div>
          </Link>

          <Link href="/blog01">
          <div className={styles.blog}>
            <img
            src="/static/images/blog/blog-01.png"
            />
            <span>
            <h2>XXXXXXXXXXXXX</h2>
              <p>XXXXXXXXXXXXXXXXXXXXXXXXXXXXX</p>
          </span>
          </div>
          </Link>
        </div>
      </section>
*/}

      <Rodape />
      <RodapeAL />
    </>
  );
}
