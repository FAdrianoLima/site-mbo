import * as React from "react";
import Banner from "../components/banner";
import RodapeAL from "../components/rodape-al";

export default function Home() {
  React.useEffect(() => {
    window.document.body.style.backgroundColor = "#01030e";
  }, []);

  return (
    <>
      <div id="banner" />
      <Banner />
      {/*
      
import Menu from "../components/menu";
import Quemsomos from "../components/quemsomos.jsx";
import Rodape from "../components/rodape";
import Whats from "../components/whats";
import Referencia from "../components/referencia";

      <Menu />
      
      <Quemsomos />
      <Referencia />
      <Rodape />
      <Whats />
      */}
      <RodapeAL />
    </>
  );
}
