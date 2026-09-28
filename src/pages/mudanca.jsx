import Menu from "../components/menu";
import Rodape from "../components/rodape";
import styles from "../styles/Servicos.module.css";
import Link from "next/link";

import RodapeAL from "../components/rodape-al";

export default function Design() {
  return (
    <>
      <Menu />
      <section className={styles.backgroundimg}></section>

      <section style={{ marginTop: "100px" }} className={styles.background}>
        <div style={{ alignItems: "center" }} className={styles.interno}>
          <div className={`${styles.box2}`}>
            <p
              style={{
                fontSize: "24px",
                fontWeight: "300",
                lineHeight: "40px",
              }}
            >
              <h3
                style={{
                  fontWeight: "600",
                  fontSize: "130px",
                  color: "#db9600",
                  lineHeight: "100px",
                }}
                className={styles.titulo}
              >
                Mu
                <br />
                dan
                <br />
                ças
              </h3>
            </p>
          </div>

          <div className={`${styles.box}`}>
            <p>
              Nós sabemos que fazer mudanças nem sempre é uma tarefa divertida
              ou agradável, pois encaixotar pertences e bens materiais realmente
              dá muito trabalho.
              <br /> <br />
              Por isso, quando se trata de mudanças, a CJS Transportes se
              destaca por sua vasta experiência no ramo e sabe exatamente como
              solucionar os principais problemas de mudanças.
              <br /> <br />
              Além de contar com uma equipe qualificada que garante a melhor
              experiência no transporte dos seus bens materiais, a Transcotempo
              também oferece o melhor custo benefício da região de Curitiba.
              <br /> <br />
              Logo abaixo você pode conferir os nossos principais serviços de
              transporte de mudanças e região.
            </p>
          </div>
        </div>

        <div className={styles.interno2} style={{ marginTop: "100px" }}>
          <div className={`${styles.box2}`}>
            <p>
              A CJS Transportes consegue realizar o transporte de mudanças com a
              agilidade que o cliente precisa.
              <br /> <br />
              Por isso, para garantir a segurança na hora de transportar a sua
              mudança residencial conte com uma empresa que possui anos de
              experiência e qualidade no que faz.
            </p>
          </div>
          <div className={`${styles.box2}`}>
            <p
              style={{
                fontSize: "24px",
                fontWeight: "300",
                lineHeight: "40px",
              }}
            >
              <h3 className={styles.titulo2}>
                Mudanças <br />
                Residenciais
              </h3>
            </p>
          </div>
        </div>

        <div className={styles.interno2} style={{ marginTop: "100px" }}>
          <div className={`${styles.box2}`}>
            <h3 className={styles.titulo2}>
              Mudanças <br />
              Comerciais
            </h3>
          </div>

          <div className={`${styles.box2}`}>
            <p>
              A CJS Transportes também oferece soluções em mudanças comerciais
              para empresas que precisam de novos ares e um novo endereço.
              <br /> <br />
              Para as mudanças comerciais, nós oferecemos serviços exclusivos
              que vão de encontro às necessidades do mundo corporativo, seja uma
              pequena empresa, um escritório ou uma grande indústria.
            </p>
          </div>
        </div>

        {/*
            Segunda Dupla
            */}
        <div className={styles.interno2} style={{ marginTop: "100px" }}>
          <div className={`${styles.box2}`}>
            <p>
              As mudanças interestaduais são mais longas e por isso exigem maior
              planejamento e cuidados específicos com os pertences durante todo
              o trajeto.
              <br /> <br />
              Por isso, além das mudanças, a Transcotempo efetua mudanças
              interestaduais, com a mesma qualidade e agilidade de uma mudança
              local.
            </p>
          </div>
          <div className={`${styles.box2}`}>
            <h3 className={styles.titulo2}>
              Mudanças <br />
              Interestaduais
            </h3>
          </div>
        </div>
      </section>

      <Rodape />
      <RodapeAL />
    </>
  );
}
