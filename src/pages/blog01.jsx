import Menu from "../components/menu";
import Rodape from "../components/rodape";
import styles from "../styles/Blog.module.css";
import Link from "next/link";

import RodapeAL from "../components/rodape-al";

export default function Blog01() {
  return (
    <>
      <Menu />
      <section className={styles.backgroundimg}>
        <div className={styles.interno}>
          <div className={styles.box}></div>

          <div className={styles.box2}>
            <img
              style={{ zIndex: "1234567" }}
              src="/static/images/a-newfly.png"
              alt=""
            />
          </div>
        </div>
      </section>

      <section style={{ marginTop: "0px" }} className={styles.background}>
        <div className={styles.interno2}>
          <div className={styles.box} style={{ maxWidth: "60rem" }}>
            <h3
              style={{
                fontWeight: "600",
                fontSize: "64px",
                color: "#db9600",
                lineHeight: "74px",
                textAlign: "center",
              }}
            >
              Entenda de uma vez por todas o que é e como funciona um centro
              logístico
            </h3>
            <p>
              <p className={styles.data} style={{ color: "#db9600" }}>
                31 / 05 / 2023 &nbsp;&nbsp;&nbsp;&nbsp;
                <img
                  style={{ maxWidth: "50px" }}
                  src="/static/images/bolinha.png"
                  alt=""
                />
                <div style={{ fontWeight: "400", color: "#01030e" }}>
                  &nbsp;&nbsp;&nbsp;&nbsp; por &nbsp;&nbsp;&nbsp;&nbsp;
                </div>
                <b className={styles.quem}>Adriano Lima</b>
              </p>
            </p>

            <span className={styles.span}>
              <p>
                O centro logístico, também conhecido como polo logístico ou
                parque industrial, é um dos elementos mais importantes na
                organização logística para aumentar a produtividade e reduzir os
                custos de entrega das mercadorias.
              </p>
              <h4>O que é um centro logístico?</h4>
              <p>
                Os centros logísticos são fruto da evolução dos tradicionais
                armazéns — espaços para armazenar o máximo de mercadorias
                possível —, integrando mais operações, mais eficiência e maior
                participação na cadeia de suprimentos.
              </p>
              <p>
                Nos centros de logística acontecem as atividades relacionadas à
                cadeia logística; logo, esses locais possuem todos os recursos
                essenciais para realizar controle de estoque, preparação e
                embalagem de pedidos, transporte interno e distribuição de
                mercadorias.
              </p>
              <p>
                Os centros de logística são equipados, ainda, com escritórios
                para supervisionar o bom funcionamento de todas essas
                atividades.
              </p>
              <h4>Como funciona um centro logístico?</h4>
              <p>
                Para o melhor desempenho de supply chain, o centro logístico
                opera com processos interligados que visam armazenar, preparar e
                distribuir produtos para o varejo e o atacado da forma mais
                eficiente possível.
              </p>
              <h4>
                A importância de ter um centro logístico bem-estruturado e de
                contar com uma boa transportadora
              </h4>
              <p>
                Um centro bem-estruturado e bem-gerenciado pode reduzir custos,
                melhorar a eficiência e aumentar a satisfação do cliente ao
                reduzir o tempo de espera pela entrega de seus pedidos. A Patrus
                Transportes não possui um centro logóstico, mas apoiamos as
                empresas na entrega e no manuseio das mercadorias.
              </p>
              <p>
                É fundamental investir em tecnologia para otimizar os processos
                e na escolha de bons gestores e de uma boa transportadora: ela é
                peça-chave para o sucesso de um centro logístico, pois é
                responsável por transportar as mercadorias deste local para os
                seus destinos finais.
              </p>
              <p>
                Neste ponto, é comum o gestor logístico, ao escolher a
                transportadora parceira, ter como um dos critérios a presença da
                tecnologia em seus processos.
              </p>
              <p>
                Além disso, uma rede de transporte confiável, com tecnologia
                avançada de rastreamento de cargas, gerenciamento de frota e uma
                equipe bem treinada para lidar com qualquer problema que possa
                surgir são fatores essenciais de uma transportadora eficiente.
              </p>
              <p></p>
              <p>Acompanhe novidades em nossas Redes Sociais:</p>

              <ul className={`${styles.social_media}`}>
                <li>
                  <Link
                    href="https://www.facebook.com/profile.php?id=100078795070667"
                    target="_blank"
                    passHref
                  >
                    <img src="/facebook-laranja.png" alt="" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.instagram.com/cjs_transportes/"
                    target="_blank"
                    passHref
                  >
                    <img src="/Instagram-laranja.png" alt="" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.linkedin.com/"
                    target="_blank"
                    passHref
                  >
                    <img src="/LinkedIn-laranja.png" alt="" />
                  </Link>
                </li>
              </ul>
            </span>
          </div>
        </div>
      </section>

      <section style={{ marginTop: "-100px" }} className={styles.background}>
        <div className={styles.interno}></div>
      </section>

      <Rodape />
      <RodapeAL />
    </>
  );
}
