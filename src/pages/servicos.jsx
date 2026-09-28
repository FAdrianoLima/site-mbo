import Menu from "../components/menu";
import Rodape from "../components/rodape";
import Whats from "../components/whats";
import styles from "../styles/Servicos.module.css";
import Link from "next/link";

import RodapeAL from "../components/rodape-al";

export default function anewfly() {
  return (
    <>
      <Menu />
      <section className={styles.backgroundimg}>
        <div className={styles.interno}></div>
      </section>

      <section style={{ marginTop: "150px" }} className={styles.background}>
        <div className={styles.interno2}>
          <p style={{ fontSize: "36 px" }}>
            <h3
              style={{ fontWeight: "600", fontSize: "64px" }}
              className={styles.titulo}
            >
              Serviços prestados
            </h3>
          </p>
        </div>
      </section>

      <section style={{ marginTop: "0px" }} className={styles.background}>
        <div className={styles.interno2}>
          <div className={styles.servicos}>
            <img src="/static/images/mudanca.png" />
            <h4>Mudanças Residenciais e Comerciais</h4>
            <p>
              Mudanças sempre são complicadas, sabendo disso oferecemos o
              serviço de mudança para o cliente com toda a responsabilidade,
              para que seus bens cheguem no local com segurança.
            </p>
            <Link href="/mudanca">
              <button className={styles.button}> Saiba Mais</button>
            </Link>
          </div>

          <div className={styles.servicos}>
            <img src="/static/images/carga.png" />
            <h4>Carga Fechada</h4>
            <p>
              Disponibilizamos carga fechada para os clientes, independente do
              volume e para todo Brasil. Tratando todo transporte com muita
              responsabilidade, tanto para o contratado como o contratante.
            </p>
            <Link href="/contato">
              <button className={styles.button}> Saiba Mais</button>
            </Link>
          </div>

          <div className={styles.servicos}>
            <img src="/static/images/complemento.png" />
            <h4>Complemento de Carga</h4>
            <p>
              Para o cliente que precisa preencher todo o espaço disponível no
              veículo, temos o complemento de carga para completar o espaço
              vazio no seu baú ou carroceria.
            </p>
            <Link href="/contato">
              <button className={styles.button}> Saiba Mais</button>
            </Link>
          </div>
        </div>
      </section>

      <Rodape />
      <RodapeAL />
    </>
  );
}
