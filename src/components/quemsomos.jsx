import styles from "../styles/Quemsomos.module.css";
import "../styles/Quemsomos.module.css";
import React, { useState } from "react";
import Link from "next/link";
import Modal from "./modal.jsx";

const CardImage = ({ imagem = "" }) => {
  return (
    <div className={styles.card}>
      <img src={`/static/images/quem-somos//${imagem}`} alt={imagem} />
    </div>
  );
};

function QuemSomos() {
  const [titulo, setTitulo] = React.useState("");
  const [descricao, setDescricao] = React.useState("");
  const [hastag, setHastag] = React.useState("");
  const [hastag2, setHastag2] = React.useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = () => {
    setIsModalVisible(true);
  };

  const handleLinkClick1 = () => {
    if (titulo === "Estrutura") {
      setTitulo("");
      setDescricao("");
      setHastag("");
      setHastag2("");
    } else {
      setTitulo("Estrutura");
      setDescricao(
        "Nossa estrutura é informatizada garantindo assim a total precisão em tudo que a CJS TRANSPORTES  negocia com seus clientes, garantindo qualidade em seus serviços. O depósito para armazenamento da mercadoria e roteirização de entregas possui uma área de 1.000 metros quadrados equipado de empilhadeira para carga e descarga dos veículos."
      );
    }
  };

  const handleLinkClick2 = () => {
    if (titulo === "Entrega") {
      setTitulo("");
      setDescricao("");
      setHastag("");
      setHastag2("");
    } else {
      setTitulo("Entrega");
      setDescricao(
        "Utilizamos ferramentas de trabalho que nos proporcionam facilidade de traçar as melhores rotas da origem ao destino dentro do território nacional, calculando sempre o tempo estimado para a entrega de sua carga."
      );
    }
  };

  const handleLinkClick3 = () => {
    if (titulo === "Encomendas") {
      setTitulo("");
      setDescricao("");
      setHastag("");
      setHastag2("");
    } else {
      setTitulo("Encomendas");
      setDescricao(
        "Contamos com a parceria da seguradora SOMPO SEGUROS S.A - CNPJ: 61.383.493/0001-80  com seguro de roubo e tombamento, além do adicional de avarias  e a Gerenciadora de Riscos Tecnorisk, nossos veículos também possuem localizador Link Monitoramentor e bloqueador de sinal da Saeggo do Brasil"
      );
    }
  };

  const handleLinkClick4 = () => {
    if (titulo === "Atendimento") {
      setTitulo("");
      setDescricao("");
      setHastag("");
      setHastag2("");
    } else {
      setTitulo("Atendimento");
      setDescricao(
        "Valorizamos a dedicação no atendimento, informações e negociações com o cliente e também priorizamos a parceria com os nossos clientes, e o objetivo não é apenas prestar serviços de transporte, mas também, conquistar e fidelizar todos os clientes, captando novos parceiros"
      );
    }
  };

  React.useEffect(() => {
    handleLinkClick1();
  }, []);

  const [isVideoVisible, setIsVideoVisible] = useState(false);

  const handlePlayButtonClick = () => {
    setIsVideoVisible(true);
  };

  const handleVideoEnded = () => {
    setIsVideoVisible(false);
  };

  return (
    <>
      <section
        id="Acesso rápido"
        style={{ paddingBottom: "0px", paddingTop: "80px" }}
        className={styles.background}
      >
        <div className={styles.interno2} style={{ justifyContent: "center" }}>
          <p style={{ fontSize: "24px", marginBottom: "30px" }}>
            Acesso Rápido
          </p>
          <ul>
            <Link href="https://maps.app.goo.gl/LSjepaTqeTN6xC828" target="_blank" passHref>
              <li style={{ cursor: "pointer" }}>
                <img src="/static/images/Encontrar-unidade.png" alt="" />
              </li>
            </Link>
            <Link href="/Rastrear" target="_blank" passHref>
              <li style={{ cursor: "pointer" }}>
                <img src="/static/images/Rastrear-encomenda.png" alt="" />
              </li>
            </Link>
            <li style={{ cursor: "pointer" }} onClick={openModal}>
              <img src="/static/images/Seja-agenciador.png" alt="" />
            </li>
            <Link href="/trabalhe" passHref>
              <li style={{ cursor: "pointer" }}>
                <img src="/static/images/Trabalhe-conosco.png" alt="" />
              </li>
            </Link>
            <Link href="/contato" passHref>
              <li style={{ cursor: "pointer" }}>
                <img src="/static/images/Fale-conosco.png" alt="" />
              </li>
            </Link>
          </ul>

          {isModalVisible && (
            <Modal
              open={isModalVisible}
              toggleModal={() => setIsModalVisible(false)} // Certifique-se de passar a função aqui
            />
          )}
        </div>
      </section>

      <section
        id="quemSomos"
        style={{ paddingBottom: "0px", paddingTop: "100px" }}
        className={styles.background}
      >
        <div className={styles.interno}>
          <div
            className={`${styles.box} ${styles.texto}`}
          >
            <h3>
              Operamos no &nbsp;
              <spam className={styles.subtitulo}>Rio Grande do Sul</spam>,&nbsp;
              <spam className={styles.subtitulo}>Santa Catarina</spam>,&nbsp;
              <spam className={styles.subtitulo}>Paraná</spam>,&nbsp;
              <spam className={styles.subtitulo}>São Paulo</spam>,&nbsp;
              <spam className={styles.subtitulo}>Mato Grosso do Sul</spam>,&nbsp;
              <spam className={styles.subtitulo}>Minas Gerais</spam>,&nbsp;
              <spam className={styles.subtitulo}>Goiânia</spam>&nbsp; e &nbsp;
              <spam className={styles.subtitulo}>Brasília</spam>
            </h3>
            <div className={styles.bloco}>
              {" "}
              transporte rápido e inteligente{" "}
            </div>
            <p>Possuímos uma estrutura com escritório equipado com as ferramentas necessárias e a infraestrutura direcionada ao transporte.  Nossa estrutura é informatizada garantindo assim a total precisão em tudo que a CJS TRANSPORTES  negocia com seus clientes, garantindo qualidade em seus serviços.</p>
            <p>O depósito para armazenamento da mercadoria e roteirização de entregas possui uma área de 1.000 metros quadrados equipado de empilhadeira para carga e descarga dos veículos.
            </p>
            <p>Utilizamos ferramentas de trabalho que nos proporcionam facilidade de traçar as melhores rotas da origem ao destino dentro do território nacional, calculando sempre o tempo estimado para a entrega de sua carga.</p>
          </div>

          <div
            className={`${styles.box}`}
          >
            <img
              className={styles.quemsomos}
              src="/static/images/quem-somos/quem-somos.png"
              alt="" />
          </div>

        </div>
      </section>

      <section className={styles.background} style={{ marginTop: "5rem" }}>
        <div className={styles.interno}>
          <div
            className={`${styles.box} ${styles.texto}`}
            style={{ marginLeft: "2rem" }}
          >
            <h3 style={{ fontSize: "36px", marginTop: "10px" }}>Conheça a</h3>
            <h2>
              <spam style={{ color: "#db9600" }}>CJS Transportes</spam>{" "}
            </h2>

          </div>
        </div>
      </section>

      <section
        style={{ paddingTop: "0rem" }}
        className={styles.background}
        id="servicos"
      >
        <div className={styles.interno} style={{ maxWidth: "75rem" }}>
          <div className={`${styles.box}`}>
            <div className={styles.interno}>
              <div className={`${styles.box} `}>
                <a
                  className={`${styles.lista} `}
                  onClick={() => handleLinkClick1("Estrutura")}
                >
                  Estrutura
                </a>

                <a
                  className={`${styles.lista} `}
                  onClick={() => handleLinkClick2("Entrega")}
                >
                  Entrega
                </a>

                <a
                  className={`${styles.lista} `}
                  onClick={() => handleLinkClick3("Encomendas")}
                >
                  Encomendas
                </a>

                <a
                  className={`${styles.lista} `}
                  onClick={() => handleLinkClick4("Atendimento")}
                >
                  Atendimento
                </a>
              </div>
            </div>
          </div>

          {titulo && descricao && (
            <div className={`${styles.box} ${styles.bloco2}`}>
              <h2>{titulo}</h2>
              <p>{descricao}</p>
            </div>
          )}
        </div>
      </section>
      {/* VIDEO

      <section className={styles.background}>
        <div className={styles.interno2}
        style={{alignItems:"flex-start"}}
        >
          <div
            className={`${styles.box} ${styles.texto}`}
            style={{ marginLeft: "2rem", marginBottom:"2rem" }}
          >
            <p>
              <h2 style={{ fontSize: "36px", marginTop: "10px", fontWeight:"300", fontSize:"48px" }}>
                Vídeo
              </h2>
              <h2>
                <spam style={{ color: "#db9600", fontSize:"64px", lineHeight:"64px" }}>institucional</spam>{" "}
              </h2>
            </p>
          </div>

          
            {isVideoVisible ? (
          <iframe
          id="video"
            width="100%"
            height="640px"
            src="https://www.youtube.com/embed/xcJtL7QggTI?autoplay=1"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            onEnded={handleVideoEnded}
          ></iframe>
          ) : (
            <div  onClick={handlePlayButtonClick} style={{ cursor: "pointer" }}>
            <img
        src="/static/images/banner-video.jpg"
        alt="Capa do Vídeo"
        style={{ maxWidth: "100%", height: "auto" }}
      />
            </div>
            )}
        </div>
      </section>

*/}


      <section className={styles.background}>
        <div className={styles.interno2}
          style={{ alignItems: "flex-start" }}
        >
          <div
            className={`${styles.box} ${styles.texto}`}
            style={{ marginLeft: "2rem", marginBottom: "2rem" }}
          >
            <div>
              <h2 style={{ fontSize: "36px", marginTop: "10px", fontWeight: "300", fontSize: "48px" }}>
                A CJS
              </h2>
              <h2>
                <spam style={{ color: "#db9600", fontSize: "64px", lineHeight: "64px" }}>Transportes</spam>{" "}
              </h2>
            </div>
          </div>

          <img
            src="/static/images/montagem.png"
            alt="Capa do Vídeo"
            style={{ maxWidth: "100%", height: "auto" }}
          />

        </div>
      </section>

      <section className={styles.background}>
        <div className={styles.interno}>
          <div
            className={`${styles.box} ${styles.texto}`}
            style={{ marginLeft: "2rem" }}
          >
            <div>
              <h3 style={{ fontSize: "36px", marginTop: "10px" }}>
                Nossos
              </h3>
              <h2>
                <spam style={{ color: "#db9600" }}>clientes </spam>{" "}
              </h2>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.background}
        style={{ paddingBottom: "10rem" }}
      >
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

      <section className={styles.background4}
        style={{ paddingBottom: "0px" }}
      >
        <div className={styles.interno}>
          <div
            className={`${styles.box} ${styles.texto}`}
            style={{ marginLeft: "2rem" }}
          >
            <div>
              <h2>
                <spam style={{ color: "#db9600" }}>Clientes que comprovam</spam>{" "}
              </h2>
              <h3 style={{ fontSize: "36px", marginTop: "10px" }}>
                os nossos serviços
              </h3>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}

export default QuemSomos;
