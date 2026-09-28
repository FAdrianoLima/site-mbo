import Menu from "../components/menu";
import Rodape from "../components/rodape";
import Whats from "../components/whats";
import styles from "../styles/Cjs.module.css";
import Carousel from "react-material-ui-carousel";
import { Paper, Button } from "@mui/material";
import Link from "next/link";

import RodapeAL from "../components/rodape-al";

export default function acjs() {
  return (
    <>
      <Menu />
      <section className={styles.backgroundimg}></section>

      <section style={{ marginTop: "100px" }} className={styles.background}>
        <div className={styles.interno} style={{ alignItems: "center" }}>
          <div className={styles.box}>
            <h3 style={{ color: "#db9600", fontWeight: "600" }}>
              Envie sua mercadoria para todo o Brasil com menor custo, mais
              conveniência e de forma sustentável.
            </h3>
            <p>
              Possuímos uma estrutura com escritório equipado com as ferramentas
              necessárias e a infraestrutura direcionada ao transporte. Nossa
              estrutura é informatizada garantindo assim a total precisão em
              tudo que a CJS TRANSPORTES negocia com seus clientes, garantindo
              qualidade em seus serviços.
            </p>
            <p>
              Utilizamos ferramentas de trabalho que nos proporcionam facilidade
              de traçar as melhores rotas da origem ao destino dentro do
              território nacional, calculando sempre o tempo estimado para a
              entrega de sua carga.
            </p>
          </div>

          <div className={styles.box}>
            <img src="/static/images/sobre.png" />
          </div>
        </div>
      </section>

      <section
        style={{ marginTop: "100px", flexDirection: "column-reverse" }}
        className={styles.background}
      >
        <div className={styles.interno} style={{ alignItems: "center" }}>
          <div className={styles.bloco}>
            <img src="/static/images/preco.png" />
            <p> Melhores preços de Frete</p>
          </div>
          <div className={styles.bloco}>
            <img src="/static/images/eficiencia.png" />
            <p> Eficiência Logística</p>
          </div>
          <div className={styles.bloco}>
            <img src="/static/images/seguranca.png" />
            <p> Segurança da postagem à entrega.</p>
          </div>
        </div>

        <div className={styles.interno}>
          <p>&nbsp;</p>
        </div>

        <div className={styles.interno}>
          <p>&nbsp;</p>
        </div>

        <div className={styles.interno} style={{ alignItems: "center" }}>
          <div className={styles.bloco}>
            <img src="/static/images/pontos-de-coleta.png" />
            <p> Presentes em vários estados</p>
          </div>
          <div className={styles.bloco}>
            <img src="/static/images/sustentavel.png" />
            <p> Sustentabilidade em foco</p>
          </div>
          <div className={styles.bloco}>
            <img src="/static/images/rastreio.png" />
            <p> Rastreamento da encomenda</p>
          </div>
        </div>
      </section>

      <section style={{ marginTop: "100px" }} className={styles.background}>
        <div className={styles.interno} style={{ alignItems: "center" }}>
          <div
            className={styles.box}
            style={{ backgroundColor: "#db9600", height: "290px" }}
          >
            <h3
              style={{
                fontWeight: "600",
                margin: "2rem",
              }}
            >
              Somos uma transportadora qualificada para entregar o que você
              precisar, com segurança e qualidade!
            </h3>
            <p style={{ margin: "1rem 0rem 0rem 2rem" }}>
              O depósito para armazenamento da mercadoria e roteirização de
              entregas possui uma área de 1.000 metros quadrados equipado de
              empilhadeira para carga e descarga dos veículos.
            </p>
          </div>

          <div className={styles.box} style={{ backgroundColor: "#db9600" }}>
            <img style={{ height: "290px" }} src="/static/images/Sobre-2.png" />
          </div>
        </div>
      </section>

      <section
        style={{ marginTop: "100px", paddingBottom: "100px" }}
        className={styles.background}
      >
        <div className={styles.interno} style={{ alignItems: "center" }}>
          <div className={styles.box}>
            <h3
              style={{ color: "#db9600", fontWeight: "600", fontSize: "48px" }}
            >
              Conheça a CJS Transportes
            </h3>
            <p>
              Valorizamos a dedicação no atendimento, informações e negociações
              com o cliente e também priorizamos a parceria com os nossos
              clientes, e o objetivo não é apenas prestar serviços de
              transporte, mas também, conquistar e fidelizar todos os clientes,
              captando novos parceiros
            </p>
          </div>

          <div className={styles.box}>
            <img src="/static/images/Sobre-3.png" />
          </div>
        </div>
      </section>

      <section style={{ paddingTop: "100px" }} className={styles.background2}>
        <div className={styles.interno}>
          <div className={`${styles.box}`}>
            <p style={{ fontSize: "36px" }}>
              <h3
                style={{ fontWeight: "600", fontSize: "48px" }}
                className={styles.titulo}
              >
                Marcas que comprovam
              </h3>
              os nossos resultados
            </p>
          </div>

          <div className={`${styles.box}`} style={{ maxWidth: "40rem" }}>
            {/*<App />*/}
          </div>
        </div>
      </section>

      <section style={{ marginTop: "0px" }} className={styles.background2}>
        <div className={styles.interno2}>
          <div className={`${styles.images} `}>
            <img src="/static/images/parceiros/logo-rometal.png" alt="" />
            <img src="/static/images/parceiros/logo-sl.png" alt="" />
            <img src="/static/images/parceiros/logo-caramuru.png" alt="" />
            <img src="/static/images/parceiros/logo-fr.png" alt="" />
            <img src="/static/images/parceiros/logo-frimesa.png" alt="" />
            <img src="/static/images/parceiros/logo-frutitalia.png" alt="" />
            <img src="/static/images/parceiros/logo-gota.png" alt="" />
            <img src="/static/images/parceiros/logo-horizonte.png" alt="" />
            <img src="/static/images/parceiros/logo-ole.png" alt="" />
            <img src="/static/images/parceiros/logo-remo.png" alt="" />
            <img src="/static/images/parceiros/logo-rubbersul.png" alt="" />
            <img src="/static/images/parceiros/logo-perfinobre.png" alt="" />
            <img src="/static/images/parceiros/logo-alternativa.png" alt="" />
            <img src="/static/images/parceiros/logo-brmetal.png" alt="" />
            <img src="/static/images/parceiros/logo-ajust.png" alt="" />
            <img src="/static/images/parceiros/logo-crescita.png" alt="" />
            <img src="/static/images/parceiros/logo-dauper.png" alt="" />
            <img src="/static/images/parceiros/logo-ecoplac.png" alt="" />
            <img src="/static/images/parceiros/logo-rudegon.png" alt="" />
            <img src="/static/images/parceiros/logo-gmad.png" alt="" />
          </div>
        </div>
      </section>

      <Rodape />
      <RodapeAL />
    </>
  );
}
