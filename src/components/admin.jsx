import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LogoutIcon from "@mui/icons-material/Logout";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import Link from "next/link";
import LinearProgress from "@mui/material/LinearProgress";
import { useRouter } from "next/router";
import PersonIcon from "@mui/icons-material/Person";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme({
  palette: {
    primary: {
      main: "#f19800",
      contrastText: "#fff",
    },
    secondary: {
      main: "#3363AC",
      contrastText: "#fff",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.54)",
    },
  },
});

const Admin = ({ children = [], showLoader = false }) => {
  const [open, setOpen] = React.useState(true);
  const [loader, setLoader] = React.useState(false);
  const [usuario, setUsuario] = React.useState({});

  const router = useRouter();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  React.useEffect(() => {
    const isAuth = true; //localStorage.getItem("isAuth");
    if (!isAuth) router.push("/admin");

    if (window.innerWidth < 1024) setOpen(false);
  }, [router]);

  React.useEffect(() => {
    if (router.isReady) {
      const usuario = JSON.parse(localStorage.getItem("user")) || {};

      setUsuario(usuario);
    }
  }, [router.isReady]);

  React.useEffect(() => {
    setLoader(showLoader);
  }, [showLoader]);

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                color: "white",
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="white"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {router.pathname.replace(/\//g, " | ")}
            </Typography>
            <Tooltip title="Sair" placement="left">
              <IconButton
                sx={{ color: "white" }}
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/admin";
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="/static/images/logo-CJS-azul.png"
                alt="Logo HCA"
                style={{
                  padding: "10px",
                  maxWidth: "100%",
                }}
              />
            </div>
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          {usuario.tipoDeUsuario === "A" && (
            <List>
              <Link href="/admin/usuarios" passHref>
                <ListItem button>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Usuários"
                    sx={{ color: "rgba(0, 0, 0, 0.54)" }}
                  />
                </ListItem>
              </Link>
              <Link href="/admin/clientes" passHref>
                <ListItem button>
                  <ListItemIcon>
                    <PeopleAltIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Clientes"
                    sx={{ color: "rgba(0, 0, 0, 0.54)" }}
                  />
                </ListItem>
              </Link>
              <Link href="/admin/cargas" passHref>
                <ListItem button>
                  <ListItemIcon>
                    <LocalShippingIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Cargas"
                    sx={{ color: "rgba(0, 0, 0, 0.54)" }}
                  />
                </ListItem>
              </Link>
            </List>
          )}
          {usuario.tipoDeUsuario === "C" && (
            <List>
              <Link href="/admin/cargas/cliente" passHref>
                <ListItem button>
                  <ListItemIcon>
                    <LocalShippingIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Minhas Cargas"
                    sx={{ color: "rgba(0, 0, 0, 0.54)" }}
                  />
                </ListItem>
              </Link>
            </List>
          )}
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          {loader && <LinearProgress />}
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container>{React.cloneElement(children)}</Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Admin;
