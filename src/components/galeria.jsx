import * as React from "react";
import Modal from "./modal";
import styles from "../styles/Areaatuacao.module.css";

function Galeria() {

  const [texto, setTexto] = React.useState("");
  const [titulo, setTitulo] = React.useState("");
  const [icone, setIcone] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const toggleModal = () => {
    setOpen(!open);
  };

  const showModal = (areaAtuacao) => {
    switch (areaAtuacao) {
      case "jose":
        setTexto(`<b>Histórico Profissional:</b> <br />
        • NGN – Neves Gestão Estratégica de Empresas
- Sócio Fundador<br />
• Rodoviário Bedin Ltda - Conselheiro
Consultivo<br />
• Randon SA Implementos e Participações -
Conselheiro Fiscal Suplente<br />
• SIM Rede de Postos - Diretor Administrativo
Financeiro (2008 a 2013), Conselheiro
Consultivo (2015 a 2020), atualmente
Consultor Estratégico<br />
• Tondo S.A. - Conselheiro Consultivo por dois
mandatos (2013 a 2019 e 2002 a 2006)<br />
• Grupo Henrique Stefani - Diretor
Administrativo e Financeiro (2005 a 2008)<br />
• Arquati Unidade Brasil - Diretor Geral entre
(2003 a 2005)<br />
• Unimed Porto Alegre - Superintendente
Administrativo e Financeiro (2001 a 2003)<br />
        <br />
       <b> Formação:</b> MBA em Gestão de Empresas,
       Graduação em Ciências Contábeis, Formação
       de Conselheiros de Administração e Coaching
       Profissional, Especializações Executivas em
       Atualização Comportamental, Desenvolvimento
       Avançado e Desenvolvimento Comportamental.
       <br />  <br />
       <b>Função desempenhada: Conselheiro e
       consultor para transportadoras, indústrias e
       empresas do varejo </b>
        `);
        setTitulo("José Carlos das Neves");
        break;
      
        case "rafael":
          setTexto(`<b>Histórico Profissional:</b> <br />
          • Sulgás – Diretor Presidente (2018 a 2020)
• SIM Rede de Postos – Diretor Comercial
(2015 a 2017)<br />
• Rede Energia – Diretor Comercial (2007 a
2014) e (2020 – atual)<br />
• Distribuidora de Produtos de Petróleo
Ipiranga – Gerente de Postos de Rodovia
(2000 a 2007), Gerente de Mercado
Consumidor (1998 a 2000) e Coordenador
de Planejamento de Marketing (1994 a
1998)<br />
• Andreas Stihl Motosseras – Engenheiro de
Nacionalização de Produtos (1986 a 1988)<br />
• Eberle S.A – Chefe do Departamento de
Engenharia (1980 a 1986)<br />
          <br />
         <b> Formação:</b> Pós-graduação em Marketing e
         em Varejo, Graduação em Engenharia
         Mecânica, Especializações em Grid do
         Desenvolvimento Gerencial, Administração do
         tempo de executivos, Gerência de
         desempenho, entre outros.
         <br />  <br />
         <b>Função desempenhada: Conselheiro
         estratégico para rede de combustíveis. </b>
          `);
          setTitulo("Rafael Cereser Pezzella");
        break;
      
      
        case "thiago":
          setTexto(`<b>Histórico Profissional:</b> <br />
          • Fundador da TC2Code Soluções: empresa especializada
          em outsoursing de projetos e profissionais, atuando em
          diversas regiões do país.<br />
          • Banco Itaú SA: migração de aplicações internas para
          novas tecnologias, atuando como consultor no auxílio da
          equipe de desenvolvimento para migrar aplicações
          utilizadas internamento, de tecnologia defasada para
          tecnologia atual.<br />
          • CBMM - Companhia Brasileira de Mineração: integração
          SAP com aplicações satélites, atuando como consultor no
          desenvolvimento de integrações entre o SAP e as
          aplicações satélites, com foco nos módulos de RH,
          Financeiro e Almoxarifado.<br />
          • Grupo Ticket: desenvolvimento de soluções para
          pagamentos pré-pagos, atuando no desenvolvimento da
          plataforma de soluções para pagamentos pré-pagos.<br />
          • Grupo Oxxy: desenvolvimento de soluções para vistorias,
          emplacamento e leilão de veículos, atuando no
          desenvolvimento de soluções integradas ao Detran e
          Denatran, com foco em vistorias, emplacamento,
          homologação e recolha de veículos.<br />
          • GOVBR - Governança Brasil: desenvolvimento de soluções
          para gestão pública, atuando no desenvolvimento de
          soluções para gestão pública no módulos de e-Social,
          Folha de Pagamento e Prestação de Contas.<br />
          • Grupo Benner: desenvolvimento de soluções para turismo
          corporativo, atuando no desenvolvimento de soluções
          integradas com cias aéreas, brokers de hotéis e veículos,
          soluções de pagamentos. Fornecendo soluções para
          agências corporativas e para cias aéreas.<br />
          <br />
         <b> Formação:</b> Pós-graduação em Engenharia de Sistemas e
         graduado em Sistemas de Informação.
         <br />  <br />
         <b>Função desempenhada: Especialista da área de tecnologia e
         desenvolvimento de projetos de RPA - automação robótica de
         processos, robotização de rotinas, desenvolvimento de
         aplicativos e soluções mobile. </b>
          `);
          setTitulo("Thiago Marcelo Pinto");
        break;
      
      
        case "marcos":
          setTexto(`<b>Histórico Profissional:</b> <br />
          • O Boticário<br />
          • FIAT<br />
          • Ambev<br />
          • CSU CardSystem<br />
          • CitiBank<br />
          • Sicredi<br />
          • Mastercard<br />
          • Orbitall<br />
          • Payments<br />
          <br />
         <b> Formação:</b> Mestre em Gestão e Negócios
         Estratégia e Competitividade, Graduação
         em Administração de Sistemas de
         Informação e Técnico em Administração
         pela Escola Técnica de Formação Gerencial
         SEEBRAE MG (Programa de Formação
         espelhado no modelo Austríaco voltado
         para o Empreendedorismo.
         <br />  <br />
         <b>Função desempenhada: Consultor em
         meios de pagamento, banco digital,
         comercial, produtos, inovação e paymants.</b>
          `);
          setTitulo("Marcos Vat");
          break;
        
          case "everton":
            setTexto(`<b>Histórico Profissional:</b> <br />
            • SIM Rede de Postos - Coordenador
            da Contabilidade e Controladoria<br />
            <br />
           <b> Formação:</b> MBA em Controladoria,
           Graduação em Ciências Contábeis e
           Especialização em PDD – Programa de
           Desenvolvimento de Dirigentes.
           <br />  <br />
           <b>Função desempenhada: Consultor em Controladoria. </b>
            `);
            setTitulo("Éverton Moreno");
          break;
        
        
          case "renata":
            setTexto(`<b>Histórico Profissional:</b> <br />
            • Croasonho Franchising <br />
            • Accor Hotels <br />
            • Best Western Hotels & Risorts <br />
            • Hilton Hotels <br />
            • Blue Tree Hotels <br />
            • Taco Bell USA <br />
            • Grupo de Ensino Faculdade da Serra Gaúcha – FSG<br />
            <br />

            <b>Consultoria de Food Service:</b>SIM Rede de
Postos, Rede de Postos Vale, Postos Mime,
Rede de Postos Sander, Postos Rota, Sohva
Coffee House & Artisan Bakery, Eccel
Incorporadora, Rocca Garden Bar, Charlie
Brownie, Doce Docê, Polentake, Becco
Enopizzeria, Pantástica, Santo Gusto
Confeitaria, Riacecí, Oi Fit, Tropino, Cervejaria
Ordeo, Salgados Garcia e Horno Pizza.<br />
            <br />

           <b> Formação:</b>Graduação em Direito e Hotelaria.
           <br />  <br />
           <b>Função desempenhada: Consultora em lojas
           de conveniências, Food Service e estruturação
           de franquias.</b>
            `);
            setTitulo("Renata Galiotto");
        break;
      
      
        case "marina":
          setTexto(`<b>Histórico Profissional:</b> <br />
          • Croasonho Franchising<br />
• Aida Alimentos (indústria de alimentos
curados)<br />
• QualyFoods (beneficiamento de grãos)<br />
• Massaiola (indústria de refeições prontas)<br />
• Doux Frangosul (frigorífico de produtos suínos)<br />
• LAREN (Laboratório de Referência Enológica)<br />
          <br />
          <b>Consultoria de Food Service:</b> SIM Rede de Postos,
          Rede de Postos Vale, Postos Mime, Rede de
          Postos Sander, Postos Rota, Sohva Coffee House
          & Artisan Bakery, Eccel Incorporadora, Rocca
          Garden Bar, Charlie Brownie, Doce Docê,
          Polentake, Becco Enopizzeria, Pantástica, Santo
          Gusto Confeitaria, Riacecí, Oi Fit, Tropino,
          Cervejaria Ordeo, Salgados Garcia e Horno
          Pizza.<br />
          <br />
         <b> Formação:</b> Graduação em Engenharia de
         Alimentos pela UCS com parte da formação em
         Ciência e Tecnologia de Alimentos na
         Universidad Miguél Hernández na Espanha.
         <br />  <br />
         <b>Função desempenhada: Consultora em lojas de
         conveniências, Food Service e estruturação de
         franquias.</b>
          `);
          setTitulo("Marina Baratter");
          break;
        
          case "diordia":
            setTexto(`<b>Histórico Profissional:</b> <br />
            • Sólida experiência na Gestão de Estratégica de
            Design, com passagens por empresas de
            Alimentação, Bens de Consumo e Moda.<br />
            • Atuação junto a times multidisciplinares no
            plano de expansão da marca, branding,
            oportunidades de negócio e implantação de
            unidades franqueadas.<br />
            • Atuou na elaboração e acompanhamento de
            projetos de implantação de franquias, lojas,
            escritórios, clínicas com academias e salas de
            atendimento.<br />
            • Gerente do Setor de Implantação de Lojas na
            Croasonho Franchising como por 6 anos.<br />
            • Atuou com marcas como Urso Brownie, Toca da
            Bruxa, Capizze Pizzaria e Bionicook Franchising,
            desenvolvendo projetos e estratégias para
            replicação modelo franquias, além de diversos
            projetos de interiores.<br />
            <br />
           <b> Formação:</b> Graduação em Arquitetura e Urbanismo pela UCS, Pós-graduação em Design Estratégico pela UNISINOS/RS, cursa Pós-graduação em Pesquisa e Design de Tendências na PUC/PR, além de cursos em áreas complementares no Rio Grande do Sul e São Paulo.
           <br />  <br />
           <b>Função desempenhada: arquitetura comercial e corporativa, com foco em desenvolvimento de layouts e projeção de ambientes. </b>
            `);
            setTitulo("Diordia Jamile Manera");
          break;
        
        
          case "glauco":
            setTexto(`<b>Histórico Profissional:</b> <br />
            • Atuou para marcas como Walmart-SP,
            Lojas Colombo, Crediare, Lojas Lebes,
            Shelter (Pizzaria), administradoras de
            imóveis e incorporadoras de Caxias do
            Sul/RS entre outros.<br />
            • Dedicado a desenvolvimento de projetos,
            acompanhamento, gerenciamento e
            administração de obras, controle de
            qualidade e orçamentos de serviços
            terceirizados, elaboração de manual do
            usuário (proprietário) e checklist de entrega
            das obras.<br />
            • Como profissional da área de arquitetura,
            para ambientes comerciais, o foco de
            trabalho é fazer com que os consumidores
            estejam apaixonados pelo loca, que
            sentiram e experimentaram.<br />
            <br />
           <b> Formação:</b> Graduação em Arquitetura e
           Urbanismo pela UCS com MBA em
           Gerenciamento Estratégico de Projetos pela
           FSG e Especialização em Steel Frame.
           <br />  <br />
           <b>Função desempenhada: arquitetura comercial
           e corporativa, com foco em desenvolvimento
           de layouts e projeção de ambientes.</b>
            `);
            setTitulo("Glauco Busanello");
          break;
      
      
    }

    toggleModal();
  };


  return (
    <section className={styles.background}>
      <div className={styles.interno}>
        <div className={styles.titulo}>
          <div>
            <h2 style={{ margin: "0px", lineHeight: "1.5rem",  paddingBottom: "2.5rem" }}>Parceiros</h2>
          </div>
        </div>

        <div className={styles.content}>

        <div
            className={styles.galeria}
            style={{ cursor: "pointer" }}
            onClick={() => showModal("jose")}
          >
            <p>José Carlos das Neves</p>
            <img src="/static/images/quemsomos/jose.png" alt="Icone" />
          </div>

          <div
            className={styles.galeria}
            style={{ cursor: "pointer" }}
            onClick={() => showModal("rafael")}
          >
            <p>Rafael Cereser Pezzella</p>
            <img src="/static/images/quemsomos/rafael.png" alt="Icone" />
          </div>

          <div
            className={styles.galeria}
            style={{ cursor: "pointer" }}
            onClick={() => showModal("thiago")}
          >
            <p>Thiago Marcelo Pinto</p>
            <img src="/static/images/quemsomos/thiago.png" alt="Icone" />
           
          </div>

        </div>
      
        <div className={styles.content}>

        <div
            className={styles.galeria}
            style={{ cursor: "pointer" }}
            onClick={() => showModal("marcos")}
          >
            <p>Marcos Vat</p>
            <img src="/static/images/quemsomos/marcos.png" alt="Icone" />
          </div>

          <div
            className={styles.galeria}
            style={{ cursor: "pointer" }}
            onClick={() => showModal("everton")}
          >
            <p>Éverton Moreno</p>
            <img src="/static/images/quemsomos/everton.png" alt="Icone" />
          </div>

          <div
            className={styles.galeria}
            style={{ cursor: "pointer" }}
            onClick={() => showModal("renata")}
          >
            <p>Renata Galiotto</p>
            <img src="/static/images/quemsomos/renata.png" alt="Icone" />
          </div>
          
        </div>

        <div className={styles.content}>

        <div
            className={styles.galeria}
            style={{ cursor: "pointer" }}
            onClick={() => showModal("marina")}
          >
            <p>Marina Baratter</p>
            <img src="/static/images/quemsomos/marina.png" alt="Icone" />
          </div>

          <div
            className={styles.galeria}
            style={{ cursor: "pointer" }}
            onClick={() => showModal("diordia")}
          >
            <p>Diordia Jamile Manera</p>
            <img src="/static/images/quemsomos/diordia.png" alt="Icone" />
          </div>

          <div
            className={styles.galeria}
            style={{ cursor: "pointer" }}
            onClick={() => showModal("glauco")}
          >
            <p>Glauco Busanello</p>
            <img src="/static/images/quemsomos/glauco.png" alt="Icone" />
          </div>
          
        </div>

        
      </div>
     <Modal
        open={open}
        toggleModal={toggleModal}
        texto={texto}
        titulo={titulo}
      />
    </section>
  );
}

export default Galeria;
