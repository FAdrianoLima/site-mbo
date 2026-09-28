import styles from "../styles/Contato2.module.css";

import * as React from "react";
import Box from "@mui/material/Box";
import PhoneIcon from "@mui/icons-material/Phone";
import RoomIcon from "@mui/icons-material/Room";
import EmailIcon from "@mui/icons-material/Email";
import TextField from "@mui/material/TextField";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Link from "next/link";
import Button from "@mui/material/Button";


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const themeOptions = {
  palette: {
    type: "black",
    primary: {
      main: "#01030e",
    },
    secondary: {
      main: "#01030e",
    },
  },
};

const theme = createTheme(themeOptions);

function Contato() {
  const [nome, setNome] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [telefone, setTelefone] = React.useState("");
  const [mensagem, setMensagem] = React.useState("");
  const [disableButton, setDisableButton] = React.useState(false);
  const [showAlertSuccess, setShowAlertSuccess] = React.useState(false);
  const [showAlertDanger, setShowAlertDanger] = React.useState(false);

  return (
    <section className={styles.background2} style={{ paddingTop: "0px" }}>
      <div className={styles.interno}>



        <div className={styles.background}>
          <div className={styles.interno}>
            <h1>
              Estamos sempre dispostos <br />a lhe atender com os melhores serviços
            </h1>
            <Link href="/contato" target="_blank" passHref>
              <button style={{ cursor: "pointer", paddingLeft: "3rem", paddingRight: "3rem" }} >Fale Conosco</button>
            </Link>
          </div>

        </div>

        <div
          className={styles.box_row}
        >
          <div className={` ${styles.mobile}`}>
            <div
              className={` ${styles.box}`}
              style={{ alignItems: "flex-start" }}
            >
              <ThemeProvider theme={theme}>
                <Box
                  id="form"
                  component="form"
                  noValidate
                  onSubmit={(event) => {
                    event.preventDefault();
                    const data = new FormData(event.currentTarget);

                    const nome = data.get("nome");
                    const email = data.get("email");
                    const telefone = data.get("telefone");
                    const mensagem = data.get("mensagem");

                    if (
                      nome.trim() === "" ||
                      email.trim() === "" ||
                      telefone.trim() === "" ||
                      mensagem.trim() === ""
                    ) {
                      setShowAlertDanger(true);
                      return;
                    }

                    setDisableButton(true);

                    SendContato({
                      nome,
                      email,
                      telefone,
                      mensagem,
                    })
                      .then((retorno) => {
                        const { status } = retorno;

                        if (status === 201) {
                          setShowAlertSuccess(true);
                        } else {
                          setShowAlertDanger(true);
                        }
                      })
                      .catch(() => setShowAlertDanger(true))
                      .finally(() => {
                        setNome("");
                        setEmail("");
                        setTelefone("");
                        setMensagem("");
                        setDisableButton(false);
                      });
                  }}
                  sx={{ width: "100%" }}
                >
                  <TextField
                    label="Seu nome *"
                    id="nome"
                    name="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    color="secondary"
                    size="small"
                    focused
                    sx={{
                      input: { color: "000000" },
                      width: "100%",
                      maxWidth: "50rem",
                      margin: "0.6rem",
                    }}
                  />
                  <TextField
                    label="E-mail *"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    color="secondary"
                    size="small"
                    focused
                    sx={{
                      input: { color: "000000" },
                      width: "100%",
                      maxWidth: "50rem",
                      margin: "0.6rem",
                    }}
                  />
                  <TextField
                    label="Telefone *"
                    id="telefone"
                    name="telefone"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    color="secondary"
                    size="small"
                    focused
                    sx={{
                      input: { color: "000000" },
                      width: "100%",
                      maxWidth: "50rem",
                      margin: "0.6rem",
                    }}
                  />
                  <TextField
                    label="Conte um pouco da sua necessidade *"
                    id="mensagem"
                    name="mensagem"
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    color="secondary"
                    size="small"
                    focused
                    multiline
                    rows={3}
                    sx={{
                      textarea: { color: "000000" },
                      width: "100%",
                      maxWidth: "50rem",
                      margin: "0.6rem",
                    }}
                  />

                </Box>

              </ThemeProvider>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 1,
                  mb: 2,
                  mx: ".6rem",
                  pt: 1,
                  pb: 1,
                  maxWidth: "15rem",
                  color: "000000",
                  fontWeight: "bold",
                }}
                style={{ backgroundColor: "#01030e" }}
                disabled={false}
              >
                Enviar
              </Button>
            </div>
          </div>
        </div>

        <Snackbar
          open={showAlertSuccess}
          autoHideDuration={6000}
          onClose={() => setShowAlertSuccess(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setShowAlertSuccess(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            Seu contato foi enviado com sucesso!
          </Alert>
        </Snackbar>
        <Snackbar
          open={showAlertDanger}
          autoHideDuration={6000}
          onClose={() => setShowAlertDanger(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setShowAlertDanger(false)}
            severity="warning"
            sx={{ width: "100%" }}
          >
            Não foi possível enviar o contato! Verifique se todos os campos
            obrigatórios foram preenchidos!
          </Alert>
        </Snackbar>



      </div>
    </section>
  );
}

export default Contato;

