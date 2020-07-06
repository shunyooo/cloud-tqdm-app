import React, { useState, useEffect, ReactNode } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../../plugins/firebase";
import {
  Box,
  Paper,
  Container,
  LinearProgress,
  BoxProps,
  Card,
} from "@material-ui/core";

export interface Progress {
  id: string;
  total: number;
  value: number;
  percentage: number;
  description: string;
  status: string;
  elapsed: number;
  remaining: number;
  createdAt: Date;
  updatedAt: Date;
}

const useStyles = makeStyles((theme) => ({
  container: {},
  card: {
    minHeight: "140px",
    position: "relative",
    borderRadius: "10px",
    maxWidth: "900px",
    margin: "15px auto",
  },
  progressInner: {
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#F5F8FF",
    borderRadius: "1px",
  },
  progressInnerSolidBar: {
    position: "absolute",
    height: "2px",
    width: "100%",
    bottom: "25%",
    backgroundColor: "#4D28D8",
  },
  progressContent: {
    position: "absolute",
    display: "flex",
    height: "62%",
    bottom: "28%",
    width: "100%",
  },
  progressTextArea: {
    paddingLeft: "2rem",
    paddingTop: "0.3rem",
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  progressInfoText: {
    fontSize: "1rem",
    color: "#939BB0",
    position: "absolute",
    top: "50%",
    transform: "translate(0, -50%)",
  },
}));

const ProgressBox: React.FC<{ progress: Progress }> = ({ progress }) => {
  const classes = useStyles();
  const p = progress;
  return (
    <Card className={classes.card}>
      <Box className={classes.progressInner} width={`${progress.percentage}%`}>
        <Box className={classes.progressInnerSolidBar} />
      </Box>
      <Box className={classes.progressContent}>
        <Box className={classes.progressTextArea}>
          <Box>
            <Typography variant="h5">{`${p.description}`}</Typography>
          </Box>
          <Box paddingLeft={1} flex={1} position={"relative"}>
            <Typography
              className={classes.progressInfoText}
            >{`${p.percentage}% | ${p.value}/${p.total} [00:00 < 00:00, 229it/s]`}</Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

const HomePage: React.FC = () => {
  const classes = useStyles();
  const [progressList, setProgressList] = useState<Progress[]>([]);
  const [loadingState, setLoadingState] = useState<{
    [pid: string]: "loading" | "done";
  }>({});

  const getProgressIdFromUrl = (): string[] => {
    console.log(location.search);
    const args = location.search.replace("?", "").split("&");
    const progressIdList = args
      .filter((arg) => arg.startsWith("pid="))
      .map((arg) => arg.replace("pid=", ""));
    console.log(progressIdList);
    return progressIdList;
  };

  const listenProgressId = (progressId: string): void => {
    // 登録済みであれば何もしない
    if (loadingState[progressId]) {
      return;
    }
    console.log(loadingState);
    setLoadingState({ ...loadingState, [progressId]: "loading" });
    const progressRef = firebase.database().ref(`progress/${progressId}`);
    // 監視対象に入っていなければ, listenに登録
    progressRef.on("value", (snapshot) => {
      setLoadingState({ ...loadingState, [progressId]: "done" });
      console.log("update", progressId, snapshot.val());
      const res = snapshot.val();
      const pData: Progress = {
        id: progressId,
        total: res.total,
        value: res.value,
        description: res.description,
        percentage: (res.value / res.total) * 100,
        elapsed: 100,
        remaining: 100,
        status: res.status,
        updatedAt: res.updated_at,
        createdAt: res.created_at,
      };
      setProgressList([...progressList, pData]);
      console.log(progressList);
    });
  };

  useEffect(() => {
    // urlからidの取得
    const progressIdList = getProgressIdFromUrl();
    // firebaseでの監視
    progressIdList.forEach(listenProgressId);
  }, [progressList]);

  return (
    <Container className={classes.container}>
      <CssBaseline />
      <Box p={4}>
        {/* <Typography variant="h2" component="h1">
          {"cloud-tqdm"}
        </Typography> */}
        <Box marginTop={2}>
          {progressList.map((progress, i) => (
            <ProgressBox key={`${progress.id}-${i}`} progress={progress} />
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;
