import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { clientApi } from "@/api/client";
import type { ClientSummary as ClientSummaryData } from "@/api/generated/models/ClientSummary";
import useSelectedClient from "@/state/client/useSelectedClient";

type SummaryFetchResult = {
  clientId: string;
  summary: ClientSummaryData | null;
  errorMessage: string | null;
};

const ClientSummary = () => {
  const { selectedClient, clientsLoading } = useSelectedClient();
  const [fetchResult, setFetchResult] = useState<SummaryFetchResult | null>(null);

  const clientId = selectedClient?.clientId;

  useEffect(() => {
    if (!clientId) return;

    let cancelled = false;

    clientApi
      .v1GetClientSummary({ clientId })
      .then((clientSummary) => {
        if (cancelled) return;
        setFetchResult({ clientId, summary: clientSummary, errorMessage: null });
      })
      .catch((error) => {
        console.error("Failed to load client summary", error);
        if (cancelled) return;
        setFetchResult({ clientId, summary: null, errorMessage: "Failed to load client summary." });
      });

    return () => {
      cancelled = true;
    };
  }, [clientId]);

  // Client list still loading — can't resolve the URL's clientId yet.
  if (clientsLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Client list loaded but the URL's clientId matches no known client.
  if (!selectedClient) {
    return <Navigate to="/" replace />;
  }

  if (fetchResult?.errorMessage) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography color="error">{fetchResult.errorMessage}</Typography>
      </Container>
    );
  }

  // Summary fetch for the current client hasn't resolved yet.
  if (!fetchResult || fetchResult.clientId !== clientId) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      {fetchResult.summary && (
        <Grid container spacing={2} id="client-summary-cards">
          {/* Cards (tickets 5.2–5.8) slot in here, each fed its slice of the summary as props */}
        </Grid>
      )}
    </Container>
  );
};

export default ClientSummary;
