import * as React from "react";
import Menu from "../components/menu";
import Rodape from "../components/rodape";
import styles from "../styles/Contato.module.css";
import Link from "next/link";
import GoogleMap from "../components/map";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#322783",
    },
    secondary: {
      main: "#db9600",
    },
  },
});

export default function Contato() {
  const [nome, setNome] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [setor, setSetor] = React.useState("");
  const [mensagem, setMensagem] = React.useState("");
  const [showAlertSuccess, setShowAlertSuccess] = React.useState(false);
  const [showAlertDanger, setShowAlertDanger] = React.useState(false);
  const [error, setError] = React.useState({});
  const [disableButton, setDisableButton] = React.useState(false);
  const [curriculo, setCurriculo] = React.useState("");
  const [file, setFile] = React.useState("");


  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const nome = data.get("nome");
    const email = data.get("email");
    const setor = data.get("setor");

    let isValid = true;
    const newError = { ...error };

    if (email.trim() === "") {
      newError.email = true;
      isValid = false;
    }

    if (nome.trim() === "") {
      newError.nome = true;
      isValid = false;
    }

    setError(newError);

    if (!isValid) return;

    setDisableButton(true);

    SendContato({
      nome,
      email,
      setor,
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
        setSetor("");
        setMensagem("");
        setDisableButton(false);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Menu />
      <section className={styles.background3} style={{ paddingBottom: "0px" }}>
        
      </section>

      <section style={{ paddingTop: "8rem" }} className={styles.background}>
        <div className={styles.interno}>
          <div
            className={styles.box_row}
            style={{ justifyContent: "flex-start" }}
          >
            <div className={styles.box}>
              <p>
             Na CJS Transportes, valorizamos nossa equipe como um ativo essencial. Se você é apaixonado pela indústria de transporte, busca excelência e deseja fazer parte de uma equipe comprometida com o sucesso, convidamos você a se juntar a nós. Oferecemos um ambiente de trabalho dinâmico e oportunidades de crescimento. Envie seu currículo e informações de contato, e entraremos em contato quando tivermos vagas que correspondam ao seu perfil.
              </p>
            </div>

            <div className={` ${styles.mobile}`}>
              <div
                className={` ${styles.box}`}
                style={{ alignItems: "flex-start" }}
              >
                <h3>Venha trabalhar conosco!</h3>
                <p className={styles.p} style={{ marginBottom: "2rem" }}>
                  Estamos ansiosos para você fazer parte de nossa família
                </p>

                <Box
                  component="form"
                  sx={{ width: "100%" }}
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmit}
                >
                  <div className="w-full flex flex-row sm:flex-nowrap flex-wrap justify-between items-center">
                    <TextField
                      value={nome || ""}
                      type="text"
                      margin="normal"
                      required
                      fullWidth
                      id="nome"
                      label="Nome"
                      name="nome"
                      autoFocus
                      onChange={(event) => setNome(event.target.value)}
                      sx={{ marginLeft: ".5rem", marginRight: ".5rem" }}
                      onFocus={() => {
                        const newError = { ...error };
                        newError.nome = false;
                        setError(newError);
                      }}
                      error={error.nome}
                      helperText={error.nome ? "campo obrigatório" : ""}
                    />

                    <TextField
                      value={email || ""}
                      type="text"
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="E-Mail"
                      name="email"
                      onChange={(event) => setEmail(event.target.value)}
                      sx={{ marginLeft: ".5rem", marginRight: ".5rem" }}
                      onFocus={() => {
                        const newError = { ...error };
                        newError.email = false;
                        setError(newError);
                      }}
                      error={error.email}
                      helperText={error.email ? "campo obrigatório" : ""}
                    />
                  </div>
                  <div className="w-full flex flex-row sm:flex-nowrap flex-wrap justify-between items-center">
                    <div
                      className="select-input w-full"
                      style={{ marginLeft: ".5rem", marginRight: ".5rem" }}
                    >
                      <FormControl fullWidth>
                        
                  <div className="relative rounded-md shadow-sm mb-[1rem]">
                    <input
                      type="text"
                      name="curriculo"
                      value={curriculo}
                      className={styles.input2}
                      placeholder="&nbsp; Envie seu currículo *"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <button
                        onClick={() => {
                          const btn = document.getElementById("btnCurriculo");
                          btn.click();
                        }}
                        className="h-full py-0 px-4 bg-secondary border-transparent text-white sm:text-sm rounded-l-none rounded-md"
                      >
                        Buscar arquivo
                      </button>
                    </div>
                  </div>
                  <input
                  className={styles.input2}
                    accept=".doc,.docx,.txt,.pdf"
                    id="btnCurriculo"
                    multiple
                    type="file"
                    onChange={(event) => {
                      if (event.target.files.length === 0) return;

                      const newFile = event.target.files[0];

                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setFile(event.target.result);
                        setCurriculo(newFile.name);
                      };

                      reader.readAsDataURL(newFile);
                    }}
                    style={{ display: "none" }}
                  />
                        {error.setor && (
                          <p className="select-error" id="setor-helper-text">
                            campo obrigatório
                          </p>
                        )}
                      </FormControl>
                    </div>
                  </div>
                  <div style={{ marginLeft: ".5rem", marginRight: ".5rem" }}>
                    <TextField
                      value={mensagem || ""}
                      type="text"
                      margin="normal"
                      fullWidth
                      id="mensagem"
                      label="Mensagem"
                      name="mensagem"
                      multiline
                      rows={4}
                      onChange={(event) => setMensagem(event.target.value)}
                    />
                  </div>
                  <div style={{ marginRight: ".5rem" }}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      className="bg-[#db9600] hover:bg-[#b17a0d] text-white mx-[.5rem] p-4 mt-2 font-bold border-0  cursor-pointer"
                      sx={{ marginLeft: 0, marginRight: 0 }}
                      disabled={disableButton}
                    >
                      ENVIAR AGORA
                    </Button>
                  </div>
                </Box>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.background} style={{ paddingTop: "8rem" }}>
        <GoogleMap />
      </section>
      <Rodape />
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
          Não foi possível enviar o contato!
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
