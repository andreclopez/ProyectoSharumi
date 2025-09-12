import React, { useState } from "react";
import { Box, Grid, Typography, Button, Input } from "@mui/material";
import axios from "axios";
import { useCupon } from "../../hooks/useCupon.js";

const CuponDescuento = () => {
  const [codigoCupon, setCodigoCupon] = useState("");
  const [mensaje, setMensaje] = useState("");
  const { aplicarCupon, quitarCupon, cuponActivo } = useCupon();

  const manejarAplicar = async () => {
    if (!codigoCupon.trim()) {
      setMensaje("Por favor ingresa un código de cupón.");
      return;
    }
    try {
      const res = await axios.get(`http://localhost:3001/api/cupones/validar/${codigoCupon.trim()}`);
      console.log("Respuesta del backend:", res.data);
      if (res.data) {
        aplicarCupon({
          nombreCupon: res.data.nombreCupon,
          porcentajeDescuento: res.data.porcentajeDescuento
        });
        setMensaje(""); 
      } else {
        quitarCupon();
        setMensaje("El código de cupón ingresado no es válido o ha expirado.");
      }
    } catch {
      quitarCupon();
      setMensaje("Error al validar el cupón. Intenta nuevamente.");
    }
  };

  const manejarQuitar = () => {
    quitarCupon();
    setMensaje("Cupón eliminado.");
    setCodigoCupon("");
  };

  return (
    <Box
      sx={{
        height: 300,
        justifyContent: "center",
        alignContent: "center",
        p: 2,
        background: "#5a2a2a",
      }}
    >
      <Grid
        container
        direction="column"
        sx={{
          height: '100%',
          width: '100%',
          justifyContent: "center",
          alignItems: "center",
          p: 2,
          background: "#fdf6f0",
        }}
      >
        <Grid item>
          <Typography variant="h2" color="#5a2a2a" textAlign="center">
            ¿Tenés un cupón de descuento?
          </Typography>
        </Grid>

        <Grid item>
          <Typography paragraph color="#5a2a2a" textAlign="center">
            Ingresa tu código aquí
          </Typography>
        </Grid>

        <Grid item xs={12} textAlign="center">
          <Grid textAlign='center'>
            <Input
              placeholder="Código de descuento"
              value={codigoCupon}
              onChange={(e) => setCodigoCupon(e.target.value)}
              sx={{
                backgroundColor: "#5a2a2a",
                color: "#fdf6f0",
                borderRadius: 1,
                paddingLeft: 1,
                marginBottom: 1,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <Button
            variant="contained"
            onClick={manejarAplicar}
            sx={{
              backgroundColor: "#5a2a2a",
              "&:hover": {
                backgroundColor: "#3e1e1e",
              },
              marginRight: cuponActivo ? 1 : 0,
            }}
            >
            Aplicar cupón
            </Button>
          </Grid>

          {cuponActivo && (
            <Grid item xs={12} sm={3}>
              <Button
              variant="outlined"
              color="secondary"
              onClick={manejarQuitar}
              >
              Quitar cupón
              </Button>
            </Grid>
          )}

          {(mensaje || cuponActivo) && (
            <Typography
              color={cuponActivo ? "green" : "red"}
              textAlign="center"
              mt={2}
            >
              {mensaje || `Cupón "${cuponActivo.nombreCupon}" (${cuponActivo.porcentajeDescuento}%) aplicado con éxito.`}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CuponDescuento;
